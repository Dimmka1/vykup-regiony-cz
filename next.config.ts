import type { NextConfig } from "next";
import withBundleAnalyzerInit from "@next/bundle-analyzer";

const withBundleAnalyzer = withBundleAnalyzerInit({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  devIndicators: false,
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default withBundleAnalyzer(nextConfig);
