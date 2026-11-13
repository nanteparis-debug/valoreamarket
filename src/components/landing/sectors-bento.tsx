"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { COMMODITY_SECTORS } from "@/lib/constants";
import {
  Flame,
  Fuel,
  Gauge,
  Atom,
  Sprout,
  Coins,
  Package,
  ArrowRight,
  Filter,
  CheckCircle2,
  FileText,
  FileCheck2,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SectorsBentoProps {
  translations: {
    title: string;
    subtitle: string;
    viewAll: string;
    buyRequest: string;
    supplyOffer: string;
    sectors: Record<string, string>;
  };
}

const SECTOR_ICONS: Record<string, React.ReactNode> = {
  Fuel: <Fuel className="w-5 h-5 text-[#b87333]" />,
  Gauge: <Gauge className="w-5 h-5 text-[#d4956b]" />,
  Flame: <Flame className="w-5 h-5 text-sky-400" />,
  Atom: <Atom className="w-5 h-5 text-purple-400" />,
  Sprout: <Sprout className="w-5 h-5 text-yellow-400" />,
  Coins: <Coins className="w-5 h-5 text-[#c9a961]" />,
  Package: <Package className="w-5 h-5 text-rose-400" />,
};

export function SectorsBento({ translations }: SectorsBentoProps) {
  const [activeSectorId, setActiveSectorId] = useState(
    COMMODITY_SECTORS[0].id
  );

  const activeSector =
    COMMODITY_SECTORS.find((s) => s.id === activeSectorId) ||
    COMMODITY_SECTORS[0];

  return (
    <section id="sectors" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121420] border border-[#23273b] text-xs font-mono text-[#d4956b] mb-4">
          <Filter className="w-3.5 h-3.5" />
          <span>7 Verified Commodity Sectors</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {translations.title}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-gray-400">
          {translations.subtitle}
        </p>
      </div>

      {/* Sector Pill Tabs */}
      <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
        {COMMODITY_SECTORS.map((sector) => {
          const isActive = sector.id === activeSectorId;
          const sectorName =
            translations.sectors[sector.titleKey] || sector.slug;

          return (
            <button
              key={sector.id}
              onClick={() => setActiveSectorId(sector.id)}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border",
                isActive
                  ? "bg-[#181a27] border-[#b87333] text-white shadow-lg shadow-[#b87333]/15"
                  : "bg-[#0d0f17] border-[#23273b] text-gray-400 hover:text-white hover:border-[#383d5a]"
              )}
            >
              {SECTOR_ICONS[sector.icon]}
              <span>{sectorName}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#121420] text-gray-400 font-mono">
                {sector.materialsCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Sector Showcase Card */}
      <div className="rounded-3xl bg-[#0c0e17] border border-[#23273b] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div
          className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-[100px] opacity-20 pointer-events-none"
          style={{ background: activeSector.color }}
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[#1f2233]">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#141724] border border-[#23273b]">
                {SECTOR_ICONS[activeSector.icon]}
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  {translations.sectors[activeSector.titleKey] || activeSector.slug}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 font-mono">
                  Catalog Code: <span className="text-[#d4956b]">{activeSector.slug}</span> • USD Denominated • Delivery: FOB / CIF / CFR
                </p>
              </div>
            </div>
          </div>

          {/* Quick Transaction Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href={`/deals/new?side=buy&sector=${activeSector.id}`}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#b87333]/20 flex items-center gap-2 transition-all"
            >
              <span>{translations.buyRequest}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>

            <Link
              href={`/deals/new?side=sell&sector=${activeSector.id}`}
              className="px-5 py-2.5 rounded-xl bg-[#161826] hover:bg-[#1e2236] border border-[#23273b] hover:border-[#b87333]/40 text-gray-200 hover:text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all"
            >
              <span>{translations.supplyOffer}</span>
            </Link>
          </div>
        </div>

        {/* Commodity Materials & Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          {activeSector.items.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#10121d] border border-[#23273b] hover:border-[#b87333]/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-[#d4956b] transition-colors">
                    {item.name}
                  </h4>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                    Verified Specs
                  </span>
                </div>
                <p className="mt-2 text-xs sm:text-sm text-gray-400 font-mono">
                  <span className="text-gray-500">Benchmark Specs:</span> {item.specs}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#1a1d2e] flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#d4956b]" />
                  COA & SGS Inspection Ready
                </span>
                <span className="font-mono text-gray-300">USD / Metric Ton</span>
              </div>
            </div>
          ))}
        </div>

        {/* Incoterms & Inspection Footnote */}
        <div className="mt-8 pt-6 border-t border-[#1f2233] flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-300">Supported Incoterms:</span>
            <div className="flex flex-wrap gap-1">
              {["FOB", "CIF", "CFR", "DAP", "CPT", "FCA"].map((term) => (
                <span
                  key={term}
                  className="px-2 py-0.5 rounded bg-[#141724] border border-[#23273b] text-[11px] font-mono text-gray-300"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>

          <Link
            href="/catalog"
            className="text-xs text-[#d4956b] hover:text-[#f8fafc] font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>{translations.viewAll}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}
