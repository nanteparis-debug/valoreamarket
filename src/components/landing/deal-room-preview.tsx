"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Lock,
  MessageSquare,
  FileText,
  CheckCircle2,
  UserCheck,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DealRoomPreviewProps {
  translations?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    roomReference?: string;
    e2eeActive?: string;
    dealSummary?: string;
    buyerAlias?: string;
    supplierAlias?: string;
    brokerLead?: string;
    tabChat?: string;
    tabDocuments?: string;
    tabAgreements?: string;
    sampleMessage1?: string;
    sampleMessage2?: string;
    leakNotice?: string;
    enterRoomBtn?: string;
    doc1Title?: string;
    doc1Type?: string;
    doc2Title?: string;
    doc2Type?: string;
    previewBtn?: string;
    agreementTitle?: string;
    agreementTerms?: string;
  };
}

export function DealRoomPreview({ translations }: DealRoomPreviewProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "documents" | "agreements">(
    "chat"
  );

  const t = {
    badge: translations?.badge || "Interactive Deal Room Experience",
    title: translations?.title || "Supervised Anonymous Deal Room",
    subtitle:
      translations?.subtitle ||
      "Complete confidentiality with zero contact leaks. LiveKit E2EE video, watermarked document inspection, and broker arbitration.",
    roomReference: translations?.roomReference || "ROOM #VALOREA-2026-EN590-410",
    e2eeActive: translations?.e2eeActive || "E2EE ACTIVE",
    dealSummary:
      translations?.dealSummary ||
      "50,000 MT Diesel EN 590 10PPM • CIF Rotterdam • USD 740/MT",
    buyerAlias: translations?.buyerAlias || "Buyer-Alpha-24",
    supplierAlias: translations?.supplierAlias || "Supplier-Nordic-77",
    brokerLead: translations?.brokerLead || "Broker Lead (VALOREA MARKET)",
    tabChat: translations?.tabChat || "Encrypted Chat",
    tabDocuments: translations?.tabDocuments || "Watermarked Documents",
    tabAgreements: translations?.tabAgreements || "Agreements & Commission",
    sampleMessage1:
      translations?.sampleMessage1 ||
      "We require confirmed delivery port CIF Rotterdam between Dec 10 and Dec 20. Can you guarantee SGS testing at loading?",
    sampleMessage2:
      translations?.sampleMessage2 ||
      "Yes, SGS inspection at loading port is fully accepted. We have uploaded the redacted Certificate of Analysis to the Documents tab.",
    leakNotice:
      translations?.leakNotice ||
      "Direct email and phone sharing is strictly prohibited. Identity disclosure is subject to mutual consent and NCNDA acceptance.",
    doc1Title:
      translations?.doc1Title || "Certificate of Analysis (COA) - EN590",
    doc1Type:
      translations?.doc1Type || "Redacted • 10 PPM Sulfur confirmed • 2.4 MB PDF",
    doc2Title:
      translations?.doc2Title || "Original Bill of Lading (Clean on Board)",
    doc2Type:
      translations?.doc2Type || "Unredacted Original • Owner Approval Required",
    previewBtn: translations?.previewBtn || "Open Viewer",
    agreementTitle:
      translations?.agreementTitle ||
      "Non-Circumvention, Non-Disclosure Agreement (NCNDA)",
    agreementTerms:
      translations?.agreementTerms ||
      "Obligor: Supplier-Nordic-77 • Commission: 1.25% ($462,500 USD) • Due at LC Settlement",
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121420] border border-[#23273b] text-xs font-mono text-[#d4956b] mb-4">
          <Lock className="w-3.5 h-3.5" />
          <span>{t.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t.title}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-gray-400">
          {t.subtitle}
        </p>
      </div>

      {/* Deal Room Simulated Workspace */}
      <div className="rounded-3xl bg-[#090a10] border border-[#23273b] shadow-2xl overflow-hidden">
        {/* Deal Room Top Bar */}
        <div className="px-6 py-4 bg-[#0e1018] border-b border-[#1f2233] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-white font-mono">
                  {t.roomReference}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#b87333]/20 text-[#d4956b] border border-[#b87333]/40 text-[10px] font-mono font-semibold">
                  معاينة توضيحية تفاعلية • Interactive Demo Preview
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                  TLS 1.3 & Anti-Leak Active
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {t.dealSummary}
              </p>
            </div>
          </div>

          {/* Participants Badges */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141724] border border-[#23273b] text-xs text-gray-300">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>{t.buyerAlias}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#141724] border border-[#23273b] text-xs text-gray-300">
              <span className="w-2 h-2 rounded-full bg-[#d4956b]" />
              <span>{t.supplierAlias}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#b87333]/20 border border-[#b87333]/40 text-xs text-[#d4956b] font-semibold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{t.brokerLead}</span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#1f2233] bg-[#0c0e15] px-6">
          <button
            onClick={() => setActiveTab("chat")}
            className={cn(
              "px-4 py-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-all",
              activeTab === "chat"
                ? "border-[#b87333] text-white font-semibold"
                : "border-transparent text-gray-400 hover:text-gray-200"
            )}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.tabChat}</span>
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={cn(
              "px-4 py-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-all",
              activeTab === "documents"
                ? "border-[#b87333] text-white font-semibold"
                : "border-transparent text-gray-400 hover:text-gray-200"
            )}
          >
            <FileText className="w-4 h-4" />
            <span>{t.tabDocuments}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#1b1f2e] text-[#d4956b]">2</span>
          </button>
          <button
            onClick={() => setActiveTab("agreements")}
            className={cn(
              "px-4 py-3 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-all",
              activeTab === "agreements"
                ? "border-[#b87333] text-white font-semibold"
                : "border-transparent text-gray-400 hover:text-gray-200"
            )}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.tabAgreements}</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div className="p-6 min-h-[340px] flex flex-col justify-between">
          {activeTab === "chat" && (
            <div className="space-y-4">
              {/* Message 1 */}
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-[#161a29] border border-[#23273b] flex items-center justify-center text-xs font-mono text-sky-400 font-bold shrink-0">
                  BA
                </div>
                <div className="bg-[#121522] border border-[#23273b] rounded-2xl p-3.5 max-w-xl text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="font-semibold text-sky-400">{t.buyerAlias}</span>
                    <span className="text-[10px] text-gray-500 font-mono">14:02 UTC</span>
                  </div>
                  <p className="text-gray-300">
                    {t.sampleMessage1}
                  </p>
                </div>
              </div>

              {/* Message 2: Supplier Reply */}
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-[#1f1812] border border-[#3d2a1d] flex items-center justify-center text-xs font-mono text-[#d4956b] font-bold shrink-0">
                  SN
                </div>
                <div className="bg-[#17141f] border border-[#332420] rounded-2xl p-3.5 max-w-xl text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="font-semibold text-[#d4956b]">{t.supplierAlias}</span>
                    <span className="text-[10px] text-gray-500 font-mono">14:05 UTC</span>
                  </div>
                  <p className="text-gray-300">
                    {t.sampleMessage2}
                  </p>
                </div>
              </div>

              {/* Message 3: Broker Safety System Notice */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#121420] border border-[#b87333]/30 text-xs text-gray-300">
                <ShieldAlert className="w-4 h-4 text-[#d4956b] shrink-0" />
                <span>
                  <strong className="text-white">VALOREA MARKET:</strong> {t.leakNotice}
                </span>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-[#121420] border border-[#23273b] text-xs text-gray-400 flex items-center justify-between">
                <span>نموذج محاكاة وثائق الشحن (وثائق تدقيق تجريبية لا تحتوي على أسرار تجارية حقيقية)</span>
                <span className="font-mono text-[#d4956b] text-[11px]">DEMO_REDACTED_PREVIEW</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#10131f] border border-[#23273b] relative overflow-hidden">
                  <div className="absolute inset-0 watermark-overlay opacity-25" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#b87333]/20 text-[#d4956b] font-mono mb-1.5 inline-block">
                          وثيقة معاينة توضيحية
                        </span>
                        <h4 className="text-sm font-semibold text-white">
                          {t.doc1Title}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1 font-mono">
                          {t.doc1Type}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[10px] font-mono">
                        Watermarked
                      </span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#1a1e30] flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-mono">{t.buyerAlias}</span>
                      <button className="px-3 py-1 rounded-lg bg-[#181d2e] hover:bg-[#20273e] text-white font-medium border border-[#2b334d]">
                        {t.previewBtn}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#10131f] border border-[#23273b]">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#b87333]/20 text-[#d4956b] font-mono mb-1.5 inline-block">
                        وثيقة معاينة توضيحية
                      </span>
                      <h4 className="text-sm font-semibold text-white">
                        {t.doc2Title}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 font-mono">
                        {t.doc2Type}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                      SGS Verified
                    </span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1a1e30] flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-mono">{t.supplierAlias}</span>
                    <button className="px-3 py-1 rounded-lg bg-[#181d2e] hover:bg-[#20273e] text-white font-medium border border-[#2b334d]">
                      {t.previewBtn}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "agreements" && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#10131f] border border-[#23273b] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {t.agreementTitle}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t.dealSummary}
                  </p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold font-mono">
                  <CheckCircle2 className="w-4 h-4" /> EXECUTED
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#10131f] border border-[#23273b] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    VALOREA MARKET — {t.tabAgreements}
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {t.agreementTerms}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#b87333]/20 text-[#d4956b] border border-[#b87333]/30 text-xs font-mono">
                  USD
                </span>
              </div>
            </div>
          )}

          {/* Bottom Chat Input Simulator */}
          <div className="mt-6 pt-4 border-t border-[#1a1d2e] flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#121422] border border-[#23273b] text-xs text-gray-400">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <input
                type="text"
                readOnly
                value={t.leakNotice}
                className="bg-transparent border-none outline-none w-full text-xs text-gray-400 cursor-not-allowed"
              />
            </div>
            <button
              disabled
              className="p-2.5 rounded-xl bg-[#b87333] opacity-60 text-white cursor-not-allowed"
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
