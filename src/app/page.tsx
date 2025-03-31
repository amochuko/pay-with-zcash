import { Suspense } from "react";
import { getAllCategory, getMerchants } from "./lib/actions";
import SearchableHomePage from "./ui/SearchableHomePage";

export default async function HomePage() {
  const merchants = await getMerchants();
  const categories = await getAllCategory();

  return (
    <Suspense
      fallback={<div className="text-slate-400 text-sm text-center">Loading...</div>}
    >
      <SearchableHomePage categories={categories} merchants={merchants} />
    </Suspense>
  );
}
