import fs from "node:fs";
import path from "node:path";
import { env } from "../env";
import { db } from "./db";

export async function initDB() {
  try {
    console.log("DB connected...");

    const schemaExists = await db.query(`
      SELECT nspname FROM pg_catalog.pg_namespace WHERE nspname NOT LIKE 'pg_%' AND nspname != 'information_schema'`);

    const exists = schemaExists.rows.some(
      (row) => row.nspname === env.DB_SCHEMA_NAME,
    );

    if (!exists) {
      console.log("Creating schema:", env.DB_SCHEMA_NAME);

      await db.query(`CREATE SCHEMA IF NOT EXISTS ${env.DB_SCHEMA_NAME}`);
    }
  } catch (err) {
    console.error("Unexpected error: ", err);
    process.exit(-1);
  }
}

async function ensureMigrationsTable() {
  await db.query(
    `CREATE TABLE IF NOT EXISTS pwz.migrations (
        id serial PRIMARY KEY,
        filename text UNIQUE,
        applied_at timestamptz DEFAULT now())`,
  );
}

export async function runDBMigration(migrationsDirPath: string) {
  await initDB();
  await ensureMigrationsTable();

  const migrationDir = path.join(__dirname, migrationsDirPath);

  const files = fs
    .readdirSync(migrationDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const file of files) {
    const already = await db.query(
      `SELECT 1 FROM pwz.migrations 
            WHERE filename = $1`,
      [file],
    );

    if (already.rowCount! > 0) {
      console.log(`Skipping already applied migration: ${file}`);
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationDir, file), "utf-8");
    console.log(`Applying migration: ${file}`);

    try {
      await db.query("BEGIN");
      await db.query(sql);
      await db.query(`INSERT INTO pwz.migrations (filename) VALUES ($1)`, [
        file,
      ]);
      await db.query("COMMIT");
    } catch (err) {
      await db.query("ROLLBACK");
      console.error(`Failed migration ${file}:`, err);
      process.exit(1);
    }
  }

  console.log("Migration complete.");
}
