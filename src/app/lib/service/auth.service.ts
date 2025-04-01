import { QueryResult } from "pg";
import { z } from "zod";
import { sql } from "../database/sqlConnection";
import User from "../models/User";
import { SignupFormSchema } from "../typings";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SignupArgs = SignupFormSchema.omit({ password: true });
type SignupArgsType = z.infer<typeof SignupArgs> & { hashedPassword: string };

class AuthService {
  async signUp(args: SignupArgsType) {
    try {
      const result: QueryResult<User> = await sql(
        `INSERT INTO users (name,email,password)
        VALUES ($1,$2,$3)`,
        [args.name, args.email, args.hashedPassword]
      );

      if (result.rowCount === 1) {
        return result;
      }
    } catch (err) {
      throw err;
    }
  }
}

const authService = new AuthService(); // using Singleton pattern
export default authService;
