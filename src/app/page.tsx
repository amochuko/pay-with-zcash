import { getAllCategory, getMerchants } from "./lib/actions";
import SearchableHomePage from "./ui/SearchableHomePage";

export default async function HomePage() {
  const merchants = await getMerchants();
  const categories = await getAllCategory();

  return (
    <div className="sm:p-20">
      <SearchableHomePage categories={categories} merchants={merchants} />
    </div>
  );
}
