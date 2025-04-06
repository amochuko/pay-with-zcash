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
  const FAVORITE_CATEGORY = "Favorite";
  const UPVOTE_COUNT_FAVORITE = 15;

  // Group merchanst by category and add the 'Favorite' category dynamically
  const groupedMerchants = props.merchants.data.reduce((acc, merchant) => {
    const { category_name, upvote_count } = merchant;
    const categoryKey = category_name || "No category";

    // Check if merchant has upvotes >= UPVOTE_COUNT_FAVORITE
    if (upvote_count >= UPVOTE_COUNT_FAVORITE) {
      if (!acc[FAVORITE_CATEGORY]) {
        acc[FAVORITE_CATEGORY] = []; // Initialize the 'Favorite' category if it doesn't exist
      }

      acc[FAVORITE_CATEGORY].push(merchant); // Add merchant to FAVORITE_CATEGORY
      return acc;
    }

    // Group merchants by their original category
    if (!acc[categoryKey]) {
      acc[categoryKey] = [];
    }
    acc[categoryKey].push(merchant);
    return acc;
  }, {} as GroupedMerchantCategory);

  // Maintain the 'FAVORITE_CATEGORY' is at the top
  const favoriteAtTop = {
    Favorite: groupedMerchants[FAVORITE_CATEGORY] || [],
    ...groupedMerchants,
  } as GroupedMerchantCategory;

  // Filtered merchants based on the search input
  const filteredMerchants = Object.keys(favoriteAtTop).reduce(
    (acc, category) => {
      //
      const categoryMerchants = favoriteAtTop[category].filter(
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
