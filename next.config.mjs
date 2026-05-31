/** @type {import('next').NextConfig} */
const posthogHost =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const posthogAssetHost =
  process.env.NEXT_PUBLIC_POSTHOG_ASSET_HOST ||
  posthogHost
    .replace("://us.i.posthog.com", "://us-assets.i.posthog.com")
    .replace("://eu.i.posthog.com", "://eu-assets.i.posthog.com");

const nextConfig = {
  transpilePackages: ["next-mdx-remote"],
  serverExternalPackages: ["sanitize-html"],
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: `${posthogAssetHost}/static/:path*`,
      },
      {
        source: "/ingest/array/:path*",
        destination: `${posthogAssetHost}/array/:path*`,
      },
      {
        source: "/ingest/:path*",
        destination: `${posthogHost}/:path*`,
      },
    ];
  },
};

export default nextConfig;
