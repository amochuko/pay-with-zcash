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
        className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Nav />
        {children}

        <footer className="flex mb-4 items-center justify-center">
          © Pay With Zcash {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
