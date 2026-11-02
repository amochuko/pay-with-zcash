import { getMerchants } from "@/app/actions/merchant.action";
import { POST_STATUS_ENUM } from "@/app/lib/typings";
import MerchantTableFull from "@/app/ui/dashboard/MerchantsTableFull";
import Link from "next/link";

export default async function MerchantsPage() {
  const merchants = await getMerchants();

  const merchantsToReview = merchants.data.filter(
    (m) => m.postStatus === POST_STATUS_ENUM.REVIEW,
  );
  const publishedMerchants = merchants.data.filter(
    (m) => m.postStatus === POST_STATUS_ENUM.PUBLISH,
  );

  return (
    <div className="flex flex-col justify-center py-12">
      <h1 className="text-3xl text-black dark:text-white my-8">Summary</h1>
      <div className="flex gap-12 mb-4">
        <p className="text-xl">{publishedMerchants.length} Published</p>
        <p
          className={`text-xl text-red-500 ${merchantsToReview.length > 0 ? "underline" : ""}`}
        >
          <Link href={"/dashboard/merchants/review"} className={``}>
            {merchantsToReview.length} requires review
          </Link>
        </p>
      </div>
      <MerchantTableFull merchants={publishedMerchants} />
    </div>
  );
}
