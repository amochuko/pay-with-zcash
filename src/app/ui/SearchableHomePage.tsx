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
      <div className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Zcash Business Directory</h1>
          <p className="text-muted-foreground mb-8">
            Businesses around the world that accepts ZEC payments.
          </p>
        </div>

        <div>
          <Link
            href={"/submit-listing"}
            className="uppercase border text-center rounded-sm border-white/[.45] p-2.5 sm:mt-0 bg-primary hover:bg-primary/90 text-gray-900"
          >
            Add business
          </Link>
        </div>
      </div>

      <div className="flex flex-col mb-12">
        <SearchBar onSearchChange={handleSearchChange} />
      </div>

      {/* MerchantList gets the filtered list of merchants based on the search query */}
      <MerchantList merchants={data} searchQuery={searchQuery} />
    </div>
  );
}
