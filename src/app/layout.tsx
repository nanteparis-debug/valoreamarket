import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://valoreamarket.com"),
  title: "VALOREA MARKET — Global Verified Commodities Exchange",
  description:
    "Premier international B2B commodities brokerage platform connecting verified buyers and suppliers across energy, fertilizers, petrochemicals, metals, and agricultural goods.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "VALOREA MARKET — Global Verified Commodities Exchange",
    description:
      "Premier international B2B commodities brokerage platform connecting verified buyers and suppliers across energy, fertilizers, petrochemicals, metals, and agricultural goods.",
    url: "https://valoreamarket.com",
    siteName: "VALOREA MARKET",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "VALOREA MARKET Icon",
        type: "image/png",
      },
      {
        url: "/og-preview.png",
        width: 1200,
        height: 630,
        alt: "VALOREA MARKET Global Verified Commodities Exchange",
        type: "image/png",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VALOREA MARKET — Global Verified Commodities Exchange",
    description:
      "Premier international B2B commodities brokerage platform connecting verified buyers and suppliers.",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
