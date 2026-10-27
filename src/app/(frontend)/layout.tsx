import "@/app/globals.css";
import { geistMono, geistSans, inter } from "@/app/ui/fonts";
import type { Metadata } from "next";
import { appDescription, appTitle } from "../lib/placeholder-data";
import Header from "../ui/Header";
import Footer from "../ui/Footer";

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
        className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
