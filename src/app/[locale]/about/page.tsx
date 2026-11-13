"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import {
  ShieldCheck,
  Building2,
  Globe2,
  Award,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Scale,
  Lock,
  Compass,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#07080c] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
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
          <span className="text-xs text-[#d4956b] font-medium">About GVCE</span>
        </div>

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b87333]/15 border border-[#b87333]/30 text-xs font-mono text-[#d4956b]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Institutional Commodities Infrastructure</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-mono">
            Bridging Global Commodity Markets with Verified Trust
          </h1>
          <p className="text-base text-gray-400 max-w-3xl leading-relaxed">
            GVCE (Global Verified Commodities Exchange) is an international institutional brokerage platform designed to solve the critical trust deficits in global cross-border physical trading.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0e1017] border border-[#23273b] p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#141724] border border-[#262a40] flex items-center justify-center text-[#d4956b]">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Non-Custodial Settlement</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              GVCE never holds physical cargo funds. Cargo settlement takes place strictly through verified commercial banking channels (Letters of Credit, TT, Escrow) between principals.
            </p>
          </div>

          <div className="bg-[#0e1017] border border-[#23273b] p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#141724] border border-[#262a40] flex items-center justify-center text-[#d4956b]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Multi-Stage Verification</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every trading entity undergoes stringent KYB registry authentication, representative KYC, and real-time screening against OFAC, EU, UN, and UK sanctions lists.
            </p>
          </div>

          <div className="bg-[#0e1017] border border-[#23273b] p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#141724] border border-[#262a40] flex items-center justify-center text-[#d4956b]">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Cryptographic Deal Rooms</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              End-to-end encrypted video meetings, dynamically watermarked technical document inspection, and active contact-leak interception prevent unauthorized circumvention.
            </p>
          </div>
        </div>

        {/* Global Desks */}
        <div className="bg-[#0c0e17] border border-[#1f2233] rounded-2xl p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-[#d4956b] font-semibold">
              Global Desk Network
            </span>
            <h2 className="text-2xl font-bold text-white font-mono">Operating in Primary Trading Hubs</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            <div className="space-y-1.5 p-4 rounded-xl bg-[#121422] border border-[#23273b]">
              <span className="font-bold text-white text-sm block">Geneva, Switzerland</span>
              <span className="text-[#d4956b] font-mono">Global Corporate HQ</span>
              <p className="text-gray-400 text-[11px]">Rue du Rhône 42, 1204 Geneva. Compliance & Legal Governance.</p>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-[#121422] border border-[#23273b]">
              <span className="font-bold text-white text-sm block">Dubai, UAE</span>
              <span className="text-[#d4956b] font-mono">Middle East & Energy Hub</span>
              <p className="text-gray-400 text-[11px]">DIFC Gate Precinct 4. Crude Oil, Refined Fuels & Petrochemicals.</p>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-[#121422] border border-[#23273b]">
              <span className="font-bold text-white text-sm block">Singapore</span>
              <span className="text-[#d4956b] font-mono">Asia-Pacific Desk</span>
              <p className="text-gray-400 text-[11px]">Marina Bay Financial Centre Tower 2. Metals & Fertilizers.</p>
            </div>
            <div className="space-y-1.5 p-4 rounded-xl bg-[#121422] border border-[#23273b]">
              <span className="font-bold text-white text-sm block">Houston, USA</span>
              <span className="text-[#d4956b] font-mono">Americas Desk</span>
              <p className="text-gray-400 text-[11px]">Downtown Energy Corridor. Gas, LNG & Agriculture.</p>
            </div>
          </div>
        </div>

        {/* Standards & Certifications */}
        <div className="border-t border-[#1f2233] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-[#d4956b]" />
            <span>Audited to OWASP ASVS Level 2 • FIDO2 WebAuthn Certified • SOC2 Type II Aligned</span>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] text-white font-medium hover:from-[#d4956b] hover:to-[#b87333] transition-all"
          >
            <span>Explore Commodities</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
