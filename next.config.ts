import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/studioOS",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
