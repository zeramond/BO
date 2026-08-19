import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "admin.bobowlingom.com",
          },
        ],
        destination: "/admin/reservations",
      },
    ];
  },
};

export default nextConfig;
