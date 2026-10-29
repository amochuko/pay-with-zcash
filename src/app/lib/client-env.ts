import { z } from "zod";

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
