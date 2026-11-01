import logger from "../logger";
import {
  deleteOldRateLimits,
  markEmailFailed,
  markEmailSent,
  updateContactNotificationJob,
} from "./repo/contact.repo";
import { deliverNotification } from "./services/contact-notification.service";

const MAX_ATTEMPTS = 5;
const BATCH_SIZE = 10;
const LOCK_MINUTES = 2;

export async function claimJobs() {
  // Job that exhausted their attempts while a worker
  // was processing them must not remain stuck indefinitely

  const result = await updateContactNotificationJob(
    MAX_ATTEMPTS,
    BATCH_SIZE,
    LOCK_MINUTES,
  );

  return result;
}

export async function processContactNotification() {
  const jobs = await claimJobs();

  let sent = 0;
  let failed = 0;

  for (const job of jobs) {
    try {
      await deliverNotification(job);
      await markEmailSent(job.id);

      sent++;
    } catch (err) {
      logger.error(
        `[processingContactNotification]: ${job.id} (${job.channel}) failed`,
        err,
      );

      try {
        await markEmailFailed(job, MAX_ATTEMPTS, err);
      } catch (updatedErr) {
        // The processing lease will allow recovery later.
        logger.error(
          `[processingContactNotification]: Could not update failed notification ${job.id}`,
          updatedErr,
        );
      }

      failed++;
    }
  }

  await deleteOldRateLimits();

  return {
    claimed: jobs.length,
    sent,
    failed,
  };
}
