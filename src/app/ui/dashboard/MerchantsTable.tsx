"use client";
import { MerchantRecord } from "@/app/lib/types/map.types";
import { POST_STATUS_ENUM } from "@/app/lib/typings";
import {
  convertToTitleCase,
  formatDateToHumanReadable,
  trimText,
} from "@/app/lib/utils/helpers";

type MerchantsTableProps = {
  merchants: MerchantRecord[];
};

const MerchantsTable = (props: MerchantsTableProps) => {
  const { merchants } = props;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Listed businesses</h2>

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
                className="hidden whitespace-nowrap px-3 py-3 font-medium md:table-cell lg:px-4"
              >
                Description
              </th>
              {/* <th
                scope="col"
                className="hidden whitespace-nowrap px-3 py-3 font-medium lg:table-cell lg:px-4"
              >
                Tags
              </th> */}
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
            </tr>
          </thead>
          <tbody className="divide-y">
            {merchants &&
              merchants.slice(0, 8).map((merchant, i) => (
                <tr key={String(merchant.id)} className="  ">
                  <td className="sticky left-0 z-10 w-10 px-2 py-3 tabular-nums sm:w-14 sm:px-3 lg:px-4">
                    {i + 1}
                  </td>
                  <td className="max-w-[140px] text-xs text-muted-foreground truncate px-2 py-3 font-medium sm:max-w-none sm:px-3 lg:px-4">
                    {convertToTitleCase(merchant.name)}
                  </td>
                  <td className="hidden max-w-[220px] truncate px-3 py-3 text-slate-600text-xs text-muted-foreground md:table-cell lg:px-4">
                    {trimText(merchant.subtitle, 30) ||
                      trimText(merchant.description!, 30)}
                  </td>
                  {/* <td className="hidden px-3 py-3 lg:table-cell lg:px-4">
                    <Tags tags={merchant.tags} />
                  </td> */}
                  <td className="hidden whitespace-nowrap px-3 py-3 text-xs text-muted-foreground md:table-cell lg:px-4">
                    {merchant.category}
                  </td>
                  <td className="whitespace-nowrap px-2 py-3 sm:px-3 lg:px-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium sm:text-xs ${
                        merchant.postStatus === POST_STATUS_ENUM.PUBLISH
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {merchant.postStatus}
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-3 text-xs text-muted-foreground sm:table-cell lg:px-4">
                    {formatDateToHumanReadable(String(merchant.createdAt))}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MerchantsTable;
