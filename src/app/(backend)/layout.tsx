"use client";

import "@/app/globals.css";
import Header from "../ui/Header";
import { SidebarProvider } from "../ui/sidebar";
import Footer from "./(admin)/admin/(components)/Footer";

export interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AdminTwoLayout({
  title = "Admin Dashboard",
  children,
}: AdminLayoutProps) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <SidebarProvider>
          <main className="flex-1 bg-slate-400">{children}</main>
        </SidebarProvider>
        <Footer />
      </body>
    </html>
  );
}
