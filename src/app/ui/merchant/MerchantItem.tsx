"use client";

import { Merchant } from "@/app/lib/models/Merchant";
import { convertToTitleCase } from "@/app/lib/utils/string";
import { useState } from "react";
import ParsedImage from "../ParseImage";
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
        className="card bg-slate-200 rounded-md shadow-md p-3 flex flex-row items-center justify-between"
        data-tags={
          props.merchant.tags
            ? props.merchant.tags.join(",")
            : props.merchant.merchant_name
        }
        data-description={props.merchant.description || props.merchant.subtitle}
        data-title={props.merchant.merchant_name}
      >
        {/* Logo and Name Container */}
        <div
          onClick={openModal}
          className="flex flex-row items-center space-x-4 flex-grow cursor-pointer"
        >
          <ParsedImage merchant={props.merchant} width={12} height={12} />
          <p
            key={props.merchant.merchant_id}
            id={`merchant-${props.merchant.merchant_id}`}
            className="text-base md:text-md lg:text-md font-semibold text-black sm:font-medium"
          >
            {convertToTitleCase(props.merchant.merchant_name)}
          </p>
        </div>
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
