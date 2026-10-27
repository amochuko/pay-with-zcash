import { Suspense } from "react";
import SearchableHomePage from "../ui/SearchableHomePage";
import { getMerchants } from "../actions/merchant.action";
import { POST_STATUS_ENUM } from "../lib/typings";

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
          data: merchants.data.filter(
            (m) => m.postStatus === POST_STATUS_ENUM.PUBLISH,
          ),
        }}
      />
    </Suspense>
  );
}
