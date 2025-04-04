import { Suspense } from "react";
import { getAllCategory } from "./actions/category.action";
import { getMerchantsPublished } from "./actions/merchant.action";
import SearchableHomePage from "./ui/SearchableHomePage";

export default async function HomePage() {
  const publishedMerchants = await getMerchantsPublished();
  const categories = await getAllCategory();

  return (
    <Suspense
      fallback={
        <div className="text-slate-400 text-sm text-center mt-20">
          Loading...
        </div>
      }
    >
      <SearchableHomePage
        categories={categories}
        merchants={publishedMerchants}
      />
    </Suspense>
  );
}
