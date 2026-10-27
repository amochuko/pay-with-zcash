import { Pool } from "pg";
import { env } from "../env";

const DATABASE_URL = env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    `Detabase connection string is not confiquired for NODE_ENV-${env.NODE_ENV}`,
  );
}

export const db = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});
