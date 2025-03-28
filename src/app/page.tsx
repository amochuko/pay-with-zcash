import Link from "next/link";
import { getAllCategory, getMerchants } from "./lib/actions";
import MerchantList from "./ui/merchant/MerchantList";
import SearchBar from "./ui/SearchBar";

export default async function HomePage() {
  const merchants = await getMerchants();
  const categories = await getAllCategory();

  return (
    <div className="min-h-screen p-8 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] flex flex-col ">
      <header className="flex flex-col my-24 gap-8">
        <h1 className="text-2xl">Discover Where to Pay With Zcash</h1>
        <div className="flex justify-between">
          <SearchBar />
          <Link
            href={"/submit-listing"}
            className="uppercase border border-white/[.45] p-4"
          >
            Add your business
          </Link>
        </div>
      </header>
      <main className="flex flex-wrap gap-[32px] items-center justify-center sm:items-start">
        <MerchantList merchants={merchants} categories={categories} />
      </main>
    </div>
  );
}
