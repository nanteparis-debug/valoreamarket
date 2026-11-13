"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import {
  CreditCard,
  CheckCircle2,
  Download,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Sparkles,
  FileText,
  AlertCircle,
  RefreshCw,
  ExternalLink,
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

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 0,
    priceAnnual: 0,
    seats: 1,
    description: "Public catalog browsing and company registration verification.",
    features: [
      "Company registration & basic KYB",
      "Browse public commodity catalog",
      "View standard specifications",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    priceMonthly: 499,
    priceAnnual: 399,
    seats: 5,
    popular: false,
    description: "Full access to commodity trading and supervised deal rooms.",
    features: [
      "Post buy requests & supply offers",
      "Broker matching engine & proposals",
      "Private E2EE deal rooms & video meetings",
      "Watermarked document viewer",
      "Standard deal brokerage rate (1.25% - 1.50%)",
      "Priority compliance screening",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: 1999,
    priceAnnual: 1599,
    seats: 15,
    popular: true,
    description: "Multi-seat corporate trading desk with custom broker assignment.",
    features: [
      "Unlimited buy requests & supply offers",
      "15 Trading Desk seats with RBAC roles",
      "Dedicated Senior Broker & Compliance Officer",
      "Volume-discounted brokerage commission",
      "LiveKit E2EE WebRTC with custom recording retention",
      "Custom SLA & 24/7 emergency desk",
    ],
  },
];

export default function BillingPortalPage() {
  const [subscription, setSubscription] = useState<SubscriptionState | null>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
  const [loading, setLoading] = useState(true);
  const [updatingPlan, setUpdatingPlan] = useState(false);
  const [downloadModal, setDownloadModal] = useState<string | null>(null);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/billing");
      const data = await res.json();
      if (data.success) {
        setSubscription(data.subscription);
        setInvoices(data.invoices);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillingData();
  }, []);

  const handlePlanChange = async (planId: "starter" | "professional" | "enterprise") => {
    if (subscription?.plan === planId) return;
    setUpdatingPlan(true);
    try {
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
                Return to Home
              </Link>
              <span className="text-gray-600">/</span>
              <span className="text-xs text-[#d4956b] font-medium">Subscriptions & Billing</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#b87333]/20 to-[#0e1017] border border-[#b87333]/30 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#d4956b]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
                Company Subscriptions & Invoicing Portal
              </h1>
            </div>
            <p className="text-xs text-gray-400 max-w-2xl">
              Manage your company SaaS trading tiers, seat quotas, and invoices. All fees are benchmarked strictly in US Dollars (USD).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1017] border border-emerald-500/30 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>USD Reference Billing</span>
            </div>
          </div>
        </div>

        {/* Banking Channel Separation Notice */}
        <div className="p-4 rounded-2xl bg-[#0f121d] border border-[#b87333]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#d4956b] flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs">
              <span className="font-semibold text-white block">
                Banking Channel Settlement Policy:
              </span>
              <p className="text-gray-400 leading-relaxed max-w-3xl">
                GVCE invoices solely cover platform subscription memberships and agreed brokerage commissions.
                The settlement of physical commodity cargo (Letter of Credit, Telegraphic Transfer, or Escrow) is executed directly between buyer and supplier banking institutions.
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded bg-[#b87333]/20 text-[#d4956b] border border-[#b87333]/40 whitespace-nowrap">
            Non-Custodial
          </span>
        </div>

        {/* Current Active Plan Overview Card */}
        {subscription && (
          <div className="bg-[#0e1017] border border-[#23273b] rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono uppercase text-[#d4956b] font-semibold tracking-wider">
                    Current Active Membership
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Active & Compliant
                  </span>
                </div>
                <h2 className="text-3xl font-bold font-mono text-white capitalize">
                  {subscription.plan} Trading Desk
                </h2>
                <p className="text-xs text-gray-400">
                  Renews on{" "}
                  <span className="text-gray-200 font-mono">
                    {new Date(subscription.renewalDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>{" "}
                  via corporate credit line or invoice.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                {/* Seats Quota */}
                <div className="bg-[#141724] border border-[#23273b] p-3.5 rounded-xl text-xs space-y-1 min-w-[160px]">
                  <div className="flex items-center justify-between text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#d4956b]" />
                      Seat Allocation
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
                  <span className="text-[10px] text-gray-500">
                    {subscription.seatsTotal - subscription.seatsUsed} seats available
                  </span>
                </div>

                {/* Monthly Rate */}
                <div className="bg-[#141724] border border-[#23273b] p-3.5 rounded-xl text-xs space-y-0.5 min-w-[160px]">
                  <span className="text-gray-400 block text-[11px]">Monthly Billing</span>
                  <div className="text-2xl font-bold font-mono text-[#c9a961]">
                    ${subscription.monthlyPriceUsd.toLocaleString()}{" "}
                    <span className="text-xs text-gray-400 font-normal">USD/mo</span>
                  </div>
                  <span className="text-[10px] text-gray-500">Separated from deal commissions</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Tiers Selection Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white">Membership Tiers</h3>
              <p className="text-xs text-gray-400">Switch or upgrade your corporate trading seats at any time.</p>
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
                Monthly
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
                <span>Annually</span>
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
                  {plan.popular && (
                    <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#b87333] to-[#8b5a2b] text-[10px] font-bold text-white tracking-wider uppercase shadow-md">
                      Recommended
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                      <p className="text-xs text-gray-400 mt-1 min-h-[32px]">{plan.description}</p>
                    </div>

                    <div className="flex items-baseline gap-1 font-mono">
                      <span className="text-3xl font-bold text-white">${price}</span>
                      <span className="text-xs text-gray-500">USD / month</span>
                    </div>

                    <div className="text-xs text-gray-400 flex items-center gap-2 border-t border-[#181b29] pt-3">
                      <Users className="w-3.5 h-3.5 text-[#d4956b]" />
                      <span>{plan.seats} Trading Seat{plan.seats > 1 ? "s" : ""} included</span>
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
                    {isCurrent ? "Current Active Plan" : `Switch to ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoices History Table */}
        <div className="bg-[#0c0e17] border border-[#1f2233] rounded-2xl overflow-hidden shadow-xl mt-8">
          <div className="px-5 py-4 border-b border-[#1f2233] flex items-center justify-between bg-[#0e1017]">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#d4956b]" />
              <span className="text-sm font-semibold text-white">
                Billing & Fee History ({invoices.length} Invoices)
              </span>
            </div>
            <span className="text-xs text-gray-500 font-mono">Tax Invoices (USD)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#121422] text-gray-400 uppercase tracking-wider text-[11px] border-b border-[#1f2233]">
                <tr>
                  <th className="p-3.5">Invoice #</th>
                  <th className="p-3.5">Category & Purpose</th>
                  <th className="p-3.5">Date Issued</th>
                  <th className="p-3.5">Due Date</th>
                  <th className="p-3.5">Amount (USD)</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Receipt / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181b29] text-gray-300">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#141724]">
                    <td className="p-3.5 font-mono text-[#d4956b] font-medium">
                      {inv.invoiceNumber}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                            inv.type === "subscription"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                              : "bg-[#b87333]/20 text-[#d4956b] border border-[#b87333]/30"
                          )}
                        >
                          {inv.type === "subscription" ? "SaaS Subscription" : "Deal Brokerage Fee"}
                        </span>
                        {inv.dealReference && (
                          <span className="font-mono text-gray-500 text-[10px]">
                            Ref: {inv.dealReference}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-gray-400 font-mono">
                      {new Date(inv.issueDate).toLocaleDateString("en-US")}
                    </td>
                    <td className="p-3.5 text-gray-400 font-mono">
                      {new Date(inv.dueDate).toLocaleDateString("en-US")}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-white">
                      ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                    </td>
                    <td className="p-3.5">
                      <span
                        className={cn(
                          "px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase",
                          inv.status === "paid"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        )}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setDownloadModal(inv.invoiceNumber)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#141724] border border-[#23273b] hover:border-[#b87333]/50 text-xs text-gray-300 hover:text-white transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
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
                  <span className="font-bold text-white">Invoice Download Ready</span>
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
                  Official tax receipt and settlement certificate for{" "}
                  <span className="font-mono text-[#d4956b] font-bold">{downloadModal}</span> has been compiled in compliance with Swiss Commercial & VAT Regulations.
                </p>
                <div className="bg-[#141724] p-3 rounded-lg border border-[#23273b] font-mono text-[11px] text-gray-400">
                  SHA-256 Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDownloadModal(null)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] text-white text-xs font-semibold"
                >
                  Save Tax Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
