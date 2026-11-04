"use server";

import { cookies } from "next/headers";
import { serverEnv } from "./server-env";
import { verifyJwt } from "./session";

export async function authenticated() {
  const cookieStore = await cookies();

  const token = cookieStore.get(serverEnv.SESSION_PAY_WITH_ZCASH)?.value;

  if (!token) {
    return {
      message: "Unauthorized",
      status: 'ERROR'
    };
  }

  const session = await verifyJwt(String(token));

  return session;
}
