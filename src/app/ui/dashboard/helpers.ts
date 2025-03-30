import { Category } from "@/app/lib/models/Category";
import { Merchant } from "@/app/lib/models/Merchant";

export function parseCategoryInMerchants(
  merchants: Merchant[],
  categories: Category[]
) {
  return merchants.map((m) => {
    const category = categories.find((c) => c.category_id == m.category_id);

    return { ...m, categoryName: category?.category_name };
  });
}
