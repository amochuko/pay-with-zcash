import dotenv from "dotenv";
import { z } from "zod";

// const nodeEnv = process.env.NODE_ENV ?? "development";

// const envFileByNodeEnv = {
//   development: ".env.development",
//   test: ".env.test",
//   production: ".env.production",
// } as const;

// const envFile = envFileByNodeEnv[nodeEnv as keyof typeof envFileByNodeEnv];

// if (!envFile) {
//   throw new Error(
//     `Invalid NODE_ENV "${nodeEnv}". Expected development, test, or production.`,
//   );
// }

// dotenv.config({ path: envFile });

const clientEnvSchema = z.object({
  NEXT_PUBLIC_BLOB_HOSTNAME: z.string(),
  NEXT_PUBLIC_BLOB_PATHNAME: z.string(),
  NEXT_PUBLIC_THEME_NAME: z.string(),
  NEXT_PUBLIC_CARTO_MAP_API_KEY: z.string(),
  NEXT_PUBLIC_LISTING_URL: z.string(),
});

const parsed = clientEnvSchema.safeParse({
  NEXT_PUBLIC_BLOB_HOSTNAME: process.env.NEXT_PUBLIC_BLOB_HOSTNAME,
  NEXT_PUBLIC_BLOB_PATHNAME: process.env.NEXT_PUBLIC_BLOB_PATHNAME,
  NEXT_PUBLIC_THEME_NAME: process.env.NEXT_PUBLIC_THEME_NAME,
  NEXT_PUBLIC_CARTO_MAP_API_KEY: process.env.NEXT_PUBLIC_CARTO_MAP_API_KEY,
  NEXT_PUBLIC_LISTING_URL: process.env.NEXT_PUBLIC_LISTING_URL,
});

if (!parsed.success) {
  console.error(
    "Invalid client environment configuration:",
    parsed.error.flatten().fieldErrors,
  );

  throw new Error("Client environment configuration is invalid.");
}

export const clientEnv = parsed.data;
