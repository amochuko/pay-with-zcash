
import { getAllCategory } from "@/app/actions/category.action";
import { addMerchant } from "@/app/actions/merchant.action";
import MerchantListingForm from "@/app/ui/merchant/MerchantListingForm";

export default async function SubmitListing() {
  const categories = await getAllCategory();

  return (
    <MerchantListingForm addMerchant={addMerchant} categories={categories} />
  );
}
