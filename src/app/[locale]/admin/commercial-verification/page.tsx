"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/routing";
import {
  ShieldCheck,
  ShieldAlert,
  FileCheck2,
  FileText,
  Building2,
  Ship,
  Search,
  Filter,
  Plus,
  RefreshCw,
  Eye,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Lock,
  Globe,
  Users,
  ChevronRight,
  ArrowUpDown,
  FileBadge,
  Layers,
  Scale,
  Calendar,
  ExternalLink,
  Info,
  Check,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  CommercialVerificationCase,
  CommercialVerificationDocument,
  CommercialVerificationCheck,
  VerificationCheckOutcome,
  CommercialVerificationDecision,
  VerificationAvailabilityMode,
} from "@/lib/store";

export default function AdminCommercialVerificationPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "ar";
  const isAr = locale === "ar";

  // State
  const [cases, setCases] = useState<CommercialVerificationCase[]>([]);
  const [currentMode, setCurrentMode] = useState<VerificationAvailabilityMode>("admin_only");
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("platform_admin");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scopeFilter, setScopeFilter] = useState("all");

  // Selected Case Detail View
  const [selectedCase, setSelectedCase] = useState<CommercialVerificationCase | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "docs" | "matrix" | "checks" | "decision" | "audit">("overview");
  const [consistencyMatrix, setConsistencyMatrix] = useState<any[]>([]);

  // Modals
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [showModeModal, setShowModeModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // New Case Form State
  const [newEntityName, setNewEntityName] = useState("");
  const [newEntityType, setNewEntityType] = useState<"company" | "supplier" | "buyer" | "broker">("company");
  const [newCountryCode, setNewCountryCode] = useState("CH");
  const [newScope, setNewScope] = useState("full_investigation");
  const [newCommodityName, setNewCommodityName] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newUnit, setNewUnit] = useState("MT");
  const [newVesselName, setNewVesselName] = useState("");
  const [newVesselImo, setNewVesselImo] = useState("");
  const [newDischargePort, setNewDischargePort] = useState("");
  const [newLoadingPort, setNewLoadingPort] = useState("");

  // Mode Switch Form State
  const [selectedNewMode, setSelectedNewMode] = useState<VerificationAvailabilityMode>("admin_only");
  const [modeChangeReason, setModeChangeReason] = useState("");

  // Document Upload Form State
  const [uploadDocTitle, setUploadDocTitle] = useState("");
  const [uploadDocType, setUploadDocType] = useState<CommercialVerificationDocument["documentType"]>("bill_of_lading");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [extractedVessel, setExtractedVessel] = useState("");
  const [extractedImo, setExtractedImo] = useState("");
  const [extractedQty, setExtractedQty] = useState("");
  const [extractedPort, setExtractedPort] = useState("");

  // Reviewer Decision Form State
  const [decisionChoice, setDecisionChoice] = useState<CommercialVerificationDecision>("pending");
  const [decisionJustification, setDecisionJustification] = useState("");
  const [reviewerConfidentialNotes, setReviewerConfidentialNotes] = useState("");
  const [shareWithClientCheck, setShareWithClientCheck] = useState(false);

  // Feedback Messages
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionErrorMsg, setActionErrorMsg] = useState<string | null>(null);

  // Fetch Cases and Settings
  const fetchData = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      // 1. Fetch Mode & Settings
      const settingsRes = await fetch("/api/admin/commercial-verification/settings", {
        cache: "no-store",
      });
      if (settingsRes.status === 401 || settingsRes.status === 403) {
        setAuthError(
          isAr
            ? "غير مصرّح بالوصول: هذه الصفحة الإدارية مخصصة حصرياً للمشرفين ومسؤولي الامتثال المعتمدين في Valorea Market."
            : "Unauthorized Access: This administrative console is strictly restricted to certified Valorea Market compliance officers and platform administrators."
        );
        setIsLoading(false);
        return;
      }
      const settingsData = await settingsRes.json();
      if (settingsData.currentMode) {
        setCurrentMode(settingsData.currentMode);
        setSelectedNewMode(settingsData.currentMode);
      }

      // 2. Fetch Cases
      const casesRes = await fetch(
        `/api/admin/commercial-verification?search=${encodeURIComponent(searchQuery)}&status=${statusFilter}&scope=${scopeFilter}`,
        { cache: "no-store" }
      );
      if (!casesRes.ok) {
        const err = await casesRes.json();
        setAuthError(err.message || "Failed to load verification records.");
        setIsLoading(false);
        return;
      }
      const casesData = await casesRes.json();
      setCases(casesData.data || []);
      if (casesData.userRole) setUserRole(casesData.userRole);

      // If a case is already open, refresh it
      if (selectedCase) {
        const detailRes = await fetch(`/api/admin/commercial-verification/${selectedCase.id}`);
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          setSelectedCase(detailData.case);
          setConsistencyMatrix(detailData.consistencyMatrix || []);
          setDecisionChoice(detailData.case.finalDecision);
          setDecisionJustification(detailData.case.decisionJustification || "");
          setReviewerConfidentialNotes(detailData.case.reviewerNotes || "");
          setShareWithClientCheck(detailData.case.sharedWithClient || false);
        }
      }
    } catch (err: any) {
      setAuthError(err.message || "Network error loading verification console.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, statusFilter, scopeFilter]);

  // Open Case Detail
  const handleOpenCase = async (caseItem: CommercialVerificationCase) => {
    setSelectedCase(caseItem);
    setActiveTab("overview");
    setDecisionChoice(caseItem.finalDecision);
    setDecisionJustification(caseItem.decisionJustification || "");
    setReviewerConfidentialNotes(caseItem.reviewerNotes || "");
    setShareWithClientCheck(caseItem.sharedWithClient || false);

    try {
      const res = await fetch(`/api/admin/commercial-verification/${caseItem.id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedCase(data.case);
        setConsistencyMatrix(data.consistencyMatrix || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit New Case
  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionErrorMsg(null);
    try {
      const res = await fetch("/api/admin/commercial-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetEntityName: newEntityName,
          targetEntityType: newEntityType,
          countryCode: newCountryCode,
          scope: newScope,
          commodityDetails: {
            commodityName: newCommodityName || undefined,
            quantity: newQuantity ? parseFloat(newQuantity) : undefined,
            unit: newUnit,
            vesselName: newVesselName || undefined,
            vesselImo: newVesselImo || undefined,
            dischargePort: newDischargePort || undefined,
            loadingPort: newLoadingPort || undefined,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionErrorMsg(data.message || "Failed to create verification case");
        return;
      }

      setShowNewCaseModal(false);
      setActionSuccessMsg(isAr ? "تم إنشاء ملف التحقق التجاري بنجاح." : "Verification dossier created successfully.");
      setNewEntityName("");
      setNewCommodityName("");
      setNewVesselName("");
      fetchData();
    } catch (err: any) {
      setActionErrorMsg(err.message || "Network error");
    }
  };

  // Save Availability Mode Change
  const handleSaveMode = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionErrorMsg(null);
    try {
      const res = await fetch("/api/admin/commercial-verification/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: selectedNewMode,
          reason: modeChangeReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionErrorMsg(data.message || "Failed to update availability mode");
        return;
      }

      setCurrentMode(selectedNewMode);
      setShowModeModal(false);
      setActionSuccessMsg(
        isAr
          ? `تم تحديث مستوى إتاحة الخدمة بنجاح إلى: ${getModeBadge(selectedNewMode).labelAr}`
          : `Availability mode successfully updated to: ${selectedNewMode}`
      );
      setModeChangeReason("");
    } catch (err: any) {
      setActionErrorMsg(err.message || "Network error");
    }
  };

  // Document Upload
  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    setActionErrorMsg(null);

    try {
      const extractedFields: Record<string, any> = {};
      if (extractedVessel) extractedFields.vesselName = extractedVessel;
      if (extractedImo) extractedFields.vesselImo = extractedImo;
      if (extractedQty) extractedFields.quantity = extractedQty;
      if (extractedPort) extractedFields.dischargePort = extractedPort;

      let res;
      if (uploadFile) {
        const fd = new FormData();
        fd.append("file", uploadFile);
        fd.append("title", uploadDocTitle || uploadFile.name);
        fd.append("documentType", uploadDocType);
        fd.append("extractedFields", JSON.stringify(extractedFields));

        res = await fetch(`/api/admin/commercial-verification/${selectedCase.id}/documents`, {
          method: "POST",
          body: fd,
        });
      } else {
        // Direct metadata registration
        res = await fetch(`/api/admin/commercial-verification/${selectedCase.id}/documents`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: uploadDocTitle || "Official Trade Document",
            documentType: uploadDocType,
            fileName: `${uploadDocType}-certified.pdf`,
            fileSizeBytes: 245000,
            mimeType: "application/pdf",
            extractedFields,
          }),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setActionErrorMsg(data.message || "Document upload failed");
        return;
      }

      setShowUploadModal(false);
      setUploadFile(null);
      setUploadDocTitle("");
      setExtractedVessel("");
      setExtractedImo("");
      setExtractedQty("");
      setExtractedPort("");
      setActionSuccessMsg(isAr ? "تم تسجيل الوثيقة وتشفيرها في الخزينة." : "Document registered to vault.");
      handleOpenCase(selectedCase);
    } catch (err: any) {
      setActionErrorMsg(err.message || "Upload error");
    }
  };

  // Update Individual Check Outcome
  const handleUpdateCheck = async (
    checkId: string,
    outcome: VerificationCheckOutcome,
    notes: string,
    evidenceSource: string
  ) => {
    if (!selectedCase) return;
    try {
      const res = await fetch(`/api/admin/commercial-verification/${selectedCase.id}/checks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkId,
          outcomeStatus: outcome,
          reviewerNotes: notes,
          evidenceSource,
        }),
      });

      if (res.ok) {
        setActionSuccessMsg(isAr ? "تم تحديث حالة الفحص ومصدر الدليل." : "Check outcome updated.");
        handleOpenCase(selectedCase);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Executive Decision
  const handleSaveDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    setActionErrorMsg(null);

    try {
      const res = await fetch(`/api/admin/commercial-verification/${selectedCase.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision: decisionChoice,
          justification: decisionJustification,
          reviewerNotes: reviewerConfidentialNotes,
          shareWithClient: shareWithClientCheck,
          status: decisionChoice === "pending" ? "in_review" : "completed",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setActionErrorMsg(data.message || "Failed to record executive decision");
        return;
      }

      setActionSuccessMsg(isAr ? "تم اعتماد القرار النهائي وسجل المراجعة بنجاح." : "Executive decision recorded.");
      handleOpenCase(data.case);
      fetchData();
    } catch (err: any) {
      setActionErrorMsg(err.message || "Network error");
    }
  };

  // Download Document with Ephemeral Token
  const handleDownloadDoc = async (docId: string) => {
    if (!selectedCase) return;
    try {
      const res = await fetch(
        `/api/admin/commercial-verification/${selectedCase.id}/documents/${docId}/download`
      );
      const data = await res.json();
      if (res.ok && data.downloadUrl) {
        alert(
          isAr
            ? `تم إصدار رابط تنزيل مشفر وموقّع ينتهي بعد 300 ثانية.\nبصمة الوثيقة (SHA-256):\n${data.document.sha256Hash}`
            : `Ephemeral signed download token generated (valid for 300s).\nSHA-256 Hash:\n${data.document.sha256Hash}`
        );
      } else {
        alert(data.message || "Download request failed");
      }
    } catch (e) {
      alert("Download error");
    }
  };

  // Helper Labels & Badges
  const getModeBadge = (mode: VerificationAvailabilityMode) => {
    switch (mode) {
      case "admin_only":
        return {
          labelAr: "الإدارة فقط (افتراضي ومقيد)",
          labelEn: "Admin Only (Default & Restricted)",
          color: "bg-red-500/10 text-red-400 border-red-500/30",
          icon: Lock,
        };
      case "registered_clients":
        return {
          labelAr: "عملاء مسجلون (عزل مؤسسي)",
          labelEn: "Registered Clients (Tenant Isolated)",
          color: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          icon: Users,
        };
      case "public_informational":
        return {
          labelAr: "صفحة عامة تعريفية فقط",
          labelEn: "Public Informational Only",
          color: "bg-blue-500/10 text-blue-400 border-blue-500/30",
          icon: Globe,
        };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return { labelAr: "جديدة", labelEn: "New", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
      case "in_review":
        return { labelAr: "قيد المراجعة", labelEn: "In Review", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
      case "needs_info":
        return { labelAr: "تحتاج معلومات", labelEn: "Needs Info", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" };
      case "completed":
        return { labelAr: "مكتملة", labelEn: "Completed", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
      default:
        return { labelAr: status, labelEn: status, color: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
    }
  };

  const getOutcomeBadge = (outcome: VerificationCheckOutcome) => {
    switch (outcome) {
      case "unverified":
        return { labelAr: "لم يتم التحقق", labelEn: "Unverified", color: "bg-gray-500/15 text-gray-400 border-gray-500/30", icon: HelpCircle };
      case "data_reviewed":
        return { labelAr: "تمت مراجعة البيانات", labelEn: "Data Reviewed", color: "bg-blue-500/15 text-blue-400 border-blue-500/30", icon: FileCheck2 };
      case "needs_human_review":
        return { labelAr: "تحتاج مراجعة بشرية", labelEn: "Needs Human Review", color: "bg-amber-500/15 text-amber-400 border-amber-500/30", icon: AlertTriangle };
      case "confirmed_from_source":
        return { labelAr: "تم تأكيدها من المصدر", labelEn: "Source Confirmed", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 };
      case "inconclusive":
        return { labelAr: "تعذر التحقق", labelEn: "Inconclusive", color: "bg-rose-500/15 text-rose-400 border-rose-500/30", icon: XCircle };
    }
  };

  const getDecisionBadge = (decision: CommercialVerificationDecision) => {
    switch (decision) {
      case "pending":
        return { labelAr: "قيد الدراسة", labelEn: "Pending", color: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
      case "cleared":
        return { labelAr: "معتمد ومقبول", labelEn: "Cleared", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
      case "conditional":
        return { labelAr: "معتمد بشروط", labelEn: "Conditional", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
      case "rejected":
        return { labelAr: "مرفوض / غير مستوفٍ", labelEn: "Rejected", color: "bg-rose-500/10 text-rose-400 border-rose-500/30" };
      case "inconclusive":
        return { labelAr: "تعذر التحقق", labelEn: "Inconclusive", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" };
    }
  };

  // Case counts
  const totalCount = cases.length;
  const newCount = cases.filter((c) => c.status === "new").length;
  const inReviewCount = cases.filter((c) => c.status === "in_review").length;
  const needsInfoCount = cases.filter((c) => c.status === "needs_info").length;
  const completedCount = cases.filter((c) => c.status === "completed").length;

  // Unauthenticated / Forbidden Screen (Air-Gapped, No Leaked Data)
  if (authError) {
    return (
      <div className="min-h-screen bg-[#07080c] text-[#f8fafc] flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="max-w-xl w-full rounded-3xl bg-[#0c0e17] border border-[#23273b] p-8 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121420] border border-[#23273b] text-xs font-mono text-[#d4956b]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAr ? "نظام حماية الوصول المؤسسي (RBAC Guard)" : "Role-Based Access Control"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {isAr ? "منطقة مقيدة: التحقق التجاري" : "Restricted: Commercial Verification"}
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
              {authError}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/admin/login"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white font-semibold text-xs sm:text-sm shadow-lg shadow-[#b87333]/20 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isAr ? "تسجيل دخول المشرفين المعتمدين" : "Executive Admin Sign In"}</span>
            </Link>
            <Link
              href="/verification"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#141724] hover:bg-[#1a1f30] border border-[#23273b] text-gray-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <Info className="w-4 h-4 text-[#d4956b]" />
              <span>{isAr ? "الصفحة التعريفية العامة للخدمة" : "Public Service Overview"}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentModeBadge = getModeBadge(currentMode);
  const CurrentModeIcon = currentModeBadge.icon;

  return (
    <div className="min-h-screen bg-[#07080c] text-[#f8fafc] pb-24 font-sans selection:bg-[#b87333]/30 selection:text-white">
      {/* Top Banner Alert if notification active */}
      {actionSuccessMsg && (
        <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-4 py-2.5 text-center text-xs text-emerald-300 font-mono flex items-center justify-center gap-2 sticky top-0 z-50 backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
          <button onClick={() => setActionSuccessMsg(null)} className="ml-4 text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {actionErrorMsg && (
        <div className="bg-rose-500/15 border-b border-rose-500/30 px-4 py-2.5 text-center text-xs text-rose-300 font-mono flex items-center justify-center gap-2 sticky top-0 z-50 backdrop-blur-md">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{actionErrorMsg}</span>
          <button onClick={() => setActionErrorMsg(null)} className="ml-4 text-rose-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Header Container */}
      <div className="border-b border-[#1f2233] bg-[#0c0e17]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title & Badge */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#b87333] to-[#8b5a2b] p-0.5 flex items-center justify-center shadow-lg shadow-[#b87333]/20">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    {isAr ? "إدارة التحقق التجاري والعناية الواجبة" : "Commercial Verification & Trade Diligence"}
                  </h1>
                  <p className="text-xs text-gray-400">
                    {isAr
                      ? "وحدة التدقيق المؤسسي للشركات ووثائق السلع واتساق الصفقات الفيزيائية"
                      : "Institutional Audit Unit for Counterparties, Trade Documents & Cargo Consistency"}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions: Mode Switcher & New Case */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Current Mode Pill */}
              <button
                type="button"
                onClick={() => setShowModeModal(true)}
                className={cn(
                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-sm",
                  currentModeBadge.color,
                  "hover:brightness-125 cursor-pointer"
                )}
                title={isAr ? "انقر لتغيير وضع إتاحة الخدمة" : "Click to adjust availability mode"}
              >
                <CurrentModeIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{isAr ? currentModeBadge.labelAr : currentModeBadge.labelEn}</span>
                <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-black/30">
                  {isAr ? "تعديل" : "Edit"}
                </span>
              </button>

              {/* Return to Platform Link */}
              <Link
                href="/"
                className="p-2 rounded-lg bg-[#141724] border border-[#23273b] hover:border-gray-500 text-gray-300 hover:text-white transition-all flex items-center gap-1.5 text-xs"
                title={isAr ? "العودة إلى المنصة الرئيسية" : "Return to Platform"}
              >
                <Globe className="w-4 h-4 text-[#d4956b]" />
                <span className="hidden sm:inline">{isAr ? "المنصة" : "Platform"}</span>
              </Link>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={fetchData}
                disabled={isLoading}
                className="p-2 rounded-lg bg-[#141724] border border-[#23273b] hover:border-gray-500 text-gray-300 hover:text-white transition-all disabled:opacity-50"
                title={isAr ? "تحديث السجلات" : "Refresh Records"}
              >
                <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
              </button>

              {/* New Case Button */}
              <button
                type="button"
                onClick={() => setShowNewCaseModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#b87333]/20 hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? "فتح ملف تحقق جديد" : "New Verification Case"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Due Diligence Mandatory Advisory Banner */}
        <div className="rounded-2xl bg-[#0f121d] border border-amber-500/25 p-4 flex items-start gap-3 shadow-lg shadow-black/30">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-gray-300 leading-relaxed">
            <span className="font-semibold text-amber-300 block">
              {isAr ? "إشعار الامتثال المهني والعناية الواجبة (Due Diligence Standard):" : "Institutional Due Diligence Advisory:"}
            </span>
            <p>
              {isAr
                ? "نتائج الفحوصات ومصفوفة اتساق المستندات هي أدوات مساعدة للتحري وتقييم المخاطر؛ ولا تشكل ضماناً مالياً قاطعاً لسلامة الشحنة أو تصديقاً حكومياً رسمياً لأصالة الوثائق. الفحص البصري واستخراج النصوص لا يثبتان أصالة الوثيقة دون تأكيد مباشر من الجهة المصدرة. جميع النتائج غير المؤكدة تعرض بوضوح كـ «لم يتم التحقق» أو «غير متاح»."
                : "Verification checks and cross-document matrices serve as investigative risk-mitigation aids. They do not constitute a financial guarantee of shipment completion or official governmental consularization. OCR text extraction does not prove document authenticity without direct issuing authority validation. Unconnected data sources strictly display as 'Unverified' or 'Not Available'."}
            </p>
          </div>
        </div>

        {/* Metrics Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="rounded-2xl bg-[#0c0e17] border border-[#1f2233] p-4 shadow-sm">
            <span className="text-xs text-gray-400 block mb-1">{isAr ? "إجمالي الحالات" : "Total Cases"}</span>
            <span className="text-2xl font-bold font-mono text-white">{totalCount}</span>
          </div>
          <div className="rounded-2xl bg-[#0c0e17] border border-[#1f2233] p-4 shadow-sm">
            <span className="text-xs text-blue-400 block mb-1">{isAr ? "جديدة" : "New"}</span>
            <span className="text-2xl font-bold font-mono text-blue-400">{newCount}</span>
          </div>
          <div className="rounded-2xl bg-[#0c0e17] border border-[#1f2233] p-4 shadow-sm">
            <span className="text-xs text-amber-400 block mb-1">{isAr ? "قيد المراجعة" : "In Review"}</span>
            <span className="text-2xl font-bold font-mono text-amber-400">{inReviewCount}</span>
          </div>
          <div className="rounded-2xl bg-[#0c0e17] border border-[#1f2233] p-4 shadow-sm">
            <span className="text-xs text-purple-400 block mb-1">{isAr ? "تحتاج معلومات" : "Needs Info"}</span>
            <span className="text-2xl font-bold font-mono text-purple-400">{needsInfoCount}</span>
          </div>
          <div className="rounded-2xl bg-[#0c0e17] border border-[#1f2233] p-4 shadow-sm col-span-2 sm:col-span-1">
            <span className="text-xs text-emerald-400 block mb-1">{isAr ? "مكتملة" : "Completed"}</span>
            <span className="text-2xl font-bold font-mono text-emerald-400">{completedCount}</span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="rounded-2xl bg-[#0c0e17] border border-[#1f2233] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث بالشركة، رقم المرجع، السلعة، أو اسم المراجع..." : "Search company, reference #, commodity, reviewer..."}
              className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 rounded-xl bg-[#121420] border border-[#23273b] text-xs sm:text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#b87333] transition-colors"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#121420] border border-[#23273b] text-xs text-gray-300 focus:outline-none focus:border-[#b87333]"
            >
              <option value="all">{isAr ? "جميع الحالات" : "All Statuses"}</option>
              <option value="new">{isAr ? "جديدة" : "New"}</option>
              <option value="in_review">{isAr ? "قيد المراجعة" : "In Review"}</option>
              <option value="needs_info">{isAr ? "تحتاج معلومات" : "Needs Info"}</option>
              <option value="completed">{isAr ? "مكتملة" : "Completed"}</option>
            </select>

            {/* Scope Filter */}
            <select
              value={scopeFilter}
              onChange={(e) => setScopeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#121420] border border-[#23273b] text-xs text-gray-300 focus:outline-none focus:border-[#b87333]"
            >
              <option value="all">{isAr ? "جميع النطاقات" : "All Scopes"}</option>
              <option value="company_due_diligence">{isAr ? "فحص الشركة" : "Company Diligence"}</option>
              <option value="commodity_documents">{isAr ? "وثائق السلع" : "Commodity Docs"}</option>
              <option value="deal_consistency">{isAr ? "اتساق الصفقة" : "Deal Consistency"}</option>
              <option value="counterparty_risk">{isAr ? "مخاطر الأطراف" : "Counterparty Risk"}</option>
              <option value="full_investigation">{isAr ? "تحقيق شامل" : "Full Investigation"}</option>
            </select>
          </div>
        </div>

        {/* Cases Table */}
        <div className="rounded-2xl bg-[#0c0e17] border border-[#1f2233] overflow-hidden shadow-xl">
          {cases.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#141724] border border-[#23273b] flex items-center justify-center text-gray-500 mx-auto">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-white">
                  {isAr ? "لا توجد ملفات تحقق تجاري مسجلة حالياً" : "No Commercial Verification Cases Found"}
                </h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto">
                  {isAr
                    ? "وفقاً لمعايير الأمان، لا يتم عرض بيانات تجريبية وهمية. استخدم زر 'فتح ملف تحقق جديد' لبدء فحص شركة حقيقية، أو ربط شحنة جديدة للتدقيق."
                    : "Zero mock data policy active. Use the 'New Verification Case' button to initiate commercial due diligence for a counterparty or trade shipment."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewCaseModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#141724] hover:bg-[#1c2032] border border-[#23273b] text-xs font-medium text-gray-200 hover:text-white transition-all"
              >
                <Plus className="w-4 h-4 text-[#d4956b]" />
                <span>{isAr ? "فتح ملف تحقق جديد الآن" : "Create First Case"}</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right text-xs">
                <thead className="bg-[#0f111a] border-b border-[#1f2233] text-gray-400 uppercase font-mono tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">{isAr ? "المرجع" : "Ref #"}</th>
                    <th className="py-3.5 px-4 font-semibold">{isAr ? "الكيان المستهدف والدولة" : "Target Entity & Country"}</th>
                    <th className="py-3.5 px-4 font-semibold">{isAr ? "النطاق" : "Scope"}</th>
                    <th className="py-3.5 px-4 font-semibold">{isAr ? "الحالة" : "Status"}</th>
                    <th className="py-3.5 px-4 font-semibold">{isAr ? "القرار النهائي" : "Decision"}</th>
                    <th className="py-3.5 px-4 font-semibold">{isAr ? "المراجع المسؤول" : "Reviewer"}</th>
                    <th className="py-3.5 px-4 font-semibold">{isAr ? "إتاحة العميل" : "Client Release"}</th>
                    <th className="py-3.5 px-4 font-semibold text-center">{isAr ? "إجراء" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#181a27] text-gray-300">
                  {cases.map((c) => {
                    const statusBadge = getStatusBadge(c.status);
                    const decisionBadge = getDecisionBadge(c.finalDecision);

                    return (
                      <tr key={c.id} className="hover:bg-[#121422]/60 transition-colors">
                        <td className="py-4 px-4 font-mono font-semibold text-[#d4956b]">
                          {c.referenceNumber}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-[#1a1d2d] border border-[#292c42] font-mono text-[10px] text-gray-300 uppercase">
                              {c.countryCode}
                            </span>
                            <div className="flex flex-col">
                              <span className="font-semibold text-white">{c.targetEntityName}</span>
                              <span className="text-[11px] text-gray-400 capitalize">
                                {c.targetEntityType} {c.commodityDetails?.commodityName ? `• ${c.commodityDetails.commodityName}` : ""}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-[#141624] border border-[#23273b] text-[11px] text-gray-300 capitalize">
                            {c.scope.replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={cn("px-2 py-0.5 rounded-full border text-[11px] font-medium", statusBadge.color)}>
                            {isAr ? statusBadge.labelAr : statusBadge.labelEn}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={cn("px-2 py-0.5 rounded-full border text-[11px] font-medium", decisionBadge.color)}>
                            {isAr ? decisionBadge.labelAr : decisionBadge.labelEn}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-400">
                          {c.assignedReviewerName || "—"}
                        </td>
                        <td className="py-4 px-4">
                          {c.sharedWithClient ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isAr ? "منشور للعميل" : "Released"}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                              <Lock className="w-3.5 h-3.5" />
                              <span>{isAr ? "للإدارة فقط" : "Confidential"}</span>
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenCase(c)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181c2c] hover:bg-[#22283e] border border-[#292f49] text-xs text-white font-medium transition-all"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#d4956b]" />
                            <span>{isAr ? "فحص الملف" : "Inspect Dossier"}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* CASE DETAILS DRAWER / MODAL */}
      {/* ======================================================== */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-4xl h-full bg-white dark:bg-[#0a0c14] border-l border-gray-200 dark:border-[#1f2233] flex flex-col shadow-2xl overflow-hidden">
            {/* Drawer Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-[#1f2233] bg-gray-50 dark:bg-[#0e101a] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b87333] to-[#8b5a2b] p-0.5 flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white font-mono">
                      {selectedCase.referenceNumber}
                    </h2>
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-[#1b1f30] text-[10px] font-mono text-[#b87333] dark:text-[#d4956b] border border-gray-300 dark:border-[#282f48] uppercase">
                      {selectedCase.countryCode}
                    </span>
                    <span className={cn("px-2 py-0.5 rounded-full border text-[10px] font-medium", getStatusBadge(selectedCase.status).color)}>
                      {isAr ? getStatusBadge(selectedCase.status).labelAr : getStatusBadge(selectedCase.status).labelEn}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {selectedCase.targetEntityName} ({selectedCase.targetEntityType})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="p-2 rounded-lg bg-white dark:bg-[#141724] border border-gray-200 dark:border-[#23273b] hover:border-gray-400 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center border-b border-gray-200 dark:border-[#1f2233] bg-gray-50/50 dark:bg-[#0b0d16] px-4 sm:px-6 overflow-x-auto shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={cn(
                  "py-3 px-3 border-b-2 font-medium text-xs whitespace-nowrap transition-colors flex items-center gap-1.5",
                  activeTab === "overview"
                    ? "border-[#b87333] text-gray-900 dark:text-white font-bold"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                )}
              >
                <Building2 className="w-3.5 h-3.5 text-[#d4956b]" />
                <span>{isAr ? "البيانات والسلعة" : "Profile & Cargo"}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("docs")}
                className={cn(
                  "py-3 px-3 border-b-2 font-medium text-xs whitespace-nowrap transition-colors flex items-center gap-1.5",
                  activeTab === "docs"
                    ? "border-[#b87333] text-gray-900 dark:text-white font-bold"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                )}
              >
                <FileText className="w-3.5 h-3.5 text-[#d4956b]" />
                <span>{isAr ? "الوثائق والأدلة" : "Trade Docs"}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-gray-100 dark:bg-[#1b1f30] text-[10px] font-mono text-gray-700 dark:text-gray-300">
                  {selectedCase.documents.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("matrix")}
                className={cn(
                  "py-3 px-3 border-b-2 font-medium text-xs whitespace-nowrap transition-colors flex items-center gap-1.5",
                  activeTab === "matrix"
                    ? "border-[#b87333] text-gray-900 dark:text-white font-bold"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                )}
              >
                <Layers className="w-3.5 h-3.5 text-[#d4956b]" />
                <span>{isAr ? "مصفوفة الاتساق" : "Consistency Matrix"}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("checks")}
                className={cn(
                  "py-3 px-3 border-b-2 font-medium text-xs whitespace-nowrap transition-colors flex items-center gap-1.5",
                  activeTab === "checks"
                    ? "border-[#b87333] text-gray-900 dark:text-white font-bold"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                )}
              >
                <Scale className="w-3.5 h-3.5 text-[#d4956b]" />
                <span>{isAr ? "مؤشرات التحقق والمصادر" : "Risk Indicators"}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-gray-100 dark:bg-[#1b1f30] text-[10px] font-mono text-gray-700 dark:text-gray-300">
                  {selectedCase.checks.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("decision")}
                className={cn(
                  "py-3 px-3 border-b-2 font-medium text-xs whitespace-nowrap transition-colors flex items-center gap-1.5",
                  activeTab === "decision"
                    ? "border-[#b87333] text-gray-900 dark:text-white font-bold"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                )}
              >
                <FileBadge className="w-3.5 h-3.5 text-[#d4956b]" />
                <span>{isAr ? "القرار الإداري" : "Executive Decision"}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("audit")}
                className={cn(
                  "py-3 px-3 border-b-2 font-medium text-xs whitespace-nowrap transition-colors flex items-center gap-1.5",
                  activeTab === "audit"
                    ? "border-[#b87333] text-gray-900 dark:text-white font-bold"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                )}
              >
                <Clock className="w-3.5 h-3.5 text-[#d4956b]" />
                <span>{isAr ? "سجل التدقيق" : "Audit Trail"}</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB 1: OVERVIEW & CARGO */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Entity Card */}
                  <div className="rounded-2xl bg-[#0e101a] border border-[#1f2233] p-5 space-y-4">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#d4956b]" />
                      <span>{isAr ? "بيانات الكيان المستهدف والتحقق" : "Target Entity Profile"}</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-400 block">{isAr ? "اسم الكيان التجاري:" : "Company Name:"}</span>
                        <span className="font-semibold text-white text-sm">{selectedCase.targetEntityName}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">{isAr ? "الدولة والولاية القضائية:" : "Jurisdiction:"}</span>
                        <span className="font-semibold text-white uppercase font-mono">{selectedCase.countryCode}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">{isAr ? "الصفة في التداول:" : "Trading Role:"}</span>
                        <span className="font-semibold text-white capitalize">{selectedCase.targetEntityType}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">{isAr ? "نطاق التحقيق:" : "Verification Scope:"}</span>
                        <span className="font-semibold text-white capitalize">{selectedCase.scope.replace(/_/g, " ")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Commodity & Shipping Specs */}
                  <div className="rounded-2xl bg-[#0e101a] border border-[#1f2233] p-5 space-y-4">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Ship className="w-4 h-4 text-[#d4956b]" />
                      <span>{isAr ? "بيانات السلعة ومسار الشحن الملاحي" : "Commodity & Maritime Specifications"}</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-400 block">{isAr ? "اسم السلعة / المادة الأولية:" : "Commodity:"}</span>
                        <span className="font-semibold text-white">
                          {selectedCase.commodityDetails?.commodityName || (isAr ? "غير محددة في الطلب" : "Not specified")}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">{isAr ? "الكمية المتعاقد عليها:" : "Contracted Quantity:"}</span>
                        <span className="font-semibold text-white font-mono">
                          {selectedCase.commodityDetails?.quantity
                            ? `${selectedCase.commodityDetails.quantity} ${selectedCase.commodityDetails.unit || "MT"}`
                            : "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">{isAr ? "اسم الناقلة البحرية:" : "Vessel Name:"}</span>
                        <span className="font-semibold text-white">
                          {selectedCase.commodityDetails?.vesselName || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">{isAr ? "رقم IMO للناقلة:" : "IMO Number:"}</span>
                        <span className="font-semibold text-white font-mono">
                          {selectedCase.commodityDetails?.vesselImo || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">{isAr ? "ميناء الشحن (Loading):" : "Loading Port:"}</span>
                        <span className="font-semibold text-white">
                          {selectedCase.commodityDetails?.loadingPort || "—"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">{isAr ? "ميناء التفريغ (Discharge):" : "Discharge Port:"}</span>
                        <span className="font-semibold text-white">
                          {selectedCase.commodityDetails?.dischargePort || "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DOCUMENTS & EVIDENCE */}
              {activeTab === "docs" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {isAr ? "الوثائق المرفوعة وأدلة التداول" : "Attached Trade Documents"}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {isAr ? "تخزين مشفر محمي بروابط مؤقتة تنتهي بعد 300 ثانية مع تسجيل بصمة SHA-256." : "Encrypted storage with ephemeral 300-second access tokens and SHA-256 hashes."}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#b87333] hover:bg-[#d4956b] text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isAr ? "رفع وثيقة جديدة" : "Upload Document"}</span>
                    </button>
                  </div>

                  {selectedCase.documents.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-[#0e101a] border border-[#1f2233] space-y-2">
                      <FileText className="w-8 h-8 text-gray-500 mx-auto" />
                      <p className="text-xs text-gray-400">
                        {isAr ? "لم يتم رفع أي مستندات حتى الآن. انقر على 'رفع وثيقة جديدة' لإرفاق بوليصة شحن أو شهادة فحص." : "No documents attached. Click 'Upload Document' to attach a B/L, SGS certificate, or LC."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedCase.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="rounded-xl bg-[#0e101a] border border-[#1f2233] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#181b2c] border border-[#272b44] flex items-center justify-center text-[#d4956b] shrink-0">
                              <FileCheck2 className="w-4 h-4" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white text-xs sm:text-sm">{doc.title}</span>
                                <span className="px-2 py-0.5 rounded bg-[#181b2a] text-[10px] text-gray-300 font-mono uppercase">
                                  {doc.documentType.replace(/_/g, " ")}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
                                <span>{doc.fileName}</span>
                                <span>•</span>
                                <span>{(doc.fileSizeBytes / 1024).toFixed(1)} KB</span>
                                <span>•</span>
                                <span className="font-mono text-[10px] text-gray-500" title={`SHA-256: ${doc.sha256Hash}`}>
                                  SHA: {doc.sha256Hash.substring(0, 12)}...
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDownloadDoc(doc.id)}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141724] hover:bg-[#1f2438] border border-[#23273b] text-xs text-gray-200 hover:text-white transition-all shrink-0"
                          >
                            <Download className="w-3.5 h-3.5 text-[#d4956b]" />
                            <span>{isAr ? "تحميل مشفر (300s)" : "Secure Download"}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CROSS-DOCUMENT CONSISTENCY MATRIX */}
              {activeTab === "matrix" && (
                <div className="space-y-6">
                  <div className="rounded-xl bg-[#0e101a] border border-[#1f2233] p-4 space-y-2">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#d4956b]" />
                      <span>{isAr ? "محرك مطابقة واتساق بيانات الوثائق" : "Cross-Document Consistency Engine"}</span>
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {isAr
                        ? "يقوم هذا المحرك بمقارنة الحقول المستخرجة تلقائياً بين بوليصة الشحن (B/L)، شهادة فحص الجودة (SGS)، الاعتماد المستندي (LC MT700)، والفاتورة التجارية لاكتشاف أي تعارض في الناقلة أو الكميات أو الموانئ."
                        : "Compares extracted data parameters between Bills of Lading, SGS certificates, MT700 LCs, and commercial invoices to detect deviations in vessel IMO, trade tolerances, or ports."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {consistencyMatrix.map((item, idx) => {
                      const isMatch = item.status === "match";
                      const isPending = item.status === "pending_documents";

                      return (
                        <div
                          key={idx}
                          className={cn(
                            "rounded-xl border p-4 space-y-2",
                            isMatch
                              ? "bg-emerald-500/5 border-emerald-500/20"
                              : isPending
                              ? "bg-gray-500/5 border-[#1f2233]"
                              : "bg-rose-500/10 border-rose-500/30"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-white">
                              {isAr ? item.fieldAr : item.field}
                            </span>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-medium border",
                                isMatch
                                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                  : isPending
                                  ? "bg-gray-500/15 text-gray-400 border-gray-500/30"
                                  : "bg-rose-500/15 text-rose-400 border-rose-500/30"
                              )}
                            >
                              {isMatch
                                ? isAr ? "متطابق" : "Matched"
                                : isPending
                                ? isAr ? "بانتظار الوثائق" : "Pending Docs"
                                : isAr ? "⚠️ تعارض مكتشف" : "⚠️ Discrepancy"}
                            </span>
                          </div>

                          {Object.keys(item.values || {}).length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-black/20 p-2.5 rounded-lg font-mono">
                              {Object.entries(item.values).map(([k, v]: any) => (
                                <div key={k} className="flex justify-between border-b border-white/5 py-1">
                                  <span className="text-gray-400">{k}:</span>
                                  <span className="text-gray-200">{v}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <p className="text-xs text-gray-300">{item.notes}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: RISK INDICATORS & SOURCES */}
              {activeTab === "checks" && (
                <div className="space-y-6">
                  <div className="rounded-xl bg-[#0e101a] border border-[#1f2233] p-4 space-y-1">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Scale className="w-4 h-4 text-[#d4956b]" />
                      <span>{isAr ? "مؤشرات التحقق ومصادر الأدلة" : "Investigation Checks & Evidence Sources"}</span>
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {isAr
                        ? "يجب على المراجع تحديد الحالة الدقيقة لكل فحص استناداً إلى أدلة قابلة للتتبع. المزودات غير المتصلة تعرض صراحة كـ «لم يتم التحقق» أو «غير متاح»."
                        : "Reviewers must assign explicit outcome statuses grounded in traceable evidence. Unconfigured integrations strictly display as 'Unverified'."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {selectedCase.checks.map((chk) => {
                      const outcomeBadge = getOutcomeBadge(chk.outcomeStatus);
                      const OutcomeIcon = outcomeBadge.icon;

                      return (
                        <div
                          key={chk.id}
                          className="rounded-2xl bg-[#0e101a] border border-[#1f2233] p-4 sm:p-5 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b1e2e] pb-3">
                            <div>
                              <h4 className="font-semibold text-white text-xs sm:text-sm">{chk.title}</h4>
                              <p className="text-xs text-gray-400">{chk.description}</p>
                            </div>
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium shrink-0",
                                outcomeBadge.color
                              )}
                            >
                              <OutcomeIcon className="w-3.5 h-3.5" />
                              <span>{isAr ? outcomeBadge.labelAr : outcomeBadge.labelEn}</span>
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-gray-400 block">{isAr ? "مصدر الدليل:" : "Evidence Source:"}</span>
                              <span className="font-medium text-gray-200">
                                {chk.evidenceSource || (isAr ? "غير محدد" : "Unspecified")}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400 block">{isAr ? "حالة الربط الآلي بالمزود:" : "Provider Integration:"}</span>
                              {chk.isExternalProviderConnected ? (
                                <span className="text-emerald-400 font-medium">{isAr ? "متصل (داخلي)" : "Connected (Internal Engine)"}</span>
                              ) : (
                                <span className="text-amber-400 font-medium">
                                  {isAr ? "غير مهيأ / يتطلب فحصاً بشرياً يدوياً" : "Unconfigured / Manual Inspection Required"}
                                </span>
                              )}
                            </div>
                          </div>

                          {chk.findingsSummary && (
                            <div className="bg-[#121524] p-3 rounded-xl border border-[#1d2138] text-xs text-gray-300">
                              <span className="font-semibold text-gray-400 block mb-0.5">{isAr ? "ملخص النتائج:" : "Findings:"}</span>
                              {chk.findingsSummary}
                            </div>
                          )}

                          {/* Quick Outcome Selector for Compliance Officer */}
                          <div className="pt-2 flex flex-wrap items-center gap-2">
                            <span className="text-xs text-gray-400 mr-2">{isAr ? "تحديث حالة الفحص:" : "Set Status:"}</span>
                            {(
                              [
                                "unverified",
                                "data_reviewed",
                                "needs_human_review",
                                "confirmed_from_source",
                                "inconclusive",
                              ] as VerificationCheckOutcome[]
                            ).map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() =>
                                  handleUpdateCheck(
                                    chk.id,
                                    st,
                                    chk.reviewerNotes || "",
                                    chk.evidenceSource || ""
                                  )
                                }
                                className={cn(
                                  "px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border",
                                  chk.outcomeStatus === st
                                    ? "bg-[#b87333] text-white border-[#d4956b] shadow-sm"
                                    : "bg-[#141726] text-gray-300 border-[#23273c] hover:border-gray-500 hover:text-white"
                                )}
                              >
                                {isAr ? getOutcomeBadge(st).labelAr : getOutcomeBadge(st).labelEn}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: EXECUTIVE DECISION & CLIENT RELEASE */}
              {activeTab === "decision" && (
                <form onSubmit={handleSaveDecision} className="space-y-6">
                  <div className="rounded-xl bg-[#0e101a] border border-[#1f2233] p-4 space-y-1">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <FileBadge className="w-4 h-4 text-[#d4956b]" />
                      <span>{isAr ? "الاعتماد الإداري ومشاركة التقرير" : "Reviewer Determination & Client Release"}</span>
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {isAr
                        ? "الإجراء الإداري النهائي لتحديد أهلية وموثوقية الملف، مع كتابة المبررات الإلزامية قبل إتاحة النتيجة للعميل."
                        : "Final administrative determination. Requires written justification before results can be released to client organizations."}
                    </p>
                  </div>

                  {/* Decision Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-300 block">
                      {isAr ? "القرار الإداري النهائي:" : "Final Determination:"}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {(
                        [
                          "pending",
                          "cleared",
                          "conditional",
                          "rejected",
                          "inconclusive",
                        ] as CommercialVerificationDecision[]
                      ).map((d) => {
                        const bd = getDecisionBadge(d);
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setDecisionChoice(d)}
                            className={cn(
                              "p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all",
                              decisionChoice === d
                                ? "bg-[#b87333]/20 border-[#d4956b] text-white shadow-md shadow-[#b87333]/20"
                                : "bg-[#0e101a] border-[#1f2233] text-gray-400 hover:text-white hover:border-gray-500"
                            )}
                          >
                            <span>{isAr ? bd.labelAr : bd.labelEn}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Decision Justification */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-300 block">
                      {isAr ? "مبررات القرار والأدلة المرجعية (إلزامي للتدقيق):" : "Decision Justification & Reference Evidence:"}
                    </label>
                    <textarea
                      rows={4}
                      value={decisionJustification}
                      onChange={(e) => setDecisionJustification(e.target.value)}
                      placeholder={
                        isAr
                          ? "اكتب مبررات القرار بالتفصيل استناداً إلى نتائج الوثائق والأدلة المسجلة..."
                          : "Provide rationale citing specific document findings, registry extract dates, or lack of conclusive evidence..."
                      }
                      className="w-full p-3 rounded-xl bg-[#121420] border border-[#23273b] text-xs sm:text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#b87333]"
                    />
                  </div>

                  {/* Confidential Notes */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-300 block">
                      {isAr ? "ملاحظات المراجعة الداخلية (خاصة بالإدارة فقط):" : "Confidential Internal Reviewer Notes (Admin Only):"}
                    </label>
                    <textarea
                      rows={2}
                      value={reviewerConfidentialNotes}
                      onChange={(e) => setReviewerConfidentialNotes(e.target.value)}
                      placeholder={isAr ? "ملاحظات سرية لا تظهر للعميل إطلاقاً..." : "Internal notes hidden from client release..."}
                      className="w-full p-3 rounded-xl bg-[#121420] border border-[#23273b] text-xs sm:text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-[#b87333]"
                    />
                  </div>

                  {/* Release Toggle */}
                  <div className="p-4 rounded-xl bg-[#121422] border border-[#23273b] flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs text-white block">
                        {isAr ? "مشاركة نتيجة التحقق مع حساب العميل" : "Release Verification Dossier to Client"}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {isAr
                          ? "عند التفعيل، سيتمكن العميل من رؤية نتيجة التحقق والتقارير المعتمدة التابعة لمؤسسته فقط."
                          : "Permits client organization to view outcome and cleared reports under strict tenant isolation."}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={shareWithClientCheck}
                      onChange={(e) => setShareWithClientCheck(e.target.checked)}
                      className="w-5 h-5 rounded border-[#23273b] text-[#b87333] focus:ring-[#b87333] accent-[#b87333]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white font-semibold text-xs sm:text-sm shadow-lg shadow-[#b87333]/20 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAr ? "حفظ واعتماد القرار النهائي" : "Confirm & Save Executive Determination"}</span>
                  </button>
                </form>
              )}

              {/* TAB 6: AUDIT TRAIL */}
              {activeTab === "audit" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">
                    {isAr ? "سجل التدقيق والتتبع الزمني للعمليات" : "Immutable Audit Trail"}
                  </h3>
                  <div className="space-y-2">
                    {selectedCase.auditLog.map((log) => (
                      <div
                        key={log.id}
                        className="rounded-xl bg-[#0e101a] border border-[#1f2233] p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <span className="font-mono text-[#d4956b] font-semibold">{log.action}</span>
                          <p className="text-gray-300">
                            {isAr ? "بواسطة:" : "By:"} <span className="font-semibold text-white">{log.performedByName}</span> (
                            {log.performedByRole})
                          </p>
                        </div>
                        <span className="text-[11px] text-gray-500 font-mono">
                          {new Date(log.createdAt).toLocaleString(locale)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: NEW VERIFICATION CASE */}
      {/* ======================================================== */}
      {showNewCaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-white dark:bg-[#0e101a] border border-gray-200 dark:border-[#1f2233] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#1f2233] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b87333] to-[#8b5a2b] p-0.5 flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {isAr ? "فتح ملف تحقق تجاري جديد" : "New Verification Case"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isAr ? "بدء فحص شركة أو شحنة مواد أولية" : "Initiate counterparty or physical cargo diligence"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewCaseModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-800 dark:text-gray-300 font-semibold block">{isAr ? "اسم الكيان / الشركة:" : "Entity / Company Name:"}</label>
                <input
                  type="text"
                  required
                  value={newEntityName}
                  onChange={(e) => setNewEntityName(e.target.value)}
                  placeholder={isAr ? "مثال: PetroGulf Trading Ltd" : "e.g., PetroGulf Trading Ltd"}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#141724] border border-gray-300 dark:border-[#23273b] text-gray-900 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#b87333] focus:ring-1 focus:ring-[#b87333]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-800 dark:text-gray-300 font-semibold block">{isAr ? "نوع الكيان:" : "Entity Type:"}</label>
                  <select
                    value={newEntityType}
                    onChange={(e) => setNewEntityType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-[#141724] border border-gray-300 dark:border-[#23273b] text-gray-900 dark:text-gray-200 focus:outline-none focus:border-[#b87333] focus:ring-1 focus:ring-[#b87333]"
                  >
                    <option value="company">{isAr ? "شركة عامة" : "Company"}</option>
                    <option value="supplier">{isAr ? "مورّد" : "Supplier"}</option>
                    <option value="buyer">{isAr ? "مشترٍ" : "Buyer"}</option>
                    <option value="broker">{isAr ? "وسيط تجاري" : "Broker"}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-800 dark:text-gray-300 font-semibold block">{isAr ? "كود الدولة (ISO 2):" : "Country (2-letter):"}</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={newCountryCode}
                    onChange={(e) => setNewCountryCode(e.target.value.toUpperCase())}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-[#141724] border border-gray-300 dark:border-[#23273b] text-gray-900 dark:text-gray-200 uppercase font-mono focus:outline-none focus:border-[#b87333] focus:ring-1 focus:ring-[#b87333]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-800 dark:text-gray-300 font-semibold block">{isAr ? "نطاق التحقيق:" : "Verification Scope:"}</label>
                <select
                  value={newScope}
                  onChange={(e) => setNewScope(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#141724] border border-gray-300 dark:border-[#23273b] text-gray-900 dark:text-gray-200 focus:outline-none focus:border-[#b87333] focus:ring-1 focus:ring-[#b87333]"
                >
                  <option value="full_investigation">{isAr ? "تحقيق شامل (شركات، عقوبات، وثائق، شحنة)" : "Full Investigation"}</option>
                  <option value="company_due_diligence">{isAr ? "فحص الشركة والسجل التجاري" : "Company Due Diligence"}</option>
                  <option value="commodity_documents">{isAr ? "تدقيق وثائق السلع (B/L, SGS, LC)" : "Commodity Documents"}</option>
                  <option value="deal_consistency">{isAr ? "مطابقة اتساق الصفقة بين الأطراف" : "Deal Consistency"}</option>
                  <option value="counterparty_risk">{isAr ? "فحص العقوبات ومخاطر الأطراف" : "Counterparty Risk & Sanctions"}</option>
                </select>
              </div>

              <div className="border-t border-gray-200 dark:border-[#1f2233] pt-3 space-y-3">
                <span className="font-semibold text-gray-800 dark:text-gray-300 block">{isAr ? "بيانات السلعة والشحنة (اختياري):" : "Cargo Specifications (Optional):"}</span>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newCommodityName}
                    onChange={(e) => setNewCommodityName(e.target.value)}
                    placeholder={isAr ? "اسم السلعة (مثلاً: EN590 Diesel)" : "Commodity Name"}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-[#141724] border border-gray-300 dark:border-[#23273b] text-gray-900 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#b87333] focus:ring-1 focus:ring-[#b87333]"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      placeholder={isAr ? "الكمية" : "Qty"}
                      className="w-2/3 p-2.5 rounded-xl bg-white dark:bg-[#141724] border border-gray-300 dark:border-[#23273b] text-gray-900 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#b87333] focus:ring-1 focus:ring-[#b87333]"
                    />
                    <select
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      className="w-1/3 p-2.5 rounded-xl bg-white dark:bg-[#141724] border border-gray-300 dark:border-[#23273b] text-gray-900 dark:text-gray-200 focus:outline-none focus:border-[#b87333] focus:ring-1 focus:ring-[#b87333]"
                    >
                      <option value="MT">MT</option>
                      <option value="BBL">BBL</option>
                      <option value="KG">KG</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newVesselName}
                    onChange={(e) => setNewVesselName(e.target.value)}
                    placeholder={isAr ? "اسم الناقلة (Vessel Name)" : "Vessel Name"}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-[#141724] border border-gray-300 dark:border-[#23273b] text-gray-900 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#b87333] focus:ring-1 focus:ring-[#b87333]"
                  />
                  <input
                    type="text"
                    value={newVesselImo}
                    onChange={(e) => setNewVesselImo(e.target.value)}
                    placeholder={isAr ? "رقم IMO (مثال: 9412345)" : "Vessel IMO"}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-[#141724] border border-gray-300 dark:border-[#23273b] text-gray-900 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#b87333] focus:ring-1 focus:ring-[#b87333]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200 dark:border-[#1f2233]">
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#141724] dark:hover:bg-[#1a1f30] text-gray-700 dark:text-gray-300 font-medium border border-gray-200 dark:border-transparent transition-colors"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white font-semibold shadow-md shadow-[#b87333]/20"
                >
                  {isAr ? "إنشاء الملف" : "Create Dossier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: AVAILABILITY MODE SWITCHER */}
      {/* ======================================================== */}
      {showModeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#0e101a] border border-gray-200 dark:border-[#1f2233] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#1f2233] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 flex items-center justify-center shadow-md">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {isAr ? "إعداد إتاحة خدمة التحقق التجاري" : "Service Availability Controls"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isAr ? "إعداد مركزي آمن يتحكم في مستويات الوصول للخدمة" : "Centralized security access tier configuration"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModeModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMode} className="space-y-4 text-xs">
              <div className="space-y-2">
                <span className="text-gray-800 dark:text-gray-300 font-semibold block">{isAr ? "اختر وضع الإتاحة:" : "Select Mode:"}</span>
                <div className="space-y-2">
                  {[
                    {
                      id: "admin_only",
                      titleAr: "1. الإدارة فقط (الوضع الافتراضي الآمن)",
                      titleEn: "1. Admin Only (Secure Default)",
                      descAr: "الصفحة وواجهات البيانات متاحة حصرياً للإدارة المخوّلة ومسؤولي الامتثال.",
                      descEn: "Pages and APIs strictly restricted to authorized admins and compliance officers.",
                      badgeColor: "border-red-500/30 text-red-400",
                    },
                    {
                      id: "registered_clients",
                      titleAr: "2. عملاء مسجلون (مع عزل مؤسسي صارم)",
                      titleEn: "2. Registered Clients (Strict Tenant Isolation)",
                      descAr: "يمكن للعميل استخدام الخدمة ورؤية الحالات والتقارير التابعة لمؤسسته فقط.",
                      descEn: "Clients may access the service and view reports belonging exclusively to their organization.",
                      badgeColor: "border-amber-500/30 text-amber-400",
                    },
                    {
                      id: "public_informational",
                      titleAr: "3. صفحة عامة تعريفية فقط",
                      titleEn: "3. Public Informational Only",
                      descAr: "صفحة تعرض معلومات الخدمة وطريقة طلبها؛ لا تعرض ملفات أو نتائج أو بيانات عملاء.",
                      descEn: "Public landing page explaining methodology; never exposes private cases or client data.",
                      badgeColor: "border-blue-500/30 text-blue-400",
                    },
                  ].map((m) => (
                    <label
                      key={m.id}
                      className={cn(
                        "block p-3.5 rounded-2xl border cursor-pointer transition-all",
                        selectedNewMode === m.id
                          ? "availability-mode-card-selected"
                          : "availability-mode-card-unselected"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="mode"
                          value={m.id}
                          checked={selectedNewMode === m.id}
                          onChange={() => setSelectedNewMode(m.id as any)}
                          className="mt-1 text-[#b87333] focus:ring-[#b87333] accent-[#b87333]"
                        />
                        <div className="space-y-1">
                          <span className="font-bold block text-sm mode-title">
                            {isAr ? m.titleAr : m.titleEn}
                          </span>
                          <p className="text-xs leading-relaxed mode-desc">
                            {isAr ? m.descAr : m.descEn}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-800 dark:text-gray-300 font-semibold block">{isAr ? "سبب التغيير (يسجّل في سجل التدقيق):" : "Reason for Change (Logged to Audit):"}</label>
                <input
                  type="text"
                  required
                  value={modeChangeReason}
                  onChange={(e) => setModeChangeReason(e.target.value)}
                  placeholder={isAr ? "مثال: تفعيل الوضع العام بعد اكتمال الحملة التسويقية" : "Reason for audit trail..."}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#141724] border border-gray-300 dark:border-[#23273b] text-gray-900 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#b87333] focus:ring-1 focus:ring-[#b87333]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200 dark:border-[#1f2233]">
                <button
                  type="button"
                  onClick={() => setShowModeModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#141724] dark:hover:bg-[#1a1f30] text-gray-700 dark:text-gray-300 font-medium border border-gray-200 dark:border-transparent transition-colors"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold shadow-md shadow-amber-600/20"
                >
                  {isAr ? "حفظ التغيير والتأكيد" : "Confirm & Save Mode"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DOCUMENT UPLOAD */}
      {/* ======================================================== */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-[#0e101a] border border-gray-200 dark:border-[#1f2233] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#1f2233] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b87333] to-[#8b5a2b] p-0.5 flex items-center justify-center shadow-md">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                    {isAr ? "إرفاق وثيقة تداول مشفرة" : "Register Trade Document"}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isAr ? "فحص النوع والحجم وبصمة SHA-256 المشفرة" : "Format validation and SHA-256 verification"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-gray-800 dark:text-gray-300 font-semibold block">{isAr ? "عنوان الوثيقة:" : "Document Title:"}</label>
                <input
                  type="text"
                  required
                  value={uploadDocTitle}
                  onChange={(e) => setUploadDocTitle(e.target.value)}
                  placeholder={isAr ? "مثال: بوليصة الشحن البحرية B/L #4192" : "e.g., Original Ocean Bill of Lading"}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#141724] border border-gray-300 dark:border-[#23273b] text-gray-900 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-[#b87333] focus:ring-1 focus:ring-[#b87333]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-800 dark:text-gray-300 font-semibold block">{isAr ? "نوع الوثيقة:" : "Document Type:"}</label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#141724] border border-gray-300 dark:border-[#23273b] text-gray-900 dark:text-gray-200 focus:outline-none focus:border-[#b87333] focus:ring-1 focus:ring-[#b87333]"
                >
                  <option value="bill_of_lading">{isAr ? "بوليصة شحن بحرية (Bill of Lading)" : "Bill of Lading (B/L)"}</option>
                  <option value="sgs_inspection">{isAr ? "شهادة فحص جودة وكمية (SGS / Saybolt)" : "SGS / Inspection Certificate"}</option>
                  <option value="mt700_lc">{isAr ? "اعتماد مستندي بنكي (MT700 LC)" : "MT700 Letter of Credit"}</option>
                  <option value="commercial_invoice">{isAr ? "فاتورة تجارية (Commercial Invoice)" : "Commercial Invoice"}</option>
                  <option value="certificate_of_origin">{isAr ? "شهادة منشأ (Certificate of Origin)" : "Certificate of Origin"}</option>
                  <option value="cargo_manifest">{isAr ? "بيان حمولة السفينة (Cargo Manifest)" : "Cargo Manifest"}</option>
                  <option value="corporate_registry">{isAr ? "مستخرج سجل تجاري رسمي" : "Official Commercial Registry Extract"}</option>
                  <option value="other">{isAr ? "مستند آخر" : "Other Trade Document"}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-gray-800 dark:text-gray-300 font-semibold block">{isAr ? "الملف (PDF, PNG, JPG - حد أقصى 15MB):" : "File (PDF, PNG, JPG - Max 15MB):"}</label>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.tiff"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full p-2.5 rounded-xl bg-white dark:bg-[#141724] border border-gray-300 dark:border-[#23273b] text-gray-900 dark:text-gray-200 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-[#b87333] file:text-white cursor-pointer"
                />
              </div>

              {/* Extracted Fields for Consistency Matching */}
              <div className="border-t border-gray-200 dark:border-[#1f2233] pt-3 space-y-2">
                <span className="font-semibold text-gray-800 dark:text-gray-300 block">{isAr ? "الحقول المستخرجة للمطابقة الآلية:" : "Extracted Fields for Consistency:"}</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={extractedVessel}
                    onChange={(e) => setExtractedVessel(e.target.value)}
                    placeholder={isAr ? "اسم الناقلة (Vessel Name)" : "Vessel Name"}
                    className="p-2 rounded-lg bg-white dark:bg-[#141724] border border-gray-300 dark:border-[#23273b] text-gray-900 dark:text-gray-200 placeholder:text-gray-400"
                  />
                  <input
                    type="text"
                    value={extractedImo}
                    onChange={(e) => setExtractedImo(e.target.value)}
                    placeholder={isAr ? "رقم IMO" : "IMO #"}
                    className="p-2 rounded-lg bg-white dark:bg-[#141724] border border-gray-300 dark:border-[#23273b] text-gray-900 dark:text-gray-200 placeholder:text-gray-400"
                  />
                  <input
                    type="text"
                    value={extractedQty}
                    onChange={(e) => setExtractedQty(e.target.value)}
                    placeholder={isAr ? "الكمية المذكورة" : "Quantity"}
                    className="p-2 rounded-lg bg-white dark:bg-[#141724] border border-gray-300 dark:border-[#23273b] text-gray-900 dark:text-gray-200 placeholder:text-gray-400"
                  />
                  <input
                    type="text"
                    value={extractedPort}
                    onChange={(e) => setExtractedPort(e.target.value)}
                    placeholder={isAr ? "ميناء التفريغ" : "Discharge Port"}
                    className="p-2 rounded-lg bg-white dark:bg-[#141724] border border-gray-300 dark:border-[#23273b] text-gray-900 dark:text-gray-200 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-200 dark:border-[#1f2233]">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-[#141724] dark:hover:bg-[#1a1f30] text-gray-700 dark:text-gray-300 font-medium border border-gray-200 dark:border-transparent transition-colors"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white font-semibold shadow-md shadow-[#b87333]/20"
                >
                  {isAr ? "تأكيد الرفع والتشفير" : "Encrypt & Store"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
