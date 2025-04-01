import { Suspense } from "react";
import { getMerchants } from "./actions/merchant.action";
import SearchableHomePage from "./ui/SearchableHomePage";
import { getAllCategory } from "./actions/category.action";

export default async function HomePage() {
  const merchants = await getMerchants();
  const categories = await getAllCategory();

  return (
    <Suspense
      fallback={
        <div className="text-slate-400 text-sm text-center">Loading...</div>
      }
    >
      <SearchableHomePage categories={categories} merchants={merchants} />
    </Suspense>
  );
}
