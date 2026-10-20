import dotenv from "dotenv";
import { z } from "zod";

const nodeEnv = process.env.NODE_ENV ?? "development";

const envFileByNodeEnv = {
  development: ".env.development",
  test: ".env.test",
  production: ".env.production",
} as const;

const envFile = envFileByNodeEnv[nodeEnv as keyof typeof envFileByNodeEnv];

if (!envFile) {
  throw new Error(
    `Invalid NODE_ENV "${nodeEnv}". Expected development, test, or production.`,
  );
}

dotenv.config({ path: envFile });

const envSchema = z.object({
  migrationPath: z.string(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  DB_SCHEMA_NAME: z.string(),
  SESSION_PAY_WITH_ZCASH: z.string(),
  DATABASE_URL: z.string(),
  DISCORD_WEBHOOK_URL: z.string(),
  ZECHUB_DISCORD_WEBHOOK_URL: z.string(),
  THEME_NAME: z.string(),
  BLOB_READ_WRITE_TOKEN: z.string(),
  BLOB_HOSTNAME: z.string(),
  BLOB_PATHNAME: z.string(),

  NOMINATIM_USER_AGENT: z.string(),
  NOMINATIM_BASE_URL: z.string(),

  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]),
});

const parsed = envSchema.safeParse({
  ...process.env,
  NODE_ENV: nodeEnv,
});

if (!parsed.success) {
  console.error(
    "Invalid environment configuration:",
    parsed.error.flatten().fieldErrors,
  );
}

export const env = {
  migrationPath: parsed.data?.migrationPath,
  NODE_ENV: parsed.data?.NODE_ENV,
  DB_SCHEMA_NAME: parsed.data?.DB_SCHEMA_NAME,
  DATABASE_URL: parsed.data?.DATABASE_URL,
  SESSION_PAY_WITH_ZCASH: parsed.data?.SESSION_PAY_WITH_ZCASH,
  DISCORD_WEBHOOK_URL: parsed.data?.DISCORD_WEBHOOK_URL,
  ZECHUB_DISCORD_WEBHOOK_URL: parsed.data?.ZECHUB_DISCORD_WEBHOOK_URL,
  THEME_NAME: parsed.data?.THEME_NAME,
  BLOB_READ_WRITE_TOKEN: parsed.data?.BLOB_READ_WRITE_TOKEN,
  BLOB_HOSTNAME: parsed.data?.BLOB_HOSTNAME,
  BLOB_PATHNAME: parsed.data?.BLOB_PATHNAME,
  LOG_LEVEL: parsed.data?.LOG_LEVEL,
  NOMINATIM_USER_AGENT: parsed.data?.NOMINATIM_USER_AGENT,
  NOMINATIM_BASE_URL: parsed.data?.NOMINATIM_BASE_URL,
};
