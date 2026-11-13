"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import {
  HelpCircle,
  ChevronDown,
  ArrowLeft,
  ShieldCheck,
  DollarSign,
  Scale,
  Lock,
  FileCheck2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    category: "Verification & Compliance",
    questions: [
      {
        q: "What verification is required to participate in GVCE?",
        a: "Participation requires a 3-tier verification: (1) Corporate entity KYB verification validating registration, tax identification, and Ultimate Beneficial Ownership (UBO); (2) Authorized representative KYC validating identity and Power of Attorney; and (3) Automated continuous sanctions screening against OFAC, EU, UN, and UK consolidated lists.",
      },
      {
        q: "How does GVCE verify cargo title for suppliers?",
        a: "Suppliers must submit verifiable documentation of supply rights, such as refinery allocation contracts, terminal tank storage receipts (TSR), or bills of lading. These are verified by GVCE compliance officers prior to deal room activation.",
      },
      {
        q: "What happens if a company's compliance status is 'Pending' or 'Suspended'?",
        a: "Under the platform's strict Compliance Lock, entities with pending or suspended compliance cannot be matched and cannot enter active deal rooms. All deal proposals are automatically halted until compliance is re-certified.",
      },
    ],
  },
  {
    category: "Settlement & Banking Channels",
    questions: [
      {
        q: "Does GVCE hold or escrow physical cargo funds?",
        a: "No. GVCE is strictly a non-custodial brokerage platform. The settlement of cargo value (millions of USD) takes place directly between the buyer's bank and the seller's bank using conventional commercial instruments like Documentary Letters of Credit (LC), Standby Letters of Credit (SBLC), or Telegraphic Transfers (TT).",
      },
      {
        q: "Why is the US Dollar (USD) used as the platform reference currency?",
        a: "International physical commodities (petroleum, metals, fertilizers, sugar) are benchmarked globally in US Dollars. While parties may express contracts in EUR, AED, or other currencies, GVCE displays USD equivalents to ensure transparent, normalized comparisons across international offers.",
      },
    ],
  },
  {
    category: "Deal Rooms & Document Security",
    questions: [
      {
        q: "Why does the deal room chat intercept contact details (phone numbers, emails)?",
        a: "To protect the integrity of the brokerage mandate and enforce the ICC 769 Non-Circumvention agreement signed by all participants, messages containing external phone numbers, personal emails, or messenger handles are sanitized and reviewed before delivery.",
      },
      {
        q: "Can other participants download my original technical documents?",
        a: "No participant can download original unredacted documents without explicit authorization from the document owner organization. Other participants can only inspect dynamically watermarked previews containing session timestamps and user identifiers.",
      },
      {
        q: "Are video meetings recorded or monitored?",
        a: "Video meetings are conducted over End-to-End Encrypted (E2EE) WebRTC channels powered by LiveKit. A supervised GVCE broker facilitates the session to record commercial milestones and draft binding terms.",
      },
    ],
  },
  {
    category: "Subscriptions & Brokerage Fees",
    questions: [
      {
        q: "What is the difference between subscription plans and brokerage commissions?",
        a: "Subscription plans (Starter, Professional, Enterprise) are recurring monthly or annual SaaS fees that cover software access, seats, compliance screening, and deal room hosting. Brokerage commissions are separate success-based fees (typically 1.0% - 1.5%) charged only upon successful deal execution and milestone trigger.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "0-0": true,
    "1-0": true,
  });

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 border-b border-[#1f2233] pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            Home
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-xs text-[#d4956b] font-medium">Frequently Asked Questions</span>
        </div>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b87333]/15 border border-[#b87333]/30 text-xs font-mono text-[#d4956b]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Knowledge Base & Protocols</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Everything you need to know about trading, compliance, non-custodial settlement, and cryptographic deal rooms on GVCE.
          </p>
        </div>

        {/* FAQ Groups */}
        <div className="space-y-8">
          {FAQS.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#d4956b] font-mono">
                {group.category}
              </h2>

              <div className="space-y-2.5">
                {group.questions.map((q, qIdx) => {
                  const key = `${groupIdx}-${qIdx}`;
                  const isOpen = !!openItems[key];

                  return (
                    <div
                      key={qIdx}
                      className="bg-[#0e1017] border border-[#23273b] rounded-xl overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(key)}
                        className="w-full p-4 text-left rtl:text-right flex items-center justify-between gap-4 text-xs sm:text-sm font-medium text-white hover:text-[#d4956b] transition-colors"
                      >
                        <span>{q.q}</span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0",
                            isOpen && "rotate-180 text-[#d4956b]"
                          )}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 text-xs text-gray-400 leading-relaxed border-t border-[#181b29] pt-3">
                          {q.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="bg-[#0c0e17] border border-[#1f2233] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <h3 className="font-bold text-white text-sm">Have additional compliance questions?</h3>
            <p className="text-gray-400">Our legal and brokerage desks in Geneva and Dubai are available 24/7.</p>
          </div>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] text-white font-medium hover:from-[#d4956b] hover:to-[#b87333] transition-all whitespace-nowrap"
          >
            Contact Desk
          </Link>
        </div>
      </div>
    </div>
  );
}
