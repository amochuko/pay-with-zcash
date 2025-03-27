import sql from "../database/sqlConnection";
import { Merchant } from "../models/Merchant";
import { POST_STATUS_ENUM } from "../typings";

class MerchantService {
  //

  async create(data: Merchant) {
    try {
      return await sql`
      INSERT INTO merchants (merchant_name, category_id, website_url, email_address, tags, subtitle, logo_url, post_status) 
      VALUES (${data.merchant_name}, ${data.category_id}, ${data.website_url}, ${data.email_address}, ${data.tags}, ${data.subtitle}, ${data.logo_url}, ${POST_STATUS_ENUM.DRAFT})
      
      RETURNING true;
      `;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error("MerchantService::create failed");
    }
  }

  async getMerchats(): Promise<Merchant[] | []> {
    try {
      return await sql`SELECT * FROM merchants`;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw err;
    }
  }
}

const merchantService = new MerchantService();
export default merchantService;
