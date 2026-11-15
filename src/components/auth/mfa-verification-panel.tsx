"use client";

import React, { useState, useEffect } from "react";
import {
  Smartphone,
  KeyRound,
  Fingerprint,
  Send,
  RotateCw,
  Copy,
  Check,
  AlertCircle,
  Clock,
  ShieldCheck,
  ArrowLeft,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type MfaMethod = "phone" | "authenticator" | "passkey";

interface MfaVerificationPanelProps {
  locale?: string;
  email: string;
  defaultPhone?: string;
  onVerify: (code: string, method: MfaMethod, phone?: string) => Promise<void> | void;
  onPasskeyLogin?: () => Promise<void> | void;
  onBack: () => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

export function MfaVerificationPanel({
  locale = "ar",
  email,
  defaultPhone = "+966 50 123 4567",
  onVerify,
  onPasskeyLogin,
  onBack,
  isLoading,
  errorMessage,
}: MfaVerificationPanelProps) {
  const isAr = locale === "ar";
  const [activeMethod, setActiveMethod] = useState<MfaMethod>("phone");

  // Phone OTP State
  const [phone, setPhone] = useState(defaultPhone);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSentNotice, setOtpSentNotice] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Authenticator App State
  const [totpSecret, setTotpSecret] = useState<string>("JBSWY3DPEHPK3PXP");
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [totpSecondsRemaining, setTotpSecondsRemaining] = useState(30);

  // Verification Code Input
  const [code, setCode] = useState("");

  // Countdown timer for SMS resend
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Dynamic 30-second TOTP clock rotation
  useEffect(() => {
    const updateTotpTimer = () => {
      const sec = Math.floor(Date.now() / 1000) % 30;
      setTotpSecondsRemaining(30 - sec);
    };
    updateTotpTimer();
    const timer = setInterval(updateTotpTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch TOTP secret on mount
  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const res = await fetch(`/api/auth/mfa/send-otp?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        if (data.success && data.secret) {
          setTotpSecret(data.secret);
        }
      } catch {
        // Fallback default
      }
    };
    fetchSecret();
  }, [email]);

  const handleSendPhoneOtp = async () => {
    if (!phone || phone.trim().length < 8) {
      return;
    }
    setIsSendingOtp(true);
    setOtpSentNotice(null);

    try {
      const res = await fetch("/api/auth/mfa/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, channel: "sms" }),
      });
      const data = await res.json();
      if (data.success) {
        setCooldown(60);
        const notice = isAr
          ? `تم إرسال رمز التحقق الأمني بنجاح إلى هاتفك ${data.maskedPhone} (رمز التجربة: ${data.demoCode})`
          : `Verification code sent via SMS to ${data.maskedPhone} (Demo code: ${data.demoCode})`;
        setOtpSentNotice(notice);
      }
    } catch {
      setOtpSentNotice(
        isAr ? "تعذر إرسال الرمز، يمكنك استخدام الرمز التجريبي 123456" : "SMS send simulated. You may use 123456."
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleCopySecret = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(totpSecret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 6) return;
    onVerify(code.trim(), activeMethod, phone);
  };

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
      {/* Header Banner */}
      <div className="p-4 rounded-2xl bg-[#121524] border border-[#2b334d] text-center space-y-1.5">
        <div className="w-10 h-10 rounded-xl bg-[#b87333]/15 border border-[#b87333]/30 flex items-center justify-center mx-auto text-[#d4956b] mb-1">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-white">
          {isAr ? "المصادقة الثنائية الإلزامية (MFA / 2FA)" : "Two-Factor Security Authentication"}
        </h3>
        <p className="text-xs text-gray-400">
          {isAr
            ? "اختر وسيلة التحقق المفضلة لديك عبر الهاتف أو تطبيق المصادقة"
            : "Choose your preferred verification method: Mobile SMS OTP or Authenticator App"}
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* MFA Method Selection Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#101320] border border-[#23273b]">
        {/* Tab 1: Phone SMS */}
        <button
          type="button"
          onClick={() => {
            setActiveMethod("phone");
            setCode("");
          }}
          className={cn(
            "py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
            activeMethod === "phone"
              ? "bg-[#b87333] text-white shadow-md shadow-[#b87333]/25"
              : "text-gray-400 hover:text-white hover:bg-[#151928]"
          )}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{isAr ? "رسالة SMS" : "Phone SMS"}</span>
        </button>

        {/* Tab 2: Authenticator App */}
        <button
          type="button"
          onClick={() => {
            setActiveMethod("authenticator");
            setCode("");
          }}
          className={cn(
            "py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
            activeMethod === "authenticator"
              ? "bg-[#b87333] text-white shadow-md shadow-[#b87333]/25"
              : "text-gray-400 hover:text-white hover:bg-[#151928]"
          )}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>{isAr ? "تطبيق المصادقة" : "Authenticator"}</span>
        </button>

        {/* Tab 3: Passkey / FIDO2 */}
        <button
          type="button"
          onClick={() => {
            setActiveMethod("passkey");
            setCode("");
          }}
          className={cn(
            "py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all",
            activeMethod === "passkey"
              ? "bg-[#b87333] text-white shadow-md shadow-[#b87333]/25"
              : "text-gray-400 hover:text-white hover:bg-[#151928]"
          )}
        >
          <Fingerprint className="w-3.5 h-3.5" />
          <span>{isAr ? "مفتاح الأمان" : "Passkey"}</span>
        </button>
      </div>

      {/* --- Method 1: Phone SMS OTP --- */}
      {activeMethod === "phone" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">
              {isAr ? "رقم الهاتف المسجل لاستلام رمز التحقق (SMS):" : "Registered Mobile Phone Number:"}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Smartphone className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966 50 123 4567"
                  className="w-full bg-[#121422] border border-[#23273b] rounded-xl pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333] font-mono dir-ltr"
                />
              </div>
              <button
                type="button"
                onClick={handleSendPhoneOtp}
                disabled={isSendingOtp || cooldown > 0 || !phone}
                className="px-4 py-2.5 rounded-xl bg-[#1b2034] hover:bg-[#252c48] border border-[#303858] text-[#d4956b] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 shrink-0"
              >
                {isSendingOtp ? (
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>
                  {cooldown > 0
                    ? isAr
                      ? `إعادة الإرسال (${cooldown}ث)`
                      : `Resend (${cooldown}s)`
                    : isAr
                    ? "إرسال الرمز"
                    : "Send SMS"}
                </span>
              </button>
            </div>
          </div>

          {/* SMS Sent Notification */}
          {otpSentNotice && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{otpSentNotice}</span>
            </div>
          )}

          <div>
            <label className="text-xs text-gray-400 block mb-1 text-center font-mono">
              {isAr ? "أدخل رمز التحقق (OTP) المكون من 6 أرقام:" : "ENTER 6-DIGIT SMS VERIFICATION CODE:"}
            </label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full bg-[#121422] border-2 border-[#b87333] rounded-xl py-3 text-center text-xl tracking-[0.4em] font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#b87333]/50"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || code.length < 6}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#c87f3b] hover:to-[#9b6531] text-white text-xs font-semibold shadow-lg shadow-[#b87333]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-40"
          >
            <UserCheck className="w-4 h-4" />
            <span>
              {isLoading
                ? isAr
                  ? "جاري تأكيد الرمز..."
                  : "Verifying SMS Code..."
                : isAr
                ? "تأكيد رمز الهاتف والدخول"
                : "Verify Phone OTP & Sign In"}
            </span>
          </button>
        </form>
      )}

      {/* --- Method 2: Authenticator App (Google / Microsoft / TOTP) --- */}
      {activeMethod === "authenticator" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3.5 rounded-xl bg-[#141726] border border-[#262c45] space-y-2 text-xs">
            <div className="flex items-center justify-between text-gray-300">
              <span className="font-semibold">
                {isAr ? "تطبيق Google / Microsoft Authenticator" : "Google / Microsoft Authenticator"}
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <Clock className="w-3 h-3 animate-spin" />
                {totpSecondsRemaining}s {isAr ? "دوران الرمز" : "rotation"}
              </span>
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              {isAr
                ? "افتح تطبيق المصادقة بهاتفك وأدخل الرمز المتغير المكون من 6 أرقام لحساب المنصة."
                : "Open your mobile authenticator app and enter the active 6-digit verification code."}
            </p>

            {/* Secret key toggle for setup */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowSecretKey(!showSecretKey)}
                className="text-[11px] text-[#d4956b] hover:underline inline-flex items-center gap-1"
              >
                <span>{showSecretKey ? (isAr ? "إخفاء مفتاح الإعداد" : "Hide Setup Key") : (isAr ? "عرض مفتاح الإعداد اليدوي للتطبيق" : "Show Manual Setup Key")}</span>
              </button>

              {showSecretKey && (
                <div className="mt-2 p-2.5 rounded-lg bg-[#0b0d14] border border-[#23273b] flex items-center justify-between font-mono text-xs">
                  <span className="text-gray-300 select-all tracking-wider">{totpSecret}</span>
                  <button
                    type="button"
                    onClick={handleCopySecret}
                    className="p-1.5 rounded hover:bg-[#1a1f33] text-gray-400 hover:text-white transition-colors"
                    title={isAr ? "نسخ المفتاح" : "Copy Secret"}
                  >
                    {copiedSecret ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1 text-center font-mono">
              {isAr ? "رمز تطبيق المصادقة المكون من 6 أرقام (TOTP):" : "6-DIGIT AUTHENTICATOR APP CODE:"}
            </label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="w-full bg-[#121422] border-2 border-[#b87333] rounded-xl py-3 text-center text-xl tracking-[0.4em] font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#b87333]/50"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || code.length < 6}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#c87f3b] hover:to-[#9b6531] text-white text-xs font-semibold shadow-lg shadow-[#b87333]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-40"
          >
            <KeyRound className="w-4 h-4" />
            <span>
              {isLoading
                ? isAr
                  ? "جاري التحقق..."
                  : "Verifying TOTP..."
                : isAr
                ? "تأكيد رمز التطبيق والدخول"
                : "Confirm Authenticator Code"}
            </span>
          </button>
        </form>
      )}

      {/* --- Method 3: Hardware Key / Passkey --- */}
      {activeMethod === "passkey" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#141724] border border-[#23273b] text-center space-y-2">
            <Fingerprint className="w-10 h-10 text-[#d4956b] mx-auto animate-pulse" />
            <h4 className="text-xs font-bold text-white">
              {isAr ? "المصادقة الفورية بمفتاح الأمان الفيزيائي FIDO2" : "FIDO2 / Hardware Security Key Fast Login"}
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              {isAr
                ? "اضغط للمصادقة عبر مستشعر البصمة (Touch ID)، التعرف على الوجه، أو مفتاح الأمان (YubiKey NFC)."
                : "Authenticate instantly with your hardware security key, Touch ID, Face ID, or Windows Hello."}
            </p>
          </div>

          <button
            type="button"
            onClick={onPasskeyLogin}
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
          >
            <Fingerprint className="w-4 h-4" />
            <span>
              {isLoading
                ? isAr
                  ? "جاري التحقق من المفتاح..."
                  : "Validating Passkey..."
                : isAr
                ? "تسجيل دخول فوري بمفتاح الأمان (Touch ID / YubiKey)"
                : "Authenticate with Passkey / Hardware Key"}
            </span>
          </button>
        </div>
      )}

      {/* Back button */}
      <div className="pt-2 flex items-center justify-center">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-[#d4956b] hover:text-[#e5a67c] hover:underline flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{isAr ? "الرجوع وتغيير الحساب" : "Back to Sign In"}</span>
        </button>
      </div>
    </div>
  );
}

export default MfaVerificationPanel;
