import React from "react";

interface JsonLdProps {
  locale: string;
}

export function JsonLd({ locale }: JsonLdProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://valoreamarket.com";

  const isArabic = locale === "ar";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "VALOREA MARKET",
    legalName: "VALOREA MARKET International AG",
    alternateName: ["VALOREA MARKET", "Valorea Market", "فالوريا ماركت", "بورصة فالوريا العالمية للسلع"],
    url: baseUrl,
    logo: `${baseUrl}/icon.png`,
    image: `${baseUrl}/og-preview.png`,
    description: isArabic
      ? "المنصة السويسرية المؤسسية الرائدة لتداول السلع المادية بين الشركات (B2B) والوساطة الخاضعة للرقابة، متخصصة في قطاعات الطاقة والأسمدة والمعادن والبتروكيماويات والمنتجات الزراعية."
      : "Premier Swiss-engineered institutional B2B physical commodities brokerage platform connecting verified buyers and suppliers across energy, fertilizers, metals, and agricultural goods.",
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
    knowsAbout: [
      "Commodities Trading",
      "Crude Oil Brokerage",
      "Ultra Low Sulfur Diesel EN590",
      "Granular Urea 46%",
      "Copper Cathodes Grade A",
      "Incoterms 2020",
      "Documentary Letters of Credit DLC",
      "Standby Letters of Credit SBLC",
      "KYC and KYB Sanctions Screening",
      "Non-Circumvention Non-Disclosure Agreements NCNDA",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+41-22-819-9000",
        contactType: "General Inquiries & Customer Support",
        email: "contact@valoreamarket.com",
        availableLanguage: ["English", "Arabic", "French", "German", "Spanish", "Chinese", "Japanese", "Russian"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+41-22-819-9000",
        contactType: "Trading Desk & Brokerage",
        email: "desk@valoreamarket.com",
        availableLanguage: ["English", "Arabic", "French", "German", "Spanish", "Chinese", "Japanese", "Russian"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+41-22-819-9001",
        contactType: "Compliance & KYC Desk",
        email: "compliance@valoreamarket.com",
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
    serviceType: "Physical Commodity Brokerage, Deal Room Escrow & Institutional Matching",
    description: isArabic
      ? "وساطة دولية منظمة ومطابقة صفقات السلع المادية، تدقيق مصرفي صارم، غرف صفقات مشفرة بين الأطراف المعتمدة، وتسوية بالدولار الأمريكي وفق معايير غرفة التجارة الدولية ICC."
      : "Supervised international commodity transaction matching, verifiable KYC/KYB screening, E2EE deal rooms, and USD-benchmarked brokerage fee settlement.",
    currenciesAccepted: "USD",
    paymentAccepted: "Letter of Credit (DLC MT700), Standby Letter of Credit (SBLC MT760), Bank Wire (TT MT103), Bank Escrow via Top-Tier Banks",
    areaServed: "Worldwide",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: isArabic
      ? [
          {
            "@type": "Question",
            name: "ما هي منصة VALOREA MARKET؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "فالوريا ماركت هي بورصة وساطة دولية مؤسسية مسجلة في جنيف بسويسرا، متخصصة في تداول ومطابقة صفقات السلع المادية الضخمة بين المشترين والموردين المعتمدين عالمياً عبر غرف تفاوض مشفرة E2EE وتدقيق مصرفي صارم.",
            },
          },
          {
            "@type": "Question",
            name: "ما هي السلع الرئيسية المتاحة للتداول في المنصة؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "تغطي المنصة 7 قطاعات حيوية: قطاع الطاقة (النفط الخام، ديزل EN590، وقود الطائرات Jet A1)، الأسمدة (اليوريا الحبيبية 46%، NPK، DAP)، المعادن (كاثودات النحاس درجة A، سبائك الألومنيوم، الليثيوم)، البتروكيماويات، والسلع الزراعية (القمح، السكر).",
            },
          },
          {
            "@type": "Question",
            name: "كيف تضمن المنصة مصداقية الأطراف وحماية الصفقات؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "تطبق فالوريا ماركت فحصاً إلزامياً شاملاً لمكافحة غسيل الأموال والتحقق من الهوية المؤسسية (KYC/KYB) وقوائم العقوبات الدولية (OFAC، الاتحاد الأوروبي، سويسرا SECO)، مع توقيع اتفاقيات الحماية وعدم التحايل (NCNDA/IMFPA) بنظام تتبع رقمي غير قابل للتلاعب.",
            },
          },
          {
            "@type": "Question",
            name: "ما هي وسائل الدفع والاعتمادات المصرفية المعتمدة؟",
            acceptedAnswer: {
              "@type": "Answer",
              text: "تتم تسوية الصفقات عبر اعتمادات مستندية مصرفية معززة وغير قابلة للإلغاء (Irrevocable DLC MT700) أو اعتمادات الضمان (SBLC MT760) وحوالات TT MT103 من خلال بنوك دولية من الدرجة الأولى (Top 50 World Banks).",
            },
          },
        ]
      : [
          {
            "@type": "Question",
            name: "What is VALOREA MARKET?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "VALOREA MARKET is a Swiss-engineered institutional commodities brokerage platform headquartered in Geneva, facilitating physical commodity transactions through audited compliance, verifiable bank instruments, and encrypted deal rooms.",
            },
          },
          {
            "@type": "Question",
            name: "Which commodity sectors are traded on the platform?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The exchange supports energy (Crude Oil, Ultra Low Sulfur Diesel EN590, Jet A1), fertilizers (Granular Urea 46%, NPK, DAP), non-ferrous and battery metals (Copper Cathodes Grade A, Aluminium Ingots, Lithium), petrochemicals, and agricultural staples.",
            },
          },
          {
            "@type": "Question",
            name: "How are transactions and counterparties protected?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Counterparties undergo mandatory bilateral KYC/KYB sanctions screening (OFAC, EU, UN, SECO), digital biometric verification, and automated NCNDA/IMFPA anti-circumvention tracking before entering E2EE private deal rooms.",
            },
          },
          {
            "@type": "Question",
            name: "What bank payment instruments are accepted?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Settlements operate strictly through recognized commercial banking channels including Irrevocable Documentary Letters of Credit (DLC MT700), Standby Letters of Credit (SBLC MT760), and Bank Wire (TT MT103) issued by top-tier financial institutions.",
            },
          },
        ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
