import withPWAInit from '@ducanh2912/next-pwa'

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

const nextConfig = {
  reactStrictMode: true,
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

export default withPWA(nextConfig);
