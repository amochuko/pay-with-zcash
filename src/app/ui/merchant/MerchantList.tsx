"use client";

import { Category } from "@/app/lib/models/Category";
import { Merchant } from "@/app/lib/models/Merchant";
import MerchantItem from "./MerchantItem";

interface MerchantListProps {
  merchants: Merchant[];
  categories: Category[];
  searchQuery: string;
}

type GroupedMerchantCategory = Record<string, Merchant[]>;

export default function MerchantList(props: MerchantListProps) {
  // Filter merchants by catefory_id and filter by merchant name as well

  const groupMerchantsByCategory = (
    categories: Category[],
    merchants: Merchant[],
    searchQuery: string
  ) => {
    // Filter categories based on search query
    const filteredCategories = props.categories.filter((category) =>
      category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group merchants by category_id
    const grouped: GroupedMerchantCategory = merchants.reduce(
      (acc, merchant) => {
        const category = filteredCategories.find(
          (c) => c.category_id === merchant.category_id
        );

        if (
          category &&
          merchant.merchant_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        ) {
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
      grouped[categoryName].sort((a, b) =>
        a.merchant_name.localeCompare(b.merchant_name)
      );
    });

    return grouped;
  };

  const groupedMerchants = groupMerchantsByCategory(
    props.categories,
    props.merchants,
    props.searchQuery
  );

  return (
    <div className="merchant-list p-8">
      {Object.keys(groupedMerchants).length === 0 ? (
        <p>No merchants found matching your search.</p>
      ) : (
        Object.keys(groupedMerchants).map((categoryName) => (
          <div
            key={categoryName}
            className="category mb-8 p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-4">{categoryName}</h2>
            <div className="merchant-items flex flex-wrap gap-4 sm:flex-row flex-col">
              {groupedMerchants[categoryName].map((merchant: Merchant) => (
                <MerchantItem key={merchant.merchant_id} merchant={merchant} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// Object.keys(groupedMerchants).map((categoryName) => (
//   <div key={categoryName} className="category-section">
//     <h3 className="text-xl font-bold">{categoryName}</h3>
//     <ul>
//       {groupedMerchants[categoryName].map((merchant) => (
//         <li key={merchant.merchant_id}>{merchant.merchant_name}</li>
//       ))}
//     </ul>
//   </div>
// ))
