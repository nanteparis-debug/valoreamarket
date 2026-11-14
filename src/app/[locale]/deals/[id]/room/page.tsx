"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { getSubpageTranslations } from "@/lib/i18n-subpages";
import { ProtectedAccessGate } from "@/components/protected-access-gate";
import {
  Lock,
  Video,
  Mic,
  MicOff,
  VideoOff,
  MessageSquare,
  FileText,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Send,
  Eye,
  Download,
  ArrowLeft,
  Info,
  ShieldAlert,
  ShieldCheck,
  VolumeX,
  Radio,
  FileWarning,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DealRoomPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function OperationalDealRoomPage({ params }: DealRoomPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState("en");
  const [dealId, setDealId] = useState("deal-en590-rotterdam");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(() => searchParams.get("demo") === "true");

  useEffect(() => {
    params.then((p) => {
      setLocale(p.locale);
      setDealId(p.id);
    });
  }, [params]);

  useEffect(() => {
    const checkAccess = async () => {
      const explicitDemo = searchParams.get("demo") === "true";
      if (explicitDemo) {
        setIsDemoMode(true);
        setIsAuthorized(false);
        return;
      }
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (data?.user) {
          setIsAuthorized(true);
          setIsDemoMode(false);
        } else {
          setIsAuthorized(false);
        }
      } catch {
        setIsAuthorized(false);
      }
    };
    checkAccess();
  }, [searchParams]);

  const t = getSubpageTranslations(locale);
  const isAr = locale === "ar";

  const [activeTab, setActiveTab] = useState<
    "chat" | "video" | "documents" | "agreements" | "compliance"
  >("chat");

  // Chat State
  const [messages, setMessages] = useState([
    {
      id: "m-1",
      senderAlias: "Buyer-Alpha-24",
      senderRole: "buyer",
      text: isAr
        ? "نطلب تأكيد ميناء التسليم CIF روتردام بين 10 و 20 ديسمبر. هل يمكنك ضمان فحص SGS عند الشحن؟"
        : "We require confirmed delivery port CIF Rotterdam between Dec 10 and Dec 20. Can you guarantee SGS testing at loading?",
      sanitizedText: isAr
        ? "نطلب تأكيد ميناء التسليم CIF روتردام بين 10 و 20 ديسمبر. هل يمكنك ضمان فحص SGS عند الشحن؟"
        : "We require confirmed delivery port CIF Rotterdam between Dec 10 and Dec 20. Can you guarantee SGS testing at loading?",
      contactViolation: false,
      evasionDetected: false,
      timestamp: "14:02 UTC",
    },
    {
      id: "m-2",
      senderAlias: "Supplier-Nordic-77",
      senderRole: "supplier",
      text: isAr
        ? "نعم، فحص SGS في ميناء الشحن مقبول بالكامل. لقد قمنا برفع شهادة التحليل المنقحة في قسم الوثائق."
        : "Yes, SGS inspection at loading port is fully accepted. We have uploaded the redacted Certificate of Analysis to the Documents tab.",
      sanitizedText: isAr
        ? "نعم، فحص SGS في ميناء الشحن مقبول بالكامل. لقد قمنا برفع شهادة التحليل المنقحة في قسم الوثائق."
        : "Yes, SGS inspection at loading port is fully accepted. We have uploaded the redacted Certificate of Analysis to the Documents tab.",
      contactViolation: false,
      evasionDetected: false,
      timestamp: "14:05 UTC",
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [isSending, startSendTransition] = useTransition();

  // Video State & Verbal Guardian
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [callActive, setCallActive] = useState(true);
  const [verbalAlert, setVerbalAlert] = useState<string | null>(null);
  const [customSpeechText, setCustomSpeechText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [lastSpokenSnippet, setLastSpokenSnippet] = useState<string | null>(null);

  // Compliance Tracking State
  const [strikesCount, setStrikesCount] = useState(0);
  const [incidentList, setIncidentList] = useState<any[]>([]);

  // Documents State
  const [docs, setDocs] = useState([
    {
      id: "doc-coa-1",
      title: isAr ? "شهادة التحليل (COA) - دفعة مصفاة #441" : "Certificate of Analysis (COA) - Refinery Batch #441",
      type: "quality_certificate",
      fileSize: "2.4 MB PDF",
      isOriginalAuthorized: false,
      downloadCount: 0,
    },
    {
      id: "doc-sgs-1",
      title: isAr ? "تقرير فحص SGS المستقل بميناء الشحن" : "SGS Independent Load Port Inspection Report",
      type: "sgs_inspection",
      fileSize: "3.8 MB PDF",
      isOriginalAuthorized: false,
      downloadCount: 0,
    },
  ]);
  const [previewDocModal, setPreviewDocModal] = useState<string | null>(null);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  // Fetch recorded compliance incidents from server
  const fetchIncidents = async () => {
    try {
      const res = await fetch(`/api/deals/${dealId}/compliance-intercept`);
      const data = await res.json();
      if (data.success && Array.isArray(data.incidents)) {
        setIncidentList(data.incidents);
      }
    } catch {
      // silent
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [dealId]);

  // Real-time client-side evasion scanner for chat input
  const preSendWarning = useMemo(() => {
    if (!inputMsg.trim()) return null;
    if (/(?:arobat|arobase|aroba|arroba|arobaz|أروبات|اروبات|أروباز|اروباز)/i.test(inputMsg)) {
      return isAr
        ? "رصد محاولة تحايل بالرمز @ (أروبات / arobat) - سيتم حجب البريد ومصادرته."
        : "Symbol substitution detected (@ as arobat/arobase) - Contact will be redacted.";
    }
    if (/(?:دوت|نقطة|نقطه|بوينت|point|dotcom)/i.test(inputMsg)) {
      return isAr
        ? "رصد محاولة تحايل للنقطة (دوت / نقطة) - سيتم تطبيق قواعد حجب الروابط والعناوين."
        : "Symbol substitution detected (. as dot/point) - Link/Email evasion blocked.";
    }
    if (/(?:واتساب|واتس|تيليجرام|تليجرام|ويتشات|whatsapp|telegram|wechat)/i.test(inputMsg)) {
      return isAr
        ? "رصد اسم تطبيق مراسلة خارجي - التواصل خارج المنصة مخالف لاتفاقية ICC NCNDA 769."
        : "External messenger handle detected - Violates ICC NCNDA 769 non-circumvention rules.";
    }
    if (/(?:صفر|واحد|إثنين|اثنين|ثلاثة|ثلاثه|أربعة|اربعه|خمسة|خمسه|zero|one|two|three|un|deux|trois)/i.test(inputMsg)) {
      return isAr
        ? "رصد كتابة أرقام بالكلمات لتفادي كاشف الأرقام - سيتم تنقيحها فوراً."
        : "Spelled-out digits evasion detected - Phonetic numbers will be intercepted.";
    }
    return null;
  }, [inputMsg, isAr]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const currentText = inputMsg;
    setInputMsg("");

    startSendTransition(async () => {
      try {
        const res = await fetch(`/api/deals/${dealId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderAlias: "Buyer-Alpha-24",
            senderRole: "buyer",
            text: currentText,
          }),
        });

        const data = await res.json();
        if (data.success && data.message) {
          setMessages((prev) => [...prev, data.message]);
          if (data.contactViolation) {
            setStrikesCount((s) => s + 1);
            fetchIncidents();
          }
        }
      } catch (err) {
        console.error("Message send failed", err);
      }
    });
  };

  // Verbal Speech Interceptor (Triggered by speech stream or interactive speech test)
  const handleSimulateVerbalSpeech = async (spokenText: string) => {
    if (!spokenText.trim()) return;
    setIsTranscribing(true);
    setLastSpokenSnippet(spokenText);

    try {
      const res = await fetch(`/api/deals/${dealId}/compliance-intercept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantAlias: "Buyer-Alpha-24",
          transcriptSnippet: spokenText,
        }),
      });

      const data = await res.json();
      if (data.success) {
        if (data.violationDetected) {
          if (data.autoMute) {
            // Instantly mute microphone automatically!
            setMicEnabled(false);
          }
          setVerbalAlert(isAr ? data.alertMessageAr : data.alertMessageEn);
          setStrikesCount((s) => s + 1);
          fetchIncidents();
        } else {
          setVerbalAlert(null);
        }
      }
    } catch (err) {
      console.error("Verbal intercept check failed", err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleDownloadOriginal = async (docId: string) => {
    try {
      const res = await fetch(`/api/deals/${dealId}/documents/${docId}/download?original=true&orgId=org-france-energy`);
      const data = await res.json();

      if (res.status === 403) {
        setDownloadNotice(
          isAr
            ? "تم رفض الوصول (403): لم يوافق مالك المستند بعد على تنزيل النسخة الأصلية غير المنقحة."
            : "Access Denied (403): The document owner has not yet approved the release of the unredacted original."
        );
      } else if (data.success) {
        setDownloadNotice(
          isAr
            ? `نجاح: تم إصدار رمز التنزيل المصرح (${data.file.downloadToken}). بدأ التنزيل.`
            : `Success: Authorized original token issued (${data.file.downloadToken}). Download initiated.`
        );
        setDocs((prev) =>
          prev.map((d) => (d.id === docId ? { ...d, downloadCount: d.downloadCount + 1 } : d))
        );
      }
    } catch {
      setDownloadNotice(t.common.error);
    }
  };

  return (
    <ProtectedAccessGate
      locale={locale}
      pageTitleAr="غرفة الصفقات والمفاوضات المجهولة المشفرة"
      pageTitleEn="Encrypted Anonymous Deal Room & Settlement"
      requiredRoleAr="أطراف الصفقة المعتمدون (المشتري، المورد، الوسيط)"
      requiredRoleEn="Authorized Deal Participants (Buyer, Supplier, Broker)"
      isAuthorized={isAuthorized}
      isDemoMode={isDemoMode}
      onEnableDemo={() => {
        setIsDemoMode(true);
      }}
    >
      <div className="min-h-screen bg-[#07080c] text-[#f8fafc] flex flex-col justify-between">
        {/* Top Header */}
        <header className="border-b border-[#1f2233] bg-[#0c0e17]/90 backdrop-blur-md py-4 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-xl bg-[#121422] border border-[#23273b] hover:border-[#b87333] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h1 className="text-sm font-bold text-white font-mono">
                  {isAr ? "غرفة الصفقة: VALOREA-2026-EN590-410" : "DEAL ROOM: VALOREA-2026-EN590-410"}
                </h1>
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-mono">
                  {isAr ? "مشفر LiveKit E2EE" : "LIVEKIT E2EE"}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {isAr ? "رصد التحايل الشفوي والكتابي نشط" : "Verbal & Chat Anti-Leak Active"}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {isAr
                  ? "50,000 طن متري ديزل EN 590 (10 PPM) • سيف روتردام CIF • 740.00$ دولار / طن"
                  : "50,000 MT Diesel EN 590 (10 PPM) • CIF Rotterdam • USD $740.00 / MT"}
              </p>
            </div>
          </div>

          {/* Participant Identification Aliases & Incident Counter */}
          <div className="flex items-center gap-2">
            {strikesCount > 0 && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>
                  {isAr ? `الإنذارات المسجلة: ${strikesCount}` : `Strikes: ${strikesCount}`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121420] border border-[#23273b] text-xs">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span className="text-gray-300 font-medium">
                {isAr ? "أنت (المشتري-ألفا-24)" : "You (Buyer-Alpha-24)"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121420] border border-[#23273b] text-xs">
              <span className="w-2 h-2 rounded-full bg-[#d4956b]" />
              <span className="text-gray-300 font-medium">
                {isAr ? "المورد (مورد-نورديك-77)" : "Supplier-Nordic-77"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#b87333]/20 border border-[#b87333]/40 text-xs text-[#d4956b] font-semibold">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{isAr ? "الوسيط المعتمد (VALOREA)" : "Broker Lead"}</span>
            </div>
          </div>
        </header>

        {/* Main Deal Room Work Area */}
        <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[#1f2233] pb-4 mb-6 overflow-x-auto no-scrollbar w-full">
            <button
              onClick={() => setActiveTab("chat")}
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all",
                activeTab === "chat"
                  ? "bg-[#b87333] text-white shadow-lg shadow-[#b87333]/20"
                  : "bg-[#0f1118] border border-[#23273b] text-gray-400 hover:text-white"
              )}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isAr ? "الدردشة الآمنة والتنقيح" : "Secure Chat & Anti-Leak"}</span>
            </button>

            <button
              onClick={() => setActiveTab("video")}
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all",
                activeTab === "video"
                  ? "bg-[#b87333] text-white shadow-lg shadow-[#b87333]/20"
                  : "bg-[#0f1118] border border-[#23273b] text-gray-400 hover:text-white"
              )}
            >
              <Video className="w-4 h-4" />
              <span>{isAr ? "اجتماع الفيديو والمراقب الصوتي" : "LiveKit Meeting & Audio Guardian"}</span>
            </button>

            <button
              onClick={() => setActiveTab("documents")}
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all",
                activeTab === "documents"
                  ? "bg-[#b87333] text-white shadow-lg shadow-[#b87333]/20"
                  : "bg-[#0f1118] border border-[#23273b] text-gray-400 hover:text-white"
              )}
            >
              <FileText className="w-4 h-4" />
              <span>{isAr ? "الوثائق المائية" : "Watermarked Documents"}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#1b1f2e] text-[#d4956b] text-[10px]">
                {docs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("agreements")}
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all",
                activeTab === "agreements"
                  ? "bg-[#b87333] text-white shadow-lg shadow-[#b87333]/20"
                  : "bg-[#0f1118] border border-[#23273b] text-gray-400 hover:text-white"
              )}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? "الاتفاقيات والعمولات" : "Commission & NCNDA"}</span>
            </button>

            <button
              onClick={() => setActiveTab("compliance")}
              className={cn(
                "px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all",
                activeTab === "compliance"
                  ? "bg-[#b87333] text-white shadow-lg shadow-[#b87333]/20"
                  : "bg-[#0f1118] border border-[#23273b] text-gray-400 hover:text-white"
              )}
            >
              <ShieldAlert className="w-4 h-4 text-[#d4956b]" />
              <span>{isAr ? "سجل الامتثال والرصد المباشر" : "Compliance & Tracking Ledger"}</span>
              {incidentList.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 text-[10px]">
                  {incidentList.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab 1: Chat Tab with Advanced Anti-Evasion */}
          {activeTab === "chat" && (
            <div className="rounded-3xl bg-[#0c0e17] border border-[#23273b] p-6 shadow-2xl flex flex-col justify-between min-h-[520px]">
              {/* Security Alert Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3.5 rounded-2xl bg-[#121422] border border-[#b87333]/30 text-xs text-gray-300 mb-6">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-[#d4956b] shrink-0" />
                  <span>
                    <strong>{isAr ? "حماية ضد الالتفاف والتسريب مفعلة:" : "Anti-Circumvention Armor Active:"}</strong>{" "}
                    {isAr
                      ? "رصد شامل لأرقام الهواتف، البريد الإلكتروني، الحسابات، وصيغ التحايل بالكلمات (مثل 'arobat' أو 'أروبات' و'دوت' والأرقام المجزأة)."
                      : "Zero-tolerance detection for phones, emails, messenger handles, and symbol evasions ('arobat', 'arobase', 'dot', spaced digits)."}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#1e2338] text-[#d4956b] font-mono text-[10px] shrink-0">
                  ICC 769 • 3x DAMAGES
                </span>
              </div>

              {/* Messages Feed */}
              <div className="space-y-4 flex-1 overflow-y-auto pr-2 max-h-[380px]" dir="inherit">
                {messages.map((m) => (
                  <div key={m.id} className="flex gap-3 items-start">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 border",
                        m.senderRole === "buyer"
                          ? "bg-sky-500/10 border-sky-500/30 text-sky-400"
                          : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                      )}
                    >
                      {m.senderAlias.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="bg-[#121522] border border-[#23273b] rounded-2xl p-4 max-w-xl text-xs sm:text-sm">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="font-semibold text-white">{m.senderAlias}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{m.timestamp}</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed font-sans">{m.sanitizedText}</p>
                      {m.contactViolation && (
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 p-2 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] font-mono">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-400" />
                          <span>
                            {isAr
                              ? "تم حجب وتشفير محاولة إفشاء بيانات اتصال / تحايل بالرموز والألفاظ بموجب ICC 769"
                              : "Contact Disclosure / Symbol Evasion Intercepted & Redacted under ICC 769"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pre-Send Evasion Indicator & Fast Verification Buttons */}
              <div className="mt-4 pt-3 border-t border-[#1f2233] space-y-3">
                {preSendWarning && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 animate-pulse">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{preSendWarning}</span>
                  </div>
                )}

                {/* Quick Simulation Testing Chips for User Verification */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#d4956b]" />
                    {isAr ? "اختبار كشف التحايل الفوري:" : "Test Evasion Interception:"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setInputMsg("راسلني على john arobat oilcorp dot com للتفاوض")}
                    className="px-2.5 py-1 rounded-lg bg-[#161a29] hover:bg-[#20263b] text-gray-300 hover:text-white border border-[#2b334d] text-[11px] transition-colors"
                  >
                    {isAr ? 'تجربة: "john arobat oilcorp dot com"' : 'Try: "john arobat..."'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMsg("ايميلي هو trader أروبات gmail دوت كوم")}
                    className="px-2.5 py-1 rounded-lg bg-[#161a29] hover:bg-[#20263b] text-gray-300 hover:text-white border border-[#2b334d] text-[11px] transition-colors"
                  >
                    {isAr ? 'تجربة: "trader أروبات gmail دوت كوم"' : 'Try Arabic arobat'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMsg("اتصل بي على صفر خمسة صفر واحد اثنين ثلاثة أربعة")}
                    className="px-2.5 py-1 rounded-lg bg-[#161a29] hover:bg-[#20263b] text-gray-300 hover:text-white border border-[#2b334d] text-[11px] transition-colors"
                  >
                    {isAr ? 'تجربة أرقام هاتف بالكلمات' : 'Try Spelled Digits'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMsg("راسلني على الواتساب: + 9 7 1 - 5 0 - 1 2 3 4 5 6 7")}
                    className="px-2.5 py-1 rounded-lg bg-[#161a29] hover:bg-[#20263b] text-gray-300 hover:text-white border border-[#2b334d] text-[11px] transition-colors"
                  >
                    {isAr ? 'تجربة واتساب وأرقام مجزأة' : 'Try WhatsApp & Spaced'}
                  </button>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={inputMsg}
                    onChange={(e) => setInputMsg(e.target.value)}
                    placeholder={
                      isAr
                        ? "اكتب رسالة تفاوض خاصة (تخضع للرصد والتنقيح التلقائي)..."
                        : "Type a negotiation message (subject to real-time anti-leak scan)..."
                    }
                    className="flex-1 bg-[#121422] border border-[#23273b] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b87333]"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !inputMsg.trim()}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] text-white text-sm font-semibold shadow-lg shadow-[#b87333]/20 flex items-center gap-2 disabled:opacity-40 transition-all"
                  >
                    <span>{isAr ? "إرسال" : "Send"}</span>
                    <Send className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Tab 2: LiveKit Video Meeting Tab with Verbal Audio Guardian */}
          {activeTab === "video" && (
            <div className="rounded-3xl bg-[#0c0e17] border border-[#23273b] p-6 shadow-2xl space-y-6">
              {/* Video Security Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#121422] border border-[#23273b]">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>
                        {isAr ? "قناة فيديو وصوت مشفرة ومراقبة (WebRTC E2EE + Audio Guardian)" : "LiveKit WebRTC Private Channel with Verbal Guardian"}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      {isAr
                        ? "مراقبة شفوية لحظية مستمرة لمنع إفشاء أرقام الهواتف أو الإيميل (أروبات/دوت) مع خاصية كتم الصوت الآلي عند المخالفة."
                        : "Continuous verbal speech-to-text inspection. Uttering contacts or evasions immediately triggers automatic mic mute."}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                    {isAr ? "المراقب الشفوي الذكي نشط" : "LIVE AUDIO GUARDIAN"}
                  </span>
                </div>
              </div>

              {/* Verbal Alert Banner (Triggered upon verbal evasion/leak) */}
              {verbalAlert && (
                <div className="p-4 rounded-2xl bg-rose-500/15 border-2 border-rose-500/40 text-rose-200 text-xs flex items-center justify-between gap-3 animate-pulse">
                  <div className="flex items-center gap-3">
                    <VolumeX className="w-6 h-6 text-rose-400 shrink-0" />
                    <div>
                      <strong className="block text-rose-100 font-bold text-sm mb-0.5">
                        {isAr ? "⚠️ تم كتم الميكروفون تلقائياً - رصد محاولة إفشاء بيانات شفوياً!" : "⚠️ Automatic Microphone Mute: Verbal Leak Intercepted!"}
                      </strong>
                      <p className="text-xs leading-relaxed">{verbalAlert}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setVerbalAlert(null)}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30 text-xs font-mono"
                  >
                    {isAr ? "تأكيد واستئناف" : "Dismiss"}
                  </button>
                </div>
              )}

              {/* Video Streams Simulated Canvas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-video rounded-2xl bg-[#0f111a] border border-[#23273b] relative overflow-hidden flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 text-xl font-bold mx-auto mb-2">
                      BA
                    </div>
                    <span className="text-xs font-semibold text-white">
                      {isAr ? "المشتري (مشتري-ألفا-24) • أنت" : "Buyer-Alpha-24 (You)"}
                    </span>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                      {videoEnabled
                        ? (isAr ? "الكاميرا تعمل" : "Camera Active")
                        : (isAr ? "الكاميرا مغلقة" : "Camera Muted")}
                      {" • "}
                      <span className={micEnabled ? "text-emerald-400" : "text-rose-400 font-bold"}>
                        {micEnabled
                          ? (isAr ? "الميكروفون مفعّل" : "Mic Open")
                          : (isAr ? "الميكروفون مكتوم (حماية)" : "Mic Muted (Guarded)")}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="aspect-video rounded-2xl bg-[#0f111a] border border-[#23273b] relative overflow-hidden flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl font-bold mx-auto mb-2">
                      SN
                    </div>
                    <span className="text-xs font-semibold text-white">
                      {isAr ? "المورد (مورد-نورديك-77)" : "Supplier-Nordic-77"}
                    </span>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                      {isAr ? "مورد مكرر معتمد • متصل" : "Verified Refiner • Connected"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Media Controls Bar */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => setMicEnabled(!micEnabled)}
                  className={cn(
                    "p-3.5 rounded-full border transition-all flex items-center gap-2 px-5",
                    micEnabled
                      ? "bg-[#141724] border-[#23273b] text-white hover:bg-[#1a1f30]"
                      : "bg-rose-500/20 border-rose-500/40 text-rose-400 font-semibold"
                  )}
                >
                  {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  <span className="text-xs">
                    {micEnabled
                      ? (isAr ? "كتم الميكروفون" : "Mute Mic")
                      : (isAr ? "الميكروفون مكتوم (اضغط للتشغيل)" : "Unmute Mic")}
                  </span>
                </button>
                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className={cn(
                    "p-3.5 rounded-full border transition-all",
                    videoEnabled
                      ? "bg-[#141724] border-[#23273b] text-white hover:bg-[#1a1f30]"
                      : "bg-rose-500/20 border-rose-500/40 text-rose-400"
                  )}
                >
                  {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setCallActive(!callActive)}
                  className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors"
                >
                  {isAr ? "مغادرة الاجتماع" : "Leave Meeting"}
                </button>
              </div>

              {/* Interactive Real-Time Verbal Speech Interceptor Sandbox */}
              <div className="mt-6 p-5 rounded-2xl bg-[#0f121d] border border-[#23273b] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1f2233] pb-3">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Radio className="w-4 h-4 text-[#d4956b]" />
                      <span>{isAr ? "محاكي الرصد الشفوي اللحظي (Verbal Speech Interception Simulator)" : "Verbal Speech Interception Simulator"}</span>
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {isAr
                        ? "اختبر كيف يرصد النظام الكلمات المنطوقة شفوياً (مثل 'أروبات' أو 'هاتف بالكلمات') ويقوم بكتم الميكروفون فوراً."
                        : "Simulate verbal phrases spoken during meetings to test instant speech recognition, policy evaluation, and auto-mute."}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 text-[10px] font-mono">
                    {isAr ? "تفريغ شفوي فوري" : "REAL-TIME STT"}
                  </span>
                </div>

                {/* Verbal Testing Quick Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleSimulateVerbalSpeech("إيميلي الخاص هو أحمد أروبات جيميل دوت كوم")}
                    className="px-3 py-1.5 rounded-xl bg-[#161a29] hover:bg-rose-950/40 text-rose-300 hover:text-white border border-[#2b334d] hover:border-rose-500/40 text-xs font-mono transition-all"
                  >
                    🎙️ {isAr ? 'محاكاة نطق: "إيميلي أحمد أروبات جيميل دوت كوم"' : 'Spoken: "email arobat dot com"'}
                  </button>

                  <button
                    onClick={() => handleSimulateVerbalSpeech("رقمي هو صفر خمسة صفر واحد اثنين ثلاثة أربعة خمسة")}
                    className="px-3 py-1.5 rounded-xl bg-[#161a29] hover:bg-rose-950/40 text-rose-300 hover:text-white border border-[#2b334d] hover:border-rose-500/40 text-xs font-mono transition-all"
                  >
                    🎙️ {isAr ? 'محاكاة نطق: "رقمي صفر خمسة صفر واحد اثنين..."' : 'Spoken: Spelled phone'}
                  </button>

                  <button
                    onClick={() => handleSimulateVerbalSpeech("appelez moi au zero six douze trente quatre")}
                    className="px-3 py-1.5 rounded-xl bg-[#161a29] hover:bg-rose-950/40 text-rose-300 hover:text-white border border-[#2b334d] hover:border-rose-500/40 text-xs font-mono transition-all"
                  >
                    🎙️ {isAr ? 'محاكاة نطق فرنسي: "zero six douze..."' : 'Spoken French phone'}
                  </button>

                  <button
                    onClick={() => handleSimulateVerbalSpeech("نحن موافقون على شروط الاعتماد المستندي DLC")}
                    className="px-3 py-1.5 rounded-xl bg-[#161a29] hover:bg-emerald-950/40 text-emerald-300 hover:text-white border border-[#2b334d] hover:border-emerald-500/40 text-xs font-mono transition-all"
                  >
                    🎙️ {isAr ? 'نطق طبيعي مصرح: "موافقون على شروط DLC"' : 'Clean negotiation speech'}
                  </button>
                </div>

                {/* Custom speech input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={customSpeechText}
                    onChange={(e) => setCustomSpeechText(e.target.value)}
                    placeholder={
                      isAr
                        ? "أو اكتب أي عبارة شفوية منطوقة لاختبار الرصد الآلي..."
                        : "Or type any spoken phrase to test automated speech monitoring..."
                    }
                    className="flex-1 bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
                  />
                  <button
                    onClick={() => {
                      handleSimulateVerbalSpeech(customSpeechText);
                      setCustomSpeechText("");
                    }}
                    disabled={isTranscribing || !customSpeechText.trim()}
                    className="px-4 py-2.5 rounded-xl bg-[#b87333] hover:bg-[#a06229] text-white text-xs font-semibold disabled:opacity-40"
                  >
                    {isAr ? "تحليل النطق" : "Analyze Speech"}
                  </button>
                </div>

                {lastSpokenSnippet && (
                  <div className="p-3 rounded-xl bg-[#08090e] border border-[#1f2233] text-xs font-mono flex items-center justify-between">
                    <span className="text-gray-400">
                      {isAr ? "آخر عبارة صوتية تم تفريغها وتحليلها:" : "Last Analyzed Verbal Speech:"}{" "}
                      <span className="text-white font-semibold">"{lastSpokenSnippet}"</span>
                    </span>
                    <span className="text-emerald-400 text-[10px]">
                      {isAr ? "✓ تم الفحص عبر Armor Engine" : "✓ Scanned by Armor Engine"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Documents Tab */}
          {activeTab === "documents" && (
            <div className="rounded-3xl bg-[#0c0e17] border border-[#23273b] p-6 shadow-2xl space-y-6">
              {downloadNotice && (
                <div
                  className={cn(
                    "p-4 rounded-2xl border text-xs leading-relaxed font-mono flex items-center gap-3",
                    downloadNotice.includes("Denied") || downloadNotice.includes("رفض")
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  )}
                >
                  <Info className="w-4 h-4 shrink-0" />
                  <span>{downloadNotice}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {docs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-5 rounded-2xl bg-[#10121d] border border-[#23273b] space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{doc.title}</h4>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono">
                          {doc.fileSize}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded text-[10px] font-mono",
                          doc.isOriginalAuthorized
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        )}
                      >
                        {doc.isOriginalAuthorized
                          ? (isAr ? "مصرح بالنسخة الأصلية" : "Original Approved")
                          : (isAr ? "معاينة منقحة فقط" : "Redacted Preview Only")}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-[#1a1d2e] flex flex-wrap items-center justify-between gap-2">
                      <button
                        onClick={() => setPreviewDocModal(doc.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#161a29] hover:bg-[#1e2338] text-white text-xs font-medium border border-[#2b334d] flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-400" />
                        <span>{isAr ? "معاينة الوثيقة المائية" : "Inspect Watermarked Preview"}</span>
                      </button>

                      <button
                        onClick={() => handleDownloadOriginal(doc.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#b87333]/20 hover:bg-[#b87333]/30 text-[#d4956b] border border-[#b87333]/40 text-xs font-medium flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isAr ? "طلب تحميل الأصل" : "Request Original Download"}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {previewDocModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="max-w-2xl w-full rounded-3xl bg-[#0c0e17] border border-[#23273b] p-6 relative overflow-hidden space-y-4">
                    <div className="absolute inset-0 watermark-overlay opacity-30 pointer-events-none" />

                    <div className="flex items-center justify-between border-b border-[#1f2233] pb-3">
                      <div>
                        <h3 className="text-sm font-bold text-white font-mono">
                          {isAr ? "عارض الوثائق المحمي" : "PROTECTED VIEWER"}
                        </h3>
                        <p className="text-[11px] text-gray-400 font-mono">
                          {isAr ? "المشتري-ألفا-24 • علامة مائية رقمية - VALOREA MARKET" : "BUYER-ALPHA-24 • VALOREA MARKET WATERMARK"}
                        </p>
                      </div>
                      <button
                        onClick={() => setPreviewDocModal(null)}
                        className="text-gray-400 hover:text-white text-sm"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="p-8 rounded-2xl bg-[#08090e] border border-[#1f2233] text-center space-y-4 font-mono text-xs">
                      <div className="text-emerald-400">
                        --- {isAr ? "ملخص فحص SGS الرسمي (منقح)" : "OFFICIAL S.G.S. INSPECTION SUMMARY (REDACTED)"} ---
                      </div>
                      <p className="text-gray-300">
                        {isAr ? (
                          <>
                            السلعة: ديزل EN 590 10 PPM
                            <br />
                            الكثافة عند 15°م: 0.835 كجم/لتر
                            <br />
                            نسبة الكبريت: 8.2 جزء في المليون (PPM)
                          </>
                        ) : (
                          <>
                            COMMODITY: DIESEL EN 590 10 PPM
                            <br />
                            DENSITY AT 15°C: 0.835 KG/L
                            <br />
                            SULFUR CONTENT: 8.2 PPM
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Agreements & Commission */}
          {activeTab === "agreements" && (
            <div className="rounded-3xl bg-[#0c0e17] border border-[#23273b] p-6 shadow-2xl space-y-6">
              <div className="p-5 rounded-2xl bg-[#10121d] border border-[#23273b] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {isAr ? "اتفاقية عدم الإفشاء وعدم الالتفاف والوساطة (NCNDA)" : "Non-Circumvention, Non-Disclosure & Brokerage Agreement (NCNDA)"}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {isAr ? "قواعد غرفة التجارة الدولية ICC Model Contract 769 • مدة 24 شهراً" : "ICC Model Contract 769 Rules • 24 Months"}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> {isAr ? "موقعة وسارية" : "EXECUTED"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {isAr
                    ? "أي محاولة للتواصل المباشر أو الالتفاف على المنصة سواء كتابة أو شفهياً تُعد خرقاً للاتفاقية وتُلزم الطرف المخالف بدفع تعويض يعادل 3 أضعاف عمولة الوساطة الإجمالية المتوقعة وفقاً لاختصاص مركز التحكيم السويسري في جنيف."
                    : "Any attempt to circumvent the broker or communicate directly, verbally or in writing, breaches this contract and triggers liquidated damages of 3x anticipated commission under Swiss Arbitration rules (Geneva)."}
                </p>
              </div>

              {/* Brokerage Commission Card */}
              <div className="p-5 rounded-2xl bg-[#121422] border border-[#b87333]/30 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1f2233] pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {isAr ? "عمولة وساطة منصة VALOREA MARKET" : "VALOREA MARKET Platform Brokerage Commission"}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">
                      {isAr
                        ? "الإجمالي: 37,000,000.00$ دولار (50,000 طن @ 740$/طن)"
                        : "Total: $37,000,000.00 USD (50,000 MT @ $740/MT)"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold font-mono text-[#d4956b]">
                      {isAr ? "462,500.00$ دولار أمريكي" : "$462,500.00 USD"}
                    </span>
                    <span className="block text-[10px] text-gray-500">1.25%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Real-time Compliance Ledger & Incident Log */}
          {activeTab === "compliance" && (
            <div className="rounded-3xl bg-[#0c0e17] border border-[#23273b] p-6 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#121422] border border-[#23273b]">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#d4956b]" />
                    <span>{isAr ? "سجل الامتثال والرصد المباشر لكافة الجلسات (Compliance Audit Ledger)" : "Session Monitoring & Compliance Audit Ledger"}</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {isAr
                      ? "تتبع آلي دقيق لجميع جلسات المحادثة الكتابية والاجتماعات الشفوية لمنع إفشاء بيانات الاتصال وفق بنود ICC 769."
                      : "Continuous automated audit log recording every circumvention attempt, verbal leak, or symbol evasion."}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-emerald-400 block">
                    {isAr ? "حالة المراقبة: نشطة 24/7" : "Monitoring: ACTIVE 24/7"}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {isAr ? `إجمالي الوقائع: ${incidentList.length}` : `Total Incidents: ${incidentList.length}`}
                  </span>
                </div>
              </div>

              {incidentList.length === 0 ? (
                <div className="p-12 rounded-2xl bg-[#0b0d14] border border-[#1f2233] text-center space-y-3">
                  <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto opacity-70" />
                  <h4 className="text-sm font-semibold text-white">
                    {isAr ? "السجل نظيف - لا توجد مخالفات مسجلة في هذه الجلسة" : "Session Clean - No Violations Logged"}
                  </h4>
                  <p className="text-xs text-gray-400 max-w-md mx-auto">
                    {isAr
                      ? "كافة المحادثات الكتابية والاجتماعات الصوتية/الفيديو قيد الرصد المباشر والامتثال لقواعد الوساطة."
                      : "All chat discussions and audio/video meetings are actively supervised under non-circumvention rules."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {incidentList.map((inc, i) => (
                    <div
                      key={inc.id || i}
                      className="p-4 rounded-2xl bg-[#0f111a] border border-rose-500/20 text-xs font-mono space-y-2"
                    >
                      <div className="flex items-center justify-between text-gray-300">
                        <span className="font-bold text-rose-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {inc.channel === "audio_video" ? (isAr ? "مخالفة شفوية (اجتماع صوتي)" : "Verbal Leak (Audio Meeting)") : (isAr ? "مخالفة كتابية (دردشة)" : "Chat Text Leak")}
                        </span>
                        <span className="text-gray-500 text-[10px]">{inc.timestamp}</span>
                      </div>
                      <p className="text-gray-300">
                        <span className="text-gray-500">{isAr ? "الطرف المخالف:" : "Actor:"}</span> {inc.participantAlias}
                        {" • "}
                        <span className="text-gray-500">{isAr ? "نوع المحاولة:" : "Type:"}</span> {inc.violationType}
                      </p>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-[#23273b] text-gray-400">
                        <span className="text-[10px] text-gray-500 block">{isAr ? "العبارة التي تم رصدها واعتراضها:" : "Intercepted Snippet:"}</span>
                        <span className="text-rose-300 text-xs">"{inc.rawSnippet}"</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-amber-400/90 pt-1">
                        <span>{isAr ? `الإجراء المتخذ: ${inc.actionTaken === "AUTO_MUTE_MICROPHONE" ? "كتم الميكروفون تلقائياً" : "حجب وتنقيح الرسالة"}` : `Action: ${inc.actionTaken}`}</span>
                        <span className="text-[10px] text-gray-500">{inc.penaltyNotice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="py-4 border-t border-[#1f2233] text-center text-xs text-gray-500 font-mono">
          {isAr ? "غرفة الصفقات المشرفة — فالوريا ماركت VALOREA MARKET" : "VALOREA MARKET Supervised Deal Room"} • {t.common.verifiedBrokerage}
        </footer>
      </div>
    </ProtectedAccessGate>
  );
}
