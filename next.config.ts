import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
