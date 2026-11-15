"use client";

import React from "react";
import Image from "next/image";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";
import { ShieldCheck, Globe, Mail } from "lucide-react";
import { PaymentMethodsStrip } from "@/components/ui/payment-methods-strip";
import { TrustpilotBadge } from "@/components/ui/trustpilot-badge";

interface AnimatedFooterProps {
  currentLocale: string;
  translations: {
    description: string;
    platform: string;
    company: string;
    legal: string;
    support: string;
    termsOfService: string;
    privacyPolicy: string;
    cookiePolicy: string;
    helpCenter: string;
    contactUs: string;
    aboutUs: string;
    rights: string;
    platformCatalog?: string;
    platformBroker?: string;
    platformCompliance?: string;
    platformBilling?: string;
    platformSecurity?: string;
    legalNcnda?: string;
    legalBrokerage?: string;
    badgeUsd?: string;
    badgeBanks?: string;
    badgeVerified?: string;
    languagesTitle?: string;
  };
}

export function AnimatedFooter({
  currentLocale,
  translations,
}: AnimatedFooterProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (langCode: string) => {
    document.cookie = `NEXT_LOCALE=${langCode}; path=/; max-age=31536000; SameSite=Lax`;
    router.replace(pathname, { locale: langCode });
  };

  return (
    <footer className="bg-[#050609] border-t border-[#1a1d2e] pt-16 pb-12 text-xs text-gray-400 relative overflow-hidden">
      {/* Subtle Top Copper Horizon Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#b87333]/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#161824]">
          {/* Brand Info & Mission (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#b87333] to-[#0c0e17] p-[1.5px] shrink-0">
                <div className="w-full h-full bg-[#0c0e17] rounded-[9px] flex items-center justify-center overflow-hidden">
                  <Image
                    src="/icon-dark.png"
                    alt="VALOREA MARKET"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain p-0.5 hidden dark:block"
                  />
                  <Image
                    src="/icon-light.png"
                    alt="VALOREA MARKET"
                    width={36}
                    height={36}
                    className="w-full h-full object-contain p-0.5 block dark:hidden"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-wider text-white font-mono">
                  VALOREA MARKET
                </span>
                <span className="text-[10px] tracking-widest text-[#d4956b] font-mono font-semibold">
                  G V C E
                </span>
              </div>
            </div>
            <p className="text-gray-400 max-w-sm text-xs leading-relaxed">
              {translations.description}
            </p>
            <div className="pt-1">
              <a
                href="mailto:contact@valoreamarket.com"
                className="inline-flex items-center gap-2 text-xs font-mono text-gray-300 hover:text-[#d4956b] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>contact@valoreamarket.com</span>
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="px-2.5 py-1 rounded bg-[#0d0f17] border border-[#23273b] text-[10px] font-mono text-gray-400">
                OWASP ASVS L2
              </span>
              <span className="px-2.5 py-1 rounded bg-[#0d0f17] border border-[#23273b] text-[10px] font-mono text-gray-400">
                WebAuthn FIDO2
              </span>
              <span className="px-2.5 py-1 rounded bg-[#0d0f17] border border-[#23273b] text-[10px] font-mono text-gray-400">
                LiveKit WebRTC E2EE
              </span>
            </div>
            <div className="pt-2">
              <TrustpilotBadge locale={currentLocale} variant="mini" />
            </div>
          </div>

          {/* Column: Platform */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">
              {translations.platform}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog" className="hover:text-white transition-colors">
                  {translations.platformCatalog || "Commodities Catalog"}
                </Link>
              </li>
              <li>
                <Link href="/broker" className="hover:text-white transition-colors">
                  {translations.platformBroker || "Broker Command Center"}
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="hover:text-white transition-colors">
                  {translations.platformCompliance || "KYC/KYB Verification"}
                </Link>
              </li>
              <li>
                <Link href="/billing" className="hover:text-white transition-colors">
                  {translations.platformBilling || "Subscriptions & Invoicing"}
                </Link>
              </li>
              <li>
                <Link href="/settings/security" className="hover:text-white transition-colors">
                  {translations.platformSecurity || "Passkeys & Active Sessions"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Compliance & Legal */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase">
              {translations.legal}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/legal/ncnda" className="hover:text-white transition-colors">
                  {translations.legalNcnda || "NCNDA & Non-Circumvention"}
                </Link>
              </li>
              <li>
                <Link href="/legal/brokerage" className="hover:text-white transition-colors">
                  {translations.legalBrokerage || "Brokerage & Commissions"}
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-white transition-colors">
                  {translations.termsOfService}
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy" className="hover:text-white transition-colors">
                  {translations.privacyPolicy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: 8 Languages Quick Switcher */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#d4956b]" />
              <span>{translations.languagesTitle || "Languages"}</span>
            </h4>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`text-left rtl:text-right py-1 px-1.5 rounded transition-colors ${
                    lang.code === currentLocale
                      ? "text-[#d4956b] font-bold bg-[#141724]"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="mr-1.5 rtl:ml-1.5">{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Official Trustpilot Verified Ratings & Reviews Showcase Banner */}
        <div className="pt-10">
          <TrustpilotBadge locale={currentLocale} variant="card" />
        </div>

        {/* Accepted Payment & Settlement Methods Strip (World-Class B2B & Retail Badges) */}
        <div className="pt-6 pb-4">
          <PaymentMethodsStrip locale={currentLocale} />
        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>{translations.rights.replace("{year}", new Date().getFullYear().toString())}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>{translations.badgeUsd || "USD Benchmark Settlement"}</span>
            <span>•</span>
            <span>{translations.badgeBanks || "Independent Banking Channels"}</span>
            <span>•</span>
            <span className="text-[#d4956b]">{translations.badgeVerified || "Verified International Brokerage"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
