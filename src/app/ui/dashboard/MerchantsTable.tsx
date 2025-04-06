"use client";
import { Merchant } from "@/app/lib/models/Merchant";
import { POST_STATUS_ENUM } from "@/app/lib/typings";
import {
  convertToTitleCase,
  formatDateToHumanReadable,
  trimText,
} from "@/app/lib/utils/string";
import Tags from "../Tags";

type MerchantsTableProps = {
  merchants: Merchant[];
};

const MerchantsTable = (props: MerchantsTableProps) => {
  const { merchants } = props;

  return (
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
            </tr>
          </thead>
          <tbody>
            {merchants &&
              merchants.slice(0, 8).map((merchant, i) => (
                <tr key={String(merchant.category_id)}>
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">
                    {convertToTitleCase(merchant.merchant_name)}
                  </td>
                  <td className="px-4 py-2">
                    {trimText(merchant.subtitle, 30) ||
                      trimText(merchant.description, 30)}
                  </td>
                  <td className="px-4 py-2">
                    <Tags tags={merchant.tags} />
                  </td>
                  <td className="px-4 py-2">{merchant.category_name}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`${
                        merchant.post_status === POST_STATUS_ENUM.PUBLISH
                          ? "bg-green-200 text-green-800"
                          : "bg-yellow-200 text-yellow-800"
                      } px-2 py-1 rounded`}
                    >
                      {merchant.post_status}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {formatDateToHumanReadable(String(merchant.created_at))}
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
