"use client";

import "@/app/globals.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import SideBar from "./components/Sidebar";

const items = [
  { label: "Users", value: 123 },
  { label: "Revenue", value: "$4,560" },
  { label: "Errors", value: 3 },
  { label: "Uptime", value: "99.9%" },
];

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
        <div className="flex flex-1 flex-col md:flex-row p-4 bg-slate-400 gap-12 md:gap-6">
          <div className="flex md:flex-col bg-slate-600 rounded-sm">
            <h1 className="p-4 font-semibold text-xl bg-transparent text-white">{title}</h1>
            <SideBar />
          </div>

          <div className="flex flex-col w-full py-15">
            <Header title={"Stats"} items={items} />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
