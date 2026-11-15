import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://valoreamarket.com";

export default function robots(): MetadataRoute.Robots {
  const commonDisallows = [
    "/*/broker*",
    "/*/compliance*",
    "/*/billing*",
    "/*/deals*",
    "/*/settings*",
    "/*/admin*",
    "/api/*",
    "/_next/*",
  ];

  const commonAllows = [
    "/",
    "/llms.txt",
    "/llms-full.txt",
    "/*/catalog*",
    "/*/about*",
    "/*/contact*",
    "/*/faq*",
    "/*/legal/*",
    "/*/auth/*",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: commonAllows,
        disallow: commonDisallows,
      },
      // AI Search Discovery & Retrieval Bots
      {
        userAgent: [
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "Claude-SearchBot",
          "ClaudeBot",
          "GPTBot",
          "Google-Extended",
          "Bingbot",
          "Applebot",
        ],
        allow: commonAllows,
        disallow: commonDisallows,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
