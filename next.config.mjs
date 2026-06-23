/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: '/p/:id',
        destination: '/s/:id',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/pastes/:path*',
        destination: '/api/snippets/:path*',
      },
    ];
  },
};

export default nextConfig;
