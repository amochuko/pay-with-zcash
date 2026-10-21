import { MerchantRepo } from "../repo/merchant.repo";
import { MerchantRecord } from "../types/map.types";
import { Geocoder } from "./geocoder";

/**
 * Geocode one merchant and persist the result.
 *
 * Call this from the signup / edit handler whenever country, state or city
 * changes, and from the backfill script for existing rows. Returns null when no
 * location could be resolved (nothing is saved, so a later retry is possible).
 * Network failures propagate as GeocodeError.
 */
export async function geocodeMerchant(
  merchant: Pick<MerchantRecord, "id" | "country" | "state" | "city">,
  geocoder: Geocoder,
  merchantRepo: Pick<MerchantRepo, "saveGeo" | "updateGeoStatus">,
): Promise<MerchantRecord | null> {
  //
  const hit = await geocoder.geocode({
    country: merchant.country,
    state: merchant.state,
    city: merchant.city,
  });

  if (!hit) return null;

  await merchantRepo.saveGeo(merchant.id, {
    geocodedAt: new Date().toISOString(),
    lat: hit.lat,
    lng: hit.lng,
    precision: hit.precision,
    coordinatesSource: "NOMINATIM",
    geoConfidence: "HIGH",
  });

  const updatedMerchant = await merchantRepo.updateGeoStatus(
    merchant.id,
    "resolved",
  );

  return updatedMerchant;
}
