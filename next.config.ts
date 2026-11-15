import type {NextConfig} from 'next';
import {REMOVED_PRODUCTS} from './lib/removed-products';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return Object.entries(REMOVED_PRODUCTS).flatMap(([from, to]) => [
      {source: `/shop/${from}`, destination: `/shop/${to}`, permanent: true},
      {source: `/:locale(fr|nl|it|es|pt)/shop/${from}`, destination: `/:locale/shop/${to}`, permanent: true}
    ]);
  },
  // Security headers for every page. The site loads nothing from third parties (fonts are self-hosted, images are local), so the policy stays on 'self'.
  // 'unsafe-inline' is needed for the inline bootstrap scripts and styles Next.js emits without a nonce.
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      'upgrade-insecure-requests'
    ].join('; ');
    return [
      {
        source: '/:path*',
        headers: [
          {key: 'Content-Security-Policy', value: csp},
          {key: 'X-Content-Type-Options', value: 'nosniff'},
          {key: 'X-Frame-Options', value: 'SAMEORIGIN'},
          {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
          {key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()'},
          {key: 'Strict-Transport-Security', value: 'max-age=63072000'}
        ]
      },
      {
        // API discovery for agents (RFC 9727 api-catalog and the OpenAPI description) on the home page of every language
        source: '/',
        headers: [{key: 'Link', value: '</.well-known/api-catalog>; rel="api-catalog", </.well-known/ard.json>; rel="ard", </openapi.json>; rel="service-desc"; type="application/json", </llms.txt>; rel="describedby"; type="text/plain"'}]
      }
    ];
  },
  async rewrites() {
    return [
      {source: '/openapi.json', destination: '/api/openapi.json'},
      {source: '/.well-known/openapi.json', destination: '/api/openapi.json'}
    ];
  },
  output: 'standalone',
  transpilePackages: ['motion'],
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify—file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
