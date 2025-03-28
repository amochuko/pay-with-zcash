"use client";

import { Category } from "@/app/lib/models/Category";
import { Merchant } from "@/app/lib/models/Merchant";
import { useState } from "react";
import MerchantItem from "./MerchantItem";

interface MerchantListProps {
  merchants: Merchant[];
  categories: Category[];
  // groupMerchantsByCategory: (m: Merchant[], cat: Category[]) => {};
}
export default function MerchantList(props: MerchantListProps) {
  const [] = useState({});

  const groupMerchantsByCategory = (
    categories: Category[],
    merchants: Merchant[]
  ) => {
    // Group merchants by category_id
    const grouped = merchants.reduce((acc, merchant) => {
      const category = categories.find(
        (c) => c.category_id === merchant.category_id
      );

      if (category) {
        if (!acc[category.category_name]) {
          acc[category.category_name] = [];
        }

        acc[category.category_name].push(merchant);
      }

      return acc;
    }, {});

    // Sort merchants by list_order within each category
    Object.keys(grouped).forEach((categoryName) => {
      grouped[categoryName].sort((a, b) => a.list_order - b.list_order);
    });

    return grouped;
  };

  const groupedMerchants = groupMerchantsByCategory(
    props.categories,
    props.merchants
  );

  return (
    <div className="merchant-list">
      {Object.keys(groupedMerchants).map((categoryName) => (
        <div key={categoryName} className="">
          <h2 className="text-2xl my-4">{categoryName}</h2>
          <div className="merchant-items">
            {groupedMerchants[categoryName].map((merchant) => (
              <MerchantItem key={merchant.merchant_id} merchant={merchant} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
