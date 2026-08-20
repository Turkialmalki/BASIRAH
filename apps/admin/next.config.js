/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@basirah/content-schema", "@basirah/database"],
  // Silence "multiple lockfiles" inference — /Users/turki/package-lock.json
  // is an unrelated file in the home directory, not part of this monorepo.
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;
