import { processContactNotification } from "@/app/lib/contact/outbox";
import logger from "@/app/lib/logger";
import { serverEnv } from "@/app/lib/server-env";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

export const runtine = "nodejs";

function isAuthorized(request: Request): boolean {
  const secret = serverEnv.CRON_SECRET;

  const authorization = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;

  const actualBuffer = Buffer.from(authorization);
  const expectedBuffer = Buffer.from(expected);

  return (
    actualBuffer.length === expected.length &&
    crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export async function GET(req: Request) {
  // The route is not publicly usable without the cron secret.
  // This schedules processing once per minute as configured in vercel.json.
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await processContactNotification();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err) {
    logger.error("[ContactNotification]:GET - worker failed", err);

    return NextResponse.json(
      { error: "Notification process failed" },
      { status: 500 },
    );
  }
}
