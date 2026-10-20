import { CategoryRow } from "./category.type";

export interface MerchantGeoDataRow extends Partial<CategoryRow> {
  id: string;
  merchant_id: string;
  lat: string;
  lng: string;
  country_code: string;
  country_name: string;
  state: string;
  city: string;
  created_at?: Date;
  updated_at?: Date;
}

// export function merchantDomain(merchant: MerchantGeoDataRow) {
//   return {
//     category: merchant.category_name!,
//     id: merchant.merchant_id,
//     name: merchant.merchant_name,
//     website: merchant.website_url,
//     city: merchant.city,
//     description: merchant.description,
//     logoUrl: merchant.logo_url,
//     country: merchant.country,
//     state: merchant.state,

//     geo: {
//       geocodedAt: Date.now().toString(),
//       lat: 2.0,
//       lng: 12.5,
//       precision: "country",
//     },
//   };
// }

// export function mapToMerchantDomain(
//   merchants: MerchantGeoDataRow[],
// ): MerchantRecord[] {
//   return merchants.map(merchantDomain);
// }
