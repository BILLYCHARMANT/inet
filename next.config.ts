import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone only for self-hosting (e.g. Hostinger). Vercel uses its own runtime.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
