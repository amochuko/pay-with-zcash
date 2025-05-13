"use client";
import { useEffect, useState } from "react";
import { Category } from "../lib/models/Category";
import { Merchant, MerchantProps } from "../lib/models/Merchant";
import { POST_STATUS_ENUM } from "../lib/typings";
import CategoriesTable from "./dashboard/CategoriesTable";
import MerchantsTable from "./dashboard/MerchantsTable";

type AdminDashboardProps = {
  merchants: MerchantProps;
  merchantsNotApproved: number;
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 mb-8">
          {/* <!-- Pending --> */}
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow transition-all duration-300 hover:bg-yellow-200 hover:border-yellow-600">
            <h2 className="text-yellow-800 font-semibold text-lg">
              Pending Approvals:{props.merchantsNotApproved}
            </h2>
          </div>
          <div className="bg-green-100 border-l-4 border-green-500 p-4 rounded shadow transition-all duration-300 hover:bg-green-200 hover:border-green-600">
            <h2 className="text-green-800 font-semibold text-lg">
              Approved:{" "}
              {props.merchants.data.reduce((acc, cur) => {
                if (cur.post_status === POST_STATUS_ENUM.PUBLISH) {
                  acc++;
                }

                return acc;
              }, 0)}
            </h2>
          </div>

          <div className="bg-gray-100 border-l-4 border-gray-500 p-4 rounded shadow transition-all duration-300 hover:bg-gray-200 hover:border-gray-600">
            <h2 className="text-gray-800 font-semibold text-lg">
              Total Merchants: {merchants.length}
            </h2>
          </div>
        </div>

        <CategoriesTable categories={categories} />
        <MerchantsTable merchants={merchants} />
      </main>
    </div>
  );
};

export default AdminDashboard;
