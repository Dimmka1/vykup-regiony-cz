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
  webpack: (config, { isServer, dev }) => {
    // Next 15.5.12 leaks ~217 KB of next-devtools (Base UI menu primitives,
    // dev-overlay components) into the client `First Load JS shared by all`
    // chunk in production builds. Fixed in newer Next majors. Stub the
    // module out for client production bundles only — server runtime and
    // dev mode still resolve the real module.
    if (!isServer && !dev) {
      config.resolve = config.resolve ?? {};
      config.resolve.alias = {
        ...(config.resolve.alias ?? {}),
        "next/dist/compiled/next-devtools$": false,
      };
    }
    return config;
  },
};

export default nextConfig;
