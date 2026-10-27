"use client";

import { MerchantRecord } from "@/app/lib/types/map.types";
import { convertToTitleCase } from "@/app/lib/utils/helpers";
import { useState } from "react";
import ParsedImage from "../ParseImage";
import UpvoteButton from "../UpvoteButton";
import MerchantPreview from "./MerchantPreview";

interface MerchantProps {
  merchant: MerchantRecord;
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
            : props.merchant.name
        }
        data-description={props.merchant.description || props.merchant.subtitle}
        data-title={props.merchant.name}
      >
        {/* Logo and Name Container */}
        <div
          onClick={openModal}
          className="flex flex-row items-center space-x-4 flex-grow cursor-pointer"
        >
          <ParsedImage merchant={props.merchant} width={12} height={12} />
          <p
            key={props.merchant.id}
            id={`merchant-${props.merchant.id}`}
            className="text-base md:text-md lg:text-md font-semibold text-black sm:font-medium"
          >
            {convertToTitleCase(props.merchant.name)}
          </p>
        </div>
        <UpvoteButton
          currentUpvoteCount={props.merchant.upvoteCount}
          merchantId={String(props.merchant.id)}
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
