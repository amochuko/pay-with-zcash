import {
  CategoryGroup,
  GeoPrecision,
  MerchantFeature,
  MerchantFeatureCollection,
  MerchantRecord,
} from "../types/map.types";

/**
 import { Merchant } from "../types/Merchant";
 * Turns geocoded merchants into the GeoJSON the map layer consumes.
 *
 * Merchants only give us city / state / country, so many will share the same
 * coordinates. A small *deterministic* offset (derived from the merchant id)
 * spreads them out so pins don't sit exactly on top of each other. It is stable
 * across rebuilds, and the radius is far smaller than the stated precision, so
 * it never misleads about which city/state/country a merchant is in.
 */

const JITTER_DEGREES: Record<GeoPrecision, number> = {
  city: 0.01, // -1 km
  state: 0.1, // -11 km
  country: 0.3, // -33 km
};

const CATEGORY_RULE: Array<[CategoryGroup, RegExp]> = [
  ["food_drink", /food|drink|restaurant|cafe|coffee|bar\b|bakery|grocer/i],
  ["travel", /travel|hotel|accommodation|flight|hostel|tour|transport/i],
  ["entertainment", /entertain|gaming|game|media|music|event|stream/i],
  [
    "online_services",
    /online|digital|service|software|saas|hosting|vpn|crypto|finance/i,
  ],
  ["retail", /retail|shop|store|fashion|apparel|electronics|beauty|home|gift/i],
];

export function groupCategory(raw: string): CategoryGroup {
  for (const [group, pattern] of CATEGORY_RULE) {
    if (pattern.test(raw)) return group;
  }

  return "other";
}

/** FNV-1a 32-bit - tiny, stable, no dependencies */
function hash32(input: string): number {
  let h = 0x811c9dc5;

  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);

    h = Math.imul(h, 0x01000193);
  }

  return h >>> 0;
}

function jitter(
  id: string,
  precision: GeoPrecision,
): [dLng: number, dLat: number] {
  const h = hash32(id);
  const angle = ((h & 0xffff) / 0xffff) * Math.PI * 2;

  // sqrt for a uniform spread across the disc rather than clustering at the centre
  const radius = Math.sqrt((h >>> 16) / 0xffff) * JITTER_DEGREES[precision];

  return [Math.cos(angle) * radius, Math.sin(angle) * radius];
}

const wrapLng = (lng: number): number =>
  ((((lng + 180) % 360) + 360) % 360) - 180;
const clampLat = (lat: number): number => Math.max(-85, Math.min(85, lat));
const round = (n: number): number => Math.round(n * 1e5) / 1e5;

const truncate = (
  text: string | null | undefined,
  max: number,
): string | null => {
  const t = text?.trim();
  if (!t) return null;

  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}...` : t;
};

export function buildMerchantGeoJSON(
  merchants: MerchantRecord[],
  now: Date = new Date(),
): MerchantFeatureCollection {
  const byPrecision: Record<GeoPrecision, number> = {
    city: 0,
    state: 0,
    country: 0,
  };

  const features: MerchantFeature[] = [];

  for (const m of merchants) {
    if (!m.geo) continue; // not geocoded yet - simple absent from the map

    const [dLang, dLat] = jitter(m.id, m.geo.precision);
    byPrecision[m.geo.precision]++;

    features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          round(wrapLng(m.geo.lng + dLang)),
          round(clampLat(m.geo.lat + dLat)),
        ],
      },
      properties: {
        id: m.id,
        name: m.name,
        category: m.category,
        categoryGroup: groupCategory(m.category),
        website: m.website,
        logoUrl: m.logoUrl ?? null,
        description: truncate(m.description, 200),
        country: m.country,
        state: m.state?.trim() || null,
        city: m.city?.trim() || null,
        precision: m.geo.precision,
      },
    });
  }

  return {
    type: "FeatureCollection",
    metadata: {
      schema_version: "1.0",
      generated: now.toISOString(),
      total_features: features.length,
      by_precision: byPrecision,
      note: `Auto-generated from the paywithz.cash directory. Pin positions are approximate (city/state/country centroid plus a small deterministic offset).`,
    },
    features,
  };
}
