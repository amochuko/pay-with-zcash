import { POST_STATUS_ENUM } from "../typings";
import { CategoryRow } from "./category.type";
import { MerchantRecord } from "./map.types";

export interface MerchantRow extends Partial<CategoryRow> {
  readonly merchant_id: string;
  merchant_name: string;
  website_url: string;
  email_address?: string;
  tags: string[];
  subtitle: string;
  description: string;
  country: string;
  state: string;
  city: string;
  logo_url: string;
  upvote_count: number;
  post_status: POST_STATUS_ENUM;
  created_at?: Date;
  updated_at?: Date;
}

export type Merchant = MerchantRow;;

export type MerchantProps = {
  data: MerchantRow[] | [];
  message: string | undefined;
};

export function merchantDomain(merchant: any): MerchantRecord {
  return {
    category: merchant.category_name!,
    id: merchant.merchant_id,
    name: merchant.merchant_name,
    website: merchant.website_url,
    description: merchant.description,
    logoUrl: merchant.logo_url,
    country: merchant.country,
    state: merchant.state,
    geo: {
      region: merchant.region,
      note: merchant.note,
      verified: merchant.verified,
      city: merchant.city,
      coordinatesSource: merchant.coordinatesSource,
      countryCode: merchant.country_code,
      countryName: merchant.country,
      geoStatus: merchant.geoStatus,
      geoConfidence: merchant.geoConfidence,
      geocodedAt: Date.now().toString(),
      lat: merchant.lat,
      lng: merchant.lng,
      precision: merchant.precision,
    },
  };
}

export function mapToMerchantDomain(
  merchants: MerchantRow[],
): MerchantRecord[] {
  return merchants.map(merchantDomain);
}
