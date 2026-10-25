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

// --------------------------
// Pin icons
// --------------------------

/**
 * Precise (city-level) merchants: a solid teardrop pin.
 * @param color for the fill
 * @param selected boolean
 * @returns zoomed element
 */
export function pinHTML(color: string, selected: boolean): string {
  const s = selected ? "transform:scale(1.28);" : "";

  return (
    `<div class="zmm-pin" style="width:22px;height:28px;cursor:pointer;${s}">` +
    `<svg viewBox="0 0 22 28" xmlns="http://www.w3.org/2000/svg" style="display:block;width:22px;height:28px">` +
    `<path d="M11 1C5.48 1 1 5.48 1 11c0 7.5 10 17 10 17s10-9.5 10-17C21 5.48 16.52 1 11 1z"` +
    ` fill="${color}" stroke="var(--color-background-primary)" stroke-width="1.5"/>` +
    `<circle cx="11" cy="11" r="3.8" fill="var(--color-background-primary)" opacity="0.92"/>` +
    `</svg></div>`
  );
}

/** Approximate (state / country) merchants: a dashed halo, i.e 'somewhere in here' */
export function haloHTML(color: string, selected: boolean): string {
  const s = selected ? "transform:scale(1.25);" : "";
  
  return (
    `<div class="zmm-halo" style="width:28px;height:28px;border-radius:50%;box-sizing:border-box;cursor:pointer;` +
    `border:2px ${selected ? "solid" : "dashed"} ${color};background:${color}33;` +
    `display:flex;align-items:center;justify-content:center;${s}">` +
    `<span style="width:8px;height:8px;border-radius:50%;background:${color}"></span></div>`
  );
}
