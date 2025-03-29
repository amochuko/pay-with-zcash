"use client";

import { Merchant } from "@/app/lib/models/Merchant";
import { convertToTitleCase } from "@/app/lib/utils/string";
import Image from "next/image";
import { useState } from "react";
import UpvoteButton from "../UpvoteButton";
import MerchantPreview from "./MerchantPreview";

interface MerchantProps {
  merchant: Merchant;
}
export default function MerchantItem(props: MerchantProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="merchant-item flex items-center gap-4 m-4 p-4  bg-slate-200 rounded-lg shadow-md w-full md:max-w-sm justify-between"
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
          className="w-12 h-12"
        />

        <h2
          className="text-xl font-semibold text-gray-700 cursor-pointer"
          onClick={openModal}
        >
          {convertToTitleCase(props.merchant.merchant_name)}
        </h2>
        <UpvoteButton
          currentUpvoteCount={props.merchant.upvote_count}
          merchantId={String(props.merchant.merchant_id)}
        />
      </div>

      <MerchantPreview
        isOpen={isModalOpen}
        onClose={closeModal}
        merchant={props.merchant}
      />
    </>
  );
}
