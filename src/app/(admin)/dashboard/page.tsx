import { getAllCategory } from "@/app/actions/category.action";
import { getMerchants, getMerchantsBy } from "@/app/actions/merchant.action";
import { POST_STATUS_ENUM } from "@/app/lib/typings";
import AdminDashboard from "@/app/ui/AdminDashboard";

export default async function DashboardPage() {
  const merchants = await getMerchants();
  const merchantsNotApproved = await getMerchantsBy(POST_STATUS_ENUM.DRAFT);
  const categories = await getAllCategory();

  return (
    <AdminDashboard
      merchants={merchants}
      categories={categories}
      merchantsNotApproved={merchantsNotApproved.length}
    />
  );
}
