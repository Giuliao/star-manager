/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['next-mdx-remote'],
  serverExternalPackages: ['sanitize-html']
};

export default nextConfig;
