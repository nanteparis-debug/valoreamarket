"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { getSubpageTranslations } from "@/lib/i18n-subpages";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Fingerprint,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = getSubpageTranslations(locale);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [step, setStep] = useState<"credentials" | "mfa">("credentials");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t.auth.errorRequired);
      return;
    }
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep("mfa");
    }, 600);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length < 6) {
      setError(t.auth.errorMfa);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/deals/deal-en590-rotterdam/room");
    }, 600);
  };

  const handlePasskeyLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/deals/deal-en590-rotterdam/room");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-[#f8fafc] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Horizon glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-[120px] bg-[#b87333]/20 pointer-events-none" />

      <div className="max-w-md w-full rounded-3xl bg-[#0c0e17] border border-[#23273b] p-8 shadow-2xl relative z-10 space-y-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t.auth.backHome}</span>
        </button>

        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#141724] border border-[#23273b] flex items-center justify-center text-[#d4956b] mx-auto mb-3 shadow-lg shadow-[#b87333]/15">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {t.auth.signInTitle}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {t.auth.signInSubtitle}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Passkey Fast Login Button */}
        <button
          onClick={handlePasskeyLogin}
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-[#141829] hover:bg-[#1a2036] border border-[#2d3450] text-gray-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-md group"
        >
          <Fingerprint className="w-4 h-4 text-[#d4956b] group-hover:scale-110 transition-transform" />
          <span>{t.auth.passkeyBtn}</span>
        </button>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex-1 h-[1px] bg-[#1f2233]" />
          <span className="font-mono text-[10px]">GVCE SECURE AUTH</span>
          <div className="flex-1 h-[1px] bg-[#1f2233]" />
        </div>

        {step === "credentials" ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">{t.auth.emailLabel}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.auth.emailPlaceholder}
                  className="w-full bg-[#121422] border border-[#23273b] rounded-xl pl-9 pr-4 rtl:pr-9 rtl:pl-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">{t.auth.passwordLabel}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.auth.passwordPlaceholder}
                className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
              />
            </div>

            <div className="p-2.5 rounded-xl bg-[#0f1118] border border-[#23273b] flex items-center justify-between text-[11px] text-gray-400 font-mono">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                OWASP ASVS L2 / FIDO2
              </span>
              <span className="text-emerald-400 font-bold">Encrypted</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white font-semibold text-xs shadow-lg shadow-[#b87333]/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? t.common.loading : t.auth.signInBtn}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleMfaSubmit} className="space-y-4">
            <div className="text-center p-3 rounded-xl bg-[#141724] border border-[#23273b]">
              <span className="text-xs text-gray-300 font-mono">{t.auth.mfaTitle}</span>
              <p className="text-[11px] text-gray-400 mt-0.5">{t.auth.mfaSubtitle}</p>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">{t.auth.mfaCodeLabel}</label>
              <input
                type="text"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="123456"
                className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-[#b87333]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{isLoading ? t.common.loading : t.auth.verifyMfaBtn}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[#1f2233] text-center text-xs text-gray-400">
          <span>{t.auth.noAccount} </span>
          <button
            onClick={() => router.push("/auth/register")}
            className="text-[#d4956b] hover:underline font-semibold"
          >
            {t.auth.registerLink}
          </button>
        </div>
      </div>
    </div>
  );
}
