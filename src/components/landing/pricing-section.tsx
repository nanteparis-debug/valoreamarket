"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { Check, Sparkles, ArrowRight, ShieldCheck, Landmark, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PLATFORM_PRICING_PLANS,
  BROKERAGE_COMMISSION_POLICY,
  SALES_CONTACT_EMAIL,
} from "@/lib/pricing-data";

interface PricingSectionProps {
  translations: {
    title: string;
    subtitle: string;
    monthly: string;
    annually: string;
    save: string;
    perMonth: string;
    perYear: string;
    upgrade: string;
    contactSales: string;
    registerFree?: string;
    getStarted?: string;
    usdHeader?: string;
    note?: string;
    savePercent?: string;
    recommended?: string;
    usdCurrency?: string;
    starter: { name: string; description: string; features: string[] };
    professional: { name: string; description: string; features: string[] };
    enterprise: { name: string; description: string; features: string[] };
  };
}

export function PricingSection({ translations }: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "annually"
  );

  const plans = [
    {
      ...PLATFORM_PRICING_PLANS[0],
      name: translations.starter.name,
      description: translations.starter.description,
      features: translations.starter.features,
      isPopular: false,
      isExternal: false,
      cta: translations.registerFree || "Register Free",
      href: "/auth/register",
    },
    {
      ...PLATFORM_PRICING_PLANS[1],
      name: translations.professional.name,
      description: translations.professional.description,
      features: translations.professional.features,
      isPopular: true,
      isExternal: false,
      cta: translations.getStarted || "Get Started",
      href: "/auth/register",
    },
    {
      ...PLATFORM_PRICING_PLANS[2],
      name: translations.enterprise.name,
      description: translations.enterprise.description,
      features: translations.enterprise.features,
      isPopular: false,
      cta: translations.contactSales,
      href: `mailto:${SALES_CONTACT_EMAIL}?subject=VALOREA%20MARKET%20Enterprise%20Commodity%20Desk%20Inquiry`,
      isExternal: true,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121420] border border-[#23273b] text-xs font-mono text-[#d4956b] mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{translations.usdHeader || "USD Denominated • Corporate Membership & Non-Custodial Brokerage"}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {translations.title}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-gray-400">
          {translations.subtitle}
        </p>

        {/* Billing Cycle Switcher */}
        <div className="mt-8 inline-flex items-center p-1 rounded-2xl bg-[#0e1017] border border-[#23273b]">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all",
              billingCycle === "monthly"
                ? "bg-[#181b29] text-white shadow"
                : "text-gray-400 hover:text-white"
            )}
          >
            {translations.monthly}
          </button>
          <button
            onClick={() => setBillingCycle("annually")}
            className={cn(
              "px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2",
              billingCycle === "annually"
                ? "bg-[#b87333] text-white shadow-lg shadow-[#b87333]/25"
                : "text-gray-400 hover:text-white"
            )}
          >
            <span>{translations.annually}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] text-white font-mono uppercase">
              {translations.savePercent || "Save 20%"}
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => {
          const displayPrice =
            billingCycle === "monthly"
              ? plan.priceMonthly
              : plan.priceAnnuallyMonthlyEquivalent;

          return (
            <div
              key={plan.id}
              className={cn(
                "rounded-3xl p-8 flex flex-col justify-between transition-all relative",
                plan.isPopular
                  ? "bg-[#0e111a] border-2 border-[#b87333] shadow-2xl shadow-[#b87333]/15 lg:-translate-y-2"
                  : "bg-[#0c0e17] border border-[#23273b] hover:border-[#383d5a]"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#b87333] to-[#c9a961] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3" /> {translations.recommended || "Recommended"}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <span className="text-[11px] font-mono text-gray-400 px-2 py-0.5 rounded bg-[#161824] border border-[#23273b]">
                    {plan.seats} {plan.seats === 1 ? "Seat" : "Seats"}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-2 min-h-[32px]">
                  {plan.description}
                </p>

                {/* Price Display in USD */}
                <div className="mt-6 flex flex-col">
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-sm font-semibold text-[#d4956b]">
                      {translations.usdCurrency || "USD"}
                    </span>
                    <span className="text-4xl font-extrabold text-white">
                      ${displayPrice}
                    </span>
                    <span className="text-xs text-gray-400">
                      {translations.perMonth}
                    </span>
                  </div>

                  {/* Full Annual Amount Due (Required by Specification) */}
                  {billingCycle === "annually" && plan.annualBilledTotal > 0 && (
                    <div className="mt-1.5 text-xs text-[#d4956b] font-mono flex items-center gap-1.5">
                      <span>
                        ${plan.annualBilledTotal.toLocaleString()} billed annually
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                        Save ${plan.annualSavingsUsd.toLocaleString()}/yr
                      </span>
                    </div>
                  )}
                  {billingCycle === "monthly" && plan.priceMonthly > 0 && (
                    <div className="mt-1.5 text-xs text-gray-500 font-mono">
                      Billed monthly • Cancel anytime
                    </div>
                  )}
                  {plan.priceMonthly === 0 && (
                    <div className="mt-1.5 text-xs text-emerald-400 font-mono">
                      Free for verified market participants
                    </div>
                  )}
                </div>

                {/* Feature List */}
                <div className="mt-8 space-y-3">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm">
                      <div className="p-0.5 rounded-full bg-[#1b1f2e] text-[#d4956b] shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan Action CTA */}
              <div className="mt-10 pt-6 border-t border-[#1f2233]">
                {plan.isExternal ? (
                  <a
                    href={plan.href}
                    className="w-full py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 bg-[#141724] hover:bg-[#1a1f30] text-gray-200 border border-[#23273b] transition-all"
                  >
                    <Mail className="w-4 h-4 text-[#d4956b]" />
                    <span>{plan.cta}</span>
                  </a>
                ) : (
                  <Link
                    href={plan.href}
                    className={cn(
                      "w-full py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all",
                      plan.isPopular
                        ? "bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white shadow-lg shadow-[#b87333]/20"
                        : "bg-[#141724] hover:bg-[#1a1f30] text-gray-200 border border-[#23273b]"
                    )}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                )}
                <p className="text-[10px] text-gray-500 text-center mt-2.5">
                  {translations.note || "Platform subscription fees billed in USD • Brokerage commissions separate"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Independent Brokerage Commission & Non-Custodial Cargo Settlement Policy Banner */}
      <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#0c0e17] border border-[#23273b] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-start max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121420] border border-[#b87333]/40 text-xs font-mono text-[#d4956b]">
            <Landmark className="w-3.5 h-3.5" />
            <span>Independent Transaction Brokerage Rate: {BROKERAGE_COMMISSION_POLICY.rateRangeDisplay}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {BROKERAGE_COMMISSION_POLICY.settlementNoticeTitle}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            {BROKERAGE_COMMISSION_POLICY.settlementNoticeDescription}
          </p>
          <div className="text-[11px] text-gray-500 font-mono pt-1">
            Governed by {BROKERAGE_COMMISSION_POLICY.governingModel} • Liquidated circumvention damages: {BROKERAGE_COMMISSION_POLICY.liquidatedDamages} • {BROKERAGE_COMMISSION_POLICY.arbitrationJurisdiction}
          </div>
        </div>

        <div className="shrink-0">
          <Link
            href="/legal/brokerage"
            className="px-6 py-3 rounded-xl bg-[#141724] hover:bg-[#1c2133] border border-[#23273b] text-gray-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <span>Read Brokerage Policy</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}
