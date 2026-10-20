import { db } from "../database/db";
import { saveLogoToBlob } from "../utils/fs";
import merchants from "./latest_merchants.json";
import { getWebsiteMetadata } from "./metadata";

export async function scrapeData() {
  const results = [];

  for (const merchant of merchants.slice(10)) {
    try {
      const result = await getWebsiteMetadata(merchant.website_url);

      if (result.status !== "success") {
        results.push({
          merchant_id: merchant.merchant_id,
          status: "scrape_failed",
          reason: result.reason,
        });
        continue;
      }

      const logoUrl = result.data.logo_url;

      if (!logoUrl) {
        results.push({
          merchant_id: merchant.merchant_id,
          status: "logo_not_found",
        });
        continue;
      }

      const savedBlob = await saveLogoToBlob(logoUrl, merchant.merchant_name);

      const updateResult = await db.query(
        `UPDATE merchants
         SET logo_url = $2,
             updated_at = NOW()
         WHERE merchant_id = $1
         RETURNING merchant_id, logo_url;`,
        [merchant.merchant_id, savedBlob.url],
      );

      if (updateResult.rowCount !== 1) {
        results.push({
          merchant_id: merchant.merchant_id,
          status: "database_update_failed",
          affectedRows: updateResult.rowCount,
        });
        continue;
      }

      results.push({
        merchant_id: merchant.merchant_id,
        status: "success",
        logo_url: updateResult.rows[0].logo_url,
      });

      console.log("Merchant logo updated:", merchant.merchant_id);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      console.error("Merchant processing failed:", {
        merchant_id: merchant.merchant_id,
        website_url: merchant.website_url,
        error: message,
      });

      results.push({
        merchant_id: merchant.merchant_id,
        status: "processing_failed",
        error: message,
      });
    }
  }

  console.table(
    results.map(({ merchant_id, status }) => ({
      merchant_id,
      status,
    })),
  );

  return results;
}
