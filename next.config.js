/** @type {import('next').NextConfig} */

module.exports = {
  env: {
    REACT_APP_IMAGES_PATH: '/assets/images',
    NEXTAUTH_SECRET: 'Wxh7ucB6n1ZpL2uSInvk/5Hl5WzgFFuPBhVfy0x6DG0U=',
    NEXT_PUBLIC_GOOGLE_MAP_API: 'AIzaSyCJM0a8oSaRMwxthozENQg1euRI51aNXJQ',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/en-US/dashboards/misc',
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
