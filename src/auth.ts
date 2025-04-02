import NextAuth from "next-auth";
import Github from "next-auth/providers/github";


export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID || "",
      clientSecret: process.env.AUTH_GITHUB_SECRET || "",
      name: "Pay With Zcash",
    }),
  ],
});
