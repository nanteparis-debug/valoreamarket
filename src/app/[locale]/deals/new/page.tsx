"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "@/i18n/routing";
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
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export default function NewDealPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [locale, setLocale] = useState("en");
  React.useEffect(() => {
    params.then((p) => setLocale(p.locale));
  }, [params]);

  const t = getSubpageTranslations(locale);
  const isAr = locale === "ar";

  // Form State
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [sectorId, setSectorId] = useState(COMMODITY_SECTORS[0].id);
  const [commodityName, setCommodityName] = useState(
    COMMODITY_SECTORS[0].items[0].name
  );
  const [quantity, setQuantity] = useState<number>(25000);
  const [unit, setUnit] = useState("Metric Tons");
  const [pricePerUnit, setPricePerUnit] = useState<number>(740);
  const [incoterm, setIncoterm] = useState("CIF");
  const [deliveryPort, setDeliveryPort] = useState("Rotterdam Port");
  const [deliveryDateRange, setDeliveryDateRange] = useState("Dec 15 - Dec 30, 2026");

  // Material-specific specs
  const [spec1, setSpec1] = useState("38.5°");
  const [spec2, setSpec2] = useState("0.85%");
  const [spec3, setSpec3] = useState("Euro 5 / 6 Compliant");

  const [submitted, setSubmitted] = useState(false);

  const currentSector =
    COMMODITY_SECTORS.find((s) => s.id === sectorId) || COMMODITY_SECTORS[0];

  const totalContractValue = (quantity || 0) * (pricePerUnit || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await fetch("/api/deals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sector: sectorId,
            commodityName,
            side,
            quantity: Number(quantity),
            unit,
            pricePerUnit: Number(pricePerUnit),
            currency: "USD",
            incoterm,
            deliveryPort,
            deliveryDateRange,
            specs: {
              "Primary Specification": spec1,
              "Secondary Benchmark": spec2,
              "Quality Grade": spec3,
            },
          }),
        });

        const data = await res.json();
        if (data.success && data.deal) {
          setSubmitted(true);
        }
      } catch (err) {
        console.error("Submission failed", err);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-[#f8fafc] flex flex-col justify-between">
      {/* Top Simple Header */}
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
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-12">
        {submitted ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0e101a] border border-[#23273b] shadow-2xl text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {isAr ? "تم تسجيل الصفقة بنجاح!" : "Deal Successfully Registered!"}
            </h2>
            <p className="mt-3 text-sm text-gray-400 max-w-lg">
              {isAr
                ? "تم تسجيل طلبك في نظام المقاصة الخاص بـ VALOREA MARKET. سيبدأ وسيط معتمد عملية المطابقة وفتح غرفة الصفقة المخصصة."
                : "Your request has been logged into the VALOREA MARKET clearing engine. A verified broker will initiate matching."}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push(`/deals/deal-en590-rotterdam/room`)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white font-semibold text-sm shadow-lg shadow-[#b87333]/20 flex items-center gap-2"
              >
                <span>{isAr ? "الدخول إلى غرفة الصفقة" : "Enter Live Deal Room"}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 rounded-xl bg-[#141724] border border-[#23273b] text-gray-300 hover:text-white text-sm"
              >
                {isAr ? "تسجيل صفقة أخرى" : "Submit Another Deal"}
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
                {isAr ? "تسجيل صفقة سلعية جديدة" : "New Commodity Deal Registration"}
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                {t.common.usdReference}
              </p>
            </div>

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
                  <span className="text-xs text-gray-400 mb-1.5 block">{isAr ? "القطاع" : "Sector"}</span>
                  <select
                    value={sectorId}
                    onChange={(e) => {
                      setSectorId(e.target.value);
                      const sec = COMMODITY_SECTORS.find((s) => s.id === e.target.value);
                      if (sec && sec.items.length > 0) {
                        setCommodityName(sec.items[0].name);
                      }
                    }}
                    className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b87333]"
                  >
                    {COMMODITY_SECTORS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {getSectorTitle(s.titleKey, locale)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-xs text-gray-400 mb-1.5 block">{isAr ? "السلعة" : "Commodity Product"}</span>
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

              {/* Dynamic Material Specifications */}
              <div className="p-4 rounded-2xl bg-[#0f121d] border border-[#23273b] space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#d4956b]">
                  <Info className="w-4 h-4" />
                  <span>{t.catalog.benchmarkSpecs}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] text-gray-400 block mb-1">
                      {isAr ? "المعيار الرئيسي" : "Primary Spec"}
                    </span>
                    <input
                      type="text"
                      value={spec1}
                      onChange={(e) => setSpec1(e.target.value)}
                      className="w-full bg-[#141726] border border-[#23273b] rounded-lg px-3 py-1.5 text-xs text-white"
                      placeholder={isAr ? "مثال: 38.5° أو 46% نيتروجين" : "e.g. 38.5° / 46% N"}
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block mb-1">
                      {isAr ? "نسبة الكبريت / الشوائب" : "Sulfur / Impurities"}
                    </span>
                    <input
                      type="text"
                      value={spec2}
                      onChange={(e) => setSpec2(e.target.value)}
                      className="w-full bg-[#141726] border border-[#23273b] rounded-lg px-3 py-1.5 text-xs text-white"
                      placeholder={isAr ? "مثال: 10 PPM أو 0.5%" : "e.g. 10 PPM"}
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block mb-1">
                      {t.catalog.sgsInspected}
                    </span>
                    <input
                      type="text"
                      value={spec3}
                      onChange={(e) => setSpec3(e.target.value)}
                      className="w-full bg-[#141726] border border-[#23273b] rounded-lg px-3 py-1.5 text-xs text-white"
                      placeholder={isAr ? "مثال: فحص SGS أو Saybolt معتمد" : "e.g. SGS / Saybolt"}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Quantity, Pricing & Incoterms */}
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                3. {isAr ? "الكمية، السعر واللوجستيات" : "Quantity, Pricing & Logistics"}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-gray-400 mb-1.5 block">{isAr ? "الكمية" : "Quantity"}</span>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b87333]"
                  />
                </div>

                <div>
                  <span className="text-xs text-gray-400 mb-1.5 block">{isAr ? "الوحدة" : "Unit"}</span>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b87333]"
                  >
                    <option value="Metric Tons">{isAr ? "طن متري" : "Metric Tons (MT)"}</option>
                    <option value="Barrels">{isAr ? "برميل" : "Barrels (BBL)"}</option>
                    <option value="MMBTU">MMBTU</option>
                    <option value="Kilograms">{isAr ? "كيلوغرام" : "Kilograms (Kg)"}</option>
                  </select>
                </div>

                <div>
                  <span className="text-xs text-gray-400 mb-1.5 block">{isAr ? "السعر للوحدة (USD)" : "Target Price (USD)"}</span>
                  <div className="relative">
                    <span className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={pricePerUnit}
                      onChange={(e) => setPricePerUnit(Number(e.target.value))}
                      className="w-full bg-[#121422] border border-[#23273b] rounded-xl pl-8 pr-4 rtl:pr-8 rtl:pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b87333] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Total Contract Estimated Value Banner */}
              <div className="p-4 rounded-2xl bg-[#121420] border border-[#b87333]/30 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-gray-400">{isAr ? "إجمالي القيمة التقديرية:" : "Total Contract Value:"}</span>
                  <div className="text-2xl font-bold font-mono text-[#d4956b]">
                    {formatCurrency(totalContractValue, "USD", locale)}
                  </div>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  <span>{t.common.usdReference}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-gray-400 mb-1.5 block">{t.catalog.incoterms}</span>
                  <select
                    value={incoterm}
                    onChange={(e) => setIncoterm(e.target.value)}
                    className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b87333]"
                  >
                    {INCOTERMS.map((term) => (
                      <option key={term} value={term}>
                        {term}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-xs text-gray-400 mb-1.5 block">{isAr ? "ميناء / محطة التسليم" : "Named Port / Terminal"}</span>
                  <input
                    type="text"
                    value={deliveryPort}
                    onChange={(e) => setDeliveryPort(e.target.value)}
                    placeholder={isAr ? "مثال: ميناء روتردام، الجبيل، الفجيرة" : "e.g. Rotterdam, Jubail"}
                    className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b87333]"
                  />
                </div>

                <div>
                  <span className="text-xs text-gray-400 mb-1.5 block">{isAr ? "فترة التسليم" : "Delivery Window"}</span>
                  <input
                    type="text"
                    value={deliveryDateRange}
                    onChange={(e) => setDeliveryDateRange(e.target.value)}
                    placeholder={isAr ? "مثال: 10 - 25 ديسمبر 2026" : "e.g. Dec 10 - Dec 25, 2026"}
                    className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#b87333]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#1f2233] flex items-center justify-between">
              <span className="text-xs text-gray-500 font-mono">
                {t.common.verifiedBrokerage}
              </span>

              <button
                type="submit"
                disabled={isPending}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white font-semibold text-sm shadow-xl shadow-[#b87333]/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{isPending ? t.common.loading : (side === "buy" ? t.catalog.buyRequest : t.catalog.supplyOffer)}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          </form>
        )}
      </main>

      <footer className="py-6 border-t border-[#1f2233] text-center text-xs text-gray-500 font-mono">
        {isAr ? "محرك المقاصة وتنفيذ الصفقات — فالوريا ماركت VALOREA MARKET" : "VALOREA MARKET Supervised Commodity Execution Engine"} • {t.common.verifiedBrokerage}
      </footer>
    </div>
  );
}
