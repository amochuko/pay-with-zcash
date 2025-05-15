// import dotenv from "dotenv";
// dotenv.config();

export const SESSION_PAY_WITH_ZCASH =
  process.env.SESSION_PAY_WITH_ZCASH || "pay_with_zcash";
export const PGHOST_LOCAL = process.env.PGHOST_LOCAL;
export const PGUSER_LOCAL = process.env.PGUSER_LOCAL;
export const PGDATABASE_LOCAL = process.env.PGDATABASE_LOCAL;
export const PGPASSWORD_LOCAL = process.env.PGPASSWORD_LOCAL;
export const PGPORT_LOCAL = Number(process.env.PGPORT_LOCAL);

export const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
export const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
export const ZECHUB_DISCORD_WEBHOOK_URL = process.env.ZECHUB_DISCORD_WEBHOOK_URL;
export const THEME_NAME = "pay-with-zcash-theme";
