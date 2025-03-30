"use client";
import { useEffect, useState } from "react";
import { Category } from "../lib/models/Category";
import { Merchant } from "../lib/models/Merchant";
import MerchantsTable from "./dashboard/MerchantsTable";
import CategoriesTable from "./dashboard/CategoriesTable";

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
            <a href="#" className="text-white hover:text-gray-300">
              Dashboard
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="text-white hover:text-gray-300">
              Categories
            </a>
          </li>
          <li className="mb-4">
            <a href="#" className="text-white hover:text-gray-300">
              Merchants
            </a>
          </li>
          <li>
            <a href="#" className="text-white hover:text-gray-300">
              Settings
            </a>
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
        <MerchantsTable merchants={merchants} />
      </div>
    </div>
  );
};

export default AdminDashboard;
