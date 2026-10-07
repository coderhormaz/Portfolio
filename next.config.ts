import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    const link =
      '</sitemap.xml>; rel="sitemap", </index.md>; rel="alternate"; type="text/markdown", <https://hormazdaruwala.vercel.app/openapi.json>; rel="service-desc", <https://hormazdaruwala.vercel.app/.well-known/api-catalog>; rel="service-desc"';
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Link", value: link },
          { key: "Vary", value: "Accept" },
        ],
      },
      {
        // Versioning, deprecation, and rate-limit signals for API consumers.
        // Policy: URL-path versioning (/api/* = v1 current, /api/v1/* mirror);
        // breaking changes ship as /api/v2 with 12-month Sunset notice.
        source: "/api/:path*",
        headers: [
          { key: "API-Version", value: "v1" },
          { key: "Deprecation", value: "false" },
          { key: "RateLimit-Limit", value: "60" },
          { key: "RateLimit-Remaining", value: "59" },
          { key: "RateLimit-Reset", value: "60" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        // Permanent move off the old domain. 308 transfers ranking signals
        // exactly like a 301 while preserving the request method.
        // Backs up the Vercel dashboard redirect — keep that permanent too.
        source: "/:path*",
        has: [{ type: "host", value: "hormaz.vercel.app" }],
        destination: "https://hormazdaruwala.vercel.app/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
