"use client";

import React, { useState, useTransition, useEffect, Suspense } from "react";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { getSubpageTranslations } from "@/lib/i18n-subpages";
import {
  COMMODITY_SECTORS,
  INCOTERMS,
  getSectorTitle,
  getCommodityItemName,
} from "@/lib/constants";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Info,
  ShieldCheck,
  Building2,
  FileCheck2,
  Lock,
  ShieldAlert,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { BROKERAGE_COMMISSION_POLICY } from "@/lib/pricing-data";

// Sector-specific specification schema definitions
const SECTOR_SPEC_CONFIG: Record<
  string,
  {
    spec1: { labelAr: string; labelEn: string; placeholderAr: string; placeholderEn: string };
    spec2: { labelAr: string; labelEn: string; placeholderAr: string; placeholderEn: string };
    spec3: { labelAr: string; labelEn: string; placeholderAr: string; placeholderEn: string };
  }
> = {
  crude_oil_condensates: {
    spec1: { labelAr: "كثافة API (درجة)", labelEn: "API Gravity (°)", placeholderAr: "مثال: 38.5° API (خفيف حلو)", placeholderEn: "e.g. 38.5° API" },
    spec2: { labelAr: "نسبة الكبريت (% بالوزن)", labelEn: "Sulfur Content (% wt)", placeholderAr: "مثال: 0.45% S كحد أقصى", placeholderEn: "e.g. 0.45% Max S" },
    spec3: { labelAr: "الرواسب والمياه (BS&W / TAN)", labelEn: "Water & Sediment (BS&W)", placeholderAr: "مثال: أقل من 0.5% BS&W", placeholderEn: "e.g. < 0.5% BS&W" },
  },
  refined_petroleum: {
    spec1: { labelAr: "مؤشر السيتان / الأوكتان", labelEn: "Cetane / Octane Rating", placeholderAr: "مثال: 51 Cetane Index", placeholderEn: "e.g. 51 Cetane / RON 95" },
    spec2: { labelAr: "محتوى الكبريت (PPM)", labelEn: "Sulfur Content (PPM)", placeholderAr: "مثال: 10 PPM كحد أقصى (Euro 5/6)", placeholderEn: "e.g. 10 PPM Max (Euro 5/6)" },
    spec3: { labelAr: "نقطة الوميض وتدفق البرودة", labelEn: "Flash Point / Cold Filter", placeholderAr: "مثال: أدنى 55°C / CFPP -10°C", placeholderEn: "e.g. Min 55°C / CFPP -10°C" },
  },
  natural_gas_ngls: {
    spec1: { labelAr: "نسبة الميثان (% C1)", labelEn: "Methane Content (% C1)", placeholderAr: "مثال: 95.0% ميثان أدنى", placeholderEn: "e.g. 95%+ Methane" },
    spec2: { labelAr: "القيمة الحرارية الإجمالية (GCV)", labelEn: "Gross Calorific Value", placeholderAr: "مثال: 1050 BTU/scf", placeholderEn: "e.g. 1050 BTU/scf" },
    spec3: { labelAr: "نسبة النيتروجين والشوائب", labelEn: "Nitrogen & Inert Gases", placeholderAr: "مثال: N2 أقل من 1.0%", placeholderEn: "e.g. Max 1.0% N2" },
  },
  petrochemicals: {
    spec1: { labelAr: "درجة النقاوة (% نقاء)", labelEn: "Chemical Purity (% wt)", placeholderAr: "مثال: 99.85% نقاوة كيميائية", placeholderEn: "e.g. 99.85% Min" },
    spec2: { labelAr: "مؤشر تدفق الذوبان (MFI)", labelEn: "Melt Flow Index (MFI)", placeholderAr: "مثال: 0.05 - 20 g/10min", placeholderEn: "e.g. MFI 0.05-20" },
    spec3: { labelAr: "معيار الجودة واللون", labelEn: "Color & Testing Standard", placeholderAr: "مثال: ASTM D1152 / Pt-Co 10 Max", placeholderEn: "e.g. ASTM D1152 / Pt-Co 10" },
  },
  sulfur_fertilizers: {
    spec1: { labelAr: "محتوى النيتروجين / الكبريت", labelEn: "Nitrogen / Sulfur (% Min)", placeholderAr: "مثال: 46.0% N لليوريا / 99.5% للكبريت", placeholderEn: "e.g. 46.0% N / 99.5% S" },
    spec2: { labelAr: "نسبة البيوريت والشوائب", labelEn: "Biuret / Impurities (% Max)", placeholderAr: "مثال: أقصى 1.0% بيوريت", placeholderEn: "e.g. Max 1.0% Biuret" },
    spec3: { labelAr: "الرطوبة وحجم الحبيبات", labelEn: "Moisture & Granulometry", placeholderAr: "مثال: رطوبة 0.5% / حبيبات 2-4 مم (90%)", placeholderEn: "e.g. 2-4 mm 90% Min" },
  },
  metals_industrial: {
    spec1: { labelAr: "درجة النقاوة ومعيار LME", labelEn: "Purity Grade (LME Standard)", placeholderAr: "مثال: 99.9935% Cu / SHG 99.995% Zn", placeholderEn: "e.g. 99.9935% Cu / 99.995% Zn" },
    spec2: { labelAr: "الشكل والأبعاد الفيزيائية", labelEn: "Form & Physical Dimensions", placeholderAr: "مثال: كاثودات / بليت بثق 6063 / بليت صلب", placeholderEn: "e.g. Cathodes / 6063 Billets" },
    spec3: { labelAr: "جهة المعاينة المستقلة", labelEn: "Independent Inspection Agency", placeholderAr: "مثال: شهادة SGS أو Alex Stewart معتمدة", placeholderEn: "e.g. SGS / Alex Stewart Certified" },
  },
  sugar: {
    spec1: { labelAr: "تصنيف اللون (ICUMSA)", labelEn: "ICUMSA Color Rating", placeholderAr: "مثال: ICUMSA 45 (مكرر) أو VHP 600-1200", placeholderEn: "e.g. ICUMSA 45 / VHP 600-1200" },
    spec2: { labelAr: "درجة الاستقطاب (% Pol)", labelEn: "Polarization (°Z / % Pol)", placeholderAr: "مثال: 99.80° أدنى للسكر المكرر", placeholderEn: "e.g. Min 99.80° S" },
    spec3: { labelAr: "نسبة الرطوبة والرماد", labelEn: "Moisture & Ash Content", placeholderAr: "مثال: أقصى 0.04% رطوبة ورماد", placeholderEn: "e.g. Max 0.04% Moisture" },
  },
};

function NewDealForm({ locale }: { locale: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const t = getSubpageTranslations(locale);
  const isAr = locale === "ar";
  const isFr = locale === "fr";

  // Read URL query parameters (?side=sell&sector=crude_oil_condensates&commodity=...)
  const sideParam = searchParams.get("side");
  const sectorParam = searchParams.get("sector");
  const commodityParam = searchParams.get("commodity") || searchParams.get("item");

  // Determine initial side from URL
  const initialSide: "buy" | "sell" = sideParam === "sell" ? "sell" : "buy";

  // Determine initial sector from URL (supports ID or slug)
  const matchedSector =
    COMMODITY_SECTORS.find(
      (s) => s.id === sectorParam || s.slug === sectorParam
    ) || COMMODITY_SECTORS[0];

  // Determine initial commodity from URL
  const initialCommodity =
    (commodityParam &&
      matchedSector.items.find(
        (item) =>
          item.name.toLowerCase() === commodityParam.toLowerCase() ||
          item.name.toLowerCase().includes(commodityParam.toLowerCase())
      )?.name) ||
    matchedSector.items[0].name;

  // Form State
  const [side, setSide] = useState<"buy" | "sell">(initialSide);
  const [sectorId, setSectorId] = useState(matchedSector.id);
  const [commodityName, setCommodityName] = useState(initialCommodity);
  const [quantity, setQuantity] = useState<number | "">("");
  const [unit, setUnit] = useState("Metric Tons");
  const [pricePerUnit, setPricePerUnit] = useState<number | "">("");
  const [incoterm, setIncoterm] = useState("CIF");
  const [deliveryPort, setDeliveryPort] = useState("");
  const [deliveryDateRange, setDeliveryDateRange] = useState("");

  // Material-specific specs (clean, dynamic)
  const [spec1, setSpec1] = useState("");
  const [spec2, setSpec2] = useState("");
  const [spec3, setSpec3] = useState("");

  // Session idempotency key
  const [idempotencyKey] = useState(() => `mut_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`);
  const [submitted, setSubmitted] = useState(false);
  const [createdDealRef, setCreatedDealRef] = useState<string>("");
  const [calculatedCommission, setCalculatedCommission] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Regulatory Session & KYC/KYB Compliance State
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: string;
    orgId: string;
    orgName: string;
    isVerified: boolean;
    kybStatus: "approved" | "pending_review" | "incomplete" | "rejected";
  } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchSession = async () => {
    try {
      setAuthLoading(true);
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error("Session check error", err);
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const handleSwitchPersona = async (personaRole: string) => {
    try {
      setAuthLoading(true);
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: personaRole }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        setErrorMessage("");
      }
    } catch (err) {
      console.error("Failed to switch persona", err);
    } finally {
      setAuthLoading(false);
    }
  };

  const isKybApproved = Boolean(
    currentUser && currentUser.isVerified && currentUser.kybStatus === "approved"
  );
  const kybStatus = currentUser ? currentUser.kybStatus : "unauthenticated";
  const orgName = currentUser?.orgName || "";

  // Sync state if URL query params change dynamically
  useEffect(() => {
    if (sideParam === "sell" || sideParam === "buy") {
      setSide(sideParam);
    }
    if (sectorParam) {
      const found = COMMODITY_SECTORS.find((s) => s.id === sectorParam || s.slug === sectorParam);
      if (found) {
        setSectorId(found.id);
        if (commodityParam) {
          const matchItem = found.items.find(
            (i) => i.name.toLowerCase() === commodityParam.toLowerCase() || i.name.toLowerCase().includes(commodityParam.toLowerCase())
          );
          if (matchItem) setCommodityName(matchItem.name);
          else setCommodityName(found.items[0].name);
        } else {
          setCommodityName(found.items[0].name);
        }
      }
    }
  }, [sideParam, sectorParam, commodityParam]);

  const currentSector =
    COMMODITY_SECTORS.find((s) => s.id === sectorId) || COMMODITY_SECTORS[0];

  const currentSpecConfig =
    SECTOR_SPEC_CONFIG[sectorId] || SECTOR_SPEC_CONFIG.crude_oil_condensates;

  const currentCommodityItem =
    currentSector.items.find((item) => item.name === commodityName) ||
    currentSector.items[0];

  const numericQuantity = typeof quantity === "number" ? quantity : 0;
  const numericPrice = typeof pricePerUnit === "number" ? pricePerUnit : 0;
  const totalContractValue = numericQuantity * numericPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Institutional KYC/KYB Check Guard
    if (!isKybApproved) {
      setErrorMessage(
        isAr
          ? "قيد تنظيمي إلزامي: لا يمكن لأي من المشتري أو البائع وضع إعلانهما أو تسجيل أي عملية سلع مادية داخل المنصة إلا عند اكتمال التحقق الكامل منهما (KYC / KYB) واعتماد ملف المنشأة رسمياً من إدارة الامتثال."
          : "Mandatory Regulatory Restriction: Neither buyers nor suppliers may publish listings or register deals until full institutional KYC/KYB verification is approved by compliance."
      );
      return;
    }

    if (!numericQuantity || numericQuantity <= 0) {
      setErrorMessage(isAr ? "يرجى تحديد كمية صالحة أكبر من الصفر" : "Please provide a valid quantity greater than zero");
      return;
    }
    if (!numericPrice || numericPrice <= 0) {
      setErrorMessage(isAr ? "يرجى تحديد سعر وحدة صالح أكبر من الصفر" : "Please provide a valid unit price greater than zero");
      return;
    }
    if (!deliveryPort.trim()) {
      setErrorMessage(isAr ? "يرجى تحديد ميناء أو محطة التسليم المعتمدة" : "Please specify the designated delivery port or terminal");
      return;
    }
    if (!deliveryDateRange.trim()) {
      setErrorMessage(isAr ? "يرجى تحديد نافذة أو فترة التسليم التعاقدية" : "Please provide a valid contractual delivery window");
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/deals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            idempotencyKey,
            sector: sectorId,
            commodityName,
            side,
            quantity: numericQuantity,
            unit,
            pricePerUnit: numericPrice,
            currency: "USD",
            incoterm,
            deliveryPort: deliveryPort.trim(),
            deliveryDateRange: deliveryDateRange.trim(),
            specs: {
              [currentSpecConfig.spec1.labelEn]: spec1 || currentCommodityItem.specs.split(",")[0] || "Standard Grade",
              [currentSpecConfig.spec2.labelEn]: spec2 || currentCommodityItem.specs.split(",")[1] || "Standard Tolerance",
              [currentSpecConfig.spec3.labelEn]: spec3 || "SGS / Independent Inspection Certified",
            },
          }),
        });

        const data = await res.json();
        if (data.success && data.deal) {
          setCreatedDealRef(data.deal.referenceNumber || "VALOREA-2026-REG");
          setCalculatedCommission(data.estimatedCommissionUsd || totalContractValue * 0.0125);
          setSubmitted(true);
        } else {
          const detail =
            (isAr ? data.messageAr : data.message) ||
            data.message ||
            data.error ||
            (isAr ? "فشل تسجيل العملية" : "Submission failed");
          setErrorMessage(detail);
        }
      } catch (err: any) {
        console.error("Submission failed", err);
        setErrorMessage(err.message || (isAr ? "حدث خطأ في الاتصال بالخادم" : "Network or server error"));
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-[#f8fafc] flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-[#1f2233] bg-[#0c0e17]/80 backdrop-blur-md py-4 px-4 sm:px-8 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t.common.backHome}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#b87333] animate-pulse" />
          <span className="text-xs font-mono text-gray-300">
            {t.common.verifiedBrokerage}
          </span>
        </div>
      </header>

      {/* Main Wizard Form Container */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-10">
        {submitted ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0e101a] border border-[#23273b] shadow-2xl text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {side === "sell"
                ? (isAr ? "تم تسجيل عرض التوريد بنجاح!" : "Supply Offer Successfully Registered!")
                : (isAr ? "تم تسجيل طلب الشراء بنجاح!" : "Purchase Request Successfully Registered!")}
            </h2>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141724] border border-[#b87333]/40 text-xs font-mono text-[#d4956b]">
              <span>{isAr ? "رقم القيد المرجعي:" : "Clearing Ref:"}</span>
              <strong className="text-white">{createdDealRef}</strong>
            </div>

            <p className="mt-4 text-sm text-gray-300 max-w-lg">
              {isAr
                ? "تم تسجيل عرضك في محرك المقاصة المركزي لـ VALOREA MARKET. سيبدأ الوسيط المعتمد فوراً مراجعة شروط التسليم ومطابقة الشركاء المؤهلين."
                : "Your order is recorded in the VALOREA MARKET clearing engine. A verified broker will match qualified counterparties."}
            </p>

            {/* Estimated Settlement & Commission Details */}
            <div className="mt-6 w-full max-w-md p-4 rounded-2xl bg-[#121420] border border-[#23273b] text-xs space-y-2 text-start">
              <div className="flex justify-between items-center text-gray-400">
                <span>{isAr ? "إجمالي القيمة التعاقدية التقديرية:" : "Total Contract Value:"}</span>
                <span className="font-mono font-bold text-white">{formatCurrency(totalContractValue, "USD", locale)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>{isAr ? "عمولة الوساطة غير الإيداعية (1.25%):" : "Brokerage Success Fee (1.25%):"}</span>
                <span className="font-mono text-[#d4956b]">{formatCurrency(calculatedCommission, "USD", locale)}</span>
              </div>
              <div className="pt-2 border-t border-[#1f2233] text-[11px] text-gray-500">
                {isAr
                  ? "تسوية قيمة الشحنة تتم مباشرة بين البنوك عبر اعتماد مستندي (DLC / SBLC). تُفوتر عمولة الوساطة بشكل مستقل عند إتمام الشحن."
                  : "Cargo settlement is strictly bank-to-bank via documentary LC. Brokerage fee is invoiced independently upon bill of lading issuance."}
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push(`/deals/deal-en590-rotterdam/room`)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white font-semibold text-sm shadow-lg shadow-[#b87333]/20 flex items-center justify-center gap-2"
              >
                <span>{isAr ? "معاينة غرفة الصفقة التوضيحية" : "Enter Interactive Deal Room"}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setQuantity("");
                  setPricePerUnit("");
                  setDeliveryPort("");
                  setDeliveryDateRange("");
                }}
                className="px-6 py-3 rounded-xl bg-[#141724] border border-[#23273b] text-gray-300 hover:text-white text-sm"
              >
                {isAr ? "تسجيل عملية أخرى" : "Submit Another Deal"}
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-[#0c0e17] border border-[#23273b] p-6 sm:p-10 shadow-2xl space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121420] border border-[#23273b] text-xs font-mono text-[#d4956b] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.common.verifiedBrokerage}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {side === "sell"
                  ? (isAr ? "تسجيل عرض توريد سلعي معتمد" : "Register Verified Supply Offer")
                  : (isAr ? "تسجيل طلب شراء سلعي معتمد" : "Register Verified Buy Request")}
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                {t.common.usdReference} • {isAr ? "وساطة غير إيداعية وتسوية مصرفية مباشرة" : "Non-custodial cargo clearing & peer-to-peer settlement"}
              </p>
            </div>

            {/* Institutional KYC / KYB Verification Gate Banner */}
            {authLoading ? (
              <div className="p-4 rounded-2xl bg-[#0f121d] border border-[#23273b] text-xs text-gray-400 flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-[#d4956b]" />
                <span>{isAr ? "جاري التحقق من الاعتماد المؤسسي وملف الامتثال (KYC / KYB)..." : "Checking institutional KYC/KYB compliance authorization..."}</span>
              </div>
            ) : !isKybApproved ? (
              <div className="p-5 sm:p-6 rounded-2xl bg-[#160f13] border-2 border-amber-500/60 shadow-xl space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-400" />
                        <span>
                          {isAr
                            ? "نظام النشر مقيد: يتطلب اكتمال التحقق المؤسسي الكامل (KYC / KYB)"
                            : "Publication Restricted: Mandatory Institutional KYC/KYB Verification"}
                        </span>
                      </h2>
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase border",
                          kybStatus === "pending_review"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : kybStatus === "incomplete"
                            ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                            : kybStatus === "rejected"
                            ? "bg-red-500/20 text-red-300 border-red-500/40"
                            : "bg-gray-500/20 text-gray-300 border-gray-500/40"
                        )}
                      >
                        {kybStatus === "unauthenticated"
                          ? (isAr ? "غير مسجل الدخول" : "UNAUTHENTICATED")
                          : kybStatus === "pending_review"
                          ? (isAr ? "قيد المراجعة الرقابية" : "PENDING REVIEW")
                          : kybStatus === "incomplete"
                          ? (isAr ? "وثائق ناقصة" : "INCOMPLETE")
                          : (isAr ? "غير معتمد" : "REJECTED")}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                      {isAr
                        ? "وفقاً لمعايير غرفة التجارة الدولية (ICC) وقوانين مكافحة غسل الأموال (AML) لتداول السلع المادية، لا يمكن لأي من المشتري أو البائع من وضع إعلانهما أو نشر طلبات الشراء وعروض التوريد داخل المنصة إلا عند اكتمال التحقق الكامل منهما (KYC للممثل القانوني و KYB للمنشأة)."
                        : "Under ICC rules and international AML regulations for physical commodity trading, neither buyers nor sellers may publish listings, buy requests, or supply offers until full corporate verification (KYB) and representative vetting (KYC) are completed and officially approved."}
                    </p>

                    {orgName && (
                      <div className="text-xs text-gray-300 font-mono bg-black/40 p-2.5 rounded-xl border border-white/10 flex items-center justify-between flex-wrap gap-2">
                        <span>
                          <strong className="text-white">{isAr ? "المنشأة الحالية:" : "Organization:"}</strong> {orgName}
                        </span>
                        <span className="text-[11px] text-amber-300">
                          {isAr ? "الحالة: بانتظار اعتماد ضابط الامتثال" : "Status: Awaiting Compliance Officer Approval"}
                        </span>
                      </div>
                    )}

                    {/* Direct Action Buttons */}
                    <div className="pt-2 flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={() => router.push("/compliance")}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white text-xs font-semibold shadow-md shadow-[#b87333]/20 flex items-center gap-1.5 transition-all"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>
                          {isAr
                            ? "لوحة الامتثال ورفع وثائق التحقق (KYC / KYB)"
                            : "Compliance Portal & Upload Verification (KYC / KYB)"}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>

                      {!currentUser && (
                        <>
                          <button
                            type="button"
                            onClick={() => router.push("/auth/signin")}
                            className="px-4 py-2 rounded-xl bg-[#141726] border border-[#23273b] hover:border-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                          >
                            <Building2 className="w-3.5 h-3.5 text-[#d4956b]" />
                            <span>{isAr ? "تسجيل الدخول للمؤسسات المعتمدة" : "Sign In with Verified Account"}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => router.push("/auth/register")}
                            className="px-4 py-2 rounded-xl bg-[#0f111a] border border-[#23273b] hover:border-[#b87333] text-gray-300 hover:text-white text-xs font-semibold transition-all"
                          >
                            <span>{isAr ? "طلب تسجيل منشأة جديدة" : "Register New Trading Desk"}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 text-xs flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{isAr ? "التحقق المؤسسي مكتمل ومعتمد (KYC / KYB VERIFIED)" : "Institutional Verification Approved (KYC / KYB VERIFIED)"}</span>
                      <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px]">APPROVED</span>
                    </div>
                    <p className="text-gray-400 text-[11px] mt-0.5">
                      {isAr
                        ? `الحساب مؤهل بالكامل لطرح الصفقات باسم: ${orgName || currentUser?.name}`
                        : `Authorized to publish physical commodity orders on behalf of: ${orgName || currentUser?.name}`}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/compliance")}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 font-mono underline"
                >
                  {isAr ? "عرض شهادة الامتثال" : "View Compliance Cert"}
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Step 1: Side (Buy vs Sell) */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                1. {isAr ? "نوع العملية" : "Transaction Type"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSide("buy")}
                  className={cn(
                    "p-4 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                    side === "buy"
                      ? "bg-[#181d2e] border-[#b87333] text-white shadow-lg shadow-[#b87333]/20"
                      : "bg-[#0e1018] border-[#23273b] text-gray-400 hover:text-white"
                  )}
                >
                  <Building2 className="w-4 h-4 text-[#d4956b]" />
                  <span>{t.catalog.buyRequest}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSide("sell")}
                  className={cn(
                    "p-4 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                    side === "sell"
                      ? "bg-[#181d2e] border-[#b87333] text-white shadow-lg shadow-[#b87333]/20"
                      : "bg-[#0e1018] border-[#23273b] text-gray-400 hover:text-white"
                  )}
                >
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>{t.catalog.supplyOffer}</span>
                </button>
              </div>
            </div>

            {/* Step 2: Sector & Material */}
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                2. {t.catalog.title}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-400 mb-1.5 block">{isAr ? "القطاع (7 قطاعات دولية)" : "Commodity Sector"}</span>
                  <select
                    value={sectorId}
                    onChange={(e) => {
                      const newSecId = e.target.value;
                      setSectorId(newSecId);
                      const sec = COMMODITY_SECTORS.find((s) => s.id === newSecId);
                      if (sec && sec.items.length > 0) {
                        setCommodityName(sec.items[0].name);
                      }
                      setSpec1("");
                      setSpec2("");
                      setSpec3("");
                    }}
                    className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b87333]"
                  >
                    {COMMODITY_SECTORS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {getSectorTitle(s.titleKey, locale)} ({s.materialsCount} {isAr ? "درجة" : "grades"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-xs text-gray-400 mb-1.5 block">{isAr ? "السلعة القياسية المعتمدة" : "Standard Commodity Product"}</span>
                  <select
                    value={commodityName}
                    onChange={(e) => setCommodityName(e.target.value)}
                    className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b87333]"
                  >
                    {currentSector.items.map((item, idx) => (
                      <option key={idx} value={item.name}>
                        {getCommodityItemName(item.name, locale)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reference Benchmark Specs Display */}
              <div className="p-3 rounded-xl bg-[#10121d] border border-[#1f2233] text-xs text-gray-300 flex items-center justify-between flex-wrap gap-2">
                <span className="text-gray-400">{t.catalog.benchmarkSpecs}</span>
                <span className="font-mono text-[#d4956b] font-medium" dir="ltr">
                  {currentCommodityItem.specs}
                </span>
              </div>

              {/* Dynamic Sector Specifications Inputs */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0f121d] border border-[#23273b] space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#d4956b]">
                  <Info className="w-4 h-4" />
                  <span>
                    {isAr
                      ? `المواصفات الفنية الخاصة بقطاع ${getSectorTitle(currentSector.titleKey, locale)}`
                      : `Technical Specifications for ${getSectorTitle(currentSector.titleKey, locale)}`}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] text-gray-400 block mb-1">
                      {isAr ? currentSpecConfig.spec1.labelAr : currentSpecConfig.spec1.labelEn}
                    </span>
                    <input
                      type="text"
                      value={spec1}
                      onChange={(e) => setSpec1(e.target.value)}
                      className="w-full bg-[#141726] border border-[#23273b] rounded-lg px-3 py-1.5 text-xs text-white"
                      placeholder={isAr ? currentSpecConfig.spec1.placeholderAr : currentSpecConfig.spec1.placeholderEn}
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block mb-1">
                      {isAr ? currentSpecConfig.spec2.labelAr : currentSpecConfig.spec2.labelEn}
                    </span>
                    <input
                      type="text"
                      value={spec2}
                      onChange={(e) => setSpec2(e.target.value)}
                      className="w-full bg-[#141726] border border-[#23273b] rounded-lg px-3 py-1.5 text-xs text-white"
                      placeholder={isAr ? currentSpecConfig.spec2.placeholderAr : currentSpecConfig.spec2.placeholderEn}
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block mb-1">
                      {isAr ? currentSpecConfig.spec3.labelAr : currentSpecConfig.spec3.labelEn}
                    </span>
                    <input
                      type="text"
                      value={spec3}
                      onChange={(e) => setSpec3(e.target.value)}
                      className="w-full bg-[#141726] border border-[#23273b] rounded-lg px-3 py-1.5 text-xs text-white"
                      placeholder={isAr ? currentSpecConfig.spec3.placeholderAr : currentSpecConfig.spec3.placeholderEn}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Quantity, Pricing & Incoterms */}
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                3. {isAr ? "الكمية، السعر والشروط اللوجستية" : "Quantity, Target Price & Logistics"}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-gray-400 mb-1.5 block">{isAr ? "الكمية المطلوبة / المعروضة *" : "Quantity *"}</span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder={isAr ? "مثال: 25000" : "e.g. 25000"}
                    className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b87333] font-mono"
                  />
                </div>

                <div>
                  <span className="text-xs text-gray-400 mb-1.5 block">{isAr ? "الوحدة القياسية" : "Standard Unit"}</span>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b87333]"
                  >
                    <option value="Metric Tons">{isAr ? "طن متري (MT)" : "Metric Tons (MT)"}</option>
                    <option value="Barrels">{isAr ? "برميل (BBL)" : "Barrels (BBL)"}</option>
                    <option value="MMBTU">MMBTU (مليون وحدة حرارية)</option>
                    <option value="Kilograms">{isAr ? "كيلوغرام (Kg)" : "Kilograms (Kg)"}</option>
                  </select>
                </div>

                <div>
                  <span className="text-xs text-gray-400 mb-1.5 block">{isAr ? "السعر للوحدة (USD) *" : "Target Price (USD) *"}</span>
                  <div className="relative">
                    <span className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={pricePerUnit}
                      onChange={(e) => setPricePerUnit(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder={isAr ? "مثال: 740" : "e.g. 740"}
                      className="w-full bg-[#121422] border border-[#23273b] rounded-xl pl-8 pr-4 rtl:pr-8 rtl:pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b87333] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Total Contract Estimated Value Banner */}
              <div className="p-4 rounded-2xl bg-[#121420] border border-[#b87333]/30 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-gray-400">{isAr ? "إجمالي القيمة التقديرية المحتسبة:" : "Calculated Total Contract Value:"}</span>
                  <div className="text-2xl font-bold font-mono text-[#d4956b]" dir="ltr">
                    {formatCurrency(totalContractValue, "USD", locale)}
                  </div>
                </div>
                <div className="text-xs text-gray-400 font-mono text-end">
                  <div>{t.common.usdReference}</div>
                  <div className="text-[11px] text-[#c9a961] mt-0.5">
                    {isAr ? "عمولة الوساطة المقدرة (1.25%): " : "Est. Brokerage Fee (1.25%): "}
                    <span dir="ltr">{formatCurrency(totalContractValue * 0.0125, "USD", locale)}</span>
                  </div>
                </div>
              </div>

              {/* Detailed Brokerage Commission Clarification */}
              <div className="p-4 rounded-2xl bg-[#0f121d] border border-[#1f2233] space-y-2 text-xs">
                <div className="flex items-center gap-2 font-semibold text-[#d4956b]">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>
                    {isAr
                      ? `بيان عمولة الوساطة المؤسسية (نطاق المنصة: ${BROKERAGE_COMMISSION_POLICY.rateRangeDisplay})`
                      : isFr
                      ? `Politique de courtage institutionnelle (Fourchette plateforme : ${BROKERAGE_COMMISSION_POLICY.rateRangeDisplay})`
                      : `Institutional Brokerage Policy (Platform Range: ${BROKERAGE_COMMISSION_POLICY.rateRangeDisplay})`}
                  </span>
                </div>
                <div className="space-y-1.5 text-gray-400 leading-relaxed text-[11px] sm:text-xs">
                  <p>
                    <strong className="text-gray-200">
                      {isAr ? "• النسبة المعروضة (1.25%): " : isFr ? "• Taux indicatif (1,25 %) : " : "• Indicative Rate (1.25%): "}
                    </strong>
                    {isAr
                      ? "نسبة استرشادية أولية للشحنات الفردية القياسية بالخطة الاحترافية، وليست نسبة ملزمة نهائية."
                      : isFr
                      ? "Taux de référence indicatif pour les expéditions uniques dans la formule Professionnel ; il ne s'agit pas d'un taux définitif contraignant."
                      : "Indicative benchmark for single shipments under the Professional tier; not a final binding rate."}
                  </p>
                  <p>
                    <strong className="text-gray-200">
                      {isAr ? "• تحديد النسبة النهائية: " : isFr ? "• Détermination du taux final : " : "• Final Rate Determination: "}
                    </strong>
                    {isAr
                      ? "تُحدد النسبة النهائية بالاتفاق مع الوسيط المعتمد داخل غرفة الصفقة وفق حجم الشحنة ومستوى المخاطر وتدرج الكميات (حتى 0.50% للعقود الكبرى)."
                      : isFr
                      ? "Le pourcentage final est fixé d'un commun accord avec le courtier agréé dans la salle de négociation en fonction du volume contractuel et des paliers (jusqu'à 0,50 % pour les contrats à fort volume)."
                      : "Final percentage is agreed with the supervising broker inside the deal room based on volume and terms (tiered down to 0.50% for high-volume contracts)."}
                  </p>
                  <p>
                    <strong className="text-gray-200">
                      {isAr ? "• الطرف الملتزم بالسداد: " : isFr ? "• Partie débitrice : " : "• Obligor Party: "}
                    </strong>
                    {isAr
                      ? "يُحدد في اتفاقية الوساطة الرسمية وملحق IMFPA (تُسدد عادة من جانب البائع/المورد أو مناصفة وفق شروط التفاوض)."
                      : isFr
                      ? "Stipulé dans l'accord officiel NCNDA/IMFPA (modèle CCI 769) (généralement pris en charge par le fournisseur ou partagé selon les négociations)."
                      : "Stipulated in the official ICC 769 NCNDA/IMFPA agreement (typically paid by the supplier or split per negotiated terms)."}
                  </p>
                  <p>
                    <strong className="text-gray-200">
                      {isAr ? "• موعد الاستحقاق: " : isFr ? "• Échéance d'exigibilité : " : "• Due Date: "}
                    </strong>
                    {isAr
                      ? "تستحق العمولة حصراً عند الإفراج المصرفي عن الاعتماد المستندي (DLC / SBLC) وصدور بوالص الشحن وفحص SGS بميناء التحميل."
                      : isFr
                      ? "Exigible exclusivement lors du dénouement bancaire de la Lettre de Crédit (DLC / SBLC) et de la remise des connaissements maritimes et du certificat d'inspection SGS."
                      : "Due strictly upon bank settlement of the Letter of Credit (DLC/SBLC) and issuance of Clean on Board Bills of Lading."}
                  </p>
                </div>
                <div className="pt-1.5 border-t border-[#181b29] text-[10px] text-gray-500 font-mono">
                  {isAr
                    ? "خاضع لقواعد غرفة التجارة الدولية ICC Model 769 • تعويضات الالتفاف الاتفاقية: 3 أضعاف العمولة المتوقعة"
                    : isFr
                    ? "Régie par le modèle de contrat 769 de la CCI • Indemnités forfaitaires en cas de contournement : 3x la commission anticipée"
                    : "Governed by ICC Model Contract 769 • Liquidated circumvention damages: 3x anticipated commission"}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-gray-400 mb-1.5 block">{t.catalog.incoterms}</span>
                  <select
                    value={incoterm}
                    onChange={(e) => setIncoterm(e.target.value)}
                    className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b87333] font-mono"
                  >
                    {INCOTERMS.map((term) => (
                      <option key={term} value={term}>
                        {term}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-xs text-gray-400 mb-1.5 block">{isAr ? "ميناء / محطة التسليم المعتمدة *" : "Named Port / Terminal *"}</span>
                  <input
                    type="text"
                    required
                    value={deliveryPort}
                    onChange={(e) => setDeliveryPort(e.target.value)}
                    placeholder={isAr ? "مثال: ميناء روتردام، الجبيل، الفجيرة" : "e.g. Rotterdam Port, Jubail, Fujairah"}
                    className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b87333]"
                  />
                </div>

                <div>
                  <span className="text-xs text-gray-400 mb-1.5 block">{isAr ? "نافذة / فترة التسليم *" : "Delivery Window *"}</span>
                  <input
                    type="text"
                    required
                    value={deliveryDateRange}
                    onChange={(e) => setDeliveryDateRange(e.target.value)}
                    placeholder={isAr ? "مثال: 10 - 25 ديسمبر 2026" : "e.g. Dec 10 - Dec 25, 2026"}
                    className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b87333]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#1f2233] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.common.verifiedBrokerage} • {isAr ? "حماية NCNDA وتدقيق SGS" : "NCNDA Protected & SGS Verified"}</span>
              </div>

              <button
                type="submit"
                disabled={isPending || !isKybApproved}
                className={cn(
                  "w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm shadow-xl flex items-center justify-center gap-2 transition-all",
                  isKybApproved
                    ? "bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white shadow-[#b87333]/20"
                    : "bg-[#181a24] text-gray-400 border border-[#2b2f42] cursor-not-allowed opacity-80"
                )}
              >
                {!isKybApproved ? (
                  <>
                    <Lock className="w-4 h-4 text-amber-400" />
                    <span>
                      {side === "sell"
                        ? (isAr ? "مغلق: يتطلب اعتماد KYC/KYB لنشر عرض التوريد" : "Locked: Requires Approved KYC/KYB to Post Offer")
                        : (isAr ? "مغلق: يتطلب اعتماد KYC/KYB لنشر طلب الشراء" : "Locked: Requires Approved KYC/KYB to Post Request")}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {isPending
                        ? t.common.loading
                        : side === "sell"
                        ? (isAr ? "إرسال عرض توريد معتمد" : "Submit Verified Supply Offer")
                        : (isAr ? "إرسال طلب شراء معتمد" : "Submit Verified Purchase Request")}
                    </span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Regulatory Persona Simulator & Interactive Compliance Switcher */}
        <div className="mt-8 p-5 rounded-2xl bg-[#0a0c13] border border-[#1f2233] text-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-gray-400 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4956b]" />
              <span>
                {isAr
                  ? "محاكي فحص الأهلية الرقابية (KYC / KYB Persona Sandbox):"
                  : "Regulatory Eligibility Simulator (KYC / KYB Persona Sandbox):"}
              </span>
            </span>
            <span className="text-[11px] text-gray-500 font-mono">
              {isAr ? "اختبر تفاعل المنصة مع أطراف التداول المعتمدة وغير المعتمدة" : "Test platform behavior across verified & unverified trading entities"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => handleSwitchPersona("buyer")}
              className={cn(
                "p-2 rounded-xl border text-center transition-all",
                currentUser?.id === "usr-buyer-alpha"
                  ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-bold"
                  : "bg-[#10121d] border-[#23273b] text-gray-400 hover:text-white"
              )}
            >
              <div>🏢 {isAr ? "مشتري معتمد" : "Verified Buyer"}</div>
              <div className="text-[10px] text-emerald-400 font-sans">{isAr ? "توتال إنرجيز (معتمد ✅)" : "TotalEnergies (Approved)"}</div>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchPersona("supplier")}
              className={cn(
                "p-2 rounded-xl border text-center transition-all",
                currentUser?.id === "usr-supplier-nordic"
                  ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-300 font-bold"
                  : "bg-[#10121d] border-[#23273b] text-gray-400 hover:text-white"
              )}
            >
              <div>🏭 {isAr ? "مورد معتمد" : "Verified Supplier"}</div>
              <div className="text-[10px] text-emerald-400 font-sans">{isAr ? "نورديك ريفاينينغ (معتمد ✅)" : "Nordic Refining (Approved)"}</div>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchPersona("unverified_buyer")}
              className={cn(
                "p-2 rounded-xl border text-center transition-all",
                currentUser?.id === "usr-unverified-buyer"
                  ? "bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold"
                  : "bg-[#10121d] border-[#23273b] text-gray-400 hover:text-white"
              )}
            >
              <div>⏳ {isAr ? "مشتري غير معتمد" : "Unverified Buyer"}</div>
              <div className="text-[10px] text-amber-400 font-sans">{isAr ? "جلف إنرجي (قيد المراجعة ⏳)" : "Gulf Energy (Pending)"}</div>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchPersona("unverified_supplier")}
              className={cn(
                "p-2 rounded-xl border text-center transition-all",
                currentUser?.id === "usr-unverified-supplier"
                  ? "bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold"
                  : "bg-[#10121d] border-[#23273b] text-gray-400 hover:text-white"
              )}
            >
              <div>⚠️ {isAr ? "مورد غير معتمد" : "Unverified Supplier"}</div>
              <div className="text-[10px] text-amber-400 font-sans">{isAr ? "لاتام ريفاينينغ (ناقص ⚠️)" : "LatAm Refining (Incomplete)"}</div>
            </button>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-[#1f2233] text-center text-xs text-gray-500 font-mono">
        {isAr ? "محرك المقاصة وتنفيذ الصفقات — فالوريا ماركت VALOREA MARKET" : "VALOREA MARKET Supervised Commodity Execution Engine"} • {t.common.verifiedBrokerage}
      </footer>
    </div>
  );
}

export default function NewDealPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07080c] flex items-center justify-center text-gray-400 text-sm">
          Loading VALOREA MARKET Deal Desk...
        </div>
      }
    >
      <NewDealForm locale={locale} />
    </Suspense>
  );
}
