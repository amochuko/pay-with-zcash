"use client";

import { useEffect, useState } from "react";
import { getMerchants, incrementLike } from "../../lib/actions";
import { Merchant } from "../../lib/models/Merchant";

export default function MerchantPreview() {
  const [merchantList, setMerchantList] = useState<Merchant[]>([]);

  useEffect(() => {});

  const upvote = async () => {
    await incrementLike();
  };

  const getAllMerchants = async () => {
    try {
      const m = await getMerchants();

      console.log({ merchant: m });
    } catch (err) {
      console.error("Error 101: ", err);
    }
  };

  return (
    <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg w-full max-w-xs md:max-w-sm lg:max-w-md">
      {/* <!-- Logo on the left --> */}
      <div className="flex items-center mb-4">
        {/* <Image
              src="path/to/logo.png"
              alt="Logo"
              className="w-16 h-16 mr-4"
              width={100}
              height={100}
            /> */}
        <h3 className="text-2xl font-semibold text-gray-800">Product Name</h3>
      </div>

      {/* <!-- Additional text - Red Rock Coffeehouse --> */}
      <p className="text-lg text-gray-600 mb-4">Red Rock Coffeehouse</p>

      {/* <!-- Upvote Button --> */}
      <button
        onClick={upvote}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none mb-4 cursor-pointer"
      >
        Upvote
      </button>

      <button
        onClick={getAllMerchants}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none mb-4 cursor-pointer"
      >
        Get Merchants
      </button>

      {/* <!-- List of Tags --> */}
      <div className="flex flex-wrap space-x-2 mb-4">
        <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-sm mb-2">
          Tag 1
        </span>
        <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-sm mb-2">
          Tag 2
        </span>
        <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-sm mb-2">
          Tag 3
        </span>
      </div>

      {/* <!-- External Website Link --> */}
      <a
        href="https://www.example.com"
        target="_blank"
        className="text-blue-500 hover:text-blue-700 text-sm"
      >
        Visit Website
      </a>
    </div>
  );
}
