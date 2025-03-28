"use client";

import { Category } from "@/app/lib/models/Category";
import { Merchant } from "@/app/lib/models/Merchant";
import MerchantItem from "./MerchantItem";

interface MerchantListProps {
  merchants: Merchant[];
  categories: Category[];
}

type GroupedMerchantCategory = Record<string, Merchant[]>

export default function MerchantList(props: MerchantListProps) {
  const groupMerchantsByCategory = (
    categories: Category[],
    merchants: Merchant[]
  ) => {
    // Group merchants by category_id
    const grouped: GroupedMerchantCategory = merchants.reduce(
      (acc, merchant) => {
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
      },
      {}
    );


    // Sort merchants by list_order within each category || category
    Object.keys(grouped).forEach((categoryName) => {
      grouped[categoryName].sort((a, b) => a.merchant_name - b.merchant_name);
    });

    return grouped;
  };

  const groupedMerchants = groupMerchantsByCategory(
    props.categories,
    props.merchants
  );

  return (
    <div className="merchant-list p-8">
      {Object.keys(groupedMerchants).map((categoryName) => (
        <div
          key={categoryName}
          className="category mb-8 p-6 rounded-lg shadow-sm"
        >
          <h2 className="text-2xl font-bold mb-4">{categoryName}</h2>
          <div className="merchant-items flex flex-wrap gap-4 sm:flex-row flex-col">
            {groupedMerchants[categoryName].map((merchant:Merchant) => (
              <MerchantItem key={merchant.merchant_id} merchant={merchant} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
