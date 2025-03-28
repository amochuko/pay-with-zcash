"use client";

import { Merchant } from "@/app/lib/models/Merchant";
import { convertToTitleCase } from "@/app/lib/utils/string";
import Image from "next/image";

interface MerchantProps {
  merchant: Merchant;
}
export default function MerchantItem(props: MerchantProps) {
  const upvote = () => {};

  return (
    <div
      className="merchant-item flex items-center gap-4 my-4 bg-slate-200 p-4 rounded-lg shadow-md w-full md:max-w-sm justify-between"
      data-tags={
        props.merchant.tags
          ? props.merchant.tags.join(",")
          : props.merchant.merchant_name
      }
    >
      <Image
        src={props.merchant.logo_url}
        width={12}
        height={12}
        alt={`${props.merchant.merchant_name} Logo`}
        className="w-12 h-12 mb-2"
      />

      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        {convertToTitleCase(props.merchant.merchant_name)}
      </h2>

      <button
        onClick={upvote}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none cursor-pointer"
      >
        Upvote ({props.merchant.upvote_count})
      </button>
    </div>
  );
}
