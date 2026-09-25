import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Portal guides are MDX files read from disk at request time.
  outputFileTracingIncludes: {
    "/portal/guides/**": ["./content/portal-guides/**"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/niution",
        destination: "/keystatic",
        permanent: false,
      },
      {
        source: "/niution/:path*",
        destination: "/keystatic/:path*",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.figma.com',
        pathname: '/api/mcp/asset/**',
      },
    ],
  },
};

export default nextConfig;