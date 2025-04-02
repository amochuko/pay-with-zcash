"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { logOut } from "../actions/auth.action";
import { Category } from "../lib/models/Category";
import { Merchant } from "../lib/models/Merchant";
import CategoriesTable from "./dashboard/CategoriesTable";
import MerchantsTable from "./dashboard/MerchantsTable";

type AdminDashboardProps = {
  merchants: Merchant[];
  categories: Category[];
};

const AdminDashboard = (props: AdminDashboardProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setMerchants(props.merchants);
    setCategories(props.categories);
  }, [props]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } md:block w-64 bg-slate-800 text-white p-6`}
      >
        <h2 className="text-xl font-semibold mb-8">Admin Dashboard</h2>
        <ul>
          <li className="mb-4">
            <Link
              href={"/dashboard/categories"}
              className="text-white hover:text-gray-300"
            >
              Categories
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href={"/dashboard/merchants"}
              className="text-white hover:text-gray-300"
            >
              Merchants
            </Link>
          </li>
          <li className="mb-4">
            <Link
              href={"/dashboard/settings"}
              className="text-white hover:text-gray-300"
            >
              Settings
            </Link>
          </li>
          <li className="mb-4">
            <button
              type="submit"
              onClick={logOut}
              className="cursor-pointer  bg-amber-400 text-black p-2 font-bold"
            >
              Log out
            </button>
          </li>
        </ul>
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
        <MerchantsTable merchants={merchants} categories={categories} />
      </div>
    </div>
  );
};

export default AdminDashboard;
