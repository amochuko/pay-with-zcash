import sql from "../database/sqlConnection";
import { Merchant } from "../models/Merchant";
import { POST_STATUS_ENUM } from "../typings";

class MerchantService {
  //

  async create(data: Merchant) {
    try {
      await sql`INSERT INTO merchants (name, category_id, website_url, email_address, tags, subtitle, logo_url, post_statue) 
      VALUES (${data.name}, ${data.category_id}, ${data.website_url}, ${data.email_address}, ${data.tags}, ${data.subtitle}, ${data.logo_url}, ${POST_STATUS_ENUM.DRAFT})`;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error("MerchantService::create failed");
    }
  }
}

const merchantService = new MerchantService();
export default merchantService;
