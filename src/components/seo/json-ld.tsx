import React from "react";

interface JsonLdProps {
  locale: string;
}

export function JsonLd({ locale }: JsonLdProps) {
  const baseUrl = "https://gvce.exchange";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "VALOREA MARKET — Global Verified Commodities Exchange",
    alternateName: ["VALOREA MARKET", "Valorea Market", "فالوريا ماركت"],
    url: baseUrl,
    logo: `${baseUrl}/images/valorea-logo.png`,
    description:
      "Premier international B2B commodities brokerage platform connecting verified buyers and suppliers across energy, fertilizers, metals, and agricultural goods.",
    sameAs: [
      "https://www.linkedin.com/company/valorea-market",
      "https://twitter.com/valorea_market",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rue du Rhône 42",
      addressLocality: "Geneva",
      postalCode: "1204",
      addressCountry: "CH",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+41-22-819-9000",
        contactType: "Trading Desk & Brokerage",
        email: "desk@valorea.exchange",
        availableLanguage: ["English", "Arabic", "French", "German", "Spanish", "Chinese", "Japanese", "Russian"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+41-22-819-9001",
        contactType: "Compliance & KYC",
        email: "compliance@valorea.exchange",
      },
    ],
  };

  const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "VALOREA MARKET",
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    inLanguage: ["en", "ar", "fr", "es", "zh-Hans", "ja", "de", "ru"],
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/${locale}/catalog?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const financialServiceSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "@id": `${baseUrl}/#brokerage`,
    name: "VALOREA MARKET Supervised Commodity Brokerage",
    provider: {
      "@id": `${baseUrl}/#organization`,
    },
    serviceType: "Physical Commodity Brokerage & Supervised Trading",
    description:
      "Supervised international commodity transaction matching, verifiable KYC/KYB screening, E2EE deal rooms, and USD-benchmarked brokerage fee settlement.",
    currenciesAccepted: "USD",
    paymentAccepted: "Letter of Credit (LC), Bank Wire (TT), Escrow via Commercial Banking Channels",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(financialServiceSchema) }}
      />
    </>
  );
}
