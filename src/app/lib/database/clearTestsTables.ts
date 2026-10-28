import { migrationEnv } from "../migration-env";
import { db } from "./db";

/**
 * This ensures tests don’t leak data between each other.
 * Dynamically truncates all tables in the `learning_app` schema.
 * This is helpful in automatically adapting to when new test tables
 * are added without updating this function.
 */
export async function clearTestTable() {
  const result = await db.query(
    `SELECT tablename FROM pg_tables
    WHERE schemaname = '${migrationEnv.DB_SCHEMA_NAME}' 
    AND tablename NOT IN ('migrations');`,
  );

  const tables = result.rows.map(
    (row) => `${migrationEnv.DB_SCHEMA_NAME}.${row.tablename}`,
  );

  if (tables.length === 0) {
    console.warn("No tables found to truncate.");
    return;
  }

  await db.query(
    `TRUNCATE TABLE ${tables.join(", ")} RESTART IDENTITY CASCADE;`,
  );

  console.log(`⚠️ Truncated ${tables.length} tables...`);
}
