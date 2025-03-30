'use client'

import { Merchant } from "@/app/lib/models/Merchant";
import { POST_STATUS_ENUM } from "@/app/lib/typings";
import { useState } from "react";
import { CategoriesTableProps } from "./CategoriesTable";
import { parseCategoryInMerchants } from "./helpers";
import { formatDateToHumanReadable } from "@/app/lib/utils/string";


type MerchantTableFullProps = {
  merchants: Merchant[];
} & CategoriesTableProps;

const MerchantTableFull = (props: MerchantTableFullProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination logic
  const paginate = (merchants: Merchant[]) => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return merchants.slice(indexOfFirstItem, indexOfLastItem);
  };

  const totalPages = Math.ceil(props.merchants.length / itemsPerPage);
  const merchants = parseCategoryInMerchants(props.merchants, props.categories);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Merchants</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">S/N</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Tags</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Date Created</th>
              <th className="px-4 py-2 text-left">Edit</th>
              <th className="px-4 py-2 text-left">Delete</th>
            </tr>
          </thead>
          <tbody>
            {paginate(merchants).map((m, i) => (
              <tr key={m.merchant_id}>
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{m.merchant_name}</td>
                <td className="px-4 py-2">{m.description}</td>
                <td className="px-4 py-2">{m.tags}</td>
                <td className="px-4 py-2">{m.category_id}</td>
                <td className="px-4 py-2">
                  <span
                    className={`${
                      m.post_status === POST_STATUS_ENUM.PUBLISH
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    } px-2 py-1 rounded`}
                  >
                    {m.post_status}
                  </span>
                </td>
                <td className="px-4 py-2">{formatDateToHumanReadable(String(m.created_at))}</td>
                <td className="px-4 py-2 text-center">
                  <button className="text-blue-600">Edit</button>
                </td>
                <td className="px-4 py-2 text-center">
                  <button className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between">
        <button
          className="px-4 py-2 bg-gray-200 rounded-md"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <div>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <button
          className="px-4 py-2 bg-gray-200 rounded-md"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MerchantTableFull;
