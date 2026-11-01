import logger from "../logger";
import {
  ClaimedJob,
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

export async function markSent(jobId: string) {
  await markEmailSent(jobId);
}

export async function markFailed(job: ClaimedJob, error: unknown) {
  await markEmailFailed(job, MAX_ATTEMPTS, error);
}

