import { geistMono, geistSans, inter } from "@/app/ui/fonts";
import "@/app/ui/globals.css";
import type { Metadata } from "next";
import { appDescription, appTitle } from "./lib/placeholder-data";
import Nav from "./ui/nav";

export const metadata: Metadata = {
  title: appTitle,
  description: appDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased flex flex-col items-center justify-center`}
      >
        <Nav />
        {children}

        <footer className=" mb-4">
          © Pay With Zcash {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
