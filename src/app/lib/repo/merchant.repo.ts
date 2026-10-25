import { db } from "../database/db";
import logger from "../logger";
import { GeoStatus, MerchantGeo, MerchantRecord } from "../types/map.types";
import { MerchantGeoRow, MerchantRow } from "../types/merchant.types";
import { POST_STATUS_ENUM } from "../typings";

export class MerchantRepo {
  //

  async create(data: Omit<MerchantRow, "merchant_id">) {
    try {
      const result = await db.query<MerchantRow>(
        `INSERT INTO pwz.merchants (
          merchant_name, category_id, website_url,
           email_address, subtitle, description, logo_url, post_status, 
           tags, country, state, city, geo_status
          )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *;`,
        [
          data.merchant_name,
          String(data.category_id),
          data.website_url,
          data.email_address,
          data.subtitle,
          data.description,
          data.logo_url,
          data.post_status,
          data.tags,
          data.country,
          data.state,
          data.city,
          data.geo_status,
        ],
      );

      if (result.rowCount === 0) {
        throw new Error("Not successful creating merchant");
      }

      return result.rows[0];
    } catch (err) {
      logger.error("[MerchantRepo.create]", err);

      throw new Error("Failed to create merchant");
    }
  }

  async listMissingGeo(): Promise<MerchantRecord[]> {
    const result = await db.query(
      `SELECT * FROM pwz.merchants m
        LEFT JOIN pwz.merchants_geo_data geo ON m.merchant_id = geo.merchant_id`,
    );

    return result.rows;
  }

  async saveGeo(merchantId: string, geo: MerchantGeo) {
    try {
      const result = await db.query(
        `INSERT INTO pwz.merchants_geo_data (merchant_id, lat, lng, 
          country_code, region, 
          geo_confidence, coordinates_source, notes, verified, precision)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)
      RETURNING *;`,
        [
          merchantId,
          geo.lat,
          geo.lng,
          geo.countryCode,
          geo.region,
          geo.geoConfidence,
          geo.coordinatesSource,
          geo.note,
          geo.verified,
          geo.precision,
        ],
      );

      if (result.rowCount === 0) {
        throw new Error("Not successful creating merchant");
      }

      return result.rows[0];
    } catch (err) {
      logger.error("[MerchantRepo.saveGeo]", err);

      throw new Error("Failed to save merchant geoData");
    }
  }

  async getMerchants(): Promise<MerchantGeoRow[]> {
    try {
      const res = await db.query(
        `SELECT m.*, c.category_name, geo.id as geo_id, geo.lat, 
            geo.lng, geo.geo_confidence, geo.coordinates_source, geo.notes, geo.precision
            FROM pwz.merchants AS m
            INNER JOIN pwz.merchants_geo_data AS geo
            ON m.merchant_id = geo.merchant_id
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
        SET upvote_count = upvote_count + 1,
            updated_at = NOW()
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
      const result = await db.query<MerchantRow>(
        `UPDATE pwz.merchants
             SET post_status = ($1),
              updated_at = NOW()
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

  async find(name: string, websiteUrl?: string): Promise<MerchantRow | null> {
    const res = await db.query(
      `SELECT * FROM pwz.merchants
        WHERE merchant_name = ($1) OR website_url = $2`,
      [name, websiteUrl],
    );

    return res.rows[0] ?? null;
  }

  async updateGeoStatus(
    merchantId: string,
    geoStatus: GeoStatus,
  ): Promise<MerchantRecord> {
    try {
      const updated = await db.query(
        `UPDATE pwz.merchants
             SET geo_status = ($2),
             updated_at = NOW()
             WHERE merchant_id = ($1)
         RETURNING *`,
        [merchantId, geoStatus],
      );

      if (updated.rowCount === 0) {
        throw new Error("Merchant not found.");
      }

      const result = await db.query(
        `SELECT * FROM pwz.merchants m
        LEFT JOIN pwz.merchants_geo_data geo
          ON m.merchant_id = geo.merchant_id
        WHERE m.merchant_id = $1;
          `,
        [merchantId],
      );

      return result.rows[0];
    } catch (err) {
      logger.error("[MerchantRepo.updateGeoStatus]:", err);

      throw new Error("Failed to update GeoStatus");
    }
  }
}

const merchantRepo = new MerchantRepo();
export default merchantRepo;
