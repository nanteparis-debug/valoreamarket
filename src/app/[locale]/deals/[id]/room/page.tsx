"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "@/i18n/routing";
import { getSubpageTranslations } from "@/lib/i18n-subpages";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DealRoomPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default function OperationalDealRoomPage({ params }: DealRoomPageProps) {
  const router = useRouter();
  const [locale, setLocale] = useState("en");
  const [dealId, setDealId] = useState("deal-en590-rotterdam");

  useEffect(() => {
    params.then((p) => {
      setLocale(p.locale);
      setDealId(p.id);
    });
  }, [params]);

  const t = getSubpageTranslations(locale);
  const isAr = locale === "ar";

  const [activeTab, setActiveTab] = useState<"chat" | "video" | "documents" | "agreements">("chat");

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
      timestamp: "14:05 UTC",
    },
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [isSending, startSendTransition] = useTransition();

  // Video State
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [callActive, setCallActive] = useState(true);

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
        }
      } catch (err) {
        console.error("Message send failed", err);
      }
    });
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
    } catch (err) {
      setDownloadNotice(t.common.error);
    }
  };

  const handleToggleOwnerApproval = (docId: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === docId ? { ...d, isOriginalAuthorized: !d.isOriginalAuthorized } : d
      )
    );
    setDownloadNotice(null);
  };

  return (
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
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              {isAr
                ? "50,000 طن متري ديزل EN 590 (10 PPM) • سيف روتردام CIF • 740.00$ دولار / طن"
                : "50,000 MT Diesel EN 590 (10 PPM) • CIF Rotterdam • USD $740.00 / MT"}
            </p>
          </div>
        </div>

        {/* Participant Identification Aliases */}
        <div className="flex items-center gap-2">
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
        {/* Navigation Tabs - Swipeable on mobile viewports */}
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
            <span>{isAr ? "الدردشة الآمنة" : "Secure Chat"}</span>
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
            <span>{isAr ? "اجتماع فيديو مشفر" : "LiveKit E2EE Meeting"}</span>
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
        </div>

        {/* Tab 1: Chat Tab */}
        {activeTab === "chat" && (
          <div className="rounded-3xl bg-[#0c0e17] border border-[#23273b] p-6 shadow-2xl flex flex-col justify-between min-h-[480px]">
            {/* Security Alert Header */}
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#121422] border border-[#b87333]/30 text-xs text-gray-300 mb-6">
              <ShieldAlert className="w-4 h-4 text-[#d4956b] shrink-0" />
              <span>
                <strong>{isAr ? "حماية ضد التسريب مفعلة:" : "Anti-Leak Protection Active:"}</strong>{" "}
                {isAr
                  ? "يتم رصد وحجب أي أرقام هواتف أو عناوين بريد إلكتروني أو حسابات خارجية تلقائياً."
                  : "Any telephone number, direct email, or external messenger handle will be intercepted and redacted on the server."}
              </span>
            </div>

            {/* Messages Feed */}
            <div className="space-y-4 flex-1 overflow-y-auto pr-2" dir="inherit">
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
                    <p className="text-gray-300 leading-relaxed">{m.sanitizedText}</p>
                    {m.contactViolation && (
                      <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-mono">
                        <AlertTriangle className="w-3 h-3" />
                        {isAr
                          ? "تم حجب معلومات الاتصال بواسطة محرك الحماية - VALOREA MARKET"
                          : "Contact Information Redacted by VALOREA MARKET Engine"}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="mt-6 pt-4 border-t border-[#1f2233] space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  placeholder={
                    isAr
                      ? "اكتب رسالة تفاوض خاصة..."
                      : "Type a negotiation message..."
                  }
                  className="flex-1 bg-[#121422] border border-[#23273b] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#b87333]"
                />
                <button
                  type="submit"
                  disabled={isSending || !inputMsg.trim()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] text-white text-sm font-semibold shadow-lg shadow-[#b87333]/20 flex items-center gap-2 disabled:opacity-40"
                >
                  <span>{isAr ? "إرسال" : "Send"}</span>
                  <Send className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: LiveKit Video Call Tab */}
        {activeTab === "video" && (
          <div className="rounded-3xl bg-[#0c0e17] border border-[#23273b] p-6 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#121422] border border-[#23273b]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isAr ? "قناة فيديو وصوت مشفرة طرفياً (WebRTC E2EE)" : "LiveKit WebRTC Private Audio / Video Channel"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {isAr ? "تشفير تام بين الأطراف • التسجيل وتصوير الشاشة محظور بسياسة الأمان" : "End-to-End Encrypted (E2EE) • Screen capture & recording disabled by policy"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
                  {isAr ? "التشفير نشط" : "E2EE ACTIVE"}
                </span>
              </div>
            </div>

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
                  <p className="text-[10px] text-gray-500 font-mono">
                    {videoEnabled ? (isAr ? "الكاميرا تعمل" : "Camera Active") : (isAr ? "الكاميرا مغلقة" : "Camera Muted")}
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
                  <p className="text-[10px] text-gray-500 font-mono">
                    {isAr ? "مورد مكرر معتمد" : "Verified Refiner"}
                  </p>
                </div>
              </div>
            </div>

            {/* Media Controls Bar */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setMicEnabled(!micEnabled)}
                className={cn(
                  "p-3.5 rounded-full border transition-all",
                  micEnabled
                    ? "bg-[#141724] border-[#23273b] text-white hover:bg-[#1a1f30]"
                    : "bg-rose-500/20 border-rose-500/40 text-rose-400"
                )}
              >
                {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
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
          </div>
        )}

        {/* Tab 3: Documents Tab with Watermarked Viewer */}
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

                  {/* Actions */}
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

            {/* Document Watermarked Modal */}
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
                    {isAr ? "قواعد غرفة التجارة الدولية ICC 765 • مدة 24 شهراً" : "ICC 765 Rules • 24 Months"}
                  </p>
                </div>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> {isAr ? "موقعة وسارية" : "EXECUTED"}
                </span>
              </div>
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
      </main>

      <footer className="py-4 border-t border-[#1f2233] text-center text-xs text-gray-500 font-mono">
        {isAr ? "غرفة الصفقات المشرفة — فالوريا ماركت VALOREA MARKET" : "VALOREA MARKET Supervised Deal Room"} • {t.common.verifiedBrokerage}
      </footer>
    </div>
  );
}
