import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@mafan/tokens", "@mafan/types"],
};

export default nextConfig;
