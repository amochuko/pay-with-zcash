import { getAllCategory, getMerchants } from "@/app/lib/actions";
import AdminDashboard from "@/app/ui/Dashboard";

export default async function DashboardPage() {
    const merchants = await getMerchants();
    const categories = await getAllCategory();
  return <AdminDashboard merchants={merchants} categories={categories} />;
}
