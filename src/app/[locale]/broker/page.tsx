"use client";

import React, { useState, useEffect } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { getSubpageTranslations } from "@/lib/i18n-subpages";
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BrokerMatchItem } from "@/lib/store";

export default function BrokerCommandCenterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = getSubpageTranslations(locale);

  const [matches, setMatches] = useState<BrokerMatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<BrokerMatchItem | null>(null);
  const [approving, setApproving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/broker/matches");
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches);
        if (data.matches.length > 0 && !selectedMatch) {
          setSelectedMatch(data.matches[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleApproveMatch = async (matchId: string) => {
    setApproving(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/broker/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, action: "approve" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to approve match");
        return;
      }
      if (data.dealRoomId) {
        router.push(`/deals/${data.dealRoomId}/room`);
      } else {
        fetchMatches();
      }
    } catch (e) {
      setErrorMessage("Network error approving match");
    } finally {
      setApproving(false);
    }
  };

  const handleRejectMatch = async (matchId: string) => {
    try {
      const res = await fetch("/api/broker/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, action: "reject" }),
      });
      const data = await res.json();
      if (data.success) {
        fetchMatches();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#1f2233] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                {t.common.backHome}
              </Link>
              <span className="text-gray-600">/</span>
              <span className="text-xs text-[#d4956b] font-medium">{t.broker.breadcrumb}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#b87333]/20 to-[#0e1017] border border-[#b87333]/30 flex items-center justify-center">
                <Compass className="w-5 h-5 text-[#d4956b]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
                {t.broker.title}
              </h1>
            </div>
            <p className="text-xs text-gray-400 max-w-2xl">
              {t.broker.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchMatches}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e1017] border border-[#23273b] hover:border-[#b87333]/50 text-xs text-gray-300 hover:text-white transition-all"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
              <span>{t.broker.refresh}</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1017] border border-[#b87333]/30 text-xs font-mono text-[#d4956b]">
              <span className="w-2 h-2 rounded-full bg-[#d4956b] animate-ping"></span>
              <span>{t.common.verifiedBrokerage}</span>
            </div>
          </div>
        </div>

        {/* Global Broker Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0e1017] border border-[#1f2233] p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>{t.broker.pendingProp}</span>
              <TrendingUp className="w-4 h-4 text-[#d4956b]" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              {matches.filter((m) => m.status === "proposed").length}
            </div>
            <span className="text-[11px] text-gray-500">{t.broker.pendingSubtitle}</span>
          </div>

          <div className="bg-[#0e1017] border border-[#1f2233] p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>{t.broker.openRooms}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {matches.filter((m) => m.status === "room_opened" || m.status === "broker_approved").length}
            </div>
            <span className="text-[11px] text-gray-500">{t.broker.openRoomsSubtitle}</span>
          </div>

          <div className="bg-[#0e1017] border border-[#1f2233] p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>{t.broker.projectedCommissions}</span>
              <DollarSign className="w-4 h-4 text-[#c9a961]" />
            </div>
            <div className="text-2xl font-bold font-mono text-[#c9a961]">
              $1,071,875 <span className="text-xs text-gray-400">USD</span>
            </div>
            <span className="text-[11px] text-gray-500">{t.broker.commissionsSubtitle}</span>
          </div>

          <div className="bg-[#0e1017] border border-[#1f2233] p-4 rounded-xl">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span>{t.broker.complianceLock}</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">
              100%
            </div>
            <span className="text-[11px] text-purple-300/80">{t.broker.complianceLockSubtitle}</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white font-mono text-xs"
            >
              ×
            </button>
          </div>
        )}

        {/* Matches Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Matches List */}
          <div className="lg:col-span-6 bg-[#0c0e17] border border-[#1f2233] rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-4 border-b border-[#1f2233] flex items-center justify-between bg-[#0e1017]">
              <span className="text-sm font-semibold text-white">{t.broker.badge}</span>
              <span className="text-xs text-gray-500 font-mono">{t.common.usdReference}</span>
            </div>

            <div className="divide-y divide-[#181b29]">
              {matches.map((m) => {
                const isSelected = selectedMatch?.id === m.id;

                return (
                  <div
                    key={m.id}
                    onClick={() => {
                      setSelectedMatch(m);
                      setErrorMessage(null);
                    }}
                    className={cn(
                      "p-4 cursor-pointer transition-colors space-y-2 hover:bg-[#131625]",
                      isSelected ? "bg-[#171a2c] border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#b87333]" : ""
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#d4956b] font-bold">
                        {m.reference}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#b87333]/20 text-[#d4956b] border border-[#b87333]/30">
                          {m.matchScore}%
                        </span>

                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-semibold uppercase",
                            m.status === "room_opened"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : m.status === "broker_approved"
                              ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          )}
                        >
                          {m.status === "room_opened"
                            ? (locale === "ar" ? "الغرفة مفتوحة" : "Room Opened")
                            : m.status === "broker_approved"
                            ? (locale === "ar" ? "معتمد من الوسيط" : "Broker Approved")
                            : (locale === "ar" ? "مقترح" : "Proposed")}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-white">{m.commodityName}</h4>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 pt-1">
                      <div>
                        <span className="text-gray-500 block text-[10px]">{t.broker.buyer}</span>
                        <span className="text-gray-300 font-medium">{m.buyerOrg}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">{t.broker.supplier}</span>
                        <span className="text-gray-300 font-medium">{m.supplierOrg}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[#181b29] text-gray-400">
                      <span>
                        {m.quantity.toLocaleString()} {locale === "ar" && m.unit === "MT" ? "طن متري" : m.unit} • {m.incoterm} {locale === "ar" && m.deliveryPort === "Rotterdam" ? "ميناء روتردام" : locale === "ar" && m.deliveryPort === "Santos" ? "ميناء سانتوس" : m.deliveryPort}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-[#c9a961]">
                        <span>{t.broker.commission}:</span>
                        <span>${m.estimatedCommissionUsd.toLocaleString()} USD</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Match Details & Approval Pane */}
          <div className="lg:col-span-6 space-y-4">
            {selectedMatch ? (
              <div className="bg-[#0e1017] border border-[#23273b] rounded-2xl p-5 space-y-6 shadow-2xl">
                <div className="border-b border-[#1f2233] pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono uppercase text-[#d4956b] font-semibold">
                      {t.broker.badge}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">{selectedMatch.commodityName}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold font-mono text-[#d4956b]">
                      {selectedMatch.matchScore}%
                    </span>
                  </div>
                </div>

                {/* Compliance Lock Indicator */}
                <div
                  className={cn(
                    "p-3.5 rounded-xl border flex items-center justify-between text-xs",
                    selectedMatch.complianceStatusBuyer === "approved" &&
                      selectedMatch.complianceStatusSupplier === "approved"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {selectedMatch.complianceStatusBuyer === "approved" &&
                    selectedMatch.complianceStatusSupplier === "approved" ? (
                      <Unlock className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-amber-400" />
                    )}
                    <div>
                      <span className="font-semibold block">
                        {selectedMatch.complianceStatusBuyer === "approved" &&
                        selectedMatch.complianceStatusSupplier === "approved"
                          ? t.broker.openRoomsSubtitle
                          : t.broker.complianceLockSubtitle}
                      </span>
                      <span className="text-[11px] opacity-80">
                        {t.broker.buyer}:{" "}
                        {selectedMatch.complianceStatusBuyer === "approved"
                          ? (locale === "ar" ? "معتمد ومطابق" : "APPROVED")
                          : (locale === "ar" ? "قيد التدقيق" : selectedMatch.complianceStatusBuyer.toUpperCase())}{" "}
                        • {t.broker.supplier}:{" "}
                        {selectedMatch.complianceStatusSupplier === "approved"
                          ? (locale === "ar" ? "معتمد ومطابق" : "APPROVED")
                          : (locale === "ar" ? "قيد التدقيق" : selectedMatch.complianceStatusSupplier.toUpperCase())}
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/compliance"
                    className="text-[11px] underline hover:text-white font-medium"
                  >
                    {t.broker.actions}
                  </Link>
                </div>

                {/* Specification Comparison Table */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-300 block">
                    {t.broker.commodity}
                  </span>
                  <div className="border border-[#1f2233] rounded-xl overflow-hidden text-xs">
                    <div className="grid grid-cols-12 bg-[#121422] p-2 text-gray-400 font-medium border-b border-[#1f2233]">
                      <div className="col-span-4">{locale === "ar" ? "المعيار الفني" : t.broker.commodity}</div>
                      <div className="col-span-4">{locale === "ar" ? "طلب المشتري" : t.broker.buyer}</div>
                      <div className="col-span-4">{locale === "ar" ? "عرض المورد" : t.broker.supplier}</div>
                    </div>
                    {selectedMatch.specsDiff.map((d, idx) => {
                      const specTranslated =
                        locale === "ar"
                          ? d.spec === "Sulfur Content"
                            ? "نسبة الكبريت"
                            : d.spec === "Density @ 15C"
                            ? "الكثافة عند 15°م"
                            : d.spec === "Flash Point"
                            ? "درجة الوميض"
                            : d.spec === "Nitrogen (N)"
                            ? "نسبة النيتروجين (N)"
                            : d.spec === "Moisture"
                            ? "نسبة الرطوبة"
                            : d.spec === "Biuret"
                            ? "محتوى البيوريت"
                            : d.spec === "Cu Purity"
                            ? "نقاء النحاس"
                            : d.spec === "Oxygen"
                            ? "محتوى الأكسجين"
                            : d.spec
                          : d.spec;

                      return (
                        <div
                          key={idx}
                          className="grid grid-cols-12 p-2.5 border-b border-[#181b29] last:border-b-0 hover:bg-[#141724]"
                        >
                          <div className="col-span-4 font-medium text-gray-300">{specTranslated}</div>
                          <div className="col-span-4 text-gray-400">{d.buyerReq}</div>
                          <div className="col-span-4 text-[#d4956b] flex items-center justify-between">
                            <span>{d.supplierVal}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 ml-1" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pricing & Commercial Spread */}
                <div className="grid grid-cols-3 gap-3 bg-[#121422] p-3 rounded-xl border border-[#1f2233] text-xs">
                  <div>
                    <span className="text-gray-500 block text-[11px]">{t.broker.buyer}</span>
                    <span className="text-sm font-bold font-mono text-white">
                      ${selectedMatch.buyerTargetPrice} USD
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">{t.broker.supplier}</span>
                    <span className="text-sm font-bold font-mono text-[#d4956b]">
                      ${selectedMatch.supplierOfferPrice} USD
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">{t.broker.benchmarkPrice}</span>
                    <span className="text-sm font-bold font-mono text-amber-400">
                      ${Math.abs(selectedMatch.supplierOfferPrice - selectedMatch.buyerTargetPrice)} USD
                    </span>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-2 border-t border-[#1f2233] flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleRejectMatch(selectedMatch.id)}
                    className="py-2.5 px-4 rounded-xl bg-rose-600/10 border border-rose-500/30 text-rose-400 text-xs font-semibold hover:bg-rose-600/20 transition-all flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" />
                    {t.broker.reject}
                  </button>

                  {selectedMatch.dealRoomId ? (
                    <Link
                      href={`/deals/${selectedMatch.dealRoomId}/room`}
                      className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-semibold shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2"
                    >
                      <span>{t.broker.openDealRoom}</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled={approving}
                      onClick={() => handleApproveMatch(selectedMatch.id)}
                      className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white text-xs font-semibold shadow-lg shadow-[#b87333]/20 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{approving ? t.common.loading : t.broker.reviewApprove}</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
