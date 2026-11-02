import { getAllCategory } from "@/app/actions/category.action";
import { getMerchants } from "@/app/actions/merchant.action";
import AdminDashboard from "./AdminDashboard";

export default async function AdminDashboardPage() {
  const merchants = await getMerchants();
  const categories = await getAllCategory();

  return (
    <>
      <AdminDashboard categories={categories} merchants={merchants} />
    </>
  );
}
