"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  Video,
  Globe2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuroraHeroProps {
  translations: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    secondaryCta: string;
    stats: {
      countries: string;
      deals: string;
      companies: string;
      volume: string;
    };
    subhead?: string;
    asvsBadge?: string;
    pillarKyc?: string;
    pillarDealRooms?: string;
    pillarDocs?: string;
    pillarLangs?: string;
  };
}

export function AuroraHero({ translations }: AuroraHeroProps) {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center overflow-hidden pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Aurora Mesh with GPU Acceleration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep Navy/Copper ambient gradient blobs */}
        <div
          className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[550px] rounded-full blur-[110px] opacity-40 animate-ambient-glow"
          style={{
            background:
              "radial-gradient(circle, rgba(184, 115, 51, 0.45) 0%, rgba(30, 41, 59, 0.3) 50%, rgba(7, 8, 12, 0) 75%)",
          }}
        />
        <div
          className="absolute top-[35%] -left-[10%] w-[500px] h-[450px] rounded-full blur-[100px] opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(201, 169, 97, 0.35) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 80%)",
          }}
        />
        <div
          className="absolute top-[40%] -right-[10%] w-[550px] h-[500px] rounded-full blur-[120px] opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(184, 115, 51, 0.35) 0%, rgba(14, 165, 233, 0.15) 50%, transparent 75%)",
          }}
        />

        {/* Subtle Grid Lines Overlay (Dark & Light optimized) */}
        <div
          className="absolute inset-0 opacity-[0.07] dark:block hidden"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05] block dark:hidden"
          style={{
            backgroundImage: `linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Bottom Fade Mask */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#07080c] via-[#07080c]/80 to-transparent dark:block hidden" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/90 to-transparent block dark:hidden" />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Trust Eyebrow Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#121420]/80 border border-[#b87333]/30 backdrop-blur-md shadow-lg shadow-[#b87333]/5 mb-6 group hover:border-[#b87333]/60 transition-all">
          <span className="flex h-2 w-2 rounded-full bg-[#b87333] ring-4 ring-[#b87333]/20 animate-pulse" />
          <span className="text-xs sm:text-sm font-medium text-gray-200">
            {translations.badge}
          </span>
          {translations.asvsBadge && (
            <span className="text-xs text-[#d4956b] font-mono hidden sm:inline-block">
              • {translations.asvsBadge}
            </span>
          )}
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.12]">
          <span className="block">{translations.title}</span>
          <span className="block mt-2 copper-gradient-text">
            {translations.subhead || "B2B Commodities Brokerage"}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-gray-300 max-w-2xl leading-relaxed">
          {translations.subtitle}
        </p>

        {/* Actions Button Group */}
        <div className="mt-9 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/auth/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#b87333] via-[#c9a961] to-[#8b5a2b] text-white font-semibold text-base shadow-xl shadow-[#b87333]/25 hover:shadow-2xl hover:shadow-[#b87333]/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            <span>{translations.cta}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
          </Link>

          <a
            href="#sectors"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0f1118]/80 hover:bg-[#161824] border border-[#23273b] hover:border-[#b87333]/40 text-gray-200 hover:text-white font-medium text-base backdrop-blur-md transition-all flex items-center justify-center gap-2"
          >
            <span>{translations.secondaryCta}</span>
          </a>
        </div>

        {/* Key Brokerage Pillars Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f1118]/60 border border-[#23273b]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{translations.pillarKyc || "KYC & KYB Multi-Stage Verification"}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f1118]/60 border border-[#23273b]">
            <Video className="w-4 h-4 text-[#d4956b]" />
            <span>{translations.pillarDealRooms || "Encrypted WebRTC Deal Rooms"}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f1118]/60 border border-[#23273b]">
            <FileCheck2 className="w-4 h-4 text-sky-400" />
            <span>{translations.pillarDocs || "Watermarked Redacted Documents"}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f1118]/60 border border-[#23273b]">
            <Globe2 className="w-4 h-4 text-purple-400" />
            <span>{translations.pillarLangs || "8 Languages & USD Pricing"}</span>
          </div>
        </div>

        {/* Live Stats Strip */}
        <div className="mt-16 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0d0f17]/90 border border-[#23273b] backdrop-blur-md flex flex-col items-center text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              50+
            </span>
            <span className="text-xs text-gray-400 mt-1">
              {translations.stats.countries}
            </span>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0d0f17]/90 border border-[#23273b] backdrop-blur-md flex flex-col items-center text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#d4956b] font-mono">
              $14.8B+
            </span>
            <span className="text-xs text-gray-400 mt-1">
              {translations.stats.volume}
            </span>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0d0f17]/90 border border-[#23273b] backdrop-blur-md flex flex-col items-center text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              1,240+
            </span>
            <span className="text-xs text-gray-400 mt-1">
              {translations.stats.companies}
            </span>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0d0f17]/90 border border-[#23273b] backdrop-blur-md flex flex-col items-center text-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              3,800+
            </span>
            <span className="text-xs text-gray-400 mt-1">
              {translations.stats.deals}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
