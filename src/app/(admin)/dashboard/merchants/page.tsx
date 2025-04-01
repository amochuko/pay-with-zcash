import { getAllCategory } from "@/app/actions/category.action";
import { getMerchants } from "@/app/actions/merchant.action";
import MerchantTableFull from "@/app/ui/dashboard/MerchantsTableFull";

export default async function MerchantsPage() {
  const categories = await getAllCategory();
  const merchants = await getMerchants();
  return <MerchantTableFull merchants={merchants} categories={categories} />;
}
