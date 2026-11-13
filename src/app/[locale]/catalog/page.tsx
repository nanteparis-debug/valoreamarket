"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { getSubpageTranslations } from "@/lib/i18n-subpages";
import { COMMODITY_SECTORS, getSectorTitle, getCommodityItemName } from "@/lib/constants";
import {
  Search,
  ArrowLeft,
  ShieldCheck,
  Fuel,
  Gauge,
  Flame,
  Atom,
  Sprout,
  Coins,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SECTOR_ICONS: Record<string, React.ReactNode> = {
  Fuel: <Fuel className="w-5 h-5 text-[#b87333]" />,
  Gauge: <Gauge className="w-5 h-5 text-[#d4956b]" />,
  Flame: <Flame className="w-5 h-5 text-sky-400" />,
  Atom: <Atom className="w-5 h-5 text-purple-400" />,
  Sprout: <Sprout className="w-5 h-5 text-yellow-400" />,
  Coins: <Coins className="w-5 h-5 text-[#c9a961]" />,
  Package: <Package className="w-5 h-5 text-rose-400" />,
};

// Search keywords map across multiple languages
const MULTILANG_KEYWORDS: Record<string, string[]> = {
  crude: ["crude", "oil", "brent", "wti", "petrole", "brut", "نفط", "خام", "condensate"],
  diesel: ["diesel", "en590", "gasoil", "gazole", "ديزل", "وقود"],
  jet: ["jet", "kerosene", "aviation", "a1", "كيروسين", "طيران"],
  gas: ["gas", "lng", "lpg", "cng", "methane", "propane", "butane", "غاز", "طبيعي"],
  petrochem: ["petrochemical", "polyethylene", "polypropylene", "methanol", "بتروكيماويات", "بوليمر"],
  fertilizer: ["fertilizer", "urea", "sulfur", "engrais", "uree", "soufre", "يوريا", "كبريت", "أسمدة", "dap"],
  metals: ["metal", "copper", "cobalt", "lithium", "aluminium", "cuivre", "معادن", "نحاس", "كوبالت", "ليثيوم"],
  sugar: ["sugar", "vhp", "icumsa", "sucre", "سكر"],
};

export default function CatalogPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = getSubpageTranslations(locale);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");

  const filteredMaterials = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return COMMODITY_SECTORS.flatMap((sector) => {
      if (selectedSector !== "all" && sector.id !== selectedSector) return [];

      return sector.items
        .filter((item) => {
          if (!q) return true;
          const matchName = item.name.toLowerCase().includes(q);
          const matchSpecs = item.specs.toLowerCase().includes(q);
          const matchSector = sector.slug.toLowerCase().includes(q);

          // Check multi-language synonyms
          const matchSynonyms = Object.values(MULTILANG_KEYWORDS).some(
            (keywords) =>
              keywords.some((k) => q.includes(k)) &&
              keywords.some(
                (k) =>
                  item.name.toLowerCase().includes(k) ||
                  sector.slug.toLowerCase().includes(k)
              )
          );

          return matchName || matchSpecs || matchSector || matchSynonyms;
        })
        .map((item) => ({
          ...item,
          sectorId: sector.id,
          sectorSlug: sector.slug,
          sectorIcon: sector.icon,
        }));
    });
  }, [searchQuery, selectedSector]);

  return (
    <div className="min-h-screen bg-[#07080c] text-[#f8fafc] flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-[#1f2233] bg-[#0c0e17]/85 backdrop-blur-md py-4 px-4 sm:px-8 flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t.catalog.backHome}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#b87333] animate-pulse" />
          <span className="text-xs font-mono text-gray-300">
            {t.catalog.topBanner}
          </span>
        </div>
      </header>

      {/* Main Catalog View */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-8">
        {/* Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1f2233]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121420] border border-[#23273b] text-xs font-mono text-[#d4956b] mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.catalog.badge}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {t.catalog.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              {t.catalog.subtitle}
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.catalog.searchPlaceholder}
              className="w-full bg-[#121422] border border-[#23273b] rounded-xl pl-10 pr-4 rtl:pr-10 rtl:pl-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b87333]"
            />
          </div>
        </div>

        {/* Sector Quick Filters - RTL-safe with horizontal scrolling and no clipping */}
        <div className="w-full overflow-x-auto pb-4 mb-2 no-scrollbar scroll-smooth" dir="inherit">
          <div className="flex items-center gap-2 w-max min-w-full px-6 sm:px-10 justify-start xl:justify-center">
            <button
              onClick={() => setSelectedSector("all")}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0",
                selectedSector === "all"
                  ? "bg-[#b87333] border-[#b87333] text-white shadow-lg shadow-[#b87333]/20"
                  : "bg-[#0c0e17] border-[#23273b] text-gray-400 hover:text-white"
              )}
            >
              {t.catalog.allSectors} ({COMMODITY_SECTORS.reduce((acc, s) => acc + s.items.length, 0)})
            </button>
            {COMMODITY_SECTORS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSector(s.id)}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-2 shrink-0",
                  selectedSector === s.id
                    ? "bg-[#181d2e] border-[#b87333] text-white shadow-lg shadow-[#b87333]/20"
                    : "bg-[#0c0e17] border-[#23273b] text-gray-400 hover:text-white"
                )}
              >
                {SECTOR_ICONS[s.icon]}
                <span>{getSectorTitle(s.titleKey, locale)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Commodity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#0c0e17] border border-[#23273b] hover:border-[#b87333]/50 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="p-2.5 rounded-2xl bg-[#141724] border border-[#23273b]">
                    {SECTOR_ICONS[item.sectorIcon]}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {t.catalog.sgsInspected}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#d4956b] transition-colors">
                  {getCommodityItemName(item.name, locale)}
                </h3>
                <p className="text-xs text-gray-400 mt-2 font-mono leading-relaxed">
                  <span className="text-gray-500 block mb-0.5">{t.catalog.benchmarkSpecs}</span>
                  {item.specs}
                </p>

                <div className="mt-4 pt-3 border-t border-[#1a1d2e] space-y-1.5 text-xs text-gray-400">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-gray-500">{t.catalog.pricingBasis}</span>
                    <span className="text-white font-semibold">{t.catalog.pricingValue}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-gray-500">{t.catalog.incoterms}</span>
                    <span className="text-[#d4956b]">{t.catalog.incotermsValue}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons for this Commodity */}
              <div className="mt-6 pt-4 border-t border-[#1a1d2e] grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    router.push(
                      `/deals/new?side=buy&sector=${item.sectorId}&commodity=${encodeURIComponent(
                        item.name
                      )}`
                    )
                  }
                  className="py-2.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white text-xs font-semibold shadow-md shadow-[#b87333]/15 transition-all text-center"
                >
                  {t.catalog.buyRequest}
                </button>

                <button
                  onClick={() =>
                    router.push(
                      `/deals/new?side=sell&sector=${item.sectorId}&commodity=${encodeURIComponent(
                        item.name
                      )}`
                    )
                  }
                  className="py-2.5 rounded-xl bg-[#141724] hover:bg-[#1a1f30] text-gray-200 border border-[#23273b] hover:border-[#b87333]/40 text-xs font-semibold transition-all text-center"
                >
                  {t.catalog.supplyOffer}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-16 p-8 rounded-3xl bg-[#0c0e17] border border-[#23273b]">
            <p className="text-gray-400 text-sm">
              {t.catalog.noResults} &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSector("all");
              }}
              className="mt-3 text-xs text-[#d4956b] underline font-mono"
            >
              {t.catalog.resetFilters}
            </button>
          </div>
        )}
      </main>

      <footer className="py-6 border-t border-[#1f2233] text-center text-xs text-gray-500 font-mono">
        {t.catalog.footerText}
      </footer>
    </div>
  );
}
