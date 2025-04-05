"use client";

import { useState } from "react";
import { Category } from "../lib/models/Category";
import { Merchant, MerchantWithImgBinData } from "../lib/models/Merchant";
import SearchBar from "./SearchBar";
import MerchantList from "./merchant/MerchantList";

type SearchableHomePageProps = {
  merchants: Merchant[];
  merchantsWithDBImg: MerchantWithImgBinData[];
  categories: Category[];
};

const SearchableHomePage = (props: SearchableHomePageProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="searchable-home-page max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="flex flex-col mb-8 gap-12 text-white py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
          Discover Where to Pay With Zcash
        </h1>

        <SearchBar onSearchChange={handleSearchChange} />
      </header>

      {/* MerchantList gets the filtered list of merchants based on the search query */}
      <MerchantList
        merchants={props.merchants}
        merchantsWithDBImg={props.merchantsWithDBImg}
        categories={props.categories}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default SearchableHomePage;
