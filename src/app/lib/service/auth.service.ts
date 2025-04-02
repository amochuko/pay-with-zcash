import { z } from "zod";
import { sql } from "../database/sqlConnection";
import { SignupFormSchema } from "../typings";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SignupArgs = SignupFormSchema.omit({ password: true });
type SignupArgsType = z.infer<typeof SignupArgs> & { hashedPassword: string };

class AuthService {
  async signUp(args: SignupArgsType) {
    try {
      const result = await sql(
        `INSERT INTO users (name,email,password)
        VALUES ($1,$2,$3)
        RETURNING *`,
        [args.name, args.email, args.hashedPassword]
      );

      if (result.rowCount === 1) {
        return result.rows[0].user_id;
      }
    } catch (err) {
      throw err;
    }
  }

  async findUserByEmail(email: string, password: string) {
    try {
      const result = await sql(
        `
          SELECT email * users
          WHERE email = ($1) AND password = ($2)`,
        [email, password]
      );

      if (result.rowCount === 0) {
        return `Account does not exist.`;
      }

      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }
}

const authService = new AuthService(); // using Singleton pattern
export default authService;
