/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode : true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qtumgzsrnbhtigfxhfzt.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
