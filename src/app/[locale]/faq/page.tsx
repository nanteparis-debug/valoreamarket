"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { getSubpageTranslations } from "@/lib/i18n-subpages";
import {
  HelpCircle,
  ChevronDown,
  ArrowLeft,
  ShieldCheck,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function FAQPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = getSubpageTranslations(locale);

  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCategories = t.faq.categories.map((cat) => {
    if (activeCategory !== "all" && cat.category !== activeCategory) {
      return { ...cat, questions: [] };
    }
    const q = searchQuery.toLowerCase().trim();
    if (!q) return cat;
    return {
      ...cat,
      questions: cat.questions.filter(
        (item) =>
          item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
      ),
    };
  });

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
            {t.common.home}
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-xs text-[#d4956b] font-medium">{t.faq.breadcrumb}</span>
        </div>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b87333]/15 border border-[#b87333]/30 text-xs font-mono text-[#d4956b]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.faq.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
            {t.faq.title}
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            {t.faq.subtitle}
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.faq.searchPlaceholder}
              className="w-full bg-[#0e1017] border border-[#23273b] rounded-xl pl-10 pr-4 py-2.5 rtl:pr-10 rtl:pl-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b87333]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                activeCategory === "all"
                  ? "bg-[#b87333] text-white"
                  : "bg-[#0e1017] border border-[#23273b] text-gray-400 hover:text-white"
              )}
            >
              {t.faq.allCategories}
            </button>
            {t.faq.categories.map((c, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(c.category)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  activeCategory === c.category
                    ? "bg-[#b87333] text-white"
                    : "bg-[#0e1017] border border-[#23273b] text-gray-400 hover:text-white"
                )}
              >
                {c.category}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-8">
          {filteredCategories.map((cat, cIdx) => {
            if (cat.questions.length === 0) return null;
            return (
              <div key={cIdx} className="space-y-3">
                <h2 className="text-sm font-bold text-[#d4956b] uppercase tracking-wider font-mono">
                  {cat.category}
                </h2>
                <div className="space-y-2">
                  {cat.questions.map((q, qIdx) => {
                    const itemId = `${cIdx}-${qIdx}`;
                    const isOpen = openItems[itemId];
                    return (
                      <div
                        key={qIdx}
                        className="bg-[#0e1017] border border-[#23273b] rounded-xl overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full px-5 py-4 text-left rtl:text-right flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-white hover:text-[#d4956b] transition-colors"
                        >
                          <span>{q.q}</span>
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200",
                              isOpen && "rotate-180"
                            )}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 pt-1 text-xs text-gray-300 leading-relaxed border-t border-[#1a1d2e]">
                            {q.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="p-8 rounded-2xl bg-[#0e1017] border border-[#23273b] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white">{t.faq.ctaTitle}</h3>
            <p className="text-xs text-gray-400 mt-1">{t.faq.ctaDesc}</p>
          </div>
          <Link
            href="/contact"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] text-white text-xs font-semibold hover:from-[#d4956b] hover:to-[#b87333] transition-all whitespace-nowrap"
          >
            {t.faq.ctaBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}
