import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@portal-sekolah/api-client',
    '@portal-sekolah/auth',
    '@portal-sekolah/config',
    '@portal-sekolah/constants',
    '@portal-sekolah/socket-client',
    '@portal-sekolah/types',
    '@portal-sekolah/utils',
    '@portal-sekolah/ui',
  ],
  reactStrictMode: true,
};

export default nextConfig;
