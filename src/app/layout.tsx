import "@/app/globals.css";
import { geistMono, geistSans, inter } from "@/app/ui/fonts";
import { JWTPayload } from "jose";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { appDescription, appTitle } from "./lib/placeholder-data";
import { serverEnv } from "./lib/server-env";
import { verifyJwt } from "./lib/session";
import Header from "./ui/Header";
import Footer from "./ui/footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: appTitle,
  description: appDescription,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get(serverEnv.SESSION_PAY_WITH_ZCASH)?.value;

  let _session: JWTPayload | null = null;

  if (token) {
    try {
      const session = await verifyJwt(String(token));

      if (session?.userId) {
        _session = session;
      }
    } catch (err) {
      console.log("Invalid token", err);
    }
  }

  return (
    <html lang="en">
      <body
        className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header session={_session} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
