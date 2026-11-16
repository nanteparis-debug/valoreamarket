import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/json-ld";
import { ThemeProvider } from "@/components/theme-provider";
import { FloatingThemeToggle } from "@/components/floating-theme-toggle";
import "../globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://valoreamarket.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07080c" },
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  let baseUrl = BASE_URL;
  try {
    const headerList = await headers();
    const host = headerList.get("x-forwarded-host") || headerList.get("host");
    const proto = headerList.get("x-forwarded-proto") || "https";
    if (host) {
      baseUrl = `${proto}://${host}`;
    }
  } catch {}

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default:
        locale === "ar"
          ? "VALOREA MARKET — البورصة العالمية المعتمدة للسلع"
          : "VALOREA MARKET — Global Verified Commodities Exchange",
      template: "%s | VALOREA MARKET",
    },
    description:
      locale === "ar"
        ? "منصة الوساطة المؤسسية الدولية الرائدة لتداول السلع المادية وربط المشترين والموردين المعتمدين في قطاعات الطاقة والأسمدة والبتروكيماويات والمعادن."
        : "Premier international B2B commodities brokerage platform connecting verified buyers and suppliers across energy, fertilizers, petrochemicals, metals, and agricultural goods.",
    keywords: [
      "VALOREA MARKET",
      "Commodities Exchange",
      "B2B Commodity Brokerage",
      "Crude Oil Trading",
      "Ultra Low Sulfur Diesel EN590",
      "Granular Urea 46",
      "Copper Cathodes",
      "Incoterms 2020",
      "Verified Suppliers",
      "Commodity Deal Rooms",
      "KYC KYB Sanctions Screening",
      "بورصة السلع العالمية",
      "وساطة النفط والغاز",
      "تداول الأسمدة والمعادن",
      "فالوريا ماركت",
    ],
    authors: [{ name: "VALOREA MARKET Clearing & Governance Desk" }],
    creator: "VALOREA MARKET",
    publisher: "VALOREA MARKET International AG",
    applicationName: "VALOREA MARKET",
    category: "Finance & Commodities Trading",
    classification: "Institutional B2B Commodity Brokerage",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ar: "/ar",
        fr: "/fr",
        es: "/es",
        "zh-Hans": "/zh-Hans",
        ja: "/ja",
        de: "/de",
        ru: "/ru",
        "x-default": "/en",
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon-dark.png", type: "image/png", media: "(prefers-color-scheme: dark)" },
        { url: "/icon-light.png", type: "image/png", media: "(prefers-color-scheme: light)" },
        { url: "/icon.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [
        { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
      shortcut: ["/favicon.ico"],
    },
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_AE" : locale === "fr" ? "fr_CH" : "en_US",
      url: `${baseUrl}/${locale}`,
      siteName: "VALOREA MARKET",
      title:
        locale === "ar"
          ? "VALOREA MARKET — البورصة العالمية المعتمدة للسلع"
          : "VALOREA MARKET — Global Verified Commodities Exchange",
      description:
        locale === "ar"
          ? "منصة وساطة دولية آمنة للسلع المادية تربط بين المشترين والموردين المعتمدين بغرف صفقات مشفرة وتدقيق مصرفي."
          : "Secure international B2B commodities brokerage connecting verified buyers and suppliers with audited compliance and supervised deal rooms.",
      images: [
        {
          url: `${baseUrl}/icon.png`,
          width: 512,
          height: 512,
          alt: "VALOREA MARKET Platform Icon",
          type: "image/png",
        },
        {
          url: `${baseUrl}/og-preview.png`,
          width: 1200,
          height: 630,
          alt: "VALOREA MARKET Global Verified Commodities Exchange",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title:
        locale === "ar"
          ? "VALOREA MARKET — البورصة العالمية المعتمدة للسلع"
          : "VALOREA MARKET — Global Verified Commodities Exchange",
      description:
        locale === "ar"
          ? "منصة وساطة دولية آمنة للسلع المادية بين الشركات عبر 7 قطاعات رئيسية."
          : "Institutional B2B commodity brokerage platform connecting verified trading entities across 7 primary physical sectors.",
      creator: "@valorea_market",
      images: [`${baseUrl}/icon.png`, `${baseUrl}/og-preview.png`],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
    other: {
      image_src: `${baseUrl}/icon.png`,
      thumbnail: `${baseUrl}/icon.png`,
      "geo.region": "CH-GE",
      "geo.placename": "Geneva",
      "geo.position": "46.2044;6.1432",
      ICBM: "46.2044, 6.1432",
      "format-detection": "telephone=no",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className="dark" suppressHydrationWarning>
      <head>
        <JsonLd locale={locale} />
        <link rel="image_src" href="/icon.png" />
        <meta name="thumbnail" content="/icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('valorea_theme');
                const cookieMatch = document.cookie.match(/valorea_theme=([^;]+)/);
                const theme = stored || (cookieMatch ? cookieMatch[1] : 'dark');
                document.documentElement.classList.remove('dark', 'light');
                document.documentElement.classList.add(theme);
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-[#07080c] text-white dark:text-[#f8fafc] antialiased min-h-screen transition-colors duration-300">
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
            <FloatingThemeToggle locale={locale} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
