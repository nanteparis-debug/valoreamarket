"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { getSubpageTranslations } from "@/lib/i18n-subpages";
import {
  Mail,
  MapPin,
  ShieldCheck,
  Send,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function ContactPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "en";
  const t = getSubpageTranslations(locale);

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    sector: "crude_oil_condensates",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 border-b border-[#1f2233] pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            {t.common.home}
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-xs text-[#d4956b] font-medium">{t.contact.breadcrumb}</span>
        </div>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#b87333]/15 border border-[#b87333]/30 text-xs font-mono text-[#d4956b]">
            <Mail className="w-3.5 h-3.5" />
            <span>{t.contact.badge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono">
            {t.contact.title}
          </h1>
          <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details & Desks */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0e1017] border border-[#23273b] p-6 rounded-2xl space-y-5 shadow-xl">
              <h3 className="text-base font-bold text-white font-mono">{t.contact.desksTitle}</h3>

              <div className="space-y-4 text-xs">
                {t.contact.desks.map((d, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#d4956b] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-white block">{d.name}</span>
                      <span className="text-gray-400">{d.location}</span>
                      <span className="text-gray-500 block font-mono mt-0.5">{d.phone} • {d.email}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#1f2233] pt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-3.5 h-3.5 text-[#d4956b]" />
                  <span>desk@gvce.exchange</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>compliance@gvce.exchange</span>
                </div>
              </div>
            </div>

            {/* PGP Card */}
            <div className="bg-[#0e1017] border border-[#23273b] p-5 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>PGP E2EE Fingerprint</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#141724] border border-[#23273b] font-mono text-[10px] text-gray-300 break-all select-all">
                4F8B 9201 CC34 8109 EF22 1765 B9A0 4431 89FE 204C
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-[#0e1017] border border-[#23273b] p-8 rounded-2xl shadow-xl">
            {submitted ? (
              <div className="p-8 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-lg font-bold text-white">{t.contact.successTitle}</h3>
                <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                  {t.contact.successDesc}
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-[#141724] border border-[#23273b] text-xs text-white"
                >
                  {t.common.backHome}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 block">{t.contact.nameLabel}</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder={t.contact.namePlaceholder}
                      className="w-full bg-[#141724] border border-[#23273b] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b87333]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 block">{t.contact.companyLabel}</label>
                    <input
                      required
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder={t.contact.companyPlaceholder}
                      className="w-full bg-[#141724] border border-[#23273b] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b87333]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 block">{t.contact.emailLabel}</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={t.contact.emailPlaceholder}
                    className="w-full bg-[#141724] border border-[#23273b] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b87333]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 block">{t.contact.messageLabel}</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t.contact.messagePlaceholder}
                    className="w-full bg-[#141724] border border-[#23273b] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#b87333]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#b87333]/20"
                >
                  <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                  <span>{t.contact.submitBtn}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
