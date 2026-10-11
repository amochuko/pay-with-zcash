import pg from "pg";
import { env } from "../env";

let pool: pg.Pool | null = null;

const nodeEnv = process.env.NODE_ENV;
const testConnStr = env.PGDB_TEST_CONNECTION_STRING;
const devConnStr = env.PGDB_DEV_CONNECTION_STRING;
const prodConnStr = env.PGDB_PRO_CONNECTION_STRING;

export let DATABASE_URL: string | undefined;

switch (nodeEnv) {
  case "test":
    DATABASE_URL = testConnStr;
    break;

  case "development":
    DATABASE_URL = devConnStr;
    break;

  case "production":
    DATABASE_URL = prodConnStr;
    break;
}

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL not set!");
}

export const dbClient = {
  getPool: () => {
    if (!pool) {
      pool = new pg.Pool({ connectionString: DATABASE_URL });
    }

    return pool;
  },
};

export async function closeDBClient() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

export async function initDB() {
  const pool = dbClient.getPool();
  const client = await pool.connect();

  try {
    console.log("DB connected...");

    const schemaExists = await client.query(`
      SELECT nspname FROM pg_catalog.pg_namespace WHERE nspname NOT LIKE 'pg_%' AND nspname != 'information_schema`);

    const exists = schemaExists.rows.some(
      (row) => row.nspname === env.DB_SCHEMA_NAME,
    );

    if (!exists) {
      console.log("Creating schema: ", env.DB_SCHEMA_NAME);

      await client.query(`CREATE SCHEMA IF NOT EXISTS ${env.DB_SCHEMA_NAME}`);
    }
  } catch (err) {
    console.log("Unexpected error on idle client: ", err);
    process.exit(-1);
  } finally {
    client.release();
  }
}

type SQLArgs = {
  query: string;
  params?: (string | string[] | Buffer | ArrayBuffer)[];
};
export async function sql<T extends pg.QueryResultRow = any>(args: SQLArgs) {
  const pool = dbClient.getPool();
  const client = await pool.connect();

  try {
    const res = await client.query<T>(args.query, args.params);
    return res;
  } catch (err) {
    console.error("SQL::Query error:", err);

    if (err instanceof Error) {
      throw err;
    }

    throw new Error(err as any);
  } finally {
    client.release();
  }
}
