"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, DollarSign, Scale, ShieldCheck } from "lucide-react";

export default function BrokeragePolicyPage() {
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
          <span className="text-xs text-[#d4956b] font-medium">Brokerage & Settlement Policy</span>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b87333]/15 border border-[#b87333]/30 text-xs font-mono text-[#d4956b]">
            <DollarSign className="w-3.5 h-3.5" />
            <span>USD Benchmark Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
            Brokerage Mandate & Settlement Rules
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Institutional Fee Structures, Milestone Invoicing, and Non-Custodial Cargo Settlement
          </p>
        </div>

        <div className="bg-[#0e1017] border border-[#23273b] rounded-2xl p-8 space-y-6 text-xs text-gray-300 leading-relaxed shadow-xl">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
              1. Non-Custodial Physical Cargo Settlement
            </h2>
            <p className="p-3.5 rounded-xl bg-[#141724] border border-[#b87333]/30 text-white font-medium">
              Important: GVCE is an intermediary technology broker and does not receive, custody, or disburse the principal purchase funds for physical commodity deliveries.
            </p>
            <p>
              The settlement of physical cargo (crude oil cargoes, refined fuel parcels, metric tons of fertilizers, metals, or sugar) must be completed directly between the authorized commercial banking accounts of the Buyer and Supplier. Acceptable instruments include Irrevocable Documentary Letters of Credit (DLC), Standby Letters of Credit (SBLC), or Bank Guarantees.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
              2. Brokerage Commission Structure
            </h2>
            <p>
              GVCE earns a standardized brokerage fee (ordinarily 1.00% to 1.50% of total cargo contract value, benchmarked in USD) for its match discovery, compliance due diligence, deal room hosting, and intermediary supervision services.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Fees are denominated in USD regardless of the contract's local billing currency.</li>
              <li>Obligor allocation (Buyer, Supplier, or 50/50 split) is formally codified in the bilateral Trade Agreement.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
              3. Milestone Invoicing & Payment Terms
            </h2>
            <p>
              Brokerage fees mature upon verified contractual milestones (e.g. Letter of Credit operative confirmation, SGS inspection release, or Bill of Lading issuance). GVCE issues a formal Swiss VAT-compliant tax invoice payable within fifteen (15) banking days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
