import crypto from "node:crypto";
import { serverEnv } from "../../server-env";
import { rateLimitContact } from "../repo/contact.repo";

const WINDOW_SECONDS = 15 * 60; // use a fixed window of 15 minutes
const MAX_REQUESTS = 5; // and allow five submissions per IP in each window.

function hashIp(ip: string): string {
  const secret = serverEnv.CONTACT_RATE_SECRET;

  return crypto.createHmac("sha256", secret).update(ip).digest("hex");
}

export async function checkContactRateLimit(ip: string) {
  const ipHash = hashIp(ip);

  const result = await rateLimitContact(ipHash, WINDOW_SECONDS);
  const { request_count, window_start } = result;

  const allowed = request_count <= MAX_REQUESTS;
  const windowEndsAt = new Date(window_start).getTime() + WINDOW_SECONDS * 1000;

  return {
    allowed,
    remaining: Math.max(0, MAX_REQUESTS - request_count),
    retriesAfterSeconds: allowed
      ? 0
      : Math.max(1, Math.ceil((windowEndsAt - Date.now()) / 1000)),
  };
}
