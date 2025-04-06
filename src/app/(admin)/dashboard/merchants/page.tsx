import { getMerchants } from "@/app/actions/merchant.action";
import MerchantTableFull from "@/app/ui/dashboard/MerchantsTableFull";

export default async function MerchantsPage() {
  const merchants = await getMerchants();
  return <MerchantTableFull merchants={merchants.data} />;
}
