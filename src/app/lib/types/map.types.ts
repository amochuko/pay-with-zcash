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

  socials?: Record<string, string>;
  contacts?: Record<string, string>;
}

/** Coarse grouping used by the map's category filter */
export type CategoryGroup =
  | "shopping"
  | "food"
  | "digital"
  | "media"
  | "travel"
  | "giving"
  | "other";

export interface MerchantFeatureProperties {
  id: string;
  name: string;
  category: string;
  categoryId: string;
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

export const GROUPS: Record<CategoryGroup, { label: string; color: string }> = {
  shopping: { label: "Shopping", color: "#378ADD" },
  food: { label: "Food", color: "#D85A30" },
  digital: { label: "Digital services", color: "#1D9E75" },
  media: { label: "Media", color: "#D4537E" },
  travel: { label: "Travel", color: "#7F77DD" },
  giving: { label: "Giving", color: "#BA7517" },
  other: { label: "Other", color: "#888780" },
};

export const GROUP_ORDER = Object.keys(GROUPS) as CategoryGroup[];
