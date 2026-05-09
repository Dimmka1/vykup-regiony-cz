import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Emit source maps for client bundles in production. Lighthouse and any
  // RUM/error-reporting tooling can then resolve minified stack traces.
  productionBrowserSourceMaps: true,
  experimental: {
    // Inline critical CSS into <head>, defer the rest. Eliminates the single
    // render-blocking CSS bundle Lighthouse flags. Powered by critters.
    optimizeCss: true,
    // Rewrite barrel imports (e.g. `import { Shield } from "lucide-react"`)
    // into direct deep imports at build time. Trims unused icons / motion
    // primitives out of the client JS bundle, reducing main-thread work.
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async headers() {
    return [
      {
        // API routes: enforce no-cache, no-store (private data)
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
  images: {
    // Default `qualities` was reduced to [75] in Next 16. We use
    // quality={65} for one below-fold image (section-process); list both
    // values so next/image keeps optimizing instead of coercing.
    qualities: [65, 75],
  },
};

export default nextConfig;
