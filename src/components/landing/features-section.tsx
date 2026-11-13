"use client";

import React from "react";
import {
  ShieldAlert,
  FileLock2,
  Users2,
  Video,
  KeyRound,
  FileBadge2,
  Lock,
  EyeOff,
  Stamp,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/routing";

interface FeaturesSectionProps {
  translations: {
    title: string;
    subtitle: string;
    verification: { title: string; description: string };
    dealRooms: { title: string; description: string };
    multiLanguage: { title: string; description: string };
    security: { title: string; description: string };
    documents: { title: string; description: string };
    commissions: { title: string; description: string };
  };
}

export function FeaturesSection({ translations }: FeaturesSectionProps) {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121420] border border-[#23273b] text-xs font-mono text-[#d4956b] mb-4">
          <Lock className="w-3.5 h-3.5" />
          <span>OWASP ASVS & Enterprise Grade</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {translations.title}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-gray-400">
          {translations.subtitle}
        </p>
      </div>

      {/* Bento Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Multi-Stage Verification (Wide 2-col) */}
        <div className="md:col-span-2 rounded-3xl bg-[#0c0e17] border border-[#23273b] p-8 relative overflow-hidden flex flex-col justify-between group hover:border-[#b87333]/50 transition-all">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#141724] border border-[#23273b] flex items-center justify-center text-[#d4956b] mb-6">
              <FileBadge2 className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {translations.verification.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed">
              {translations.verification.description}
            </p>

            {/* Verification Steps Pills */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#10121d] border border-[#23273b]">
                <div className="text-[10px] font-mono text-[#d4956b] uppercase">Step 01</div>
                <div className="text-sm font-semibold text-white mt-1">KYC Representative</div>
                <div className="text-xs text-gray-500 mt-0.5">Biometric & Legal ID</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#10121d] border border-[#23273b]">
                <div className="text-[10px] font-mono text-[#d4956b] uppercase">Step 02</div>
                <div className="text-sm font-semibold text-white mt-1">KYB Company</div>
                <div className="text-xs text-gray-500 mt-0.5">Registry & UBO Check</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#10121d] border border-[#23273b]">
                <div className="text-[10px] font-mono text-[#d4956b] uppercase">Step 03</div>
                <div className="text-sm font-semibold text-white mt-1">Cargo Right Check</div>
                <div className="text-xs text-gray-500 mt-0.5">Proof of Supply & Sanctions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Passkey & MFA (Single col) */}
        <div className="rounded-3xl bg-[#0c0e17] border border-[#23273b] p-8 flex flex-col justify-between group hover:border-[#b87333]/50 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#141724] border border-[#23273b] flex items-center justify-center text-emerald-400 mb-6">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {translations.security.title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {translations.security.description}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#1a1d2e] flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>WebAuthn FIDO2</span>
            <span className="text-emerald-400">Phishing Resistant</span>
          </div>
        </div>

        {/* Card 3: Private Deal Rooms with LiveKit (Single col) */}
        <div className="rounded-3xl bg-[#0c0e17] border border-[#23273b] p-8 flex flex-col justify-between group hover:border-[#b87333]/50 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#141724] border border-[#23273b] flex items-center justify-center text-purple-400 mb-6">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {translations.dealRooms.title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {translations.dealRooms.description}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-[#1a1d2e] flex items-center justify-between text-xs text-gray-400 font-mono">
            <span>E2EE Audio / Video</span>
            <span className="text-purple-400">Broker Supervised</span>
          </div>
        </div>

        {/* Card 4: Watermarked Document Protection (Wide 2-col) */}
        <div className="md:col-span-2 rounded-3xl bg-[#0c0e17] border border-[#23273b] p-8 relative overflow-hidden flex flex-col justify-between group hover:border-[#b87333]/50 transition-all">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#141724] border border-[#23273b] flex items-center justify-center text-sky-400 mb-6">
              <Stamp className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">
              {translations.documents.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-400 max-w-xl leading-relaxed">
              {translations.documents.description}
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-[#10121d] border border-[#23273b] relative overflow-hidden">
              <div className="absolute inset-0 watermark-overlay opacity-30" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-[#d4956b]" />
                  <span className="font-mono text-gray-300">
                    Viewer: [BUYER-ALPHA-89] • Session: [2026-11-13] • Redacted
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#b87333]/20 text-[#d4956b] font-mono text-[11px] self-start sm:self-auto">
                  Owner Consent Required
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1a1d2e] flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
            <span>Anti-copy & Print Disabled</span>
            <span className="font-mono text-gray-300">Original Stays Encrypted</span>
          </div>
        </div>
      </div>
    </section>
  );
}
