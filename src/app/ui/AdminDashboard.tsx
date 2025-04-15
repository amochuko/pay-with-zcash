"use client";
import { useEffect, useState } from "react";
import { Category } from "../lib/models/Category";
import { Merchant, MerchantProps } from "../lib/models/Merchant";
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
    <div className="flex h-screen">
      <main className="flex-1 px-6">
        {/* Hamburger menu */}
        <button
          className="md:hidden p-2 bg-blue-600 text-white rounded"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>

        <CategoriesTable categories={categories} />
        <MerchantsTable merchants={merchants} />
      </main>
    </div>
  );
};

export default AdminDashboard;
