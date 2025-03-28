import { sql } from "../database/sqlConnection";
import { Merchant } from "../models/Merchant";

class MerchantService {
  //

  async create(data: Merchant) {
    const values = [
      data.merchant_name,
      data.category_id,
      data.website_url,
      data.email_address,
      data.subtitle,
      data.logo_url,
      data.post_status,
      data.tags,
    ];

    try {
      await sql(
        `INSERT INTO merchants (merchant_name, category_id, website_url, email_address, subtitle, logo_url, post_status, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;`,
        values
      );
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error("Failed to add merchant!");
    }
  }

  async getMerchants(): Promise<Merchant[]> {
    try {
      const res = await sql(`SELECT * FROM merchants`);
      return res.rows;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error("Failed to fetch Merchant list");
    }
  }

  async upvote(merchantId: string): Promise<number> {
    try {
      const res = await sql(
        `SELECT merchant_name FROM merchants
        WHERE merchant_id = ($1)`,
        [merchantId]
      );

      if (res.rows[0]) {
        const result = await sql(
          `UPDATE merchants
        SET upvote_count = upvote_count + 1
        WHERE merchant_id = ($1)
        RETURNING upvote_count`,
          [merchantId]
        );

        if (result.rows.length === 0) {
          throw new Error("Failed to update upvote count");
        }

        return result.rows[0].upvote_count;
      }

      return 0;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error("Failed to update upvote count");
    }
  }
}

const merchantService = new MerchantService();
export default merchantService;
