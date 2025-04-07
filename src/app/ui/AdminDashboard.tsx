"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { logOut } from "../actions/auth.action";
import { Category } from "../lib/models/Category";
import { Merchant, MerchantProps } from "../lib/models/Merchant";
import { navMenuBackend } from "../lib/nav-menu";
import { convertToTitleCase } from "../lib/utils/string";
import CategoriesTable from "./dashboard/CategoriesTable";
import MerchantsTable from "./dashboard/MerchantsTable";

type AdminDashboardProps = {
  merchants: MerchantProps;
  categories: Category[];
};

const AdminDashboard = (props: AdminDashboardProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setMerchants(props.merchants.data);
    setCategories(props.categories);
  }, [props]);

  return (
    <div className="dashboard flex h-screen">
      {/* Sidebar */}
      <div
        className={`nav-bar-left flex flex-col h-full ${
          isSidebarOpen ? "block" : "hidden"
        } md:block w-64 bg-slate-800 text-white p-6`}
      >
        <h2 className="text-xl font-semibold mb-8">Admin Dashboard</h2>

        <ul className="nav-items flex-grow-1 overflow-y-auto min-h--[100]">
          {navMenuBackend.map((n) => (
            <li key={n.link} className="nav-item mb-4">
              <Link href={n.link} className="text-white hover:text-gray-300">
                {convertToTitleCase(n.title)}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="submit"
          onClick={logOut}
          className="mt-48 cursor-pointer bg-amber-400 text-black p-2 font-bold"
        >
          Log out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Hamburger menu */}
        <button
          className="md:hidden p-2 bg-blue-600 text-white rounded"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>

        <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
        <CategoriesTable categories={categories} />
        <MerchantsTable merchants={merchants} />
      </div>
    </div>
  );
};

export default AdminDashboard;
