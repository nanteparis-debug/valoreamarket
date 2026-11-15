"use client";

import React, { useState, useRef, Suspense } from "react";
import { useRouter, Link } from "@/i18n/routing";
import { useParams, useSearchParams } from "next/navigation";
import { getSubpageTranslations } from "@/lib/i18n-subpages";
import { TurnstileWidget, type TurnstileRef } from "@/components/ui/turnstile-widget";
import {
  FileBadge2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Clock,
  ExternalLink,
  AlertCircle,
  CreditCard,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const SUPPORTED_INCORPORATION_COUNTRIES = [
  { code: "CH", nameAr: "سويسرا (CH)", nameEn: "Switzerland (CH)", flag: "🇨🇭" },
  { code: "AE", nameAr: "الإمارات العربية المتحدة (AE)", nameEn: "United Arab Emirates (AE)", flag: "🇦🇪" },
  { code: "SA", nameAr: "المملكة العربية السعودية (SA)", nameEn: "Saudi Arabia (SA)", flag: "🇸🇦" },
  { code: "MA", nameAr: "المملكة المغربية (MA)", nameEn: "Morocco (MA)", flag: "🇲🇦" },
  { code: "FR", nameAr: "فرنسا (FR)", nameEn: "France (FR)", flag: "🇫🇷" },
  { code: "GB", nameAr: "المملكة المتحدة (GB)", nameEn: "United Kingdom (GB)", flag: "🇬🇧" },
  { code: "SG", nameAr: "سنغافورة (SG)", nameEn: "Singapore (SG)", flag: "🇸🇬" },
  { code: "US", nameAr: "الولايات المتحدة (US)", nameEn: "United States (US)", flag: "🇺🇸" },
  { code: "NL", nameAr: "هولندا (NL)", nameEn: "Netherlands (NL)", flag: "🇳🇱" },
  { code: "DE", nameAr: "ألمانيا (DE)", nameEn: "Germany (DE)", flag: "🇩🇪" },
];

function RegisterContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const locale = (params?.locale as string) || "en";
  const t = getSubpageTranslations(locale);
  const isAr = locale === "ar";

  const planParam = searchParams.get("plan");
  const validPlans = ["starter", "professional", "enterprise"] as const;
  type PlanType = (typeof validPlans)[number];

  const [selectedPlan, setSelectedPlan] = useState<PlanType>(() => {
    if (planParam && validPlans.includes(planParam as PlanType)) {
      return planParam as PlanType;
    }
    return "starter";
  });

  const [companyName, setCompanyName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [country, setCountry] = useState(""); // Starts UNSELECTED per requirement
  const [repName, setRepName] = useState("");
  const [repEmail, setRepEmail] = useState("");
  const turnstileRef = useRef<TurnstileRef>(null);
  const [agreeLegal, setAgreeLegal] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const PLAN_OPTIONS = [
    {
      id: "starter" as const,
      name: isAr ? "مكتب المبتدئ" : "Trading Starter",
      price: isAr ? "مجاني" : "Free",
      seats: isAr ? "مقعد تداول 1" : "1 Trading Seat",
      desc: isAr ? "تصفح السوق والتحقق الأساسي" : "Market access & basic KYB",
      popular: false,
    },
    {
      id: "professional" as const,
      name: isAr ? "المؤسسات التجارية" : "Professional Desk",
      price: "$499/mo",
      seats: isAr ? "5 مقاعد تداول" : "5 Trading Seats",
      desc: isAr ? "غرف صفقات خاصة ومطابقة الوسيط" : "Deal rooms & broker matching",
      popular: true,
    },
    {
      id: "enterprise" as const,
      name: isAr ? "الشركات الكبرى والسيادية" : "Global Enterprise",
      price: "$1,999/mo",
      seats: isAr ? "15+ مقعداً" : "15+ Trading Seats",
      desc: isAr ? "غرف غير محدودة ووسيط مخصص" : "Unlimited rooms & dedicated desk",
      popular: false,
    },
  ];

  // Audit document versions accepted
  const legalVersions = {
    termsVersion: "2026.1-CH",
    privacyVersion: "2026.1-FADP",
    ncndaVersion: "ICC-769-2026",
    acceptedAt: new Date().toISOString(),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!country) {
      setErrorMessage(
        isAr
          ? "يرجى تحديد دولة التأسيس القانونية للشركة"
          : "Please select the legal jurisdiction/incorporation country"
      );
      return;
    }

    if (!agreeLegal) {
      setErrorMessage(
        isAr
          ? "يرجى الموافقة على شروط الخدمة وسياسة الخصوصية واتفاقية NCNDA للمتابعة"
          : "Please agree to the Terms, Privacy Policy, and NCNDA to proceed"
      );
      return;
    }

    if (!turnstileToken) {
      setErrorMessage(
        isAr
          ? "يرجى إكمال التحقق الأمني من Cloudflare Turnstile للمتابعة"
          : locale === "fr"
          ? "Veuillez valider la vérification de sécurité Cloudflare Turnstile pour continuer"
          : "Please complete the Cloudflare Turnstile security challenge to continue"
      );
      return;
    }

    // Starter plan: Free KYB/KYC verification request
    if (selectedPlan === "starter") {
      setSubmitted(true);
      return;
    }

    // Paid plans (Professional & Enterprise): Redirect to Lemon Squeezy with copied/prefilled details
    setIsRedirecting(true);

    const checkoutBase =
      selectedPlan === "enterprise"
        ? "https://valoreamarket.lemonsqueezy.com/checkout/buy/29fed9b0-8ff5-4736-947e-8f851dd55675"
        : "https://valoreamarket.lemonsqueezy.com/checkout/buy/8d9c977f-9b9c-41f4-a61e-92d9897aab37";

    const checkoutUrl = new URL(checkoutBase);
    // Prefill customer contact details in Lemon Squeezy (fully editable by user on checkout)
    if (repEmail) {
      checkoutUrl.searchParams.set("checkout[email]", repEmail.trim());
    }
    if (repName) {
      checkoutUrl.searchParams.set("checkout[name]", repName.trim());
    }
    // Pass enterprise context in custom parameters
    checkoutUrl.searchParams.set("checkout[custom][companyName]", companyName.trim());
    checkoutUrl.searchParams.set("checkout[custom][regNumber]", regNumber.trim());
    checkoutUrl.searchParams.set("checkout[custom][country]", country);
    checkoutUrl.searchParams.set("checkout[custom][plan]", selectedPlan);

    // Persist registration in session storage
    try {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(
          "gvce_pending_registration",
          JSON.stringify({
            companyName: companyName.trim(),
            regNumber: regNumber.trim(),
            country,
            repName: repName.trim(),
            repEmail: repEmail.trim(),
            plan: selectedPlan,
            timestamp: new Date().toISOString(),
          })
        );
      }
    } catch (err) {
      console.warn("Storage warning:", err);
    }

    // Redirect to Lemon Squeezy payment gateway
    setTimeout(() => {
      window.location.href = checkoutUrl.toString();
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-[#f8fafc] flex flex-col justify-center items-center p-4 py-12">
      <div className="max-w-2xl w-full rounded-3xl bg-[#0c0e17] border border-[#23273b] p-6 sm:p-10 shadow-2xl space-y-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t.auth.backHome}</span>
        </button>

        {isRedirecting ? (
          <div className="text-center py-12 space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-[#b87333]/15 border border-[#b87333]/30 flex items-center justify-center text-[#d4956b] mx-auto shadow-xl shadow-[#b87333]/20">
              <Loader2 className="w-8 h-8 animate-spin text-[#d4956b]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">
                {isAr ? "تم حفظ بيانات التسجيل المؤسسي" : "Registration Data Captured"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                {isAr
                  ? `جاري تحويلك بأمان إلى بوابة الدفع المشفرة لإتمام اشتراك ${companyName || "شركتك"}... تم نسخ معلوماتك لتسهيل عملية الشراء، ولك كامل الحرية في تعديلها داخل بوابة الدفع.`
                  : `Redirecting securely to payment gateway for ${companyName || "your company"}... Your registered information is copied for easy checkout, with full right to edit it at the gateway.`}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#141724] border border-[#23273b] text-xs font-mono text-[#d4956b] inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {isAr ? "دفع مشفر ومؤمن عبر Lemon Squeezy" : "256-Bit Encrypted Checkout via Lemon Squeezy"}
              </span>
            </div>
          </div>
        ) : submitted ? (
          <div className="text-center py-6 space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">
                {isAr ? "تم تسجيل طلب التحقق المؤسسي بنجاح" : "Institutional Verification Request Submitted"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
                {isAr
                  ? `تم استلام ملف شركة ${companyName} (${country}). أرسلنا رابط تأكيد الحساب إلى ${repEmail}.`
                  : `Application received for ${companyName} (${country}). Confirmation link sent to ${repEmail}.`}
              </p>
            </div>

            {/* Document versions audit pill */}
            <div className="p-3 rounded-xl bg-[#141724] border border-[#23273b] text-[11px] font-mono text-[#d4956b] inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {isAr ? "سجل التوقيع القانوني:" : "Legal Execution Record:"} Terms v{legalVersions.termsVersion} • NCNDA {legalVersions.ncndaVersion}
              </span>
            </div>

            {/* Verification Lifecycle Stages & Next Actions */}
            <div className="mt-6 text-start p-5 rounded-2xl bg-[#0e101a] border border-[#23273b] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d4956b]" />
                <span>{isAr ? "مسار التحقق المؤسسي (KYB / KYC Lifecycle):" : "Institutional Verification Lifecycle:"}</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-[#171a2b] border border-[#b87333]/40 flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b87333] animate-pulse mt-1 shrink-0" />
                  <div>
                    <span className="font-bold text-white">
                      1. {isAr ? "قيد المراجعة (PENDING_REVIEW) — الحالة الحالية" : "1. Under Review (PENDING_REVIEW) — Current Status"}
                    </span>
                    <p className="text-gray-400 text-[11px] mt-0.5">
                      {isAr
                        ? "يقوم ضابط الامتثال بفحص السجل التجاري وفحص العقوبات الدولية وقوائم PEP (متوسط 2-4 ساعات عمل)."
                        : "Compliance officer conducts commercial registry check, sanctions, and PEP screening (est. 2-4 business hours)."}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#10121d] border border-[#1f2233] opacity-80 flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-300">
                      2. {isAr ? "معلومات إضافية مطلوبة (INFO_REQUIRED) — إجراء مشروط" : "2. Information Required (INFO_REQUIRED) — Conditional"}
                    </span>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      {isAr
                        ? "إذا تطلب الملف إيضاحاً حول المستفيد الحقيقي (UBO) أو التفويض المصرفي، ستصلك دعوة فورية لرفع الوثيقة."
                        : "If beneficial ownership (UBO) or banking mandate clarification is needed, you will receive an upload prompt."}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-[#10121d] border border-[#1f2233] opacity-80 flex items-start gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-300">
                      3. {isAr ? "معتمد (APPROVED) — النتيجة المستهدفة" : "3. Approved (APPROVED) — Target Outcome"}
                    </span>
                    <p className="text-gray-500 text-[11px] mt-0.5">
                      {isAr
                        ? "منح شارة الشركة المعتمدة، وتفعيل نشر عروض التوريد وطلبات الشراء، والدخول الكامل إلى غرف الصفقات."
                        : "Grants Verified Badge, unlocks publishing buy/supply offers, and grants full access to private deal rooms."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => router.push("/catalog")}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] text-white text-xs font-semibold shadow-lg shadow-[#b87333]/20"
              >
                {t.catalog.title}
              </button>
              <button
                onClick={() => router.push("/compliance")}
                className="px-6 py-2.5 rounded-xl bg-[#141724] border border-[#23273b] text-gray-300 hover:text-white text-xs"
              >
                {isAr ? "لوحة الامتثال والتحقق" : "Compliance Dashboard"}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121420] border border-[#23273b] text-xs font-mono text-[#d4956b] mb-2">
                <FileBadge2 className="w-3.5 h-3.5" />
                <span>{t.auth.registerBadge}</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                {t.auth.registerTitle}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                {t.auth.registerSubtitle}
              </p>
            </div>

            {/* Plan Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 block">
                {isAr ? "نوع اشتراك المنصة المختار:" : "Selected Platform Membership Plan:"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PLAN_OPTIONS.map((p) => {
                  const isSelected = selectedPlan === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPlan(p.id)}
                      className={cn(
                        "p-3 rounded-2xl border text-start transition-all relative flex flex-col justify-between",
                        isSelected
                          ? "bg-[#181b29] border-[#b87333] ring-1 ring-[#b87333]/50 shadow-lg shadow-[#b87333]/15"
                          : "bg-[#10121d] border-[#23273b] hover:border-[#343a56]"
                      )}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{p.name}</span>
                          {p.popular && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#b87333]/20 text-[#ffd700] border border-[#b87333]/40">
                              {isAr ? "موصى به" : "Popular"}
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-sm font-extrabold text-[#d4956b]">
                          {p.price}
                        </div>
                        <p className="text-[10px] text-gray-400 leading-tight">
                          {p.desc}
                        </p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-[#1e2235] text-[10px] text-gray-500 font-mono">
                        {p.seats}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  {t.auth.companyLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={isAr ? "مثال: شركة الطاقة والتجارة الدولية" : "e.g. TotalEnergies Trading SA"}
                  className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  {isAr ? "رقم السجل التجاري (CR / Registration #) *" : "Commercial Registration (CR) *"}
                </label>
                <input
                  type="text"
                  required
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder={isAr ? "مثال: 1010045231 أو RCS 542 051" : "e.g. CHE-105.805.123"}
                  className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333] font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  {t.auth.countryLabel} *
                </label>
                <select
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
                >
                  <option value="" disabled>
                    {isAr ? "-- اختر دولة التأسيس المدعومة --" : "-- Select Supported Jurisdiction --"}
                  </option>
                  {SUPPORTED_INCORPORATION_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {isAr ? c.nameAr : c.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  {t.auth.fullNameLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  placeholder={isAr ? "الممثل القانوني / المفوض بالتوقيع" : "Authorized Legal Officer"}
                  className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">
                {t.auth.emailLabel} *
              </label>
              <input
                type="email"
                required
                value={repEmail}
                onChange={(e) => setRepEmail(e.target.value)}
                placeholder={t.auth.emailPlaceholder}
                className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
              />
            </div>

            {/* Legal Documents Acceptance with Explicit Links and Versions */}
            <div className="p-4 rounded-xl bg-[#121422] border border-[#23273b] space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeLegal}
                  onChange={(e) => setAgreeLegal(e.target.checked)}
                  className="mt-1 rounded text-[#b87333] focus:ring-[#b87333] shrink-0"
                />
                <span className="text-xs text-gray-300 leading-relaxed">
                  {isAr ? (
                    <>
                      أوافق بصفتي ممثلاً مفوضاً للشركة على{" "}
                      <Link href="/legal/terms" target="_blank" className="text-[#d4956b] underline hover:text-[#c9a961] inline-flex items-center gap-0.5">
                        شروط الخدمة (Terms v2026.1) <ExternalLink className="w-3 h-3 inline" />
                      </Link>
                      ، و
                      <Link href="/legal/privacy" target="_blank" className="text-[#d4956b] underline hover:text-[#c9a961] inline-flex items-center gap-0.5">
                        سياسة الخصوصية وحماية البيانات <ExternalLink className="w-3 h-3 inline" />
                      </Link>
                      ، و
                      <Link href="/legal/ncnda" target="_blank" className="text-[#d4956b] underline hover:text-[#c9a961] inline-flex items-center gap-0.5">
                        اتفاقية عدم الالتفاف والسرية الدولية ICC 769 <ExternalLink className="w-3 h-3 inline" />
                      </Link>
                      ، والتسوية غير الإيداعية للشحنات بين البنوك.
                    </>
                  ) : (
                    <>
                      I confirm as an authorized representative my binding agreement to the{" "}
                      <Link href="/legal/terms" target="_blank" className="text-[#d4956b] underline hover:text-[#c9a961] inline-flex items-center gap-0.5">
                        Terms of Service (v2026.1) <ExternalLink className="w-3 h-3 inline" />
                      </Link>
                      , the{" "}
                      <Link href="/legal/privacy" target="_blank" className="text-[#d4956b] underline hover:text-[#c9a961] inline-flex items-center gap-0.5">
                        Privacy Policy <ExternalLink className="w-3 h-3 inline" />
                      </Link>
                      , and the{" "}
                      <Link href="/legal/ncnda" target="_blank" className="text-[#d4956b] underline hover:text-[#c9a961] inline-flex items-center gap-0.5">
                        ICC 769 NCNDA Agreement <ExternalLink className="w-3 h-3 inline" />
                      </Link>
                      , and peer-to-peer bank cargo settlement.
                    </>
                  )}
                </span>
              </label>

              <div className="text-[11px] text-gray-500 font-mono pt-1">
                {isAr
                  ? "تسجل المنصة توقيت الموافقة ورقم الإصدار كوثيقة إثبات قانونية ملزمة لغرفة التجارة الدولية (ICC)."
                  : "Recorded with audit timestamp and version metadata under Swiss jurisdiction."}
              </div>
            </div>

            {/* Cloudflare Turnstile Bot Protection */}
            <TurnstileWidget
              ref={turnstileRef}
              action="register"
              onVerify={(token) => {
                setTurnstileToken(token);
                setErrorMessage("");
              }}
              onError={(err) => setErrorMessage(err || "Turnstile challenge failed")}
              onExpire={() => setTurnstileToken("")}
            />

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white font-semibold text-xs sm:text-sm shadow-lg shadow-[#b87333]/20 transition-all flex items-center justify-center gap-2"
            >
              <span>
                {selectedPlan === "starter"
                  ? t.auth.registerBtn
                  : selectedPlan === "professional"
                  ? (isAr ? "متابعة للدفع وتفعيل باقة المحترفين ($499/شهر)" : "Proceed to Payment — Professional Desk ($499/mo)")
                  : (isAr ? "متابعة للدفع وتفعيل باقة المؤسسات ($1,999/شهر)" : "Proceed to Payment — Enterprise Desk ($1,999/mo)")}
              </span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            <div className="text-center text-xs text-gray-400 pt-2">
              <span>{t.auth.alreadyAccount} </span>
              <button
                type="button"
                onClick={() => router.push("/auth/signin")}
                className="text-[#d4956b] hover:underline font-semibold"
              >
                {t.auth.signInLink}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07080c] flex items-center justify-center text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin text-[#d4956b]" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
