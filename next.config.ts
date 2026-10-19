import type { NextConfig } from "next";
import { env } from "./src/app/lib/env";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: env.BLOB_HOSTNAME!,
        pathname: env.BLOB_PATHNAME,
      },
    ],
  },
};

export default nextConfig;
