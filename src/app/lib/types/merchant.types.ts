import { POST_STATUS_ENUM } from "../typings";
import { CategoryRow } from "./category.type";
import { GeoStatus, MerchantGeo, MerchantRecord } from "./map.types";

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
  geo_status: GeoStatus;
}

export type Merchant = MerchantRow;

export type MerchantProps = {
  data: MerchantRow[] | [];
  message: string | undefined;
};

export function merchantDomain(
  merchant: MerchantRow,
  geo: MerchantGeo,
): MerchantRecord {
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
      lat: geo.lat,
      lng: geo.lng,
      region: geo.region,
      note: geo.note,
      verified: geo.verified,
      coordinatesSource: geo.coordinatesSource,
      countryCode: geo.countryCode,
      geoConfidence: geo.geoConfidence,
      precision: geo.precision,
      geocodedAt: geo.geocodedAt,
    },
  };
}

export function mapToMerchantGeoDomain(
  merchants: MerchantRow[],
  geo: MerchantGeo,
): MerchantRecord[] {
  return merchants.map((m) => ({
    category: m.category_name!,
    id: m.merchant_id,
    name: m.merchant_name,
    website: m.website_url,
    description: m.description,
    logoUrl: m.logo_url,
    country: m.country,
    state: m.state,
    geo: {
      lat: geo.lat,
      lng: geo.lng,
      region: geo.region,
      note: geo.note,
      verified: geo.verified,
      coordinatesSource: geo.coordinatesSource,
      countryCode: geo.countryCode,
      geoConfidence: geo.geoConfidence,
      precision: geo.precision,
      geocodedAt: geo.geocodedAt,
    },
  }));
}
