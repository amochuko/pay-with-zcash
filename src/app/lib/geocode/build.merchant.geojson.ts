import {
  CategoryGroup,
  GeoPrecision,
  MerchantFeature,
  MerchantFeatureCollection,
  MerchantRecord,
} from "../types/map.types";

/**
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

/**
 * Pin-colour groups for the real paywithz.cash categories. Anything not listed,
 * including categories added later, falls back to "other", so a new category
 * can never break the map. Keys are lowercase with whitespace collapsed.
 */
const GROUP_BY_CATEGORY: Record<string, CategoryGroup> = {
  clothing: "shopping",
  "beauty & personal care": "shopping",
  "gold & jewelry": "shopping",
  "games & electronics": "shopping",
  "gift cards": "shopping",
  stickers: "shopping",
  books: "shopping",
  art: "shopping",
  food: "food",
  "web design": "digital",
  "web hosting & domains": "digital",
  "virtual private networks (vpn)": "digital",
  "opsec / security": "digital",
  advertising: "digital",
  "professional services": "digital",
  legal: "digital",
  "zcash apps": "digital",
  "blogs & podcasts": "media",
  music: "media",
  "zcash en español": "media",
  travel: "travel",
  "social good": "giving",
  "religious donations": "giving",
};

const normalizeCategory = (raw: string): string =>
  raw.trim().replace(/\s+/g, " ").toLowerCase();

export function groupCategory(categoryName: string): CategoryGroup {
  return GROUP_BY_CATEGORY[normalizeCategory(categoryName)] ?? "other";
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

const wrapLng = (lon: number): number =>
  ((((lon + 180) % 360) + 360) % 360) - 180;
const clampLat = (lat: number): number => Math.max(-85, Math.min(85, lat));
const round = (n: number): number => Math.round(n * 1e5) / 1e5;

const truncate = (
  text: string | null | undefined,
  max: number,
): string | null => {
  const t = text?.trim();
  if (!t) return null;

  const sliced = `${t.slice(0, max - 3).trimEnd()}...`;

  return t.length > max ? sliced : t;
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
        categoryId: m.categoryId,
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
