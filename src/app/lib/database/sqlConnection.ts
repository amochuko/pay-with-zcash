import pg from "pg";
import {
  DB_CONNECTION_STRING,
  PGDATABASE_LOCAL,
  PGHOST_LOCAL,
  PGPASSWORD_LOCAL,
  PGPORT_LOCAL,
  PGUSER_LOCAL,
} from "../config";


export const dbClient =
  process.env.NODE_ENV != "production"
    ? new pg.Pool({
        host: PGHOST_LOCAL,
        user: PGUSER_LOCAL,
        database: PGDATABASE_LOCAL,
        password: PGPASSWORD_LOCAL,
        port: PGPORT_LOCAL,
        ssl: false,
      })
    : new pg.Pool({
        connectionString: DB_CONNECTION_STRING,
      });

dbClient.on("error", (err) => {
  console.log("Unexpected error on idle client: ", err);
  process.exit(-1);
});

export async function sql(query: string, params: (string | string[])[] = []) {
  const client = await dbClient.connect();

  try {
    const result = await client.query(query, params);
    return result;
  } catch (err) {
    throw err;
  } finally {
    client.release();
  }
}
