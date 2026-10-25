import {
  CategoryGroup,
  GROUPS,
  MerchantFeatureCollection,
} from "@/app/lib/types/map.types";
import { MerchantGeoRow } from "@/app/lib/types/merchant.types";

export const esc = (s: string): string =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

/** Only http(s) URLs are ever rendered as links or images */
function safeHttpUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;

  try {
    const u = new URL(raw.trim());

    return u.protocol === "https:" || u.protocol === "http:" ? u.href : null;
  } catch {
    return null;
  }
}

const hostOf = (href: string): string => {
  try {
    return new URL(href).host.replace(/^www\./, "");
  } catch {
    return href;
  }
};

const placeLabel = (
  m: Pick<MerchantGeoRow, "city" | "state" | "country">,
): string => [m.city, m.state, m.country].filter(Boolean).join(", ");

const groupColor = (g: CategoryGroup): string =>
  (GROUPS[g] ?? GROUPS.other).color;

export function parserMerchants(json: MerchantFeatureCollection) {
  const feats = json.features;

  if (!Array.isArray(feats)) throw new Error("Unexpected response");

  const out = [];

  for (const f of feats) {
    const coords = f.geometry.coordinates;
    const p = f.properties;

    if (!p || !Array.isArray(coords)) continue;

    const [lng, lat] = coords;
    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng) ||
      typeof p.id !== "string"
    )
      continue;

    out.push({
      id: p.id,
      name: p.name,
      category: p.category,
      categoryGroup: p.categoryGroup in GROUPS ? p.categoryGroup : "other",
      website: p.website,
      logoUrl: p.logoUrl,
      description: typeof p.description === "string" ? p.description : null,
      country: p.country ?? null,
      state: p.state ?? null,
      city: p.city ?? null,
      precision:
        p.precision === "city" || p.precision === "state"
          ? p.precision
          : "country",
      lat,
      lng,
    });
  }

  return out.sort((a, b) => a.name.localeCompare(b.name));
}
