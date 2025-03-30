'use client'
import React, { useState } from "react";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sample data for categories and merchants
  const categories = [
    { id: 1, name: "Electronics", date: "2025-03-29" },
    { id: 2, name: "Fashion", date: "2025-03-28" },
  ];

  const merchants = [
    {
      id: 1,
      name: "TechStore",
      description: "A leading store for electronics.",
      tags: "Electronics, Gadgets",
      categoryName: "Electronics",
      postStatus: "Active",
      dateCreated: "2025-03-20",
    },
    {
      id: 2,
      name: "ClothingHub",
      description: "Trendy clothes for all ages.",
      tags: "Clothing, Fashion",
      categoryName: "Fashion",
      postStatus: "Pending",
      dateCreated: "2025-03-15",
    },
  ];

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
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-4 py-2">{category.id}</td>
                  <td className="px-4 py-2">{category.name}</td>
                  <td className="px-4 py-2">{category.date}</td>
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
              {merchants.map((merchant) => (
                <tr key={merchant.id}>
                  <td className="px-4 py-2">{merchant.id}</td>
                  <td className="px-4 py-2">{merchant.name}</td>
                  <td className="px-4 py-2">{merchant.description}</td>
                  <td className="px-4 py-2">{merchant.tags}</td>
                  <td className="px-4 py-2">{merchant.categoryName}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`${
                        merchant.postStatus === "Active"
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      } px-2 py-1 rounded`}
                    >
                      {merchant.postStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2">{merchant.dateCreated}</td>
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
