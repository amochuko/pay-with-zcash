"use client";

import SideBar from "@/app/ui/dashboard/SideBar";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard flex h-screen">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-semibold mb-6">Admin Dashboard</h2>
        <nav>
          <ul>
            <li></li>
          </ul>
          <SideBar isSidebarOpen={isSidebarOpen} />
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4">
        <main>{children}</main>
      </div>

      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded"
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

      {/* Mobile Sidebar */}
      {isMobileNavOpen && (
        <div className="lg:hidden fixed inset-0 bg-gray-800 bg-opacity-75 z-50">
          <div className="flex flex-col items-center justify-center h-full">
            <nav>
              <ul>
                <li>
                  <a href="/admin" className="block py-2 px-4 text-white">
                    Dashboard
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
