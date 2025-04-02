import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SESSION_PAY_WITH_ZCASH } from "./config";

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

type SessionPayload = {
  userId: string;
  expiresAt: Date;
};

export async function signJwt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function verifyJwt(session: string) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (err) {
    console.log("Failed to verify session", err);
  }
}

export async function createUserSession(userId: string) {
  const cookieStore = await cookies();

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await signJwt({ userId, expiresAt });

  cookieStore.set(SESSION_PAY_WITH_ZCASH, session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
  });
}

export async function deleteUserSession() {
  const cookieStore = await cookies()

  cookieStore.delete(SESSION_PAY_WITH_ZCASH);
}
