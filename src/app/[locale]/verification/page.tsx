"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import {
  ShieldCheck,
  Building2,
  FileCheck2,
  Ship,
  Scale,
  Lock,
  Layers,
  FileText,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  AlertCircle,
  Send,
  Globe2,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PublicCommercialVerificationPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const isAr = locale === "ar";

  // Inquiry Form State
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [commoditySector, setCommoditySector] = useState("energy");
  const [inquiryNotes, setInquiryNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate safe intake submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-[#f8fafc] font-sans selection:bg-[#b87333]/30 selection:text-white pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-[#1f2233]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#b87333]/15 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121422] border border-[#272b42] text-xs font-mono text-[#d4956b] shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#d4956b]" />
            <span>{isAr ? "خدمة التحقق التجاري والعناية الواجبة للسلع" : "Physical Commodity Due Diligence Unit"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {isAr ? (
              <>
                التحقق المؤسسي المستقل من{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4956b] via-[#b87333] to-[#8b5a2b]">
                  الشركات والوثائق والصفقات
                </span>
              </>
            ) : (
              <>
                Institutional Verification for{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4956b] via-[#b87333] to-[#8b5a2b]">
                  Counterparties & Trade Documents
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? "منظومة فحص وتدقيق متعددة المراحل لتقييم مصداقية الشركات، ومطابقة وثائق شحن السلع (B/L, SGS, LC)، واكتشاف التناقضات الملاحية قبل تحويل الأموال وتوقيع العقود."
              : "A rigorous multi-tiered verification framework designed to validate corporate legitimacy, cross-match physical commodity shipping documents (B/L, SGS, LC), and detect trade discrepancies before capital commitment."}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#inquiry"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white font-semibold text-xs sm:text-sm shadow-lg shadow-[#b87333]/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{isAr ? "طلب خدمة التحقق لصفقة" : "Request Deal Verification"}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </a>

            <Link
              href="/catalog"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#121422] hover:bg-[#1a1f32] border border-[#23273b] text-gray-200 hover:text-white font-semibold text-xs sm:text-sm transition-all"
            >
              {isAr ? "استكشاف بورصة السلع الموثقة" : "Browse Verified Commodities"}
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Core Verification Pillars */}
      <section className="py-16 sm:py-20 border-b border-[#1f2233]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {isAr ? "ركائز الفحص والتحقق التجاري" : "The 4 Core Verification Pillars"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              {isAr
                ? "منهجية تدقيق شاملة تجمع بين التحري الميداني والمطابقة الرقمية والمراجعة البشرية المعتمدة."
                : "A forensic approach combining legal registry checks, parameter matching, and expert human review."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="rounded-2xl bg-[#0c0e17] border border-[#1f2233] p-6 space-y-4 hover:border-[#b87333]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#141726] border border-[#24283f] flex items-center justify-center text-[#d4956b]">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                {isAr ? "1. الوجود القانوني والملكية (UBO)" : "1. Corporate Legitimacy & UBO"}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {isAr
                  ? "التحقق من صحة القيد في السجل التجاري الوطني، ومطابقة المستفيد الحقيقي النهائي (UBO)، وفحص قوائم العقوبات الدولية (OFAC, EU, UN)."
                  : "Validation of official corporate registration, ultimate beneficial ownership (UBO) structures, and international sanctions watchlist screening."}
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-2xl bg-[#0c0e17] border border-[#1f2233] p-6 space-y-4 hover:border-[#b87333]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#141726] border border-[#24283f] flex items-center justify-center text-[#d4956b]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                {isAr ? "2. مصفوفة اتساق المستندات" : "2. Cross-Document Consistency"}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {isAr
                  ? "المطابقة المتقاطعة للكميات ونسب التفاوت، ورقم IMO للناقلة، وموانئ الشحن والتفريغ بين البوليصة (B/L) والفاتورة والاعتماد المستندي."
                  : "Cross-comparison of vessel IMO, net tolerances, loading/discharge ports, and consignee data between B/Ls, LCs, and commercial invoices."}
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-2xl bg-[#0c0e17] border border-[#1f2233] p-6 space-y-4 hover:border-[#b87333]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#141726] border border-[#24283f] flex items-center justify-center text-[#d4956b]">
                <Ship className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                {isAr ? "3. الفحص المخبري وتتبع الشحنة" : "3. Laboratory Integrity & AIS"}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {isAr
                  ? "تدقيق تقارير فحص الجودة الصادرة عن جهات معتمدة (SGS / Saybolt / Intertek)، ومطابقة مواصفات السلعة مع مسار السفينة عبر الأقمار الصناعية."
                  : "Forensic verification of accredited surveyor inspection certificates (SGS/Saybolt) and satellite AIS voyage history validation."}
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-2xl bg-[#0c0e17] border border-[#1f2233] p-6 space-y-4 hover:border-[#b87333]/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#141726] border border-[#24283f] flex items-center justify-center text-[#d4956b]">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">
                {isAr ? "4. المراجعة البشرية والاعتماد" : "4. Expert Human Review"}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {isAr
                  ? "لا نعتمد على استخراج النصوص OCR كدليل قاطع. يتولى مسؤول امتثال معتمد مراجعة الملفات يدوياً وإصدار مبررات النتيجة الموثقة."
                  : "Zero automated guesswork. Every file is scrutinized by a senior compliance officer who writes verifiable justification notes."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accepted Documents Grid */}
      <section className="py-16 sm:py-20 border-b border-[#1f2233] bg-[#090b12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {isAr ? "وثائق تجارة السلع المؤهلة للتحقق" : "Accepted Physical Trade Documents"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              {isAr
                ? "ندعم فحص جميع وثائق الشحن والتسليم والتسوية المصرفية المعتمدة في التجارة الدولية."
                : "Comprehensive coverage across shipping, title, quality, and banking settlement instruments."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                titleAr: "بوليصة الشحن البحرية (Ocean B/L)",
                titleEn: "Ocean Bill of Lading (B/L)",
                descAr: "فحص البوليصة الأصلية (Clean on Board)، تطابق اسم السفينة، خط الملاحة، والمرسل إليه.",
                descEn: "Verification of clean on board endorsements, vessel IMO, carrier legitimacy, and notify party.",
              },
              {
                titleAr: "شهادة فحص الجودة والكمية (SGS / Saybolt)",
                titleEn: "SGS / Saybolt Certificate of Quality",
                descAr: "مطابقة نسب الكثافة، الكبريت، الرطوبة، ومعايير ASTM/API الصادرة عن المختبر المعتمد.",
                descEn: "Validation of API gravity, sulfur content, moisture, and surveyor seal authenticity.",
              },
              {
                titleAr: "الاعتماد المستندي البنكي (SWIFT MT700 LC)",
                titleEn: "Documentary Credit (SWIFT MT700 LC)",
                descAr: "فحص شروط الاعتماد، البنك المصدر والمعزز، والتوافق مع القواعد الموحدة (UCP 600).",
                descEn: "Inspection of letter of credit clauses, issuing bank routing, and UCP 600 conformity.",
              },
              {
                titleAr: "الفاتورة التجارية وقائمة التعبئة (Invoice & Packing)",
                titleEn: "Commercial Invoice & Packing List",
                descAr: "مطابقة أسعار الوحدة، الكميات الصافية والإجمالية، وشروط التسليم الدولية (Incoterms 2020).",
                descEn: "Cross-matching invoice values, gross/net weights, Incoterms, and payment terms.",
              },
              {
                titleAr: "شهادة المنشأ الرسمية (Certificate of Origin)",
                titleEn: "Certificate of Origin (COO)",
                descAr: "التحقق من تصديق الغرفة التجارية ووزارة الخارجية في بلد المنشأ لتجنب التحايل التجاري.",
                descEn: "Verification of chamber of commerce certification and trade embargo compliance.",
              },
              {
                titleAr: "إيصالات التخزين وحصص التكرير (TSR / Allocation)",
                titleEn: "Tank Storage Receipts & Refinery Allocation",
                descAr: "التحقق من ملكية المنتج في خزانات الموانئ أو عقود الحصص الشهرية المخصصة للتكرير.",
                descEn: "Validation of terminal storage titles, tank receipts, and direct refinery allocation quotas.",
              },
            ].map((doc, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#0c0e17] border border-[#1f2233] space-y-2 hover:border-[#b87333]/30 transition-all"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#d4956b]" />
                  <span className="font-semibold text-white text-xs sm:text-sm">
                    {isAr ? doc.titleAr : doc.titleEn}
                  </span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  {isAr ? doc.descAr : doc.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Intake Form */}
      <section id="inquiry" className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              {isAr ? "طلب خدمة التحقق لصفقة أو شريك تجاري" : "Request Commercial Verification"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              {isAr
                ? "املأ النموذج أدناه وسيتواصل معك مستشار الامتثال المختص لدراسة متطلبات ملفك بسرية تامة."
                : "Submit deal parameters for confidential evaluation by our compliance desk."}
            </p>
          </div>

          <div className="rounded-3xl bg-[#0c0e17] border border-[#1f2233] p-6 sm:p-8 shadow-2xl">
            {submitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {isAr ? "تم استلام طلب التحقق بنجاح" : "Verification Request Received"}
                </h3>
                <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                  {isAr
                    ? "سيتواصل معك فريق الامتثال التجاري خلال ساعتي عمل لمراجعة المتطلبات وإرشادك لكيفية إيداع الوثائق في الخزينة المشفرة."
                    : "A designated compliance officer will review your request and contact you within 2 business hours regarding encrypted vault submission."}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#141724] border border-[#23273b] text-xs font-semibold text-gray-200 hover:text-white"
                >
                  {isAr ? "تقديم طلب آخر" : "Submit Another Request"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold block">
                      {isAr ? "اسم مؤسستك / شركتك:" : "Your Company Name:"}
                    </label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={isAr ? "مثال: Gulf Petrochemical Trading" : "e.g., Gulf Energy Trading Ltd"}
                      className="w-full p-3 rounded-xl bg-[#121420] border border-[#23273b] text-gray-200 focus:outline-none focus:border-[#b87333]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold block">
                      {isAr ? "البريد الإلكتروني المؤسسي:" : "Corporate Email Address:"}
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="compliance@yourcompany.com"
                      className="w-full p-3 rounded-xl bg-[#121420] border border-[#23273b] text-gray-200 focus:outline-none focus:border-[#b87333]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold block">
                      {isAr ? "رقم الهاتف / الواتساب التجاري:" : "Direct Phone / WhatsApp:"}
                    </label>
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+41 22 000 0000"
                      className="w-full p-3 rounded-xl bg-[#121420] border border-[#23273b] text-gray-200 focus:outline-none focus:border-[#b87333]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold block">
                      {isAr ? "قطاع السلعة المستهدفة:" : "Commodity Sector:"}
                    </label>
                    <select
                      value={commoditySector}
                      onChange={(e) => setCommoditySector(e.target.value)}
                      className="w-full p-3 rounded-xl bg-[#121420] border border-[#23273b] text-gray-200 focus:outline-none focus:border-[#b87333]"
                    >
                      <option value="energy">{isAr ? "النفط والمشتقات البترولية (EN590, Crude, Jet A1)" : "Oil & Petroleum Products"}</option>
                      <option value="metals">{isAr ? "المعادن والصناعات التعدينية (Copper, Aluminum)" : "Industrial Metals"}</option>
                      <option value="agriculture">{isAr ? "السلع الزراعية والأسمدة (Urea, Sugar, Wheat)" : "Agri-Commodities & Fertilizers"}</option>
                      <option value="chemicals">{isAr ? "البتروكيماويات والغاز الطبيعي (LNG, LPG)" : "Petrochemicals & Natural Gas"}</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold block">
                    {isAr ? "تفاصيل الطلب والوثائق المراد تدقيقها:" : "Deal Overview & Verification Scope:"}
                  </label>
                  <textarea
                    rows={4}
                    value={inquiryNotes}
                    onChange={(e) => setInquiryNotes(e.target.value)}
                    placeholder={
                      isAr
                        ? "وضح طبيعة الصفقة، الأطراف المشاركة، الميناء، وما إذا كانت الوثائق متوفرة لديك حالياً..."
                        : "Describe cargo parameters, counterparties involved, target ports, and documents currently available..."
                    }
                    className="w-full p-3 rounded-xl bg-[#121420] border border-[#23273b] text-gray-200 focus:outline-none focus:border-[#b87333]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white font-semibold text-xs sm:text-sm shadow-lg shadow-[#b87333]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? (isAr ? "جارٍ الإرسال..." : "Submitting...") : (isAr ? "إرسال طلب التحقق للمراجعة" : "Submit Verification Inquiry")}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Legal Advisory Footer */}
          <div className="p-4 rounded-2xl bg-[#0f111a] border border-[#1f2233] text-[11px] text-gray-400 text-center leading-relaxed">
            {isAr
              ? "إشعار قانوني: خدمة التحقق التجاري في Valorea Market هي أداة مهنية مساعدة للعناية الواجبة وتخفيف مخاطر المعاملات. لا تشكل هذه التقارير ضماناً مالياً للوفاء العقدي، ولا تحل محل الفحص القانوني المعتمد أو التحويلات المصرفية عبر خطابات الاعتماد المعززة."
              : "Legal Notice: Valorea Market commercial verification services are institutional due diligence aids. Reports do not constitute contractual performance guarantees, legal counsel, or official government notarizations."}
          </div>
        </div>
      </section>
    </div>
  );
}
