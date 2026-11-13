"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Scale, ShieldCheck } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[#07080c] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex items-center gap-2 border-b border-[#1f2233] pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            Home
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-xs text-[#d4956b] font-medium">Terms of Service</span>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b87333]/15 border border-[#b87333]/30 text-xs font-mono text-[#d4956b]">
            <Scale className="w-3.5 h-3.5" />
            <span>Institutional B2B Contract</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
            Platform Terms of Service
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Effective Date: November 13, 2026 • Jurisdiction: Geneva, Switzerland
          </p>
        </div>

        <div className="bg-[#0e1017] border border-[#23273b] rounded-2xl p-8 space-y-6 text-xs text-gray-300 leading-relaxed shadow-xl">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
              1. Platform Nature & Scope
            </h2>
            <p>
              GVCE International AG (hereinafter "GVCE") operates a specialized, non-custodial electronic trade brokerage platform connecting verified corporate entities ("Buyers" and "Suppliers") for transactions in physical commodities. GVCE acts solely as an independent transaction broker and supervisor.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
              2. Non-Custodial Policy & Settlement of Cargo
            </h2>
            <p>
              GVCE does not hold, clear, or transmit funds for the purchase price of physical commodities. All payments for commodities shall be settled directly between the commercial banking institutions of the Buyer and Supplier through Documentary Letters of Credit (LC), Standby Letters of Credit (SBLC), or Telegraphic Transfer (TT) as agreed between the trading principals.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
              3. Verification & Compliance Requirements
            </h2>
            <p>
              Access to deal rooms, order matching, and document exchange is contingent upon maintaining an active "Approved" status in the GVCE Compliance Registry. Any entity subject to international sanctions (including OFAC, EU, UN, or UK sanctions regimes) or failing to submit verifiable Ultimate Beneficial Ownership (UBO) records shall be suspended immediately.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
              4. Anti-Circumvention and Non-Disclosure
            </h2>
            <p>
              All registered entities are bound by the ICC 769 Non-Circumvention, Non-Disclosure & Working Agreement incorporated herein. Bypassing the platform or directly contacting matched counterparties outside supervised GVCE channels constitutes a material breach entitling GVCE to liquidated damages equal to the full anticipated brokerage commission.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
              5. Governing Law and Arbitration
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the substantive laws of Switzerland, without regard to its conflict of laws principles. Any dispute arising out of or in connection with this agreement shall be submitted to the exclusive jurisdiction of the Swiss Arbitration Centre in Geneva.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
