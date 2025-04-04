import { z } from "zod";
import { sql } from "../database/sqlConnection";
import { SignupFormSchema } from "../typings";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SignupArgs = SignupFormSchema.omit({ password: true });
type SignupArgsType = z.infer<typeof SignupArgs> & { hashedPassword: string };

class AuthService {
  //

  async signUp(args: SignupArgsType) {
    if (args.email.length > 150) {
      throw new Error(
        "Email address is too long. Maximum allowed length is 150 characters."
      );
    }

    try {
      const result = await sql(
        `INSERT INTO accounts (username, email_address, password)
        VALUES ($1, $2, $3)
        RETURNING *`,
        [args.name, args.email, args.hashedPassword]
      );

      if (result.rowCount === 1) {
        return result.rows[0].user_id;
      } else {
        throw new Error("Sign up failed. Please try agian.");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error during sign up:", err.message); // Log the error in a general manner

        // Check for the 'value too long' error (specific to PostgreSQL)
        if (
          err.message &&
          err.message.includes("value too long for type character varying")
        ) {
          // Return a generic error message or a more specific one based on the app's context
          throw new Error(
            "The provided email address is too long. Please check your input."
          );
        }

        // Handle unique constraint violations (if email or username already exists)
        if (
          err.message.includes("duplicate key value violates unique constraint")
        ) {
          if (err.message.includes("accounts_username_key")) {
            throw new Error(
              "Username already exists. Please choose another one."
            );
          }
          if (err.message.includes("accounts_email_address_key")) {
            throw new Error(
              "Email address already in use. Please choose another one."
            );
          }
        }
      }

      // Catch any other errors and return a generic error message
      throw new Error(
        "An error occurred during the sign up process. Please try again."
      );
    }
  }

  async findUserByEmail(email: string) {
    try {
      const result = await sql(
        `
          SELECT * FROM accounts
          WHERE email_address = ($1)
          LIMIT 1`,
        [email]
      );

      if (result.rowCount === 0) {
        return { success: false, data: `Account does not exist.` };
      }

      return { success: true, data: result.rows[0] };
    } catch (err) {
      console.error("Error in findUserByEmail: ", err);

      throw new Error("Database query failed");
    }
  }
}

const authService = new AuthService(); // using Singleton pattern
export default authService;
