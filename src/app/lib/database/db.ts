import { Pool } from "pg";
import { migrationEnv } from "../migration-env";

export const db = new Pool({
  connectionString: migrationEnv.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});
