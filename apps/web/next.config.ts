import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mafan/tokens", "@mafan/types"],
  images: {
    // Instagram feed media (served unoptimized; see InstagramFeed).
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
  },
};

export default nextConfig;
