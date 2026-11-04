 
import { getAllCategory } from "@/app/actions/category.action";
import CategoryTableFull from "@/app/ui/dashboard/CategoryTableFull";

export default async function CategoriesPage() {
  const categories = await getAllCategory();
  return <CategoryTableFull categories={categories} />;
}
