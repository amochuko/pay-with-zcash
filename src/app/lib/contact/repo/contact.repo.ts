import { ContactFormInput } from "@/app/(frontend)/contact/contact.validation";
import { db } from "../../database/db";

export type ClaimedJob = {
  id: string;
  contact_message_id: string;
  channel: "email" | "discord";
  attempts: number;
} & ContactMessage;

export interface ContactMessage {
  id: string;
  email: string;
  name: string;
  subject: string;
  message: string;
  created_at: Date;
}

export async function createContactMessage(
  args: ContactFormInput,
  attempts:number
): Promise<ContactMessage> {
  try {
    // This is the important transactional guarantee:
    // - If the message insert fails, nothing is saved.
    // - If either notification job insert fails, the message insert is rolled back too.
    // - If both jobs are inserted successfully, the message and both jobs are committed together.

    await db.query(`BEGIN`);

    const msgResult = await db.query(
      `INSERT INTO pwz.contact_messages (name, email, subject, message)
          VALUES ($1,$2,$3,$4)
          RETURNING id, name, email, subject, message, created_at`,
      [args.name, args.email, args.subject, args.message],
    );

    const msgId = msgResult.rows[0].id;

    await db.query(
      `INSERT INTO pwz.contact_notification_jobs (
        contact_message_id, channel, attempts
      )
      VALUES ($1, 'email', $2), ($1, 'discord', $2)`,
      [msgId, attempts],
    );

    await db.query("COMMIT");

    return msgId;
  } catch (err) {
    await db.query("ROLLBACK");

    throw err;
  } finally {
    db.end();
  }
}

export async function updateNotificationStatus(
  id: string,
  channel: "email" | "discord",
  status: "sent" | "failed",
) {
  const column =
    channel === "email"
      ? "email_notification_status"
      : "discord_notification_status";

  await db.query(
    `UPDATE pwz.contact_messages
        SET ${column} = $1,
            updated_at = NOW()
            WHERE id = $2`,
    [status, id],
  );
}

export async function rateLimitContact(ipHash: string, windowSeconds: number) {
  // The key detail is that the counter increment is a single atomic SQL statement. Concurrent requests cannot both read the same old count and independently pass the limit.
  const result = await db.query<{ request_count: number; window_start: Date }>(
    `INSERT INTO pwz.contact_rate_limits (ip_hash, window_start, request_count)
            VALUES ($1, to_timestamp(floor(extract(epoch FROM NOW())/$2) * $2), 1)
            ON CONFLICT (ip_hash)
            DO UPDATE 
                SET window_start = EXCLUDED.window_start,
                    request_count = 
                                    CASE 
                                        WHEN pwz.contact_rate_limits.window_start = EXCLUDED.window_start
                                        THEN pwz.contact_rate_limits.request_count + 1
                                        ELSE 1
                                    END,
                    updated_at = NOW()
        RETURNING request_count, window_start`,
    [ipHash, windowSeconds],
  );

  return result.rows[0];
}

export async function updateContactNotificationJob(
  maxAttempts: number,
  batchSize: number,
  lockMinutes: number,
) {
  await db.query(
    `UPDATE pwz.contact_notification_jobs
      SET 
        status = 'failed',
        locked_until = NULL,
        last_error = COALESCE(last_error, 'Maximum attempts reached; processing lease expired')
      WHERE status = 'processing'
        AND locked_until <= NOW()
        AND attempts >= $1
      `,
    [maxAttempts],
  );

  const result = await db.query<ClaimedJob>(
    `WITH candidates AS (
      SELECT 
          job.id
          job.contact_message_id
      FROM pwz.contact_notification_jobs AS job
      WHERE job.attempts < $1 
        AND (
        (job.status = 'pending' ND job.next_attempt_at <= NOW()) 
        OR (
            job.status = 'processing' AND job.locked_until <= NOW()
          )
        )
        ORDER BY job.next_attempt_at ASC, job.created_at ASC
        FOR UPDATE OF job SKIP LOCKED
        LIMIT $2
      )
        UPDATE pwz.contact_notification_jobs AS jobs
          SET 
            status = 'processing',
            attempts = jobs.attempts + 1,
            locked_until = NOW() + ($3 * INTERVAL '1 minute')
        FROM candidates
        JOIN pwz.contact_messages AS cm
          ON  cm.id = candidates.contact_message_id
        WHERE jobs.id = candidates.id
      RETURNING 
        jobs.id, 
        jobs.contact_message_id, 
        jobs.channel, 
        jobs.attempts, 
        cm.name, 
        cm.email, 
        cm.subject, 
        cm.message`,
    [maxAttempts, batchSize, lockMinutes],
  );

  return result.rows;
}

export async function markEmailSent(jobId: string) {
  await db.query(
    `UPDATE pwz.contact_notification_jobs
      SET 
        status = 'sent',
        sent_at = NOW(),
        locked_until = NULL,
        last_error = NULL
      WHERE id = $1`,
    [jobId],
  );
}

export async function markEmailFailed(
  job: ClaimedJob,
  maxAttempts: number,
  error: unknown,
) {
  const errorMessage =
    error instanceof Error
      ? error.message.slice(0, 2000)
      : "Unknown notification delivery error";

  const exhausted = job.attempts >= maxAttempts;

  // Attempts 1-5 wait 2, 4, 8, 16, and 32 minutes
  const retryMinutes = Math.min(60, 2 ** job.attempts);

  await db.query(
    `UPDATE pwz.contact_notification_jobs
      SET 
        status = $2 
        next_attempt_at = CASE 
          WHEN $2 = 'pending'
          THEN NOW() + ($3 * INTERVAL '1 minute')
          ELSE next_attempt_at
        END,
        locked_until = NULL,
        last_error = $4
      WHERE id = $1`,
    [job.id, exhausted ? "failed" : "pending", retryMinutes, errorMessage],
  );
}

export async function deleteOldRateLimits() {
  // Remove old rate-limit records. This is housekeeping,
  // not part of the critical notification delivery path.
  await db.query(
    `DELETE FROM pwz.contact_rate_limits
    WHERE updated_at < NOW() - INTERVAL '1 day'`,
  );
}
