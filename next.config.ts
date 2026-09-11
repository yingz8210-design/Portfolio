import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  ...(process.env.TENCENT_STATIC_EXPORT === 'true'
    ? { output: 'export' as const }
    : {}),
};

export default nextConfig;
