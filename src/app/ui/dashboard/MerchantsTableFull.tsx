"use client";

import { deleteMerchantById } from "@/app/actions/merchant.action";
import { MerchantRecord } from "@/app/lib/types/map.types";
import { POST_STATUS_ENUM } from "@/app/lib/typings";
import {
  convertToTitleCase,
  formatDateToHumanReadable,
  trimText,
} from "@/app/lib/utils/helpers";
import { useState } from "react";
import ParsedImage from "../ParseImage";
import Tags from "../Tags";
import ApproveMerchantModal from "./ApproveMerchantModal";
import { getSerialNumber, paginateArrayItems } from "./helpers";

type MerchantTableFullProps = {
  merchants: MerchantRecord[];
};

const MerchantTableFull = (props: MerchantTableFullProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 12;

  const totalPages = Math.ceil(props.merchants.length / itemsPerPage);

  const filteredMerchants = props.merchants.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()),
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
    merchantName: string,
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
    <>
      <div className="relative w-full max-w-7xl mx-auto overflow-x-auto rounded-lg bg-card/50 border-border/50 shadow-sm [-webkit-overflow-scrolling:touch] ">
        {props.merchants.length > 0 ? (
          <>
            {/* Gradient fade to hint horizontal scroll is available */}
            <div className="pointer-events-none absolute inset-y-0 right-0 w-8 md:hidden" />

            <table className="w-full min-w-[640px] border-collapse text-left text-xs sm:text-sm">
              <thead className="sticky top-0 z-10">
                <tr>
                  <th
                    scope="col"
                    className="sticky left-0 z-20 w-10 px-2 py-3 font-medium sm:w-14 sm:px-3 lg:px-4"
                  >
                    S/N
                  </th>
                  <th
                    scope="col"
                    className="sticky left-0 z-20 w-10 px-2 py-3 font-medium sm:w-14 sm:px-3 lg:px-4"
                  >
                    Logo
                  </th>
                  <th
                    scope="col"
                    className="max-w-[140px] whitespace-nowrap px-2 py-3 font-medium sm:max-w-none sm:px-3 lg:px-4"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="hidden whitespace-nowrap px-3 py-3 font-medium md:table-cell lg:px-4"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="hidden whitespace-nowrap px-3 py-3 font-medium lg:table-cell lg:px-4"
                  >
                    Tags
                  </th>
                  <th
                    scope="col"
                    className="hidden whitespace-nowrap px-3 py-3 font-medium md:table-cell lg:px-4"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3 font-medium sm:px-3 lg:px-4"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="hidden whitespace-nowrap px-3 py-3 font-medium sm:table-cell lg:px-4"
                  >
                    Date Created
                  </th>
                  <th
                    scope="col"
                    className="whitespace-nowrap px-2 py-3 font-medium sm:px-3 lg:px-4"
                  >
                    Edit
                  </th>
                  <th
                    scope="col"
                    className="hidden whitespace-nowrap px-3 py-3 font-medium sm:table-cell lg:px-4"
                  >
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {paginateArrayItems(
                  filteredMerchants,
                  currentPage,
                  itemsPerPage,
                ).map((m, i) => {
                  const serialNumber = getSerialNumber(
                    currentPage,
                    itemsPerPage,
                    i,
                  );

                  return (
                    <tr key={String(m.id)} className="  ">
                      <td className="sticky left-0 z-10 w-10 px-2 py-3 tabular-nums sm:w-14 sm:px-3 lg:px-4">
                        {i + 1}
                      </td>
                      <td className="sticky left-0 z-10 w-10 px-2 py-3 tabular-nums sm:w-14 sm:px-3 lg:px-4">
                        <ParsedImage merchant={m} width={18} height={18} />
                      </td>
                      <td className="max-w-[140px] text-xs text-muted-foreground truncate px-2 py-3 font-medium sm:max-w-none sm:px-3 lg:px-4">
                        {convertToTitleCase(m.name)}
                      </td>
                      <td className="hidden max-w-[220px] truncate px-3 py-3 text-slate-600text-xs text-muted-foreground md:table-cell lg:px-4">
                        {trimText(m.subtitle, 30) ||
                          trimText(m.description!, 30)}
                      </td>
                      <td className="hidden px-3 py-3 lg:table-cell lg:px-4">
                        <Tags tags={m.tags} />
                      </td>
                      <td className="hidden whitespace-nowrap px-3 py-3 text-xs text-muted-foreground md:table-cell lg:px-4">
                        {m.category}
                      </td>
                      <td className="whitespace-nowrap px-2 py-3 sm:px-3 lg:px-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium sm:text-xs ${
                            m.postStatus === POST_STATUS_ENUM.PUBLISH
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {m.postStatus}
                        </span>
                      </td>
                      <td className="hidden whitespace-nowrap px-3 py-3 text-xs text-muted-foreground sm:table-cell lg:px-4">
                        {formatDateToHumanReadable(String(m.createdAt))}
                      </td>

                      <td className="hidden whitespace-nowrap px-3 py-3 text-xs text-muted-foreground sm:table-cell lg:px-4">
                        <button
                          className="text-slate-900 border-2 p-2 rounded-md bg-blue-200 cursor-pointer"
                          onClick={() =>
                            openEditModal(String(m.id), m.postStatus, m.name)
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
                      <td className="hidden whitespace-nowrap px-3 py-3 text-xs text-muted-foreground sm:table-cell lg:px-4">
                        <button
                          className="text-slate-900 border-2 p-2 rounded-md bg-red-300 cursor-pointer"
                          onClick={async () => {
                            const confirm = window.confirm(
                              "Are you sure you want to delete this Merchant?",
                            );

                            if (confirm) {
                              deleteMerchantById(String(m.id));
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

            {/* Pagination Controls */}
            <div className="mt-8 flex justify-between items-center">
              <button
                className="px-4 py-2  rounded-md cursor-pointer"
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
                className="px-4 py-2   rounded-md mt-4 cursor-pointer"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div>
            <p>No published merchant yet</p>
          </div>
        )}
      </div>
    </>
  );
};

export default MerchantTableFull;
