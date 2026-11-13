"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
      id: "starter",
      name: translations.starter.name,
      description: translations.starter.description,
      priceMonthly: 0,
      priceAnnually: 0,
      features: translations.starter.features,
      isPopular: false,
      cta: translations.registerFree || "Register Free",
    },
    {
      id: "professional",
      name: translations.professional.name,
      description: translations.professional.description,
      priceMonthly: 499,
      priceAnnually: 399,
      features: translations.professional.features,
      isPopular: true,
      cta: translations.getStarted || "Get Started",
    },
    {
      id: "enterprise",
      name: translations.enterprise.name,
      description: translations.enterprise.description,
      priceMonthly: 1999,
      priceAnnually: 1599,
      features: translations.enterprise.features,
      isPopular: false,
      cta: translations.contactSales,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121420] border border-[#23273b] text-xs font-mono text-[#d4956b] mb-4">
          <span>USD Denominated • Company Level</span>
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
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => {
          const price =
            billingCycle === "monthly" ? plan.priceMonthly : plan.priceAnnually;

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
                  <Sparkles className="w-3 h-3" /> Recommended
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-gray-400 mt-1 min-h-[32px]">
                  {plan.description}
                </p>

                {/* Price Display in USD */}
                <div className="mt-6 flex items-baseline gap-1 font-mono">
                  <span className="text-sm font-semibold text-[#d4956b]">USD</span>
                  <span className="text-4xl font-extrabold text-white">
                    ${price}
                  </span>
                  <span className="text-xs text-gray-400">
                    {billingCycle === "monthly"
                      ? translations.perMonth
                      : translations.perYear}
                  </span>
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
                <Link
                  href="/auth/register"
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
                <p className="text-[10px] text-gray-500 text-center mt-2.5">
                  Subscription billed in USD • Brokerage commissions separate
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
