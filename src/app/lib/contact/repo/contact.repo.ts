import { ContactFormInput } from "@/app/(frontend)/contact-us/contact.validation";
import { db } from "../../database/db";

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
): Promise<ContactMessage> {
  try {
    // This is the important transactional guarantee:
    // - If the message insert fails, nothing is saved.
    // - If either notification job insert fails, the message insert is rolled back too.
    // - If both jobs are inserted successfully, the message and both jobs are committed together.

    await db.query(`BEGIN`);

    const msgResult = await db.query(
      `INSERT INTO pwz.contact_message (name, email, subject, message)
          VALUES ($1,$2,$3,$4)
          RETURNING id, name, email, subject, message, created_at`,
      [args.name, args.email, args.subject, args.message],
    );

    const msgId = msgResult.rows[0].id;

    await db.query(
      `INSERT INTO pwz.contact_notification_jobs (
        contact_message_id, channel
      )
      VALUES ($1, 'email'), ($1, 'discord')`,
      [msgId],
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
