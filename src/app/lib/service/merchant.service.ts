import { dbClient } from "../database/sqlConnection";
import { Merchant } from "../models/Merchant";

class MerchantService {
  //

  async sql(query: string, params: (string | string[])[] = []) {
    const client = await dbClient.connect();

    try {
      const res = await client.query(query, params);
      return res;
    } catch (err) {
      console.error("Query failed: ", err);
      throw err;
    } finally {
      client.release();
    }
  }

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
      await this.sql(
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
      const res = await this.sql(`SELECT * FROM merchants`);
      return res.rows;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error("Failed to fetch Merchant list");
    }
  }

  async updatePostStatus() {
    try {
      const res = await this.sql(`SELECT $1::text as message`, [
        "Hello world!",
      ]);

      console.log({ res: res.rows[0].message });
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error("Failed to approved Status");
    }
  }
}

const merchantService = new MerchantService();
export default merchantService;
