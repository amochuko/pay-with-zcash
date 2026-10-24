/**
 * Shared types for the merchant map layer.
 * Mirrors the paywithz.cash listing form: name, category, website (+ scraped
 * logo/description) and, since the form update, country / state / city.
 */

import { POST_STATUS_ENUM } from "../typings";

/** How precisely a merchant could be placed. Drives pin style on the map. */

export type GeoPrecision = "city" | "state" | "country";

export type GeoStatus = "resolved" | "partial" | "unknown";

/** Persisted geocoding result */
export interface MerchantGeo {
  lat: number;
  lng: number;
  region?: string;
  countryCode?: string;
  geoConfidence?: string;
  coordinatesSource?: string;
  note?: string;
  verified?: boolean;
  precision: GeoPrecision;
  /** ISO timestamp of when the lookup ran */
  geocodedAt: string;
}

/** A merchant as read from database */
export interface MerchantRecord {
  id: string;
  name: string;
  category: string;
  website: string;
  logoUrl?: string | null;
  description?: string | null;
  /** Free text from the form: "Nigeria" or "NG" both work. */
  country: string;
  state?: string | null;
  city?: string | null;
  /** null until the merchant has been geocoded. */
  geo: MerchantGeo | null;
  upvoteCount: number;
  postStatus: POST_STATUS_ENUM;
}

/** Coarse grouping used by the map's category filter */
export type CategoryGroup =
  | "food_drink"
  | "retail"
  | "online_services"
  | "travel"
  | "entertainment"
  | "other";

export interface MerchantFeatureProperties {
  id: string;
  name: string;
  category: string;
  categoryGroup: CategoryGroup;
  website: string;
  logoUrl: string | null;
  description: string | null;
  country: string;
  state: string | null;
  city: string | null;
  precision: GeoPrecision;
}

export interface MerchantFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [lng: number, lat: number] };
  properties: MerchantFeatureProperties;
}

export interface MerchantFeatureCollection {
  type: "FeatureCollection";
  metadata: {
    schema_version: "1.0";
    generated: string;
    total_features: number;
    by_precision: Record<GeoPrecision, number>;
    note: string;
  };
  features: MerchantFeature[];
}
