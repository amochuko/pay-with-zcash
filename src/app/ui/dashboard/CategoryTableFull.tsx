"use client";

import { deleteCategoryById } from "@/app/lib/actions";
import { formatDateToHumanReadable } from "@/app/lib/utils/string";
import { Suspense, useState } from "react";
import { CategoriesTableProps } from "./CategoriesTable";
import CreateCategory from "./CreateCategory";
import { paginateArrayItems } from "./helpers";

const CategoryTableFull = (props: CategoriesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(props.categories.length / itemsPerPage);

  return (
    <div>
      <div className="flex flex-row justify-between md:flex-col my-24">
        <h1 className="text-3xl mb-12"> List of Category</h1>
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
                <th className="px-4 py-2 text-left w-1/4">Date</th>
                <th className="px-4 py-2 text-left w-24">Edit</th>
                <th className="px-4 py-2 text-left w-24">Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginateArrayItems(
                props.categories,
                currentPage,
                itemsPerPage
              ).map((c, i) => (
                <tr key={c.category_id}>
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{c.category_name}</td>
                  <td className="px-4 py-2">
                    {formatDateToHumanReadable(c.created_at)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button className="text-blue-600">Edit</button>
                  </td>
                  <td className="px-4 py-2 text-center">
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
              ))}
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
      </div>{" "}
    </div>
  );
};

export default CategoryTableFull;
