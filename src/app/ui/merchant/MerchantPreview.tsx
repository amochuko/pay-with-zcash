"use client";

import { convertToTitleCase } from "@/app/lib/utils/string";
import { Merchant } from "../../lib/models/Merchant";
import ParsedImage from "../ParseImage";
import Tags from "../Tags";

type MerchantPreviewProps = {
  isOpen: boolean;
  merchant: Merchant;
  onClose: () => void;
};
export default function MerchantPreview(props: MerchantPreviewProps) {
  if (!props.isOpen) return null;

  const description =
    props.merchant.description ||
    props.merchant.subtitle ||
    "This merchant has no description.";

  return (
    <div
      className="merchant-preview fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50"
      onClick={props.onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        <button
          onClick={props.onClose}
          className="absolute top-2 right-2 bg-[#F4B728] text-black text-2xl rounded-full w-12 h-12 p-2 cursor-pointer font-extrabold"
        >
          ×
        </button>
        <div className="">
          <h3 className="text-2xl font-semibold text-center my-4 text-slate-700">
            {convertToTitleCase(props.merchant.merchant_name)}
          </h3>
          <p className="text-gray-800 text-center mb-6">{description}</p>

          <ParsedImage
            merchant={props.merchant}
            className="w-full h-auto rounded mb-4"
            width={120}
            height={120}
          />
          {/* <!-- List of Tags --> */}
          <Tags tags={props.merchant.tags} />
          <a
            href={props.merchant.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-center block"
          >
            Visit Merchant Website
          </a>
        </div>
      </div>
    </div>
  );
}
