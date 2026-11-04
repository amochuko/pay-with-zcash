"use client";

import "@/app/globals.css";
import { SidebarProvider } from "../ui/sidebar";

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
      <body className="flex">
        <SidebarProvider>
          <main className="flex-1 bg-slate-400">{children}</main>
        </SidebarProvider>
      </body>
    </html>
  );
}
