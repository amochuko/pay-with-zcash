import "@/app/ui/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "appTitle",
  description: "appDescription",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="dashboard">{children}</div>;
}
