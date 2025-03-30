import NextAuth from "next-auth";
import Github from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Github({
      clientId:
        process.env.NODE_ENV != "production"
          ? String(process.env.AUTH_GITHUB_ID_DEV)
          : String(process.env.AUTH_GITHUB_ID_PROD),
      clientSecret:
        process.env.NODE_ENV != "production"
          ? String(process.env.AUTH_GITHUB_SECRET_DEV)
          : String(process.env.AUTH_GITHUB_SECRET_PROD),
      name: "Pay with Zcash",
    }),
  ],
});
