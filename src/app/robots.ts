import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/*/catalog",
          "/*/about",
          "/*/contact",
          "/*/faq",
          "/*/legal/*",
          "/*/auth/*",
        ],
        disallow: [
          "/*/broker*",
          "/*/compliance*",
          "/*/billing*",
          "/*/deals*",
          "/*/settings*",
          "/api/*",
          "/_next/*",
        ],
      },
    ],
    sitemap: "https://valoreamarket.vercel.app/sitemap.xml",
    host: "https://valoreamarket.vercel.app",
  };
}
