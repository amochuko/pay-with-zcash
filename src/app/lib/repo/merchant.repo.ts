import { db } from "../database/db";
import logger from "../logger";
import { MerchantGeo, MerchantRecord } from "../types/map.types";
import { MerchantRow } from "../types/merchant.types";
import { POST_STATUS_ENUM } from "../typings";

export class MerchantRepo {
  //

  async create(data: Omit<MerchantRow, "merchant_id">) {
    try {
      const result = await db.query<MerchantRow>(
        `INSERT INTO pwz.merchants (merchant_name, category_id, website_url, email_address, subtitle, logo_url, post_status, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;`,
        [
          data.merchant_name,
          String(data.category_id),
          data.website_url,
          "NA",
          data.subtitle,
          data.logo_url,
          data.post_status,
          data.tags,
        ],
      );

      if (result.rowCount === 0) {
        throw new Error("Not successful creating merchant");
      }

      return result.rows[0];
    } catch (err) {
      logger.error("[MerchantRepo.create]: creating merchant:", err);

      throw new Error("Failed to create merchant");
    }
  }

  async listOnMap(): Promise<MerchantRecord[]> {
    const result = await db.query(
      `SELECT * FROM pwz.merchants m
        LEFT JOIN pwz.merchants_geo_data mgeo ON m.merchant_id = mgeo.merchant_id`,
    );

    return result.rows;
  }

  async listMissingGeo(): Promise<MerchantRecord[]> {
    const result = await db.query(
      `SELECT * FROM pwz.merchants m
        LEFT JOIN pwz.merchants_geo_data mgeo ON m.merchant_id = mgeo.merchant_id`,
    );

    return result.rows;
  }

  async saveGeo(merchantId: string, geo?: MerchantGeo) {
    try {
      const result = await db.query(
        `INSERT INTO pwz.merchants_geo_data (merchant_id, lat, lng, country_code, country_name, city, region, geo_status, geo_confidence, coordinates_source, note, verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9,$10,$11,$12)
      RETURNING *;`,
        [
          merchantId,
          geo?.lat,
          geo?.lng,
          geo?.countryCode,
          geo?.countryName,
          geo?.city,
          geo?.region,
          geo?.geoStatus,
          geo?.geoConfidence,
          geo?.coordinatesSource,
          geo?.note,
          geo?.verified,
        ],
      );

      if (result.rowCount === 0) {
        throw new Error("Not successful creating merchant");
      }

      return result;
    } catch (err) {
      logger.error("[MerchantRepo.create]: creating merchant:", err);

      throw new Error("Failed to create merchant");
    }
  }

  async getMerchants(): Promise<MerchantRow[]> {
    try {
      const res = await db.query(
        `SELECT m.*, c.category_name
            FROM pwz.merchants AS m
            INNER JOIN pwz.categories AS c
            ON m.category_id = c.category_id
            ORDER BY c.category_name ASC, m.created_at DESC;`,
      );

      return res.rows ?? [];
    } catch (err) {
      logger.error("[MerchantRepo.getMerchants]:", err);

      throw new Error("Failed to fetch Merchant list");
    }
  }

  async getMerchantsByPublishStatus(): Promise<MerchantRow[]> {
    try {
      const res = await db.query(
        `SELECT * FROM pwz.merchants
          WHERE post_status = 'publish'`,
      );

      return res.rows;
    } catch (err) {
      logger.error("[MerchantRepo.getMerchantsByPublishStatus]:", err);

      throw new Error("Failed to fetch Merchant list");
    }
  }

  async getMerchantsBy(
    filterByStatus: POST_STATUS_ENUM = POST_STATUS_ENUM.PUBLISH,
  ): Promise<MerchantRow[]> {
    try {
      const res = await db.query(
        `SELECT * FROM pwz.merchants m
        LEFT JOIN pwz.merchants_geo_data mg 
        ON m.merchant_id = mg.merchant_id
        WHERE post_status = ($1)`,
        [filterByStatus],
      );

      return res.rows;
    } catch (err) {
      logger.error("[MerchantRepo.getMerchantsBy]:", err);

      throw new Error("Failed to fetch Merchant list");
    }
  }

  async upvote(merchantId: string): Promise<number> {
    try {
      const res = await db.query(
        `SELECT merchant_name FROM pwz.merchants
        WHERE merchant_id = ($1)`,
        [merchantId],
      );

      if (res.rows[0]) {
        const result = await db.query(
          `UPDATE pwz.merchants
        SET upvote_count = upvote_count + 1
        WHERE merchant_id = ($1)
        RETURNING upvote_count`,
          [merchantId],
        );

        if (result.rows.length === 0) {
          throw new Error("Failed to update upvote count");
        }

        return result.rows[0].upvote_count;
      }

      return 0;
    } catch (err) {
      logger.error("[MerchantRepo.upvote]:", err);

      throw new Error("Failed to update upvote count");
    }
  }

  async deleteById(merchantId: string) {
    try {
      const result = await db.query(
        `DELETE FROM pwz.merchants
             WHERE merchant_id = ($1)
         RETURNING *
            `,
        [merchantId],
      );

      if (result.rowCount === 0) {
        throw new Error("Merchant not found.");
      }

      return result.rows[0];
    } catch (err) {
      logger.error("[MerchantRepo.deleteById]:", err);

      throw new Error("Failed to delete data");
    }
  }

  async approveById(merchantId: string, status: POST_STATUS_ENUM) {
    try {
      const result = await db.query(
        `UPDATE pwz.merchants
                      SET post_status = ($1)
                      WHERE merchant_id = ($2)
                  RETURNING *`,
        [status, merchantId],
      );

      if (result.rowCount === 0) {
        throw new Error("Merchant not found.");
      }

      return result.rows[0];
    } catch (err) {
      logger.error("[MerchantRepo.approveById]:", err);

      throw new Error("Failed to delete data");
    }
  }
}

const merchantRepo = new MerchantRepo();
export default merchantRepo;
