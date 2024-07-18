import withSerwistInit from "@serwist/next";
const revision = "v1.0.0"
import { codeInspectorPlugin } from 'code-inspector-plugin'
const withSerwist = withSerwistInit({
  cacheOnNavigation: true,
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries: [{ url: "/~offline", revision }],
});
const basePath = process.env.BASE_URL || '';
const OSSPaths = process.env.OSS_URLs || '';
const remotePatterns = OSSPaths.split(',').map((hostname) => {
  return {
    protocol:"https",
    hostname,
    port:"",
    pathname: '**'
  }
});

/** @type {import('next').NextConfig} */
const nextConfig ={
  output: "standalone",
  reactStrictMode:false,
  images: {
    remotePatterns
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/api/:path*',
          destination: `${basePath}/api/:path*`,
        },
      ],
    }
  },
  webpack: (config) => {
    config.plugins.push(codeInspectorPlugin({ bundler: 'webpack' }));
    return config;
  },
}
// export default withSerwist(nextConfig);
export default nextConfig

