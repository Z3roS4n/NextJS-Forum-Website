import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        port: "",
        pathname: "/**",
        hostname: "img.clerk.com"
      },
      {
        protocol: "https",
        port: "",
        pathname: "/**",
        hostname: "images.clerk.dev"
      },
    ]
  }
};

export default nextConfig;
