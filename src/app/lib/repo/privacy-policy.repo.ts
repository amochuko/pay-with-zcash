import { db } from "../database/db";
import { Merchant } from "../types/merchant.types";
import PrivacyPolicy from "../types/PrivacyPolicy";

class PrivacyPolicyService {
  //

  async create(args: Pick<PrivacyPolicy, "title" | "description">) {
    //
    const params = [args.title, args.description];

    try {
      const result = await db.query(
        `INSERT INTO privacy_policy (title, description)
             VALUES ($1, $2)
             RETURNING *;`,
        params,
      );

      if (result.rowCount === 0) {
        throw new Error("Not succssful creating Privacy Policy");
      }

      return result;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const msg = "Creating policy";

      if (err instanceof Error) {
        console.error(msg, err.message);
        throw new Error(`${msg} description is longer than acceptable`);
      } else {
        throw new Error(`${msg}: something went wrong`);
      }
    }
  }

  async getPolicies(): Promise<PrivacyPolicy[]> {
    try {
      const res = await db.query(
        `SELECT * FROM public.privacy_policy AS p
                        ORDER BY p.serial_num ASC;`,
      );

      if (res.rowCount && res.rowCount > 0) {
        return res.rows;
      } else {
        return [];
      }
    } catch (err) {
      const msg = "Fetching policies failed.";
      if (err instanceof Error) {
        console.error(msg, err.message);
        throw new Error(msg);
      }

      throw new Error("Failed to fetch Policy list");
    }
  }

  async getPolicyById(policyId: string): Promise<Merchant[]> {
    try {
      const res = await db.query(
        `SELECT * FROM privacy_policcy 
        WHERE policy_id = ($1)`,
        [policyId],
      );
      return res.rows;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error(`Failed to fetch Policy of id: ${policyId}`);
    }
  }

  async updatePolicyById(
    policyId: string,
    data: Partial<PrivacyPolicy>,
  ): Promise<number> {
    try {
      const { description, title } = data;

      const res = await db.query(
        `SELECT policy_id FROM privacy_policy
        WHERE policy_id = ($1)`,
        [policyId],
      );

      if (res.rows[0]) {
        const result = await db.query(
          `UPDATE privacy_policy
        SET title = ($2)
        SET description = ($3)
        WHERE policy_id = ($1)
        RETURNING *`,
          [policyId, String(title), String(description)],
        );

        if (result.rows.length === 0) {
          throw new Error("Failed to update policy");
        }

        return result.rows[0].upvote_count;
      }

      return 0;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }

      throw new Error("Failed to update policy");
    }
  }

  async deleteById(policyId: string): Promise<{ policy_id: string } | null> {
    try {
      const result = await db.query(
        `DELETE FROM privacy_policy
            WHERE policy_id = ($1)
            RETURNING policy_id
            `,
        [policyId],
      );

      if (result.rowCount === 0) {
        throw new Error("Policy not found.");
      }

      return result.rows[0];
    } catch (err) {
      if (err instanceof Error) {
        throw err.message;
      }

      throw new Error("Failed to delete policy");
    }
  }
}

const privacyPolicyService = new PrivacyPolicyService();
export default privacyPolicyService;
