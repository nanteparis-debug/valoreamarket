"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { Lock, ShieldCheck, AlertTriangle, ArrowRight, UserCheck, KeyRound } from "lucide-react";

interface ProtectedAccessGateProps {
  locale: string;
  pageTitleAr: string;
  pageTitleEn: string;
  requiredRoleAr?: string;
  requiredRoleEn?: string;
  isAuthorized: boolean;
  isDemoMode: boolean;
  onEnableDemo: () => void;
  children: React.ReactNode;
}

export function ProtectedAccessGate({
  locale,
  pageTitleAr,
  pageTitleEn,
  requiredRoleAr,
  requiredRoleEn,
  isAuthorized,
  isDemoMode,
  onEnableDemo,
  children,
}: ProtectedAccessGateProps) {
  const isAr = locale === "ar";

  // If authorized or in explicit demo mode, render children with top simulation badge if in demo
  if (isAuthorized || isDemoMode) {
    return (
      <div className="w-full">
        {isDemoMode && (
          <div className="w-full bg-amber-500/15 border-b border-amber-500/30 px-4 py-2.5 text-center text-xs text-amber-300 font-mono flex items-center justify-center gap-2 sticky top-0 z-40 backdrop-blur-md">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {isAr
                ? "⚠️ بيئة محاكاة توضيحية تجريبية — جميع السجلات والبيانات وأسماء الشركات وحسابات الأجهزة المعروضة هي نماذج افتراضية للعرض فقط ولا تمثل أي عميل أو صفقة حقيقية."
                : "⚠️ DEMO SIMULATION MODE — All records, session IPs, counterparties, and deals shown here are synthetic sample data for demonstration only."}
            </span>
          </div>
        )}
        {children}
      </div>
    );
  }

  // Otherwise, render Access Restricted Gate (zero data leaked to visitors)
  return (
    <div className="min-h-[85vh] bg-[#07080c] text-[#f8fafc] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full rounded-3xl bg-[#0c0e17] border border-[#23273b] p-8 sm:p-10 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121420] border border-[#23273b] text-xs font-mono text-[#d4956b]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isAr ? "نظام حماية الوصول المؤسسي (RBAC Guard)" : "Role-Based Access Control"}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {isAr ? `منطقة مقيدة: ${pageTitleAr}` : `Restricted Area: ${pageTitleEn}`}
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
            {isAr
              ? `هذه الصفحة محمية ومخصصة حصرياً للمشاركين المعتمدين ${requiredRoleAr ? `(${requiredRoleAr})` : ""}. يتطلب عرض السجلات والعمليات تسجيل الدخول بحساب الشركة المفوض.`
              : `This page is restricted to verified participants ${requiredRoleEn ? `(${requiredRoleEn})` : ""}. Authentication with authorized corporate credentials is required.`}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/auth/signin"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white font-semibold text-xs sm:text-sm shadow-lg shadow-[#b87333]/20 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isAr ? "تسجيل الدخول إلى حسابك" : "Sign In to Corporate Account"}</span>
          </Link>

          <Link
            href="/auth/register"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#141724] hover:bg-[#1a1f30] border border-[#23273b] text-gray-200 hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-[#d4956b]" />
            <span>{isAr ? "طلب تسجيل شركة جديدة" : "Register New Company"}</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-[#1f2233]">
          <p className="text-xs text-gray-500 mb-2">
            {isAr
              ? "هل ترغب في استكشاف وظائف هذه اللوحة دون تسجيل دخول؟"
              : "Want to explore how this dashboard operates without signing in?"}
          </p>
          <button
            type="button"
            onClick={onEnableDemo}
            className="inline-flex items-center gap-1.5 text-xs text-[#d4956b] hover:text-[#e8b589] font-semibold underline decoration-dotted transition-colors"
          >
            <span>{isAr ? "عرض محاكاة توضيحية موسومة (Interactive Demo)" : "Open Interactive Demo Simulation"}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
