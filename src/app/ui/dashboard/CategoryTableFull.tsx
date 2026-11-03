"use client";

import { deleteCategoryById } from "@/app/actions/category.action";
import {
  convertToTitleCase,
  formatDateToHumanReadable,
} from "@/app/lib/utils/helpers";
import { Edit2Icon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "../button";
import { CategoriesTableProps } from "./CategoriesTable";
import EditCategoryModal from "./EditCategoryModal";
import { getSerialNumber, paginateArrayItems } from "./helpers";

const CategoryTableFull = (props: CategoriesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteB, setIsDelete] = useState(false);

  const [currentCategory, setCurrentCategory] = useState({
    categoryId: "",
    categoryName: "",
  });

  const openEditModal = (categoryId: string, categoryName: string) => {
    setIsModalOpen(true);
    setCurrentCategory({ categoryId, categoryName });
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setCurrentCategory({ categoryId: "", categoryName: "" });
  };

  const handleDelete = () => {
    setIsModalOpen(true);
    // setCurrentCategory({ categoryId, categoryName });
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(props.categories.length / itemsPerPage);

  return (
    <>
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
                className="max-w-[140px] whitespace-nowrap px-2 py-3 font-medium sm:max-w-none sm:px-3 lg:px-4"
              >
                Name
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
              props.categories,
              currentPage,
              itemsPerPage,
            ).map((c, i) => {
              const serialNumber = getSerialNumber(
                currentPage,
                itemsPerPage,
                i,
              );

              return (
                <tr key={String(c.category_id)}>
                  <td className="sticky left-0 z-10 w-10 px-2 py-3 tabular-nums sm:w-14 sm:px-3 lg:px-4">
                    {serialNumber}
                  </td>

                  <td className="max-w-[140px] text-xs text-muted-foreground truncate px-2 py-3 font-medium sm:max-w-none sm:px-3 lg:px-4">
                    {convertToTitleCase(c.category_name)}
                  </td>

                  <td className="hidden whitespace-nowrap px-3 py-3 text-xs text-muted-foreground sm:table-cell lg:px-4">
                    {formatDateToHumanReadable(String(c.created_at))}
                  </td>

                  <td className="hidden whitespace-nowrap px-3 py-3 text-xs text-muted-foreground sm:table-cell lg:px-4">
                    <Button
                      className="text-slate-900 border-2 p-2 rounded-md bg-blue-200 cursor-pointer"
                      onClick={() =>
                        openEditModal(c.category_id, c.category_name)
                      }
                    >
                      <Edit2Icon className="h-4 w-4" />
                    </Button>
                    <EditCategoryModal
                      key={currentCategory.categoryId}
                      isOpen={isModalOpen}
                      onClose={closeEditModal}
                      categoryId={currentCategory.categoryId}
                      categoryName={currentCategory.categoryName}
                    />
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-3 text-xs text-muted-foreground sm:table-cell lg:px-4">
                    <Button
                      className="text-slate-900 border-2 p-2 rounded-md bg-red-300 cursor-pointer"
                      onClick={async () => {
                        const confirm = window.confirm(
                          "Are you sure you want to delete this Merchant?",
                        );

                        if (confirm) {
                          deleteCategoryById(String(c.category_id));
                        }
                      }}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="mt-8 flex justify-between items-center">
          <Button
            className="px-4 py-2  rounded-md cursor-pointer"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <div className="flex justify-center">
            <span className="text-center">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <Button
            className="px-4 py-2   rounded-md mt-4 cursor-pointer"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </>
    </>
  );
};

export default CategoryTableFull;
