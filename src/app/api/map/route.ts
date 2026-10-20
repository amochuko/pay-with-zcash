import { buildMerchantGeoJSON } from "@/app/lib/geocode/build.merchant.geojson";
import logger from "@/app/lib/logger";
import merchantRepo from "@/app/lib/repo/merchant.repo";
import { NextResponse } from "next/server";

/**
 * GET /api/map/merchants → GeoJSON FeatureCollection for the map's merchant layer.
 *
 * Reads persisted coordinates only (no geocoding on the request path), so it is
 * fast and safe to cache. Revalidated hourly; the CDN may serve stale for a day.
 */

export const revalidate = 3600;

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const merchants = await merchantRepo.listOnMap();
    const geojson = buildMerchantGeoJSON(merchants);

    return NextResponse.json(geojson, {
      status: 200,
      headers: {
        "Content-Type": "application/geo+json; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    logger.error("[/api/map/merchants]", err);

    return NextResponse.json(
      { error: "Could not load merchants" },
      { status: 500 },
    );
  }
}
