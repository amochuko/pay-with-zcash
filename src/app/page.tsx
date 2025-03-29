import { getAllCategory, getMerchants } from "./lib/actions";
import SearchableHomePage from "./ui/SearchableHomePage";

export default async function HomePage() {
  const merchants = await getMerchants();
  const categories = await getAllCategory();

  return (
    <div className="min-h-screen p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] flex flex-col ">
      <SearchableHomePage categories={categories} merchants={merchants} />
    </div>
  );
}
