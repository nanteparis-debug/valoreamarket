/**
 * VALOREA MARKET - Single Source of Truth for Platform Pricing & Brokerage Structure
 * Governs Landing Page (#pricing), Billing Portal (/billing), and Billing API (/api/billing)
 */

export interface PricingPlan {
  id: "starter" | "professional" | "enterprise";
  name: { en: string; ar: string };
  description: { en: string; ar: string };
  priceMonthly: number;
  priceAnnuallyMonthlyEquivalent: number;
  annualBilledTotal: number;
  annualSavingsUsd: number;
  seats: number;
  dealRoomsLimit: number; // -1 for unlimited
  isPopular?: boolean;
  features: {
    en: string[];
    ar: string[];
  };
  cta: {
    en: string;
    ar: string;
    action: "register" | "upgrade" | "contact_sales";
    href?: string;
  };
}

export interface BrokerageCommissionStructure {
  rateMinPercent: number; // 0.5%
  rateMaxPercent: number; // 1.5%
  standardRatePercent: number; // 1.25%
  rateRangeDisplay: string;
  currency: string;
  custodyModel: "non_custodial";
  settlementChannels: string[];
  matureMilestones: {
    en: string[];
    ar: string[];
  };
  liquidatedDamagesMultiplier: number; // 3x in case of circumvention per ICC 769 NCNDA
  liquidatedDamages: string;
  governingModel: string;
  arbitrationJurisdiction: string;
  settlementNoticeTitle: string;
  settlementNoticeDescription: string;
}

export const PLATFORM_PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: {
      en: "Trading Desk Starter",
      ar: "مكتب التداول المبتدئ",
    },
    description: {
      en: "Essential market access for verified buyers and emerging commodity suppliers.",
      ar: "دخول أساسي للسوق للمشترين المعتمدين والموردين الجدد للسلع المادية.",
    },
    priceMonthly: 0,
    priceAnnuallyMonthlyEquivalent: 0,
    annualBilledTotal: 0,
    annualSavingsUsd: 0,
    seats: 1,
    dealRoomsLimit: 1,
    isPopular: false,
    features: {
      en: [
        "1 Verified Corporate Trading Seat",
        "Full Physical Commodity Catalog Access (7 Sectors)",
        "Submit Verified Buy & Sell Requests",
        "1 Active Encrypted Deal Room",
        "Watermarked Redacted Document Viewing",
        "Standard KYC/KYB Screening within 48h",
      ],
      ar: [
        "مقعد تداول مؤسسي معتمد واحد",
        "وصول كامل لكتالوج السلع المادية (7 قطاعات)",
        "تقديم طلبات الشراء وعروض التوريد المعتمدة",
        "غرفة صفقات مشفرة واحدة نشطة",
        "معاينة الوثائق المنقحة بالعلامة المائية",
        "تدقيق KYC/KYB خلال 48 ساعة عمل",
      ],
    },
    cta: {
      en: "Register Free",
      ar: "سجل مجاناً",
      action: "register",
      href: "/auth/register",
    },
  },
  {
    id: "professional",
    name: {
      en: "Institutional Trading Firm",
      ar: "المؤسسات التجارية المعتمدة",
    },
    description: {
      en: "Full operational toolkit for active physical commodity trading houses and refineries.",
      ar: "حزمة تشغيلية متكاملة لبيوت التجارة والمصافي النشطة في تداول السلع المادية.",
    },
    priceMonthly: 499,
    priceAnnuallyMonthlyEquivalent: 399,
    annualBilledTotal: 4788,
    annualSavingsUsd: 1200,
    seats: 5,
    dealRoomsLimit: 5,
    isPopular: true,
    features: {
      en: [
        "Up to 5 Multi-Seat Corporate Accounts",
        "5 Concurrent Encrypted Deal Rooms",
        "Automated PEP & OFAC Sanctions Screening",
        "LiveKit E2EE Video Negotiation Channels",
        "Priority Broker Match Dispatching",
        "Encrypted Document Watermarking & Expiry Controls",
        "Dedicated Swiss & Gulf Brokerage Desk Support",
      ],
      ar: [
        "حتى 5 حسابات تداول فرعية للشركة",
        "5 غرف صفقات مشفرة متزامنة",
        "فحص آلي فوري لقوائم العقوبات الدولية وPEP",
        "قنوات تفاوض فيديو مشفرة E2EE عبر LiveKit",
        "أولوية إرسال وتنسيق المطابقات الذكية",
        "حماية الوثائق بالعلامات المائية والتحكم في الصلاحيات",
        "دعم مباشر من مكاتب الوساطة في جنيف ودبي",
      ],
    },
    cta: {
      en: "Upgrade to Professional",
      ar: "ترقية للمؤسسات",
      action: "upgrade",
      href: "/billing",
    },
  },
  {
    id: "enterprise",
    name: {
      en: "Global Enterprise & Sovereign",
      ar: "الشركات الكبرى والكيانات السيادية",
    },
    description: {
      en: "Custom compliance workflows, unlimited deal capacity, and sovereign trading desks.",
      ar: "سير عمل رقابي مخصص، غرف صفقات غير محدودة، ومكاتب وساطة سيادية مكرسة.",
    },
    priceMonthly: 1999,
    priceAnnuallyMonthlyEquivalent: 1599,
    annualBilledTotal: 19188,
    annualSavingsUsd: 4800,
    seats: 15,
    dealRoomsLimit: -1, // Unlimited
    isPopular: false,
    features: {
      en: [
        "15+ Corporate Seats with Role-Based Access (RBAC)",
        "Unlimited Encrypted Commodity Deal Rooms",
        "Real-Time LiveKit Multilateral Video Conferences",
        "Bespoke Compliance Officer On-Call",
        "Custom Invoicing & Split Commission Mandates",
        "Audited Cryptographic Log Archives (10 Years)",
        "Direct API Integration with ERP / SAP / Bloomberg",
      ],
      ar: [
        "15 مقعداً أو أكثر مع صلاحيات دقيقة حسب الدور",
        "غرف صفقات مشفرة غير محدودة لجميع القطاعات",
        "مؤتمرات فيديو جماعية مشفرة فورية عالية الدقة",
        "مسؤول امتثال مصرفي مكرس لحساب الشركة",
        "فوترة مخصصة واتفاقيات عمولة وساطة مرنة",
        "أرشيف سجلات تدقيق مشفرة وموثقة لمدة 10 سنوات",
        "ربط برمجي مباشر API مع أنظمة ERP و Bloomberg",
      ],
    },
    cta: {
      en: "Upgrade to Enterprise",
      ar: "ترقية لباقة المؤسسات",
      action: "upgrade",
      href: "/billing",
    },
  },
];

export const BROKERAGE_COMMISSION_POLICY: BrokerageCommissionStructure = {
  rateMinPercent: 0.5,
  rateMaxPercent: 1.5,
  standardRatePercent: 1.25,
  rateRangeDisplay: "0.50% - 1.50%",
  currency: "USD",
  custodyModel: "non_custodial",
  settlementChannels: [
    "Irrevocable Documentary Letter of Credit (DLC at Sight)",
    "Standby Letter of Credit (SBLC / MT760)",
    "Confirmed Bank Payment Undertaking (BPU / Bank Guarantee)",
    "Escrow via Top-Tier Swiss or UAE Clearing Bank",
  ],
  matureMilestones: {
    en: [
      "100% Confirmation of Operative Financial Instrument (DLC / SBLC)",
      "Issuance of SGS / Intertek Independent Inspection Certificate at Loading Port",
      "Bill of Lading (B/L) Cargo Title Handover and Customs Clearance",
    ],
    ar: [
      "تأكيد سريان ونفاذ الاعتماد المستندي غير القابل للإلغاء (DLC / SBLC)",
      "صدور شهادة الفحص المخبري المستقل من SGS أو Intertek بميناء الشحن",
      "تسليم بوالص الشحن الرسمية (B/L) واكتمال التخليص الجمركي للشحنة",
    ],
  },
  liquidatedDamagesMultiplier: 3, // ICC Model 769 Liquidated Damages
  liquidatedDamages: "3x total anticipated brokerage commission (ICC 769)",
  governingModel: "ICC Model Contract 769 (NCNDA)",
  arbitrationJurisdiction: "Swiss Arbitration Centre, Geneva",
  settlementNoticeTitle: "Non-Custodial Physical Commodity Settlement Notice",
  settlementNoticeDescription: "VALOREA MARKET does not hold or clear purchase funds for physical commodity shipments. Cargo value is settled directly bank-to-bank via Documentary Letters of Credit (DLC / SBLC). The platform invoices only for membership access and success-based transaction brokerage fees.",
};

export const SALES_CONTACT_EMAIL = "contact@valoreamarket.com";

