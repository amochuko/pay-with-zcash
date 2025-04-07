import { sql } from "../database/sqlConnection";
import { Merchant } from "../models/Merchant";
import PrivacyPolicy from "../models/PrivacyPolicy";

class PrivacyPolicyService {
  //

  async create(args: Omit<PrivacyPolicy, "policy_id">) {
    //
    const values = [args.title, args.description];

    try {
      const result = await sql(
        `INSERT INTO merchants (title, description)
             VALUES ($1, $2)
             RETURNING *;`,
        values
      );

      if (result.rowCount === 0) {
        throw new Error("Not succssful creating Privacy Policy");
      }

      return result;
    } catch (err) {
      const msg = "Error creating policy: ";
      console.error(msg, err);
      throw new Error(msg);
    }
  }

  async getPolicies(): Promise<PrivacyPolicy[]> {
    try {
      const res = await sql(`SELECT * FROM public.privacy_policcy AS p
                        ORDER BY p.serial_num ASC;`);

      if (res.rowCount && res.rowCount > 1) {
        return res.rows;
      } else {
        return [];
      }
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error("Failed to fetch Policy list");
    }
  }

  async getPolicyById(policyId: string): Promise<Merchant[]> {
    try {
      const res = await sql(
        `SELECT * FROM privacy_policcy 
        WHERE policy_id = ($1)`,
        [policyId]
      );
      return res.rows;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error(`Failed to fetch Policy of id: ${policyId}`);
    }
  }


}

const privacyPolicyService = new PrivacyPolicyService();
export default privacyPolicyService;
