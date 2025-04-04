"use client";

import { Category } from "@/app/lib/models/Category";
import { Merchant, MerchantWithImgBinData } from "@/app/lib/models/Merchant";
import MerchantItem from "./MerchantItem";

interface MerchantListProps {
  merchants: Merchant[];
  merchantsWithDBImg: MerchantWithImgBinData[];
  categories: Category[];
  searchQuery: string;
}

type GroupedMerchantCategory = {
  [categoryName: string]: MerchantWithImgBinData[];
  // [categoryName:string]: Merchant[]
};

export default function MerchantList(props: MerchantListProps) {
  // Filter merchants by catefory_id and filter by merchant name as well

  // const groupMerchantsByCategory = (
  //   categories: Category[],
  //   merchants: Merchant[],
  //   searchQuery: string
  // ) => {
  //   // Filter categories based on search query
  //   const filteredCategories = props.categories.filter((category) =>
  //     category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );

  //   // Group merchants by category_id
  //   const grouped: GroupedMerchantCategory = merchants.reduce(
  //     (acc, merchant) => {
  //       const category = filteredCategories.find(
  //         (c) => c.category_id === merchant.category_id
  //       );

  //       if (
  //         category &&
  //         merchant.merchant_name
  //           .toLowerCase()
  //           .includes(searchQuery.toLowerCase())
  //       ) {
  //         if (!acc[category.category_name]) {
  //           acc[category.category_name] = [];
  //         }

  //         acc[category.category_name].push(merchant);
  //       }

  //       return acc;
  //     },
  //     {} as GroupedMerchantCategory
  //   );

  //   // Sort merchants by list_order within each category || category
  //   Object.keys(grouped).forEach((categoryName) => {
  //     grouped[categoryName].sort((a, b) =>
  //       a.merchant_name.localeCompare(b.merchant_name)
  //     );
  //   });

  //   return grouped;
  // };

  const groupMerchantsWithBinImgByCategory = (
    merchants: MerchantWithImgBinData[],
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
      {} as GroupedMerchantCategory
    );

    // Sort merchants by list_order within each category || category
    Object.keys(grouped).forEach((categoryName) => {
      grouped[categoryName].sort((a, b) =>
        a.merchant_name.localeCompare(b.merchant_name)
      );
    });

    return grouped;
  };

  // const groupedMerchants = groupMerchantsByCategory(
  //   props.categories,
  //   props.merchants,
  //   props.searchQuery
  // );

  const groupedMerchantsWithBinImg = groupMerchantsWithBinImgByCategory(
    props.merchantsWithDBImg,
    props.searchQuery
  );
 

  return (
    <div className="merchant-list">
      {Object.keys(groupedMerchantsWithBinImg).length === 0 ? (
        <p className="text-lg text-center">
          No merchants found matching your search.
        </p>
      ) : (
        Object.keys(groupedMerchantsWithBinImg).map((categoryName) => (
          <div
            key={categoryName}
            className="category mb-20 rounded-lg shadow-sm"
          >
            <h2 className="text-3xl not-last:font-medium mb-8">{categoryName}</h2>
            <div className="merchant-items grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {groupedMerchantsWithBinImg[categoryName].map(
                (merchant: MerchantWithImgBinData) => (
                  <MerchantItem
                    key={merchant.merchant_id}
                    merchant={merchant}
                  />
                )
              )}
              {/* {groupedMerchants[categoryName].map((merchant: Merchant) => (
                <MerchantItem key={merchant.merchant_id} merchant={merchant} />
              ))} */}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
