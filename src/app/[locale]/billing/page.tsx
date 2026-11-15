"use client";

import React, { useState, useEffect } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useParams, useSearchParams } from "next/navigation";
import { getSubpageTranslations } from "@/lib/i18n-subpages";
import { ProtectedAccessGate } from "@/components/protected-access-gate";
import {
  CreditCard,
  CheckCircle2,
  Download,
  ArrowLeft,
  ShieldCheck,
  Users,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { InvoiceItem } from "@/lib/store";

interface SubscriptionState {
  plan: "starter" | "professional" | "enterprise";
  status: string;
  seatsUsed: number;
  seatsTotal: number;
  monthlyPriceUsd: number;
  renewalDate: string;
  billingCycle: string;
}

export default function BillingPortalPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = getSubpageTranslations(locale);

  const PLANS = [
    {
      id: "starter",
      name: locale === "ar" ? "البداية" : "Starter",
      priceMonthly: 0,
      priceAnnual: 0,
      seats: 1,
      description: locale === "ar" ? "تصفح الكتالوج العام وتوثيق الشركة" : "Public catalog browsing and company registration verification.",
      features: [
        locale === "ar" ? "تسجيل الشركة والتحقق الأساسي" : "Company registration & basic KYB",
        locale === "ar" ? "تصفح كتالوج السلع العام" : "Browse public commodity catalog",
        locale === "ar" ? "عرض المواصفات القياسية" : "View standard specifications",
        locale === "ar" ? "دعم بالبريد الإلكتروني" : "Email support",
      ],
    },
    {
      id: "professional",
      name: locale === "ar" ? "المحترف" : "Professional",
      priceMonthly: 499,
      priceAnnual: 399,
      seats: 5,
      popular: false,
      description: locale === "ar" ? "وصول كامل لتداول السلع وغرف الصفقات المراقبة" : "Full access to commodity trading and supervised deal rooms.",
      features: [
        locale === "ar" ? "نشر طلبات الشراء وعروض التوريد" : "Post buy requests & supply offers",
        locale === "ar" ? "محرك مطابقة الصفقات ومقترحات الوسيط" : "Broker matching engine & proposals",
        locale === "ar" ? "غرف صفقات خاصة مشفرة واجتماعات فيديو" : "Private E2EE deal rooms & video meetings",
        locale === "ar" ? "حماية الوثائق بالعلامات المائية" : "Watermarked document viewer",
        locale === "ar" ? "عمولة تداول قياسية (1.25% - 1.50%)" : "Standard deal brokerage rate (1.25% - 1.50%)",
        locale === "ar" ? "أولوية في فحص الامتثال" : "Priority compliance screening",
      ],
    },
    {
      id: "enterprise",
      name: locale === "ar" ? "المؤسسات" : "Enterprise",
      priceMonthly: 1999,
      priceAnnual: 1599,
      seats: 15,
      popular: true,
      description: locale === "ar" ? "مكاتب تداول مؤسسية متعددة المقاعد مع وسيط مخصص" : "Multi-seat corporate trading desk with custom broker assignment.",
      features: [
        locale === "ar" ? "طلبات وعروض غير محدودة" : "Unlimited buy requests & supply offers",
        locale === "ar" ? "15 مقعد تداول مع إدارة الأدوار" : "15 Trading Desk seats with RBAC roles",
        locale === "ar" ? "وسيط أول ومسؤول امتثال مخصص" : "Dedicated Senior Broker & Compliance Officer",
        locale === "ar" ? "خصومات خاصة على عمولات التداول" : "Volume-discounted brokerage commission",
        locale === "ar" ? "غرف فيديو مشفرة مع حفظ السجلات" : "LiveKit E2EE WebRTC with custom recording retention",
        locale === "ar" ? "اتفاقية مستوى خدمة ودعم طوارئ 24/7" : "Custom SLA & 24/7 emergency desk",
      ],
    },
  ];

  const router = useRouter();
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState<SubscriptionState | null>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(() => searchParams.get("demo") === "true");
  const [updatingPlan, setUpdatingPlan] = useState(false);
  const [downloadModal, setDownloadModal] = useState<string | null>(null);

  const fetchBillingData = async (demo = isDemoMode) => {
    try {
      setLoading(true);
      const url = demo ? "/api/billing?demo=true" : "/api/billing";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setSubscription(data.subscription);
        setInvoices(data.invoices);
        if (data.isDemoSimulation) {
          setIsDemoMode(true);
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
          setIsDemoMode(false);
        }
      } else {
        setIsAuthorized(false);
      }
    } catch (e) {
      console.error(e);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isExplicitDemo = searchParams.get("demo") === "true";
    if (isExplicitDemo) {
      setIsDemoMode(true);
      fetchBillingData(true);
    } else {
      fetchBillingData(false);
    }
  }, [searchParams]);

  const handlePlanChange = async (planId: "starter" | "professional" | "enterprise") => {
    if (subscription?.plan === planId) return;
    setUpdatingPlan(true);
    try {
      if (planId === "starter") {
        const res = await fetch("/api/billing", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: planId }),
        });
        const data = await res.json();
        if (data.success) {
          setSubscription(data.subscription);
        }
        return;
      }

      // Paid plans: request Lemon Squeezy checkout link
      const checkoutRes = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, cycle: billingCycle }),
      });
      const checkoutData = await checkoutRes.json();

      if (checkoutData.success && checkoutData.checkoutUrl) {
        window.location.href = checkoutData.checkoutUrl;
        return;
      }

      // Fallback
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.success) {
        setSubscription(data.subscription);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingPlan(false);
    }
  };

  return (
    <ProtectedAccessGate
      locale={locale}
      pageTitleAr="بوابة الفوترة واشتراك الشركة"
      pageTitleEn="Company Billing & Invoices Portal"
      requiredRoleAr="مسؤولو الفوترة والحسابات بالشركة"
      requiredRoleEn="Company Billing & Finance Officers"
      isAuthorized={isAuthorized}
      isDemoMode={isDemoMode}
      onEnableDemo={() => {
        setIsDemoMode(true);
        fetchBillingData(true);
      }}
    >
      <div className="min-h-screen bg-[#07080c] text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#1f2233] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                {t.common.backHome}
              </Link>
              <span className="text-gray-600">/</span>
              <span className="text-xs text-[#d4956b] font-medium">{t.billing.breadcrumb}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#b87333]/20 to-[#0e1017] border border-[#b87333]/30 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#d4956b]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
                {t.billing.title}
              </h1>
            </div>
            <p className="text-xs text-gray-400 max-w-2xl">
              {t.billing.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1017] border border-emerald-500/30 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.common.usdReference}</span>
            </div>
          </div>
        </div>

        {/* Lemon Squeezy Success Activation Banner */}
        {searchParams.get("success") === "true" && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4 text-xs animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <span className="font-semibold text-white block">
                  {locale === "ar" ? "تم تفعيل الاشتراك المؤسسي بنجاح!" : "Subscription Activated Successfully!"}
                </span>
                <span className="text-gray-300">
                  {locale === "ar"
                    ? "تمت معالجة الدفع عبر Lemon Squeezy وتفعيل حسابك المؤسسي وغرف الصفقات المشفرة بالكامل."
                    : "Payment processed via Lemon Squeezy. Your institutional membership and deal rooms are now unlocked."}
                </span>
              </div>
            </div>
            <button
              onClick={() => router.replace("/billing")}
              className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 underline"
            >
              {locale === "ar" ? "إغلاق الإشعار" : "Dismiss"}
            </button>
          </div>
        )}

        {/* Banking Channel Separation Notice */}
        <div className="p-4 rounded-2xl bg-[#0f121d] border border-[#b87333]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#d4956b] flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <span className="font-semibold text-white block">
                {t.billing.milestoneNotice}
              </span>
              <p className="text-gray-400 leading-relaxed max-w-3xl">
                {locale === "ar"
                  ? "تغطي فواتير VALOREA MARKET اشتراكات المنصة وعمولات الوساطة المتفق عليها فقط. وتتم تسوية قيمة شحنات السلع الفعلية (اعتمادات مستندية أو تحويلات بنكية) مباشرة بين البنوك المعتمدة للمشتري والمورد."
                  : "VALOREA MARKET invoices solely cover platform subscription memberships and agreed brokerage commissions. Physical commodity settlement is executed directly between authorized banking institutions."}
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-[#b87333]/20 text-[#d4956b] border border-[#b87333]/40 whitespace-nowrap">
            {t.common.verifiedBrokerage}
          </span>
        </div>

        {/* Current Active Plan Overview Card */}
        {subscription && (
          <div className="bg-[#0e1017] border border-[#23273b] rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono uppercase text-[#d4956b] font-semibold tracking-wider">
                    {t.billing.currentPlan}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {locale === "ar" ? "نشط ومطابق" : "Active & Compliant"}
                  </span>
                </div>
                <h2 className="text-3xl font-bold font-mono text-white capitalize">
                  {subscription.plan}
                </h2>
                <p className="text-xs text-gray-400">
                  {t.billing.renewal}:{" "}
                  <span className="text-gray-200 font-mono">
                    {subscription.renewalDate}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                {/* Seats Quota */}
                <div className="bg-[#141724] border border-[#23273b] p-3.5 rounded-xl text-xs space-y-1 min-w-[160px]">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#d4956b]" />
                      {t.billing.seats}
                    </span>
                    <span className="font-mono text-white font-bold">
                      {subscription.seatsUsed} / {subscription.seatsTotal}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#0a0c13] overflow-hidden mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-[#b87333] to-[#d4956b]"
                      style={{
                        width: `${(subscription.seatsUsed / subscription.seatsTotal) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Monthly Rate */}
                <div className="bg-[#141724] border border-[#23273b] p-3.5 rounded-xl text-xs space-y-0.5 min-w-[160px]">
                  <span className="text-gray-400 block text-[11px]">{t.billing.monthlyBilling}</span>
                  <div className="text-2xl font-bold font-mono text-[#c9a961]">
                    ${subscription.monthlyPriceUsd.toLocaleString()}{" "}
                    <span className="text-xs text-gray-400 font-normal">USD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tiers Selection Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">{t.billing.title}</h3>
              <p className="text-xs text-gray-400">{t.billing.subtitle}</p>
            </div>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center bg-[#0e1017] border border-[#23273b] p-1 rounded-xl text-xs">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-colors",
                  billingCycle === "monthly"
                    ? "bg-[#b87333] text-white font-medium"
                    : "text-gray-400 hover:text-white"
                )}
              >
                {t.billing.monthlyBilling}
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annually")}
                className={cn(
                  "px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5",
                  billingCycle === "annually"
                    ? "bg-[#b87333] text-white font-medium"
                    : "text-gray-400 hover:text-white"
                )}
              >
                <span>{t.billing.annualBilling}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  -20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan) => {
              const isCurrent = subscription?.plan === plan.id;
              const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceAnnual;

              return (
                <div
                  key={plan.id}
                  className={cn(
                    "bg-[#0e1017] rounded-2xl p-6 border transition-all flex flex-col justify-between space-y-6 relative shadow-xl",
                    isCurrent
                      ? "border-[#b87333] ring-1 ring-[#b87333]/50"
                      : "border-[#1f2233] hover:border-[#2d324d]"
                  )}
                >
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                      <p className="text-xs text-gray-400 mt-1 min-h-[32px]">{plan.description}</p>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-1 font-mono">
                        <span className="text-3xl font-bold text-white">${price}</span>
                        <span className="text-xs text-gray-500 font-sans">
                          {locale === "ar"
                            ? (billingCycle === "monthly" ? "دولار / شهر" : "دولار / شهر (مكافئ سنوي)")
                            : (billingCycle === "monthly" ? "USD / mo" : "USD / mo (equiv.)")}
                        </span>
                      </div>
                      {billingCycle === "annually" && plan.priceAnnual > 0 && (
                        <div className="text-[11px] text-[#d4956b] font-mono mt-1">
                          {locale === "ar"
                            ? `$${(plan.priceAnnual * 12).toLocaleString()} دولار يُدفع سنوياً`
                            : `$${(plan.priceAnnual * 12).toLocaleString()} USD billed annually`}
                        </div>
                      )}
                    </div>

                    <div className="text-xs text-gray-400 flex items-center gap-2 border-t border-[#181b29] pt-3">
                      <Users className="w-3.5 h-3.5 text-[#d4956b]" />
                      <span>
                        {locale === "ar"
                          ? (plan.seats === 1 ? "مقعد تداول مؤسسي واحد" : `${plan.seats} مقاعد تداول مؤسسية`)
                          : `${plan.seats} ${plan.seats === 1 ? "Trading Seat" : "Trading Seats"}`}
                      </span>
                    </div>

                    <ul className="space-y-2 text-xs text-gray-300 border-t border-[#181b29] pt-4">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#d4956b] flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    disabled={isCurrent || updatingPlan}
                    onClick={() => handlePlanChange(plan.id as "starter" | "professional" | "enterprise")}
                    className={cn(
                      "w-full py-2.5 rounded-xl text-xs font-semibold transition-all",
                      isCurrent
                        ? "bg-[#161929] border border-[#262a40] text-gray-400 cursor-default"
                        : "bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white shadow-lg shadow-[#b87333]/20"
                    )}
                  >
                    {isCurrent ? t.billing.currentPlan : t.billing.upgradePlan}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Institutional Payment Gateway & Wire Notice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1017] border border-[#23273b] flex items-start gap-3.5 text-xs text-gray-300">
          <CreditCard className="w-5 h-5 text-[#d4956b] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white block">
              {locale === "ar"
                ? "قنوات السداد المصرفي المؤسسي المعتمدة (B2B Wire Clearing)"
                : "Approved Institutional Payment Channels (B2B Wire Clearing)"}
            </span>
            <p className="text-gray-400 leading-relaxed text-[11px]">
              {locale === "ar"
                ? "تتم تسوية اشتراكات المنصة وعمولات الوساطة حصرياً عبر التحويلات المصرفية المباشرة (SWIFT / SEPA / Fedwire) إلى حساب VALOREA MARKET International AG المعتمد في جنيف، سويسرا. بوابة الدفع ببطاقات الائتمان الاستهلاكية غير مفعلة للحفاظ على معايير الامتثال المؤسسي ومكافحة غسيل الأموال."
                : "Platform subscriptions and brokerage fees are settled exclusively via institutional wire transfer (SWIFT / SEPA / Fedwire) to VALOREA MARKET International AG in Geneva, Switzerland. Direct consumer card gateway is disabled in compliance with institutional trade mandates."}
            </p>
          </div>
        </div>

        {/* Invoices History Table */}
        <div className="bg-[#0c0e17] border border-[#1f2233] rounded-2xl overflow-hidden shadow-xl mt-8">
          <div className="px-5 py-4 border-b border-[#1f2233] flex items-center justify-between bg-[#0e1017]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#d4956b]" />
              <span className="text-sm font-semibold text-white">
                {t.billing.invoicesTitle} ({invoices.length})
              </span>
            </div>
            <span className="text-xs text-gray-500 font-mono">{t.common.usdReference}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right">
              <thead className="bg-[#121422] text-gray-400 uppercase tracking-wider text-[11px] border-b border-[#1f2233]">
                <tr>
                  <th className="p-3.5">{locale === "ar" ? "رقم الفاتورة" : "#"}</th>
                  <th className="p-3.5">{locale === "ar" ? "الفئة والغرض" : t.billing.currentPlan}</th>
                  <th className="p-3.5">{locale === "ar" ? "المبلغ (دولار)" : "USD"}</th>
                  <th className="p-3.5">{locale === "ar" ? "الإجراء" : t.billing.downloadPdf}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181b29] text-gray-300">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#141724]">
                    <td className="p-3.5 font-mono text-[#d4956b] font-medium">
                      {inv.invoiceNumber}
                    </td>
                    <td className="p-3.5 text-gray-300">
                      {inv.type === "subscription" ? (locale === "ar" ? "اشتراك المنصة" : t.billing.title) : (locale === "ar" ? "عمولة وساطة الصفقات" : t.common.verifiedBrokerage)}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-white">
                      ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {locale === "ar" ? "دولار" : "USD"}
                    </td>
                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => setDownloadModal(inv.invoiceNumber)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#141724] border border-[#23273b] hover:border-[#b87333]/50 text-xs text-gray-300 hover:text-white transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{locale === "ar" ? "تحميل PDF" : "PDF"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Simulated Invoice Download Modal */}
        {downloadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#0e1017] border border-[#23273b] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#1f2233] pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#d4956b]" />
                  <span className="font-bold text-white">{t.billing.downloadPdf}</span>
                </div>
                <button
                  onClick={() => setDownloadModal(null)}
                  className="text-gray-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2 text-xs text-gray-300">
                <p>
                  {downloadModal}
                </p>
                <div className="bg-[#141724] p-3 rounded-lg border border-[#23273b] font-mono text-[11px] text-gray-400">
                  SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDownloadModal(null)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] text-white text-xs font-semibold"
                >
                  {t.billing.downloadPdf}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </ProtectedAccessGate>
  );
}
