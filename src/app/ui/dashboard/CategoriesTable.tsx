"use client";

import { Category } from "@/app/lib/types/category.type";
import {
  convertToTitleCase,
  formatDateToHumanReadable,
} from "@/app/lib/utils/helpers";

export type CategoriesTableProps = {
  categories: Category[];
};
export const CategoriesTable = (props: CategoriesTableProps) => {
  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>

      <div className="relative w-full overflow-x-auto rounded-lg bg-card/50 border-border/50 shadow-sm [-webkit-overflow-scrolling:touch] ">
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
                className="whitespace-nowrap px-2 py-3 font-medium sm:px-3 lg:px-4"
              >
                Date Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {props.categories &&
              props.categories.map((c, i) => (
                <tr key={String(c.category_id)} className="  ">
                  <td className="sticky left-0 z-10 w-10 px-2 py-3 tabular-nums sm:w-14 sm:px-3 lg:px-4">
                    {i + 1}
                  </td>
                  <td className="max-w-[140px] text-xs text-muted-foreground truncate px-2 py-3 font-medium sm:max-w-none sm:px-3 lg:px-4">
                    {convertToTitleCase(c.category_name)}
                  </td>

                  <td className="hidden whitespace-nowrap px-3 py-3 text-xs text-muted-foreground sm:table-cell lg:px-4">
                    {formatDateToHumanReadable(String(c.created_at))}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesTable;
