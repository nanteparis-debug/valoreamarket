"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";

export default function PrivacyPolicyPage() {
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
          <span className="text-xs text-[#d4956b] font-medium">Privacy Policy</span>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b87333]/15 border border-[#b87333]/30 text-xs font-mono text-[#d4956b]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GDPR & Swiss FADP Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
            Privacy & Data Protection Policy
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Effective Date: November 13, 2026 • Data Controller: GVCE International AG, Geneva
          </p>
        </div>

        <div className="bg-[#0e1017] border border-[#23273b] rounded-2xl p-8 space-y-6 text-xs text-gray-300 leading-relaxed shadow-xl">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
              1. Overview & Commitment
            </h2>
            <p>
              GVCE International AG is dedicated to safeguarding commercial and personal data. We comply with the European Union General Data Protection Regulation (GDPR) and the revised Swiss Federal Act on Data Protection (FADP).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
              2. Categories of Information Processed
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-400">
              <li>Corporate registry extracts, articles of association, and VAT/tax registrations.</li>
              <li>Identity documents of authorized representatives (Passports, National IDs, Biometrics).</li>
              <li>Sanctions and Politically Exposed Persons (PEP) screening records.</li>
              <li>Commodity specifications, laboratory Certificates of Analysis (COA), and inspection reports.</li>
              <li>Audit logs including IP addresses, active session tokens, and cryptographic access authorizations.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
              3. Cryptographic Document Protection
            </h2>
            <p>
              All confidential trade documents uploaded to GVCE are encrypted at rest with AES-256-GCM. Unredacted original files are never exposed to counterparties without explicit, revocable authorization granted directly by the document owner organization.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
              4. Data Retention & International Transfers
            </h2>
            <p>
              Corporate records and transaction audit trails are securely retained in high-security Swiss data centers for ten (10) years in accordance with Swiss commercial code requirements.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
