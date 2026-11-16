"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { TurnstileWidget, type TurnstileRef } from "@/components/ui/turnstile-widget";
import { MfaVerificationPanel } from "@/components/auth/mfa-verification-panel";
import {
  ShieldCheck,
  Lock,
  Mail,
  Fingerprint,
  AlertCircle,
  ArrowLeft,
  KeyRound,
  Radio,
  Building2,
  CheckCircle2,
  Cpu,
  Eye,
  EyeOff,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const isAr = locale === "ar";

  // Form State
  const turnstileRef = useRef<TurnstileRef>(null);
  const [selectedRole, setSelectedRole] = useState<"platform_admin" | "broker" | "compliance_officer">("platform_admin");
  const [email, setEmail] = useState("director@valorea.exchange");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaTicket, setMfaTicket] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [step, setStep] = useState<"credentials" | "mfa">("credentials");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle role quick switch presets
  const handleRoleSelect = (role: "platform_admin" | "broker" | "compliance_officer") => {
    setSelectedRole(role);
    if (role === "platform_admin") {
      setEmail("director@valorea.exchange");
    } else if (role === "broker") {
      setEmail("desk.lead@valorea.exchange");
    } else {
      setEmail("compliance@valorea.exchange");
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(
        isAr
          ? "يرجى إدخال اسم المستخدم وكلمة المرور المشفرة"
          : "Both executive identifier and cryptographic password are required."
      );
      return;
    }

    if (!turnstileToken) {
      setError(
        isAr
          ? "يرجى إكمال فحص التحقق الأمني من Cloudflare Turnstile للمتابعة"
          : "Please complete the Cloudflare Turnstile security challenge to continue."
      );
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          turnstileToken,
          selectedRole,
        }),
      });

      const data = await res.json();
      if (!res.ok && res.status !== 200) {
        setError(data.message || (isAr ? "فشل التحقق من الهوية الإدارية" : "Authentication failed"));
        setIsLoading(false);
        turnstileRef.current?.reset();
        setTurnstileToken("");
        return;
      }

      if (data.step === "MFA_REQUIRED") {
        setMfaTicket(data.mfaTicket || "");
        setStep("mfa");
        setIsLoading(false);
      } else if (data.success && data.redirectUrl) {
        router.push(data.redirectUrl);
      }
    } catch {
      setError(isAr ? "حدث خطأ في الاتصال ببوابة الإدارة" : "Network error contacting administrative gateway");
      setIsLoading(false);
    }
  };

  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.trim().length < 6) {
      setError(
        isAr
          ? "رمز المصادقة الثنائية (MFA / TOTP) يجب أن يتكون من 6 أرقام"
          : "Two-factor authentication code (TOTP) must be at least 6 digits."
      );
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          mfaCode,
          mfaTicket,
          turnstileToken,
          selectedRole,
        }),
      });

      const data = await res.json();
      if (data.success && data.redirectUrl) {
        router.push(data.redirectUrl);
      } else {
        setError(data.message || (isAr ? "رمز المصادقة غير صالح" : "Invalid authenticator code"));
        setIsLoading(false);
      }
    } catch {
      setError(isAr ? "حدث خطأ في المصادقة" : "MFA verification failed");
      setIsLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usePasskey: true,
          selectedRole,
        }),
      });

      const data = await res.json();
      if (data.success && data.redirectUrl) {
        router.push(data.redirectUrl);
      }
    } catch {
      setError(isAr ? "فشل التعرف على مفتاح الأمان FIDO2" : "Hardware security key verification failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-[#f8fafc] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Horizon Executive Amber Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full blur-[140px] bg-[#b87333]/15 pointer-events-none" />

      {/* Main Glass Panel */}
      <div className="max-w-xl w-full rounded-3xl bg-white dark:bg-[#0c0e17]/95 border border-gray-200 dark:border-[#23273b] p-6 sm:p-10 shadow-2xl relative z-10 space-y-6 backdrop-blur-xl">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#1f2233] pb-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{isAr ? "العودة للمنصة" : "Back to Platform"}</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider">
              {isAr ? "بوابة الإدارة المشفرة • المستوى 4" : "EXECUTIVE GATEWAY • CLEARANCE 4"}
            </span>
          </div>
        </div>

        {/* Executive Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1b1f33] to-[#0e101a] border border-[#b87333]/40 flex items-center justify-center text-[#d4956b] mx-auto shadow-xl shadow-[#b87333]/20">
            <ShieldCheck className="w-8 h-8 text-[#d4956b]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight font-sans">
            {isAr ? "بوابة إدارة المنصة والوساطة المؤسسية" : "Institutional Platform Administration"}
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            {isAr ? (
              <span>
                جلسة تشغيلية آمنة مخصصة للمدير التنفيذي، كبار الوسطاء، وهيئة الامتثال والرقابة{" "}
                <bdi dir="ltr" className="inline-block font-mono text-[11px] text-gray-500 dark:text-gray-400">
                  (FINMA &amp; ICC 769 Standards)
                </bdi>
                .
              </span>
            ) : (
              "Dedicated executive authentication gateway for Platform Directors, Lead Brokers, and the Compliance Board."
            )}
          </p>
        </div>

        {/* Security Status Ticker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-[#090b12] border border-gray-200 dark:border-[#1b1f2e] text-[10px] font-mono text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>TLS 1.3 / E2EE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-[#b87333]" />
            <span>HSM Enclave</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-sky-500" />
            <span>Turnstile Ready</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Building2 className="w-3 h-3 text-purple-500" />
            <span>Geneva ICC 769</span>
          </div>
        </div>

        {/* Role Selection Tabs */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
            {isAr ? "الصفة والمستوى الإداري:" : "Administrative Capacity & Clearance:"}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleRoleSelect("platform_admin")}
              className={cn(
                "admin-role-btn",
                selectedRole === "platform_admin"
                  ? "admin-role-btn-active"
                  : "admin-role-btn-inactive"
              )}
            >
              <span className="block text-xs leading-tight admin-role-title">
                {isAr ? "مدير المنصة" : "Platform Admin"}
              </span>
              <span className="text-[10px] font-mono block mt-0.5 admin-role-clearance">
                Clearance 4
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("broker")}
              className={cn(
                "admin-role-btn",
                selectedRole === "broker"
                  ? "admin-role-btn-active"
                  : "admin-role-btn-inactive"
              )}
            >
              <span className="block text-xs leading-tight admin-role-title">
                {isAr ? "كبير الوسطاء" : "Lead Broker"}
              </span>
              <span className="text-[10px] font-mono block mt-0.5 admin-role-clearance">
                Clearance 3
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect("compliance_officer")}
              className={cn(
                "admin-role-btn",
                selectedRole === "compliance_officer"
                  ? "admin-role-btn-active"
                  : "admin-role-btn-inactive"
              )}
            >
              <span className="block text-xs leading-tight admin-role-title">
                {isAr ? "هيئة الامتثال" : "Compliance"}
              </span>
              <span className="text-[10px] font-mono block mt-0.5 admin-role-clearance">
                Auditor L3
              </span>
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* FIDO2 Hardware Key / WebAuthn Fast Entrance */}
        <button
          onClick={handlePasskeyLogin}
          disabled={isLoading}
          className="admin-fido2-btn w-full py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-between transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2.5">
            <Fingerprint className="w-4 h-4 text-[#d4956b] group-hover:scale-110 transition-transform shrink-0" />
            <span className="admin-fido2-text">
              {isAr ? "تسجيل دخول فوري بمفتاح الأمان (FIDO2 / YubiKey)" : "Authenticate with Hardware Passkey (FIDO2 / HSM)"}
            </span>
          </div>
          <span className="admin-fido2-badge px-2 py-0.5 rounded text-[10px] font-mono shrink-0">
            FIDO2 Certified
          </span>
        </button>

        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
          <div className="flex-1 h-[1px] bg-gray-200 dark:bg-[#1f2233]" />
          <span className={cn("text-[10px] text-gray-500 uppercase", !isAr && "font-mono tracking-wider")}>
            {isAr ? "أو عبر المصادقة المشفرة ثنائية المعايير" : "OR TWO-FACTOR ENCRYPTED ENTRY"}
          </span>
          <div className="flex-1 h-[1px] bg-gray-200 dark:bg-[#1f2233]" />
        </div>

        {/* Step 1: Credentials Form */}
        {step === "credentials" && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                {isAr ? "البريد الإلكتروني الإداري المعتمد:" : "Executive Identifier / Corporate Email:"}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="executive@valorea.exchange"
                  className="w-full bg-white dark:bg-[#121422] border border-gray-300 dark:border-[#23273b] rounded-xl pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2.5 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#b87333] focus:ring-1 focus:ring-[#b87333] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1">
                {isAr ? "كلمة المرور الإدارية المشفرة:" : "Administrative Password:"}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white dark:bg-[#121422] border border-gray-300 dark:border-[#23273b] rounded-xl pl-9 pr-10 rtl:pr-9 rtl:pl-10 py-2.5 text-xs text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#b87333] focus:ring-1 focus:ring-[#b87333] font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rtl:right-auto rtl:left-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Cloudflare Turnstile Challenge */}
            <div className="pt-2">
              <label className="text-xs text-gray-600 dark:text-gray-400 block mb-1.5">
                {isAr ? "حماية Cloudflare Turnstile ضد الروبوتات:" : "Cloudflare Turnstile Bot Verification:"}
              </label>
              <TurnstileWidget
                ref={turnstileRef}
                action="admin_signin"
                theme="auto"
                language={isAr ? "ar" : locale}
                onVerify={(token: string) => {
                  setTurnstileToken(token);
                  setError(null);
                }}
                onError={(err?: string) => {
                  setError(err || null);
                }}
                onExpire={() => {
                  setTurnstileToken("");
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !turnstileToken}
              className={cn(
                "w-full py-3 rounded-xl text-xs font-semibold shadow-lg flex items-center justify-center gap-2 transition-all",
                turnstileToken && !isLoading
                  ? "bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#c87f3b] hover:to-[#9b6531] text-white shadow-[#b87333]/25 cursor-pointer"
                  : "bg-gray-200 dark:bg-[#1a1d2e] text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-[#282d44] cursor-not-allowed"
              )}
            >
              <KeyRound className="w-4 h-4" />
              <span>
                {isLoading
                  ? (isAr ? "جاري التحقق من الهوية المشفرة..." : "Authenticating...")
                  : (isAr ? "متابعة إلى خطوة المصادقة الثنائية (TOTP)" : "Continue to Two-Factor Challenge")}
              </span>
            </button>
          </form>
        )}

        {/* Step 2: Multi-Factor Authentication (Phone SMS / Authenticator App / Passkey) */}
        {step === "mfa" && (
          <MfaVerificationPanel
            locale={locale}
            email={email}
            defaultPhone="+966 50 123 4567"
            isLoading={isLoading}
            errorMessage={error}
            onVerify={async (enteredCode, method, phoneUsed) => {
              setError(null);
              setIsLoading(true);
              try {
                const res = await fetch("/api/admin/auth", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email,
                    password,
                    mfaCode: enteredCode,
                    mfaTicket,
                    phone: phoneUsed,
                    turnstileToken,
                    selectedRole,
                  }),
                });
                const data = await res.json();
                if (data.success && data.redirectUrl) {
                  router.push(data.redirectUrl);
                } else {
                  setError(data.message || (isAr ? "رمز المصادقة غير صالح" : "Invalid verification code"));
                  setIsLoading(false);
                }
              } catch {
                setError(isAr ? "حدث خطأ في المصادقة" : "MFA verification failed");
                setIsLoading(false);
              }
            }}
            onPasskeyLogin={handlePasskeyLogin}
            onBack={() => {
              setStep("credentials");
              setMfaCode("");
              setMfaTicket("");
              setError(null);
            }}
          />
        )}

        {/* Security and Legal Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-500/5 dark:bg-[#090b12] border border-amber-500/20 dark:border-[#1b1f2e] text-[11px] text-gray-700 dark:text-gray-400 leading-relaxed font-mono">
          <p className="text-gray-700 dark:text-gray-400">
            {isAr ? (
              <>
                <strong className="text-amber-900 dark:text-white block mb-0.5">⚠️ تحذير أمني مؤسسي صارم:</strong>
                هذه البوابة مخصصة حصراً للإدارة العليا ووسطاء منصة VALOREA MARKET المعتمدين. يتم تشفير كافة الجلسات وتسجيل عنوان IP والموقع الجغرافي. أي محاولة وصول غير مصرح بها تخضع للملاحقة القانونية بموجب القوانين السويسرية والدولية.
              </>
            ) : (
              <>
                <strong className="text-amber-900 dark:text-white block mb-0.5">⚠️ Institutional Security Notice:</strong>
                This gateway is strictly reserved for authorized platform executives and supervising brokers. All attempts are monitored, geographically logged, and encrypted. Unauthorized access attempts trigger automatic IP blocklisting and legal escalation.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
