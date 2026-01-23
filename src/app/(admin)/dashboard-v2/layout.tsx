"use client";

import "@/app/globals.css";
import { useState } from "react";
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
  const [openSideBar, setOpenSideBar] = useState(false);

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <div className="flex flex-1 flex-col md:flex-row p-4  bg-slate-400 gap-12 md:gap-6">
          <div className="flex md:flex-col bg-slate-600 rounded-sm">
            <div className="flex flex-row justify-between items-center md:flex-col">
              <div className="md:hidden">
                {/* Mobile Sidebar Toggle Button */}
                <button
                  onClick={() => {
                    console.log("Sidebar clicked");
                    setOpenSideBar(!openSideBar);
                  }}
                  className="lg:hidden ml-2 bg-gray-800 text-white p-2 rounded hover:cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    ></path>
                  </svg>
                </button>
              </div>
              <h1 className="p-4 font-semibold text-xl bg-transparent text-white">
                {title}
              </h1>
            </div>
            <SideBar isSidebarOpen={openSideBar} />
          </div>

          <div className="flex flex-col w-full gap-4 md:gap-6 ms:gap-8">
            <Header title={"Stats"} items={items} />
            <main className="flex-1">{children}</main>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
