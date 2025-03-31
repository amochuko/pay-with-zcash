import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

export const dbClient =
  process.env.NODE_ENV != "production"
    ? new pg.Pool({
        host: process.env.PGHOST_LOCAL,
        user: process.env.PGUSER_LOCAL,
        database: process.env.PGDATABASE_LOCAL,
        password: process.env.PGPASSWORD_LOCAL,
        port: Number(process.env.PGPORT_LOCAL),
        ssl: false,
      })
    : new pg.Pool({
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: Number(process.env.PGPORT),
        ssl: true,
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
