import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/json-ld";
import "../globals.css";

const BASE_URL = "https://gvce.exchange";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: "GVCE — Global Verified Commodities Exchange",
      template: "%s | GVCE",
    },
    description:
      "Premier international B2B commodities brokerage platform connecting verified buyers and suppliers across energy, fertilizers, petrochemicals, metals, and agricultural goods.",
    keywords: [
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
    ],
    authors: [{ name: "GVCE Clearing & Governance Desk" }],
    creator: "GVCE Global Verified Commodities Exchange",
    publisher: "GVCE International AG",
    applicationName: "GVCE Platform",
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
    openGraph: {
      type: "website",
      locale: locale === "ar" ? "ar_AE" : locale === "fr" ? "fr_CH" : "en_US",
      url: `${BASE_URL}/${locale}`,
      siteName: "GVCE — Global Verified Commodities Exchange",
      title: "GVCE — Global Verified Commodities Exchange",
      description:
        "Secure international B2B commodities brokerage connecting verified buyers and suppliers with audited compliance and supervised deal rooms.",
      images: [
        {
          url: `${BASE_URL}/og-preview.png`,
          width: 1200,
          height: 630,
          alt: "GVCE Global Verified Commodities Exchange",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "GVCE — Global Verified Commodities Exchange",
      description:
        "Institutional B2B commodity brokerage platform connecting verified trading entities across 7 primary physical sectors.",
      creator: "@gvce_exchange",
      images: [`${BASE_URL}/og-preview.png`],
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
    other: {
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
    <html lang={locale} dir={dir} className="dark">
      <head>
        <JsonLd locale={locale} />
      </head>
      <body className="bg-[#07080c] text-[#f8fafc] antialiased min-h-screen selection:bg-[#b87333] selection:text-white">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
