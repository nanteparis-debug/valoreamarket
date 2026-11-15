import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://valoreamarket.com";
const LOCALES = ["en", "ar", "fr", "es", "zh-Hans", "ja", "de", "ru"];

const PUBLIC_PATHS = [
  { path: "", priority: 1.0, changeFrequency: "daily" as const },
  { path: "catalog", priority: 0.9, changeFrequency: "hourly" as const },
  { path: "about", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "faq", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "contact", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "legal/terms", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "legal/privacy", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "legal/cookies", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "legal/ncnda", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "legal/brokerage", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "auth/signin", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "auth/register", priority: 0.6, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const item of PUBLIC_PATHS) {
    for (const locale of LOCALES) {
      const url = item.path ? `${BASE_URL}/${locale}/${item.path}` : `${BASE_URL}/${locale}`;
      
      const languages: Record<string, string> = {};
      for (const altLocale of LOCALES) {
        languages[altLocale] = item.path
          ? `${BASE_URL}/${altLocale}/${item.path}`
          : `${BASE_URL}/${altLocale}`;
      }
      languages["x-default"] = item.path ? `${BASE_URL}/en/${item.path}` : `${BASE_URL}/en`;

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: item.changeFrequency,
        priority: item.priority,
        alternates: {
          languages,
        },
      });
    }
  }

  return entries;
}
