"use client";
import { useEffect, useState } from "react";
import { Category } from "../lib/models/Category";
import { Merchant } from "../lib/models/Merchant";
import { POST_STATUS_ENUM } from "../lib/typings";
import { trimText } from "../lib/utils/string";

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

        {/* Categories Table */}
        <div className="bg-slate-700 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Categories</h2>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-slate-900">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {categories &&
                categories.slice(0, 8).map((category, i) => (
                  <tr key={category.category_id}>
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{category.category_name}</td>
                    <td className="px-4 py-2">{category.created_at}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Merchants Table */}
        <div className="bg-slate-700 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Merchants</h2>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-slate-900">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Tags</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date Created</th>
              </tr>
            </thead>
            <tbody>
              {merchants.slice(0, 8).map((merchant, i) => (
                <tr key={merchant.category_id + i}>
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{merchant.merchant_name}</td>
                  <td className="px-4 py-2">
                    {trimText(merchant.subtitle, 30) ||
                      trimText(merchant.description, 30)}
                  </td>
                  <td className="px-4 py-2">{merchant.tags}</td>
                  <td className="px-4 py-2">{merchant.category_id}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`${
                        merchant.post_status === POST_STATUS_ENUM.PUBLISH
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      } px-2 py-1 rounded`}
                    >
                      {merchant.post_status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {merchant.created_at?.toString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
