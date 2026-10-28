import { z } from "zod";

const envSchema = z.object({
  MIGRATION_PATH: z.string().min(1),
  DB_SCHEMA_NAME: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  NODE_ENV: z.enum(["development", "test", "production"]),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid migration environment configuration:",
    parsed.error.flatten().fieldErrors,
  );

  throw new Error("Migration environment configuration is invalid.");
}

export const migrationEnv = parsed.data;
