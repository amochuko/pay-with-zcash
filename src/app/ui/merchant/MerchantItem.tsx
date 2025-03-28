'use client'

import { Merchant } from "@/app/lib/models/Merchant";
import Image from "next/image";

interface MerchantProps {
  merchant: Merchant;
}
export default function MerchantItem(props: MerchantProps) {
  const upvote = () => {};

  return (
    <div
      className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md w-full max-w-xs md:max-w-sm lg:max-w-md"
      data-tags={
        props.merchant.tags
          ? props.merchant.tags.join(",")
          : props.merchant.merchant_name
      }
    >
      <Image
        src={props.merchant.logo_url}
        width={50}
        height={50}
        alt={`${props.merchant.merchant_name} Logo`}
        className="w-16 h-16 mb-4"
      />

      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {props.merchant.merchant_name}
      </h2>

      <button
        onClick={upvote}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none cursor-pointer"
      >
        Upvote
      </button>
    </div>
  );
}
