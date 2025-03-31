"use client";

import { deleteMerchantById } from "@/app/lib/actions";
import { Merchant } from "@/app/lib/models/Merchant";
import { POST_STATUS_ENUM } from "@/app/lib/typings";
import { formatDateToHumanReadable } from "@/app/lib/utils/string";
import { Suspense, useState } from "react";
import { CategoriesTableProps } from "./CategoriesTable";
import CreateMerchant from "./CreateMerchant";
import {
  getSerialNumber,
  paginateArrayItems,
  parseCategoryInMerchants,
} from "./helpers";

type MerchantTableFullProps = {
  merchants: Merchant[];
} & CategoriesTableProps;

const MerchantTableFull = (props: MerchantTableFullProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(props.merchants.length / itemsPerPage);
  const merchants = parseCategoryInMerchants(props.merchants, props.categories);

  return (
    <>
      <div className="flex flex-row justify-between md:flex-col my-24">
        <h1 className="text-3xl mb-12"> List of Merchant</h1>
        <Suspense fallback={<p>Failed to create Merchant</p>}>
          <CreateMerchant />
        </Suspense>
      </div>
      <div className="bg-slate-700 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Merchants</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-slate-900">
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
              {paginateArrayItems(merchants, currentPage, itemsPerPage).map(
                (m, i) => {
                  const serialNumber = getSerialNumber(
                    currentPage,
                    itemsPerPage,
                    i
                  );
                  return (
                    <tr key={m.merchant_id}>
                      <td className="px-4 py-2">{serialNumber}</td>
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
                      <td className="px-4 py-2">
                        {formatDateToHumanReadable(String(m.created_at))}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button className="text-blue-600 cursor-pointer">
                          Edit
                        </button>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          className="text-red-600 cursor-pointer"
                          onClick={async () => {
                            const confirm = window.confirm(
                              "Are you sure you want to delete this Merchant?"
                            );

                            if (confirm) {
                              deleteMerchantById(String(m.merchant_id));
                            }
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between">
          <button
            className="px-4 py-2 bg-slate-900 rounded-md"
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
            className="px-4 py-2 bg-slate-900 rounded-md"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default MerchantTableFull;
