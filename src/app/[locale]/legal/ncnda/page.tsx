"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, FileCheck2, Lock, ShieldCheck } from "lucide-react";

export default function NCNDAPage() {
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
          <span className="text-xs text-[#d4956b] font-medium">ICC 769 NCNDA Agreement</span>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b87333]/15 border border-[#b87333]/30 text-xs font-mono text-[#d4956b]">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>International Chamber of Commerce Model 769</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
            Non-Circumvention, Non-Disclosure & Working Agreement
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Mandatory Binding Electronic Execution Prior to Deal Room Disclosure
          </p>
        </div>

        <div className="bg-[#0e1017] border border-[#23273b] rounded-2xl p-8 space-y-6 text-xs text-gray-300 leading-relaxed shadow-xl">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
              1. Non-Circumvention Covenants
            </h2>
            <p>
              The signing parties agree not to circumvent, avoid, bypass, or obviate each other or GVCE, directly or indirectly, with respect to transactions, sources, clients, suppliers, or intermediaries introduced through the GVCE platform. This obligation shall remain valid for a period of five (5) years from the date of initial introduction.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
              2. Strict Confidentiality of Commercial Specs
            </h2>
            <p>
              All proprietary technical documents, laboratory assays, refinery allocation letters, and commercial pricing structures exchanged in GVCE deal rooms shall be held in strict confidence. Parties shall not duplicate, publish, or reveal such information to third parties without prior written consent.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
              3. Liquidated Damages & Enforcement
            </h2>
            <p>
              In the event of an intentional circumvention or unauthorized direct contracting between counterparties introduced by GVCE, the violating entity agrees to pay liquidated damages equal to three times (3x) the total anticipated brokerage commission of the transaction, plus all legal fees incurred in enforcement.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
