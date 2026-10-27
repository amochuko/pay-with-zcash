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

export interface MerchantGeoRow extends MerchantRow, MerchantGeo {}

export type Merchant = MerchantRow;

export type MerchantProps = {
  data: MerchantRecord[] | [];
  message: string | undefined;
};

export function merchantDomain(m: MerchantRow & MerchantGeo): MerchantRecord {
  return {
    category: m.category_name!,
    categoryId: m.category_id!,
    id: m.merchant_id,
    name: m.merchant_name,
    website: m.website_url,
    description: m.description,
    logoUrl: m.logo_url,
    country: m.country,
    state: m.state,
    upvoteCount: m.upvote_count,
    postStatus: m.post_status,
    subtitle: m.subtitle,
    tags: m.tags,
    createdAt: new Date(m.created_at!),
    precision: m.precision,
    geo: {
      lat: m.lat,
      lng: m.lng,
      region: m.region,
      note: m.note,
      verified: m.verified,
      coordinatesSource: m.coordinatesSource,
      countryCode: m.countryCode,
      geoConfidence: m.geoConfidence,
      precision: m.precision,
      geocodedAt: m.geocodedAt,
    },
  };
}

export function mapToMerchantGeoDomain(
  merchants: MerchantGeoRow[],
): MerchantRecord[] {
  return merchants.map(merchantDomain);

  // return merchants.map((m) => ({
  //   category: m.category_name!,
  //   categoryId: m.category_id!,
  //   id: m.merchant_id,
  //   name: m.merchant_name,
  //   website: m.website_url,
  //   description: m.description,
  //   logoUrl: m.logo_url,
  //   country: m.country,
  //   state: m.state,
  //   upvoteCount: m.upvote_count,
  //   postStatus: m.post_status,
  //   subtitle: m.subtitle,
  //   tags: m.tags,
  //   createdAt: new Date(m.created_at!),
  //   geo: {
  //     lat: m.lat,
  //     lng: m.lng,
  //     region: m.region,
  //     note: m.note,
  //     verified: m.verified,
  //     coordinatesSource: m.coordinatesSource,
  //     countryCode: m.countryCode,
  //     geoConfidence: m.geoConfidence,
  //     precision: m.precision,
  //     geocodedAt: m.geocodedAt,
  //   },
  // }));
}
