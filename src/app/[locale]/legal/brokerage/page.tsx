"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { getSubpageTranslations } from "@/lib/i18n-subpages";
import { ArrowLeft, DollarSign } from "lucide-react";

export default function BrokeragePolicyPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = getSubpageTranslations(locale);

  return (
    <div className="min-h-screen bg-[#07080c] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex items-center gap-2 border-b border-[#1f2233] pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            {t.common.home}
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-xs text-[#d4956b] font-medium">{t.brokerage.breadcrumb}</span>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b87333]/15 border border-[#b87333]/30 text-xs font-mono text-[#d4956b]">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{t.brokerage.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
            {t.brokerage.title}
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            {t.brokerage.subtitle}
          </p>
        </div>

        <div className="bg-[#0e1017] border border-[#23273b] rounded-2xl p-8 space-y-6 text-xs text-gray-300 leading-relaxed shadow-xl">
          {t.brokerage.sections.map((section, idx) => (
            <section key={idx} className="space-y-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider text-[#d4956b]">
                {section.title}
              </h2>
              {section.notice && (
                <p className="p-3.5 rounded-xl bg-[#141724] border border-[#b87333]/30 text-white font-medium">
                  {section.notice}
                </p>
              )}
              <p>{section.content}</p>
              {section.list && (
                <ul className="list-disc pl-5 rtl:pr-5 rtl:pl-0 space-y-1 text-gray-400 mt-2">
                  {section.list.map((item, lIdx) => (
                    <li key={lIdx}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
