import { getAllCategory } from "@/app/actions/category.action";
import { getMerchants } from "@/app/actions/merchant.action";
import AdminDashboard from "@/app/ui/Dashboard";

export default async function DashboardPage() {
  const merchants = await getMerchants();
  const categories = await getAllCategory();
  return <AdminDashboard merchants={merchants} categories={categories} />;
}
