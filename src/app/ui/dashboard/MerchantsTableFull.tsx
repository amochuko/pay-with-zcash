"use client";

import { deleteMerchantById } from "@/app/actions/merchant.action";
import { Merchant } from "@/app/lib/models/Merchant";
import { POST_STATUS_ENUM } from "@/app/lib/typings";
import {
  convertToTitleCase,
  formatDateToHumanReadable,
} from "@/app/lib/utils/string";
import { useState } from "react";
import ParsedImage from "../ParseImage";
import Tags from "../Tags";
import ApproveMerchantModal from "./ApproveMerchantModal";
import { getSerialNumber, paginateArrayItems } from "./helpers";

type MerchantTableFullProps = {
  merchants: Merchant[];
};

const MerchantTableFull = (props: MerchantTableFullProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 12;

  const totalPages = Math.ceil(props.merchants.length / itemsPerPage);

  const filteredMerchants = props.merchants.filter((m) =>
    m.merchant_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentMerchant, setCurrentMerchant] = useState({
    merchantId: "",
    merchantStatus: "",
    merchantName: "",
  });

  const openEditModal = (
    merchantId: string,
    merchantStatus: string,
    merchantName: string
  ) => {
    setIsModalOpen(true);
    setCurrentMerchant({ merchantId, merchantStatus, merchantName });
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setCurrentMerchant({
      merchantId: "",
      merchantStatus: "",
      merchantName: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
      <div className="flex flex-col gap-4 justify-between md:flex-row md:gap-24 md:mb-16 sm:mb-8">
        <h1 className="text-3xl text-black dark:text-white">
          List of Merchant
        </h1>
        <div className="search text-lg flex-1">
          <input
            className="px-4 py-2 border-1 rounded dark:text-slate-200 text-slate-800 border-slate-800 dark:border-slate-400 w-full"
            placeholder="Search by Merchant name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-slate-700 rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-slate-900">
                <th className="px-4 py-2 text-left">S/N</th>
                <th className="px-4 py-2 text-left">Logo</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Subtitle</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Website</th>
                <th className="px-4 py-2 text-left">Tags</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Date Created</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginateArrayItems(
                filteredMerchants,
                currentPage,
                itemsPerPage
              ).map((m, i) => {
                const serialNumber = getSerialNumber(
                  currentPage,
                  itemsPerPage,
                  i
                );

                return (
                  <tr
                    key={m.merchant_id}
                    className="border-b border-slate-400 hover:bg-slate-600"
                  >
                    <td className="px-4 py-2">{serialNumber}</td>
                    <td className="px-4 py-2">
                      <ParsedImage merchant={m} width={18} height={18} />
                    </td>
                    <td className="px-4 py-2 font-medium">
                      {convertToTitleCase(m.merchant_name)}
                    </td>
                    <td className="px-4 py-2">{m.subtitle}</td>
                    <td className="px-4 py-2">
                      {m.description ? m.description : "No description"}
                    </td>
                    <td className="px-4 py-2">
                      <a href={m.website_url} target="_blank">
                        {m.website_url}
                      </a>
                    </td>
                    <td className="px-4 py-2">
                      <Tags tags={m.tags} />
                    </td>

                    <td className="px-4 py-2 font-medium">{m.category_name}</td>
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
                      <button
                        className="text-slate-900 border-2 p-2 rounded-md bg-blue-200 cursor-pointer"
                        onClick={() =>
                          openEditModal(
                            String(m.merchant_id),
                            m.post_status,
                            m.merchant_name
                          )
                        }
                      >
                        Update
                      </button>
                      <ApproveMerchantModal
                        key={currentMerchant.merchantId}
                        isOpen={isModalOpen}
                        onClose={closeEditModal}
                        merchantId={currentMerchant.merchantId}
                        merchantStatus={
                          currentMerchant.merchantStatus as POST_STATUS_ENUM
                        }
                        merchant_name={currentMerchant.merchantName}
                      />
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        className="text-slate-900 border-2 p-2 rounded-md bg-red-300 cursor-pointer"
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
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="mt-8 flex justify-between items-center">
          <button
            className="px-4 py-2 bg-slate-900 rounded-md cursor-pointer"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </button>
          <div className="flex justify-center">
            <span className="text-center">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <button
            className="px-4 py-2 bg-slate-900 rounded-md mt-4 cursor-pointer"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MerchantTableFull;
