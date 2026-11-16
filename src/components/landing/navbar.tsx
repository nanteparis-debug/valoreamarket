"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { SUPPORTED_LANGUAGES, type LanguageOption } from "@/lib/constants";
import {
  Globe,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavbarProps {
  currentLocale: string;
  translations: {
    home: string;
    commodities: string;
    howItWorks: string;
    pricing: string;
    signIn: string;
    getStarted: string;
    language: string;
    brokerDesk?: string;
    compliance?: string;
    security?: string;
    dealRooms?: string;
    billing?: string;
    verifiedBadge?: string;
    siteSubtitle?: string;
    referenceCurrency?: string;
    commercialVerification?: string;
  };
}

export function Navbar({ currentLocale, translations }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLocale) ||
    SUPPORTED_LANGUAGES[2]; // Default to English

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    // Set cookie to remember user choice explicitly
    document.cookie = `NEXT_LOCALE=${langCode}; path=/; max-age=31536000; SameSite=Lax`;
    setLangDropdownOpen(false);
    setMobileMenuOpen(false);
    router.replace(pathname, { locale: langCode });
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#07080c]/85 backdrop-blur-md border-b border-[#23273b] py-3 shadow-lg shadow-black/40"
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b87333] rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b87333] via-[#8b5a2b] to-[#07080c] dark:from-[#b87333] dark:to-[#07080c] p-[1.5px] shadow-lg shadow-[#b87333]/20 shrink-0">
              <div className="w-full h-full bg-[#0c0e17] rounded-[10px] flex items-center justify-center group-hover:bg-[#121524] transition-colors overflow-hidden">
                <Image
                  src="/icon-dark.png"
                  alt="VALOREA MARKET"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain p-0.5 hidden dark:block group-hover:scale-105 transition-transform"
                  priority
                />
                <Image
                  src="/icon-light.png"
                  alt="VALOREA MARKET"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain p-0.5 block dark:hidden group-hover:scale-105 transition-transform"
                  priority
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider text-white font-mono flex items-center gap-1.5">
                VALOREA MARKET
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-[#b87333]/20 text-[#d4956b] border border-[#b87333]/30 font-sans font-semibold">
                  {translations.verifiedBadge || "Verified"}
                </span>
              </span>
              <span className="text-[10px] text-gray-400 tracking-tight hidden sm:flex items-center gap-1.5">
                <span>{translations.siteSubtitle || "Global Verified Commodities Exchange"}</span>
                <span className="text-[#d4956b] font-mono font-semibold">GVCE</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#0f1118]/80 border border-[#23273b] rounded-full px-4 py-1.5 backdrop-blur-md">
            <Link
              href="/catalog"
              className="px-3 py-1 text-xs font-medium text-gray-300 hover:text-white hover:bg-[#161824] rounded-full transition-all"
            >
              {translations.commodities}
            </Link>
            <a
              href="/#how-it-works"
              className="px-3 py-1 text-xs font-medium text-gray-300 hover:text-white hover:bg-[#161824] rounded-full transition-all"
            >
              {translations.howItWorks || "How It Works"}
            </a>
            <a
              href="/#pricing"
              className="px-3 py-1 text-xs font-medium text-gray-300 hover:text-white hover:bg-[#161824] rounded-full transition-all"
            >
              {translations.pricing}
            </a>
            <Link
              href="/legal/brokerage"
              className="px-3 py-1 text-xs font-medium text-gray-300 hover:text-white hover:bg-[#161824] rounded-full transition-all"
            >
              {currentLocale === "ar" ? "سياسة الوساطة" : "Brokerage Policy"}
            </Link>
            <Link
              href="/verification"
              className="px-3 py-1 text-xs font-medium text-gray-300 hover:text-white hover:bg-[#161824] rounded-full transition-all flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4956b]" />
              <span>{translations.commercialVerification || (currentLocale === "ar" ? "التحقق التجاري" : "Verification")}</span>
            </Link>

            {/* Role-Gated Operational Desk Gateway */}
            <div className="h-4 w-[1px] bg-[#23273b] mx-1" />
            <Link
              href="/broker"
              className="px-3 py-1 text-xs font-semibold text-[#d4956b] hover:text-white hover:bg-[#b87333]/20 rounded-full transition-all flex items-center gap-1"
            >
              <Lock className="w-3 h-3 text-[#d4956b]" />
              <span>{currentLocale === "ar" ? "مكتب العمليات" : "Desk Portal"}</span>
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <ThemeToggle locale={currentLocale} />

            {/* Currency Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#121420] border border-[#23273b] text-xs font-mono text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-white">USD</span>
              <span className="text-gray-500 text-[10px]">{translations.referenceCurrency || "Reference"}</span>
            </div>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                aria-expanded={langDropdownOpen}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0f1118] border border-[#23273b] hover:border-[#b87333]/50 text-sm text-gray-200 hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b87333]"
              >
                <Globe className="w-4 h-4 text-[#d4956b]" />
                <span className="text-sm">{currentLang.flag}</span>
                <span className="text-xs font-medium">{currentLang.nativeName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {langDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0e1017] border border-[#23273b] shadow-2xl p-1.5 z-50">
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider border-b border-[#1f2233] mb-1">
                      {translations.language} (8 Supported)
                    </div>
                    <div className="space-y-0.5 max-h-72 overflow-y-auto">
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => handleLanguageChange(lang.code)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors",
                            lang.code === currentLocale
                              ? "bg-[#b87333]/20 text-[#d4956b] font-semibold"
                              : "text-gray-300 hover:bg-[#161824] hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{lang.flag}</span>
                            <span>{lang.nativeName}</span>
                          </div>
                          <span className="text-[10px] text-gray-500 uppercase font-mono">
                            {lang.code}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sign in Button */}
            <Link
              href="/auth/signin"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              {translations.signIn}
            </Link>

            {/* Primary CTA */}
            <Link
              href="/auth/register"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white text-sm font-medium shadow-md shadow-[#b87333]/20 hover:shadow-lg hover:shadow-[#b87333]/30 transition-all"
            >
              <span>{translations.getStarted}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle locale={currentLocale} />
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="p-2 rounded-lg bg-[#0f1118] border border-[#23273b] text-gray-300"
              aria-label="Language"
            >
              <span className="text-base">{currentLang.flag}</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#0f1118] border border-[#23273b] text-gray-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0c13] border-b border-[#23273b] px-4 pt-3 pb-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-[#161824]"
            >
              {translations.commodities}
            </Link>
            <a
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-[#161824]"
            >
              {translations.howItWorks || "How It Works"}
            </a>
            <a
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-[#161824]"
            >
              {translations.pricing}
            </a>
            <Link
              href="/legal/brokerage"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-[#161824]"
            >
              {currentLocale === "ar" ? "سياسة الوساطة والتسوية" : "Brokerage Policy"}
            </Link>
            <Link
              href="/verification"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm text-gray-200 hover:bg-[#161824] flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#d4956b]" />
              <span>{translations.commercialVerification || (currentLocale === "ar" ? "التحقق التجاري" : "Verification")}</span>
            </Link>

            {/* Role-Gated Operations Sub-section */}
            <div className="pt-2 mt-2 border-t border-[#1f2233]">
              <span className="text-[10px] uppercase font-mono text-[#d4956b] px-3 font-semibold block mb-1">
                {currentLocale === "ar" ? "بوابات التشغيل والوساطة (أعضاء)" : "Operations & Broker Desk"}
              </span>
              <div className="grid grid-cols-2 gap-1">
                <Link
                  href="/broker"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-[#161824] flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-[#d4956b]" />
                  <span>{translations.brokerDesk || "Broker"}</span>
                </Link>
                <Link
                  href="/compliance"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-[#161824] flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-[#d4956b]" />
                  <span>{translations.compliance || "Compliance"}</span>
                </Link>
                <Link
                  href="/admin/commercial-verification"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-[#161824] flex items-center gap-1.5 col-span-2 text-[#d4956b]"
                >
                  <Lock className="w-3 h-3 text-[#d4956b]" />
                  <span>{currentLocale === "ar" ? "لوحة التحقق التجاري (إدارة)" : "Commercial Verification Admin"}</span>
                </Link>
                <Link
                  href="/billing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-[#161824] flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-[#d4956b]" />
                  <span>{translations.billing || "Billing"}</span>
                </Link>
                <Link
                  href="/settings/security"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-[#161824] flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-[#d4956b]" />
                  <span>{translations.security || "Security"}</span>
                </Link>
              </div>
            </div>
          </nav>

          {/* Theme Switcher in Mobile */}
          <div className="pt-2 border-t border-[#1f2233] flex items-center justify-between">
            <span className="text-xs text-gray-400 font-semibold">
              {currentLocale === "ar" ? "المظهر" : "Theme"}
            </span>
            <ThemeToggle locale={currentLocale} showLabel />
          </div>

          {/* Languages in Mobile */}
          <div className="pt-2 border-t border-[#1f2233]">
            <p className="text-xs text-gray-400 font-semibold mb-2">
              {translations.language}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={cn(
                    "flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs",
                    lang.code === currentLocale
                      ? "bg-[#b87333]/20 text-[#d4956b] font-bold"
                      : "text-gray-300 hover:bg-[#161824]"
                  )}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#1f2233] flex flex-col gap-2">
            <Link
              href="/auth/signin"
              className="w-full text-center py-2.5 rounded-lg border border-[#23273b] text-sm font-medium text-gray-200 hover:bg-[#161824]"
            >
              {translations.signIn}
            </Link>
            <Link
              href="/auth/register"
              className="w-full text-center py-2.5 rounded-lg bg-gradient-to-r from-[#b87333] to-[#8b5a2b] text-white text-sm font-medium shadow-md shadow-[#b87333]/20"
            >
              {translations.getStarted}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
