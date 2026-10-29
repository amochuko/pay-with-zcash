import { Pool } from "pg";
import { serverEnv } from "../server-env";

export const db = new Pool({
  connectionString: serverEnv.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});
