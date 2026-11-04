import { getMerchants } from "@/app/actions/merchant.action";
import { POST_STATUS_ENUM } from "@/app/lib/typings";
import MerchantTableFull from "@/app/ui/dashboard/MerchantsTableFull";

export default async function ReviewMerchantsPage() {
  const merchants = await getMerchants();

  const needsReview = merchants.data.filter(
    (m) => m.postStatus === POST_STATUS_ENUM.REVIEW,
  );

  return (
    <div>
      {needsReview.length > 0 ? (
        <MerchantTableFull merchants={needsReview} />
      ) : (
        <div className="my-24">
          <p className="text-gray-600">No pending reviews.</p>
        </div>
      )}
    </div>
  );
}
