"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { getSubpageTranslations } from "@/lib/i18n-subpages";
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Scale,
  Lock,
  Award,
} from "lucide-react";

export default function AboutPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = getSubpageTranslations(locale);

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
            {t.common.home}
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-xs text-[#d4956b] font-medium">{t.about.breadcrumb}</span>
        </div>

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b87333]/15 border border-[#b87333]/30 text-xs font-mono text-[#d4956b]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{t.about.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-mono">
            {t.about.title}
          </h1>
          <p className="text-base text-gray-400 max-w-3xl leading-relaxed">
            {t.about.subtitle}
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0e1017] border border-[#23273b] p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#141724] border border-[#262a40] flex items-center justify-center text-[#d4956b]">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">{t.about.pillar1Title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t.about.pillar1Desc}
            </p>
          </div>

          <div className="bg-[#0e1017] border border-[#23273b] p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#141724] border border-[#262a40] flex items-center justify-center text-[#d4956b]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">{t.about.pillar2Title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t.about.pillar2Desc}
            </p>
          </div>

          <div className="bg-[#0e1017] border border-[#23273b] p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#141724] border border-[#262a40] flex items-center justify-center text-[#d4956b]">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">{t.about.pillar3Title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t.about.pillar3Desc}
            </p>
          </div>
        </div>

        {/* Global Desks */}
        <div className="bg-[#0c0e17] border border-[#1f2233] rounded-2xl p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase text-[#d4956b] font-semibold">
              {t.about.hubsBadge}
            </span>
            <h2 className="text-2xl font-bold text-white font-mono">{t.about.hubsTitle}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            {t.about.hubs.map((hub, idx) => (
              <div key={idx} className="space-y-1.5 p-4 rounded-xl bg-[#121422] border border-[#23273b]">
                <span className="font-bold text-white text-sm block">{hub.name}</span>
                <span className="text-[#d4956b] font-mono">{hub.role}</span>
                <p className="text-gray-400 text-[11px]">{hub.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Standards & Certifications */}
        <div className="border-t border-[#1f2233] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-[#d4956b]" />
            <span>{t.about.governanceDesc}</span>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] text-white font-medium hover:from-[#d4956b] hover:to-[#b87333] transition-all"
          >
            <span>{t.catalog.title}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}
