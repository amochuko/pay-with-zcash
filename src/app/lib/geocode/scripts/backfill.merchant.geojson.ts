/**
 * One-off (and re-runnable) backfill: geocode every merchant that has a
 * country but no coordinates yet.
 *
 *   npx tsx scripts/backfill-merchant-geo.ts
 *   npx tsx scripts/backfill-merchant-geo.ts --dry-run --limit 20
 *
 * Safe to interrupt and re-run: each result is saved as it arrives, and
 * merchants that already have coordinates are skipped by listMissingGeo().
 * Runs at ~1 request/second per Nominatim policy, so 500 merchants ≈ 10–15 min.
 */

import { createGeocoderFromEnv } from "..";
import logger from "../../logger";
import merchantRepo from "../../repo/merchant.repo";
import { GeoPrecision } from "../../types/map.types";
import { GeocodeError } from "../geocode.error";
import { geocodeMerchant } from "../geocode.merchant";

function parseArgs(argv: string[]): { dryRun: boolean; limit: number | null } {
  const limitIdx = argv.indexOf("--limit");
  const limit = limitIdx >= 0 ? Number(argv[limitIdx + 1]) : NaN;

  return {
    dryRun: argv.includes("--dry-run"),
    limit: Number.isFinite(limit) && limit > 0 ? limit : null,
  };
}

async function main(): Promise<void> {
  const { dryRun, limit } = parseArgs(process.argv.slice(2));
  const geocoder = createGeocoderFromEnv();

  let pending = await merchantRepo.listMissingGeo();

  if (limit) {
    pending = pending.slice(0, limit);
  }

  logger.debug(
    `${pending.length} merchant(s) to geocode${dryRun ? " (dry run — nothing saved)" : ""}`,
  );

  const byPrecision: Record<GeoPrecision, number> = {
    city: 0,
    state: 0,
    country: 0,
  };
  const notFound: string[] = [];
  const failed: string[] = [];

  for (const [i, m] of pending.entries()) {
    const label = `[${i + 1}/${pending.length}] ${m.name} — ${[m.city, m.state, m.country].filter(Boolean).join(", ")}`;

    try {
      if (dryRun) {
        const hit = await geocoder.geocode(m);

        if (hit) {
          byPrecision[hit.precision]++;
          logger.debug(
            `${label} → ${hit.precision} (${hit.lat.toFixed(3)}, ${hit.lng.toFixed(3)})`,
          );
        } else {
          notFound.push(m.id);
          logger.debug(`${label} → not found`);
        }
      
        continue;
      }

      const geo = await geocodeMerchant(m, geocoder, merchantRepo);

      if (geo) {
        byPrecision[geo.precision]++;
        logger.debug(`${label} → ${geo.precision}`);
      } else {
        notFound.push(m.id);
      
        logger.debug(`${label} → not found`);
      }


    } catch (err) {
      failed.push(m.id);
      const reason = err instanceof GeocodeError ? err.message : String(err);
      
      logger.warn(`${label} → FAILED (${reason}) — will retry on next run`);
    }
  }

  logger.debug("\nDone.");
  logger.debug(`  city-level   : ${byPrecision.city}`);
  logger.debug(`  state-level  : ${byPrecision.state}`);
  logger.debug(`  country-level: ${byPrecision.country}`);
  logger.debug(
    `  not found    : ${notFound.length}${notFound.length ? `  (${notFound.join(", ")})` : ""}`,
  );
  logger.debug(`  errors       : ${failed.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
