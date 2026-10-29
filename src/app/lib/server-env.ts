import 'server-only'
import { z } from "zod";

const serverEnvSchema = z.object({
  MIGRATION_PATH: z.string().min(1),

  DB_SCHEMA_NAME: z.string().min(1),
  DATABASE_URL: z.string().min(1),

  NODE_ENV: z.enum(["development", "test", "production"]),

  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]),

  SESSION_PAY_WITH_ZCASH: z.string().min(1),
  DISCORD_WEBHOOK_URL: z.string(),
  ZECHUB_DISCORD_WEBHOOK_URL: z.string(),

  BLOB_READ_WRITE_TOKEN: z.string(),

  NOMINATIM_USER_AGENT: z.string(),
  NOMINATIM_BASE_URL: z.string(),
});

const parsed = serverEnvSchema.safeParse({
  ...process.env,
  NODE_ENV: process.env.NODE_ENV ?? "development",
});


if (!parsed.success) {
  console.error(
    "Invalid server environment configuration:",
    parsed.error.flatten().fieldErrors,
  );

  throw new Error("Server environment configuration is invalid.");
}

export const serverEnv = parsed.data;
