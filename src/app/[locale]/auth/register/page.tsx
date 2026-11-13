"use client";

import React, { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { getSubpageTranslations } from "@/lib/i18n-subpages";
import {
  FileBadge2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = getSubpageTranslations(locale);

  const [companyName, setCompanyName] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [country, setCountry] = useState("FR");
  const [repName, setRepName] = useState("");
  const [repEmail, setRepEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-[#f8fafc] flex flex-col justify-center items-center p-4">
      <div className="max-w-2xl w-full rounded-3xl bg-[#0c0e17] border border-[#23273b] p-8 sm:p-10 shadow-2xl space-y-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{t.auth.backHome}</span>
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {t.auth.registerTitle}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
              {t.contact.successDesc}
            </p>
            <div className="p-3 rounded-xl bg-[#141724] border border-[#23273b] text-xs font-mono text-[#d4956b] inline-block">
              {locale === "ar" ? "حالة التدقيق: قيد المراجعة (KYB/KYC)" : "KYC/KYB: PENDING_REVIEW"}
            </div>
            <div className="pt-4">
              <button
                onClick={() => router.push("/deals/deal-en590-rotterdam/room")}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] text-white text-xs font-semibold"
              >
                {t.catalog.title}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121420] border border-[#23273b] text-xs font-mono text-[#d4956b] mb-2">
                <FileBadge2 className="w-3.5 h-3.5" />
                <span>{t.auth.registerBadge}</span>
              </div>
              <h1 className="text-2xl font-bold text-white">
                {t.auth.registerTitle}
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                {t.auth.registerSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">{t.auth.companyLabel}</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={locale === "ar" ? "مثال: شركة الطاقة الوطنية" : "TotalEnergies Trading SA"}
                  className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  {locale === "ar" ? "رقم السجل التجاري (CR / Registration #)" : "Commercial Registration (CR)"}
                </label>
                <input
                  type="text"
                  required
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder={locale === "ar" ? "مثال: 1010045231 أو RCS 542 051" : "RCS 542 051 180"}
                  className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">{t.auth.countryLabel}</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
                >
                  <option value="CH">{locale === "ar" ? "سويسرا (CH)" : "Switzerland (CH)"}</option>
                  <option value="AE">{locale === "ar" ? "الإمارات العربية المتحدة (AE)" : "United Arab Emirates (AE)"}</option>
                  <option value="SA">{locale === "ar" ? "المملكة العربية السعودية (SA)" : "Saudi Arabia (SA)"}</option>
                  <option value="FR">{locale === "ar" ? "فرنسا (FR)" : "France (FR)"}</option>
                  <option value="GB">{locale === "ar" ? "المملكة المتحدة (GB)" : "United Kingdom (GB)"}</option>
                  <option value="SG">{locale === "ar" ? "سنغافورة (SG)" : "Singapore (SG)"}</option>
                  <option value="US">{locale === "ar" ? "الولايات المتحدة (US)" : "United States (US)"}</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">{t.auth.fullNameLabel}</label>
                <input
                  type="text"
                  required
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  placeholder={locale === "ar" ? "الممثل القانوني / المفوض بالتوقيع" : "Legal Officer"}
                  className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">{t.auth.emailLabel}</label>
              <input
                type="email"
                required
                value={repEmail}
                onChange={(e) => setRepEmail(e.target.value)}
                placeholder={t.auth.emailPlaceholder}
                className="w-full bg-[#121422] border border-[#23273b] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#b87333]"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-[#121422] border border-[#23273b] text-xs text-gray-400">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" required className="mt-0.5 rounded text-[#b87333]" />
                <span>{t.auth.agreeTerms}</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white font-semibold text-xs shadow-lg shadow-[#b87333]/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{t.auth.registerBtn}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            <div className="text-center text-xs text-gray-400 pt-2">
              <span>{t.auth.alreadyAccount} </span>
              <button
                type="button"
                onClick={() => router.push("/auth/signin")}
                className="text-[#d4956b] hover:underline font-semibold"
              >
                {t.auth.signInLink}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
