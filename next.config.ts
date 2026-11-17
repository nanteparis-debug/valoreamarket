import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(self), geolocation=(), payment=()",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://valorea-traffic-pilot-wwkr.vercel.app https://*.vercel.app http://127.0.0.1:3000 http://localhost:3000 https://127.0.0.1:3000 https://localhost:3000 https://challenges.cloudflare.com https://assets.lemonsqueezy.com https://*.lemonsqueezy.com https://widget.trustpilot.com https://www.googletagmanager.com https://*.googletagmanager.com https://tagassistant.google.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob: https://valorea-traffic-pilot-wwkr.vercel.app https://*.vercel.app http://127.0.0.1:3000 http://localhost:3000 https://127.0.0.1:3000 https://localhost:3000 https://*.lemonsqueezy.com https://*.trustpilot.com https://www.googletagmanager.com https://*.googletagmanager.com https://*.google-analytics.com",
              "font-src 'self' data:",
              "connect-src 'self' https: wss: ws: https://valorea-traffic-pilot-wwkr.vercel.app https://*.vercel.app http://127.0.0.1:3000 http://localhost:3000 https://127.0.0.1:3000 https://localhost:3000 https://*.lemonsqueezy.com https://*.trustpilot.com https://www.googletagmanager.com https://*.googletagmanager.com https://*.google-analytics.com https://analytics.google.com https://stats.g.doubleclick.net",
              "frame-src 'self' https://challenges.cloudflare.com https://*.lemonsqueezy.com https://app.lemonsqueezy.com https://widget.trustpilot.com https://*.trustpilot.com https://www.googletagmanager.com https://tagassistant.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
