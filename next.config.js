const withPWAInit = require('@ducanh2912/next-pwa').default;

const withPWA = withPWAInit({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true
  }
});

const nextConfig = {
  reactStrictMode: true,
  // Remove or comment out distDir: "build"
  // distDir: "build",
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    REACT_APP_IMAGES_PATH: '/assets/images',
    NEXTAUTH_SECRET: 'YjByKC1BpoOaRVEgu4kdL98YErK7oA+2tRMaw+x0ino=',
    NEXT_PUBLIC_GOOGLE_MAP_API: 'AIzaSyCJM0a8oSaRMwxthozENQg1euRI51aNXJQ',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en-US/dashboard',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/manifest.json',
        destination: '/api/manifest?lang=en-US', // Adjust to match PWA manifest generation
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = withPWA(nextConfig);