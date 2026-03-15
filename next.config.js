/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true
  },
  images: {
    // unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**'
      },
      {
        protocol: 'https',
        hostname: 'www.pexels.com',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dmijwrtws/**'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/password',
        destination: '/',
        permanent: true
      }
    ];
  }
};
