"use client";

import { Merchant, MerchantProps } from "@/app/lib/models/Merchant";
import MerchantItem from "./MerchantItem";

interface MerchantListProps {
  searchQuery: string;
  merchants: MerchantProps;
}

type GroupedMerchantCategory = {
  [categoryName: string]: Merchant[];
};

export default function MerchantList(props: MerchantListProps) {
  // Group merchanst by category
  const groupedMerchants = props.merchants.data.reduce((acc, merchant) => {
    const { category_name } = merchant;
    const categoryKey = category_name || "No category";
    if (!acc[categoryKey]) {
      acc[categoryKey] = [];
    }
    acc[categoryKey].push(merchant);
    return acc;
  }, {} as GroupedMerchantCategory);

  // Filtered merchants based on the search input
  const filteredMerchants = Object.keys(groupedMerchants).reduce(
    (acc, category) => {
      //
      const categoryMerchants = groupedMerchants[category].filter(
        (merchant) =>
          merchant.merchant_name
            .toLowerCase()
            .includes(props.searchQuery.toLowerCase()) ||
          category.toLowerCase().includes(props.searchQuery.toLowerCase())
      );

      if (categoryMerchants.length > 0) {
        acc[category] = categoryMerchants;
      }

      return acc;
    },
    {} as GroupedMerchantCategory
  );

  return (
    <div className="merchant-list">
      {Object.keys(filteredMerchants).map((category) => (
        <div key={category} className="category mb-20 rounded-lg shadow-sm">
          <h2
            id={`category-${category}`}
            className="text-3xl not-last:font-medium mb-8"
          >
            {category}
          </h2>
          <div className="merchant-items grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredMerchants[category].map((merchant) => (
              <MerchantItem key={merchant.merchant_id} merchant={merchant} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
