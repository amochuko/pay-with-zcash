"use client";

import { deleteCategoryById } from "@/app/actions/category.action";
import { formatDateToHumanReadable } from "@/app/lib/utils/string";
import { Suspense, useState } from "react";
import { CategoriesTableProps } from "./CategoriesTable";
import CreateCategory from "./CreateCategory";
import EditCategoryModal from "./EditCategoryModal";
import { getSerialNumber, paginateArrayItems } from "./helpers";

const CategoryTableFull = (props: CategoriesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const itemsPerPage = 10;
  const totalPages = Math.ceil(props.categories.length / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
      <div className="flex flex-row justify-between mb-12">
        <h1 className="text-3xl  text-black dark:text-white">
          List of Category
        </h1>
        <Suspense fallback={<p>Failed to create Caategory</p>}>
          <CreateCategory />
        </Suspense>
      </div>
      <div className="bg-slate-700 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-slate-900">
                <th className="px-4 py-2 text-left w-16">S/N</th>
                <th className="px-4 py-2 text-left w-1/3">Name</th>
                <th className="px-4 py-2 text-left w-1/3">Created Date</th>
                <th className="px-4 py-2 text-left w-1/3">Updated Date</th>
                <th className="px-4 py-2 text-left w-1/3">Edit</th>
                <th className="px-4 py-2 text-left w-1/3">Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginateArrayItems(
                props.categories,
                currentPage,
                itemsPerPage
              ).map((c, i) => {
                const serialNumber = getSerialNumber(
                  currentPage,
                  itemsPerPage,
                  i
                );

                return (
                  <tr key={c.category_id}>
                    <td className="px-4 py-4">{serialNumber}</td>
                    <td className="px-4 py-4 max-w-16">{c.category_name}</td>
                    <td className="px-4 py-4">
                      {formatDateToHumanReadable(String(c.created_at))}
                    </td>
                    <td className="px-4 py-4">
                      {c.updated_at
                        ? formatDateToHumanReadable(
                            String(c.updated_at?.toDateString())
                          )
                        : "NIL"}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() =>
                          openEditModal(c.category_id, c.category_name)
                        }
                        className="text-blue-200 cursor-pointer"
                      >
                        Edit
                      </button>
                      <EditCategoryModal
                        key={currentCategory.categoryId}
                        isOpen={isModalOpen}
                        onClose={closeEditModal}
                        categoryId={currentCategory.categoryId}
                        categoryName={currentCategory.categoryName}
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={async () => {
                          const confirm = window.confirm(
                            "Are you sure you want to delete this Category?"
                          );

                          if (confirm) {
                            deleteCategoryById(c.category_id);
                          }
                        }}
                        className="text-red-600 cursor-pointer"
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
        <div className="mt-8 flex justify-between">
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
    </div>
  );
};

export default CategoryTableFull;
