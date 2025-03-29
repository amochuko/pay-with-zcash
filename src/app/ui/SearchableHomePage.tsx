"use client";

import Link from "next/link";
import { useState } from "react";
import { Category } from "../lib/models/Category";
import { Merchant } from "../lib/models/Merchant";
import SearchBar from "./SearchBar";
import MerchantList from "./merchant/MerchantList";

type SearchableHomePageProps = {
  merchants: Merchant[];
  categories: Category[];
};

const SearchableHomePage = (props: SearchableHomePageProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="searchable-home-page">
      <header className="flex flex-col mb-8 gap-8">
        <h1 className="text-2xl">Discover Where to Pay With Zcash</h1>
        <div className="flex justify-between">
          {/* SearchBar updates the search query */}
          <SearchBar onSearchChange={handleSearchChange} />
          <Link
            href={"/submit-listing"}
            className="uppercase border border-white/[.45] p-4"
          >
            Add your business
          </Link>
        </div>
      </header>
      <main className="flex flex-wrap gap-[32px] items-center justify-center sm:items-start">
        {/* MerchantList gets the filtered list of merchants based on the search query */}
        <MerchantList
          merchants={props.merchants}
          categories={props.categories}
          searchQuery={searchQuery}
        />
      </main>
    </div>
  );
};

export default SearchableHomePage;
