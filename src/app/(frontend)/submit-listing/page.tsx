import { getAllCategory, addMerchant } from "@/app/lib/actions";
import MerchantListingForm from "@/app/ui/form/MerchantListingForm";

export default async function SubmitListing() {
  const categories = await getAllCategory();

  return (
    <MerchantListingForm addMerchant={addMerchant} categories={categories} />
  );
}
