"use client";

import { useMemo, useState } from "react";
import { MerchantProps } from "../lib/types/merchant.types";
import SearchBar from "./SearchBar";
import MerchantList2 from "./merchant/MerchantList2";

type SearchableHomePageProps = {
  merchants: MerchantProps;
};

const SearchableHomePageV2 = (props: SearchableHomePageProps) => {
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
    <div className="container py-12 mx-auto">
      <h1 className="text-3xl font-bold mb-2">Zcash Business Directory</h1>
      <p className="text-muted-foreground mb-8">
        Businesses around the world that accepts ZEC payments.
      </p>
      <div className="flex flex-col mb-8 gap-12 py-8">
        <SearchBar onSearchChange={handleSearchChange} />
      </div>

      {/* MerchantList gets the filtered list of merchants based on the search query */}
      <MerchantList2 merchants={data} searchQuery={searchQuery} />
    </div>
  );
};

export default SearchableHomePageV2;
