import { geistMono, geistSans, inter } from "@/app/ui/fonts";
import "@/app/ui/globals.css";
import type { Metadata } from "next";
import { appDescription, appTitle } from "./lib/placeholder-data";
import Footer from "./ui/footer";
import NavigationBar from "./ui/navigation/navigation-bar";


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
        className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <NavigationBar />
        <main className="flex-grow mt-40">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
