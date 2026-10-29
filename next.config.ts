import { clientEnv } from "@/app/lib/client-env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: clientEnv.NEXT_PUBLIC_BLOB_HOSTNAME!,
        pathname: clientEnv.NEXT_PUBLIC_BLOB_PATHNAME,
      },
    ],
  },
};

export default nextConfig;
