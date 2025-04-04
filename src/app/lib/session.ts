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
  try {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(encodedKey);
  } catch (err) {
    console.error("Error signing JWT:", err);
    throw new Error("Failed to sign JWT");
  }
}

export async function verifyJwt(session: string) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (err) {
    console.error("Failed to verify session", err);
    throw new Error("Invalid session token");
  }
}

export async function createUserSession(userId: string) {
  try {
    const cookieStore = await cookies();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const session = await signJwt({ userId, expiresAt });

    cookieStore.set(SESSION_PAY_WITH_ZCASH, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      sameSite: "strict", // Prevent CSRF attacks
    });
  } catch (err) {
    console.error("Error creating user session: ", err);
    throw new Error("Failed to create user session");
  }
}

export async function deleteUserSession() {
  const cookieStore = await cookies();

  cookieStore.delete({
    name: SESSION_PAY_WITH_ZCASH,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
}
