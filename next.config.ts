import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "export",
  basePath: "/T-Gia-nh",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
