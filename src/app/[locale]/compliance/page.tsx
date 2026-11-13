"use client";

import React, { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useParams, useSearchParams } from "next/navigation";
import { getSubpageTranslations } from "@/lib/i18n-subpages";
import { ProtectedAccessGate } from "@/components/protected-access-gate";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Building2,
  UserCheck,
  Search,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { VerificationRecord } from "@/lib/store";

export default function CompliancePortalPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = getSubpageTranslations(locale);

  const STATUS_CONFIG: Record<
    VerificationRecord["status"],
    { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
  > = {
    approved: {
      label: t.compliance.approved,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
    },
    pending_review: {
      label: t.compliance.pendingReview,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      icon: <Clock className="w-4 h-4 text-amber-400" />,
    },
    additional_info_required: {
      label: t.compliance.additionalInfo,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      border: "border-orange-500/30",
      icon: <AlertTriangle className="w-4 h-4 text-orange-400" />,
    },
    incomplete: {
      label: t.compliance.incomplete,
      color: "text-gray-400",
      bg: "bg-gray-500/10",
      border: "border-gray-500/30",
      icon: <Clock className="w-4 h-4 text-gray-400" />,
    },
    rejected: {
      label: t.compliance.rejected,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/30",
      icon: <XCircle className="w-4 h-4 text-rose-400" />,
    },
    expired: {
      label: t.compliance.expired,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      icon: <AlertTriangle className="w-4 h-4 text-purple-400" />,
    },
    suspended: {
      label: t.compliance.suspended,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      icon: <ShieldAlert className="w-4 h-4 text-red-500" />,
    },
  };

  const SCOPE_CONFIG = {
    kyb: { label: t.compliance.kybScope, icon: <Building2 className="w-4 h-4 text-[#d4956b]" /> },
    representative_kyc: { label: t.compliance.kycScope, icon: <UserCheck className="w-4 h-4 text-sky-400" /> },
    cargo_title: { label: t.compliance.cargoScope, icon: <FileText className="w-4 h-4 text-yellow-400" /> },
    sanctions_pep: { label: t.compliance.sanctionsScope, icon: <ShieldCheck className="w-4 h-4 text-purple-400" /> },
  };

  const searchParams = useSearchParams();
  const [records, setRecords] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterScope, setFilterScope] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<VerificationRecord | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(() => searchParams.get("demo") === "true");

  const fetchRecords = async (demo = isDemoMode) => {
    try {
      setLoading(true);
      const url = demo ? "/api/compliance?demo=true" : "/api/compliance";
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
        if (data.isDemoSimulation) {
          setIsDemoMode(true);
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
          setIsDemoMode(false);
        }
      } else {
        setIsAuthorized(false);
      }
    } catch (e) {
      console.error(e);
      setIsAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isExplicitDemo = searchParams.get("demo") === "true";
    if (isExplicitDemo) {
      setIsDemoMode(true);
      fetchRecords(true);
    } else {
      fetchRecords(false);
    }
  }, [searchParams]);

  const handleUpdateStatus = async (status: VerificationRecord["status"]) => {
    if (!selectedRecord) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedRecord.id,
          status,
          decisionReason: actionNotes || `Status updated to ${status} by Compliance Officer`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRecords((prev) =>
          prev.map((r) => (r.id === selectedRecord.id ? data.record : r))
        );
        setSelectedRecord(data.record);
        setActionNotes("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const filteredRecords = records.filter((r) => {
    if (filterScope !== "all" && r.scope !== filterScope) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.orgName.toLowerCase().includes(q) ||
        r.jurisdiction.toLowerCase().includes(q) ||
        r.registrationNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <ProtectedAccessGate
      locale={locale}
      pageTitleAr="بوابة الامتثال والتحقق KYC/KYB ومكافحة غسل الأموال"
      pageTitleEn="Compliance, KYC/KYB & Sanctions Verification Portal"
      requiredRoleAr="مسؤولو الامتثال والتدقيق القانوني"
      requiredRoleEn="Compliance Officers & Legal Auditors"
      isAuthorized={isAuthorized}
      isDemoMode={isDemoMode}
      onEnableDemo={() => {
        setIsDemoMode(true);
        fetchRecords(true);
      }}
    >
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
              <span className="text-xs text-[#d4956b] font-medium">{t.compliance.breadcrumb}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#b87333]/20 to-[#0e1017] border border-[#b87333]/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#d4956b]" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-mono">
                {t.compliance.title}
              </h1>
            </div>
            <p className="text-xs text-gray-400 max-w-2xl">
              {t.compliance.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchRecords()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0e1017] border border-[#23273b] hover:border-[#b87333]/50 text-xs text-gray-300 hover:text-white transition-all"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
              <span>{t.compliance.lastUpdated}</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e1017] border border-emerald-500/30 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{t.common.verifiedBrokerage}</span>
            </div>
          </div>
        </div>

        {/* Verification Stage Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {(
            [
              "approved",
              "pending_review",
              "additional_info_required",
              "incomplete",
              "rejected",
              "expired",
              "suspended",
            ] as VerificationRecord["status"][]
          ).map((st) => {
            const count = records.filter((r) => r.status === st).length;
            const cfg = STATUS_CONFIG[st];
            return (
              <div
                key={st}
                onClick={() => setFilterStatus(filterStatus === st ? "all" : st)}
                className={cn(
                  "p-3 rounded-xl border cursor-pointer transition-all",
                  cfg.bg,
                  cfg.border,
                  filterStatus === st ? "ring-2 ring-[#b87333]" : "hover:border-[#b87333]/40"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    {cfg.label}
                  </span>
                  {cfg.icon}
                </div>
                <div className="text-xl font-bold font-mono text-white">{count}</div>
              </div>
            );
          })}
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0e1017] border border-[#1f2233] p-4 rounded-xl">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t.catalog.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141724] border border-[#23273b] rounded-lg pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b87333]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* Scope Filter */}
            <div className="flex items-center gap-1 bg-[#141724] border border-[#23273b] p-1 rounded-lg text-xs">
              <span className="px-2 text-gray-500 text-[11px]">{t.compliance.scope}:</span>
              <button
                onClick={() => setFilterScope("all")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-colors",
                  filterScope === "all" ? "bg-[#b87333] text-white font-medium" : "text-gray-400 hover:text-white"
                )}
              >
                {t.compliance.allScopes}
              </button>
              {Object.entries(SCOPE_CONFIG).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setFilterScope(key)}
                  className={cn(
                    "px-2.5 py-1 rounded-md transition-colors",
                    filterScope === key ? "bg-[#b87333] text-white font-medium" : "text-gray-400 hover:text-white"
                  )}
                >
                  {val.label.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content: Table & Detail Pane */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Records Table */}
          <div className="lg:col-span-8 bg-[#0c0e17] border border-[#1f2233] rounded-2xl overflow-hidden shadow-xl">
            <div className="px-5 py-4 border-b border-[#1f2233] flex items-center justify-between bg-[#0e1017]">
              <span className="text-sm font-semibold text-white">
                {t.compliance.badge} ({filteredRecords.length})
              </span>
              <span className="text-xs text-gray-500 font-mono">{t.common.usdReference}</span>
            </div>

            <div className="divide-y divide-[#181b29] overflow-x-auto">
              {filteredRecords.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-500">
                  {locale === "ar"
                    ? "لم يتم العثور على سجلات تدقيق أو امتثال تطابق معايير البحث والفلترة المحددة."
                    : "No compliance, verification, or sanctions audit records match the current filters."}
                </div>
              ) : (
                filteredRecords.map((r) => {
                  const statusCfg = STATUS_CONFIG[r.status];
                  const scopeCfg = SCOPE_CONFIG[r.scope];
                  const isSelected = selectedRecord?.id === r.id;

                  return (
                    <div
                      key={r.id}
                      onClick={() => setSelectedRecord(r)}
                      className={cn(
                        "p-4 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#131625]",
                        isSelected ? "bg-[#171a2c] border-l-4 rtl:border-l-0 rtl:border-r-4 border-[#b87333]" : ""
                      )}
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white group-hover:text-[#d4956b]">
                            {r.orgName}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#161929] border border-[#262a40] text-gray-300">
                            {r.orgCountry}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                          <div className="flex items-center gap-1.5">
                            {scopeCfg.icon}
                            <span>{scopeCfg.label}</span>
                          </div>
                          <span>•</span>
                          <span className="font-mono text-gray-500">{r.registrationNumber}</span>
                          <span>•</span>
                          <span className="text-gray-400">{r.jurisdiction}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "px-2 py-0.5 rounded text-[11px] font-mono border",
                            r.sanctionsScore === 0
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          )}
                        >
                          {r.sanctionsScore === 0
                            ? (locale === "ar" ? "سليم (0%)" : "CLEAR (0%)")
                            : (locale === "ar" ? `مُسجل (${r.sanctionsScore}%)` : `FLAGGED (${r.sanctionsScore}%)`)}
                        </div>

                        <div
                          className={cn(
                            "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                            statusCfg.bg,
                            statusCfg.border,
                            statusCfg.color
                          )}
                        >
                          {statusCfg.icon}
                          <span>{statusCfg.label}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Record Inspection & Audit Review Pane */}
          <div className="lg:col-span-4 space-y-4">
            {selectedRecord ? (
              <div className="bg-[#0e1017] border border-[#23273b] rounded-2xl p-5 space-y-5 sticky top-24 shadow-2xl">
                <div className="border-b border-[#1f2233] pb-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[#d4956b] font-semibold">
                      {t.compliance.viewDetails}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">ID: {selectedRecord.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{selectedRecord.orgName}</h3>
                  <p className="text-xs text-gray-400">{selectedRecord.jurisdiction}</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-gray-500 block text-[11px]">{t.compliance.company}</span>
                    <span className="text-gray-200 font-mono">
                      {selectedRecord.registrationNumber} / {selectedRecord.taxNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">
                      {locale === "ar" ? "المالك المستفيد النهائي (UBO)" : "UBO"}
                    </span>
                    <span className="text-gray-200 font-medium">{selectedRecord.uboName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">{t.compliance.status}</span>
                    <p className="text-gray-300 bg-[#141724] p-2.5 rounded-lg border border-[#23273b] mt-1 text-[11px] leading-relaxed">
                      {selectedRecord.decisionReason || t.compliance.approved}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-[#1f2233] pt-4">
                  <span className="text-xs font-semibold text-gray-300 block">
                    {t.compliance.cargoScope}:
                  </span>
                  <div className="space-y-1.5">
                    {selectedRecord.documentsSubmitted.map((doc, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#141724] border border-[#23273b] text-xs text-gray-300"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-[#d4956b]" />
                          <span className="truncate">{doc}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          {locale === "ar" ? "مُعتمد وموثق" : "AUTHENTICATED"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Compliance Officer Actions */}
                <div className="border-t border-[#1f2233] pt-4 space-y-3">
                  <span className="text-xs font-semibold text-gray-300 block">
                    {t.compliance.actions}:
                  </span>
                  <textarea
                    rows={2}
                    placeholder={t.compliance.additionalInfo}
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    className="w-full bg-[#141724] border border-[#23273b] rounded-lg p-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b87333]"
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleUpdateStatus("approved")}
                      className="py-2 px-3 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold hover:bg-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {t.compliance.approved}
                    </button>
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleUpdateStatus("additional_info_required")}
                      className="py-2 px-3 rounded-lg bg-orange-600/20 border border-orange-500/40 text-orange-400 text-xs font-semibold hover:bg-orange-600/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {t.compliance.additionalInfo}
                    </button>
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleUpdateStatus("suspended")}
                      className="py-2 px-3 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300 text-xs font-semibold hover:bg-purple-600/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      {t.compliance.suspended}
                    </button>
                    <button
                      type="button"
                      disabled={updating}
                      onClick={() => handleUpdateStatus("rejected")}
                      className="py-2 px-3 rounded-lg bg-rose-600/20 border border-rose-500/40 text-rose-400 text-xs font-semibold hover:bg-rose-600/30 transition-all flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {t.compliance.rejected}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#0e1017] border border-[#1f2233] rounded-2xl p-8 text-center text-xs text-gray-500 space-y-3">
                <ShieldCheck className="w-10 h-10 text-gray-600 mx-auto" />
                <p>{t.compliance.viewDetails}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </ProtectedAccessGate>
  );
}
