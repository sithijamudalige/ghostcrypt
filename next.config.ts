import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/admin/:path*',
        headers: [ { key: 'X-Robots-Tag', value: 'noindex, nofollow' } ],
      },
      {
        source: '/dashboard/:path*',
        headers: [ { key: 'X-Robots-Tag', value: 'noindex, nofollow' } ],
      },
      {
        source: '/encrypt/:path*',
        headers: [ { key: 'X-Robots-Tag', value: 'noindex, nofollow' } ],
      },
      {
        source: '/login',
        headers: [ { key: 'X-Robots-Tag', value: 'noindex, nofollow' } ],
      },
      {
        source: '/fix-labs',
        headers: [ { key: 'X-Robots-Tag', value: 'noindex, nofollow' } ],
      }
    ];
  },
};

export default nextConfig;
