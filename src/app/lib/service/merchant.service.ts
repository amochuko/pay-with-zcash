import { sql } from "../database/sqlConnection";
import { Merchant } from "../models/Merchant";
import { POST_STATUS_ENUM } from "../typings";

class MerchantService {
  //

  async create(data: Omit<Merchant, "merchant_id">) {
    //
    const values = [
      data.merchant_name,
      String(data.category_id),
      data.website_url,
      "NA",
      data.subtitle,
      data.logo_url,
      data.post_status,
      data.tags,
      data.logo_img_id,
    ];

    try {
      const result = await sql(
        `INSERT INTO merchants (merchant_name, category_id, website_url, email_address, subtitle, logo_url, post_status, tags, logo_img_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;`,
        values
      );

      if (result.rowCount === 0) {
        throw new Error("Not succssful creating merchant");
      }

      return result;
    } catch (err) {
      const msg = "Error creating merchant: ";
      console.error(msg, err);
      throw new Error(msg);
    }
  }

  async getMerchants(): Promise<Merchant[]> {
    try {
      const res = await sql(
        `SELECT m.*, c.category_name, i.img_name, i.img_bin_data 
                        FROM public.merchants AS m
                        INNER JOIN categories AS c
                        ON m.category_id = c.category_id
                        LEFT JOIN logo_images AS i
                        ON m.logo_img_id = i.img_id
                    
                        ORDER BY c.category_name ASC, m.created_at DESC;`
      );

      if (res.rowCount && res.rowCount > 1) {
        return res.rows;
      } else {
        return [];
      }
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error("Failed to fetch Merchant list");
    }
  }

  async getMerchantsByPublishStatus(): Promise<Merchant[]> {
    try {
      const res = await sql(`SELECT * FROM merchants
          WHERE post_status = 'publish'`);
      return res.rows;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error("Failed to fetch Merchant list");
    }
  }

  async getMerchantsBy(
    filterByStatus: POST_STATUS_ENUM = POST_STATUS_ENUM.PUBLISH
  ): Promise<Merchant[]> {
    try {
      const res = await sql(
        `SELECT * FROM merchants 
        WHERE post_status = ($1)`,
        [filterByStatus]
      );
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

  async deleteById(merchantId: string) {
    try {
      const result = await sql(
        `
                      DELETE FROM merchants
                      WHERE merchant_id = ($1)
              RETURNING *
            `,
        [merchantId]
      );

      if (result.rowCount === 0) {
        throw new Error("Merchant not found.");
      }

      return result.rows[0];
    } catch (err) {
      if (err instanceof Error) {
        throw err.message;
      }

      throw new Error("Failed to delete data");
    }
  }

  async approveById(merchantId: string, status: POST_STATUS_ENUM) {
    try {
      const result = await sql(
        `UPDATE merchants
                      SET post_status = ($1)
                      WHERE merchant_id = ($2)
                  RETURNING *`,
        [status, merchantId]
      );

      if (result.rowCount === 0) {
        throw new Error("Merchant not found.");
      }

      return result.rows[0];
    } catch (err) {
      if (err instanceof Error) {
        throw err.message;
      }

      throw new Error("Failed to delete data");
    }
  }
}

const merchantService = new MerchantService();
export default merchantService;
