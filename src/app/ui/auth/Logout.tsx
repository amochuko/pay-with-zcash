"use client";
import { signOut } from "next-auth/react";

export function SignOut() {
  return (
    <form
      action={async () => {
        await signOut();
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  );
}
