import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: [".env.production", ".env.development"] });

export const env = {
  migrationPath: path.resolve("src", "/database/migrations"),
  DB_SCHEMA_NAME: "pwz",
  PGDB_TEST_CONNECTION_STRING: process.env.PGDB_TEST_CONNECTION_STRING,
  PGDB_DEV_CONNECTION_STRING: process.env.PGDB_DEV_CONNECTION_STRING,
  PGDB_PRO_CONNECTION_STRING: process.env.PGDB_PRO_CONNECTION_STRING,
  SESSION_PAY_WITH_ZCASH:
    process.env.SESSION_PAY_WITH_ZCASH || "pay_with_zcash",
  PGHOST_LOCAL: process.env.PGHOST_LOCAL,
  PGUSER_LOCAL: process.env.PGUSER_LOCAL,
  PGDATABASE_LOCAL: process.env.PGDATABASE_LOCAL,
  PGPASSWORD_LOCAL: process.env.PGPASSWORD_LOCAL,
  PGPORT_LOCAL: Number(process.env.PGPORT_LOCAL),
  DB_CONNECTION_STRING: process.env.DB_CONNECTION_STRING,
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  ZECHUB_DISCORD_WEBHOOK_URL: process.env.ZECHUB_DISCORD_WEBHOOK_URL,
  THEME_NAME: "pay-with-zcash-theme",
};
