"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MerchantProps } from "../lib/types/merchant.types";
import SearchBar from "./SearchBar";
import MerchantList from "./merchant/MerchantList";

type SearchableHomePageProps = {
  merchants: MerchantProps;
};

export default function SearchableHomePage(props: SearchableHomePageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(
    () =>
      props.merchants.data.filter((m) =>
        `${m.name} ${m.state} ${m.country} ${m.category}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const data = {
    data: filtered,
    message: props.merchants.message,
  };

  return (
    <div className="container mt-10 mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Zcash Business Directory
          </h1>

          <p className="text-muted-foreground mb-4 sm:mb-8">
            Businesses around the world that accepts ZEC payments.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            href={"/submit-listing"}
            className="inline-flex items-center justify-center uppercase whitespace-nowrap border rounded-sm border-white/[.45] px-2.5 py-2 sm:py-2.5 text-xs sm:text-sm bg-primary hover:bg-primary/90 text-gray-900"
          >
            Add business
          </Link>
        </div>
      </div>

      <div className="flex flex-col my-12">
        <SearchBar onSearchChange={handleSearchChange} />
      </div>

      {/* MerchantList gets the filtered list of merchants based on the search query */}
      <MerchantList merchants={data} searchQuery={searchQuery} />
    </div>
  );
}
