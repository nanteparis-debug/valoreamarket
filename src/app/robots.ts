import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/*/catalog",
          "/*/broker",
          "/*/compliance",
          "/*/billing",
          "/*/about",
          "/*/contact",
          "/*/faq",
          "/*/legal/*",
          "/*/auth/*",
        ],
        disallow: [
          "/*/deals/*/room",
          "/*/deals/new",
          "/*/settings/*",
          "/api/*",
          "/_next/*",
        ],
      },
    ],
    sitemap: "https://gvce.exchange/sitemap.xml",
    host: "https://gvce.exchange",
  };
}
