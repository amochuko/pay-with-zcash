import { addMerchant, getAllCategory } from "@/app/lib/actions";
import MerchantListingForm from "@/app/ui/merchant/MerchantListingForm";

export default async function SubmitListing() {
  const categories = await getAllCategory();

  return (
    <MerchantListingForm addMerchant={addMerchant} categories={categories} />
  );
}
