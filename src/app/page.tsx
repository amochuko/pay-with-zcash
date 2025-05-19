import { Suspense } from "react";
import { getMerchants } from "./actions/merchant.action";
import SearchableHomePage from "./ui/SearchableHomePage";

export default async function HomePage() {
  const merchants = await getMerchants();

  return (
    <Suspense
      fallback={
        <div className="text-slate-400 text-sm text-center mt-20">
          Loading...
        </div>
      }
    >
      <SearchableHomePage
        merchants={{
          message: merchants.message,
          data: merchants.data.filter((m) => m.post_status === "publish"),
        }}
      />
    </Suspense>
  );
}
