"use client";

import React from "react";
import Image from "next/image";
import { ShieldCheck, Lock, Landmark, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrustpilotBadge } from "./trustpilot-badge";

interface PaymentMethodsStripProps {
  locale?: string;
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
}

const PAYMENT_CARDS = [
  { id: "visa", name: "Visa", src: "/images/payments/visa.svg", width: 80, height: 48 },
  { id: "mastercard", name: "Mastercard", src: "/images/payments/mastercard.svg", width: 80, height: 48 },
  { id: "amex", name: "American Express", src: "/images/payments/amex.svg", width: 80, height: 48 },
  { id: "apple-pay", name: "Apple Pay", src: "/images/payments/apple-pay.svg", width: 80, height: 48 },
  { id: "google-pay", name: "Google Pay", src: "/images/payments/google-pay.svg", width: 80, height: 48 },
  { id: "discover", name: "Discover", src: "/images/payments/discover.svg", width: 84, height: 48 },
  { id: "swift-sepa", name: "SWIFT & SEPA Wire", src: "/images/payments/swift-sepa.svg", width: 110, height: 48 },
  { id: "lemon-squeezy", name: "Lemon Squeezy (Merchant of Record)", src: "/images/payments/lemon-squeezy.svg", width: 160, height: 48 },
];

const SETTLEMENT_BADGES = [
  { id: "dlc", name: "Documentary LC / SBLC", src: "/images/payments/dlc-letter-credit.svg", width: 160, height: 48 },
  { id: "ssl", name: "256-Bit SSL Encryption", src: "/images/payments/ssl-encryption.svg", width: 150, height: 48 },
];

export function PaymentMethodsStrip({
  locale = "en",
  className,
  showTitle = true,
  compact = false,
}: PaymentMethodsStripProps) {
  const isAr = locale === "ar";
  const isFr = locale === "fr";

  return (
    <div
      className={cn(
        "w-full rounded-2xl bg-[#0c0e17] border border-[#23273b] p-5 sm:p-6 backdrop-blur-sm shadow-md transition-colors",
        className
      )}
    >
      {showTitle && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#23273b]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-xs sm:text-sm font-bold text-white [html.light_&]:text-slate-900 tracking-wide flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#d4956b]" />
                <span>
                  {isAr
                    ? "طرق الدفع والاشتراك الإلكتروني والتسوية المصرفية المعتمدة"
                    : isFr
                    ? "Moyens de paiement acceptés & règlement bancaire sécurisé"
                    : "Accepted Payment Methods & Secure Banking Channels"}
                </span>
              </h3>
            </div>
            <p className="text-[11px] text-gray-400 [html.light_&]:text-slate-600">
              {isAr
                ? "بوابات دفع مشفرة 256-Bit SSL • متوافق مع معايير PCI-DSS المستوى الأول • تسوية بضائع مباشرة بنك-إلى-بنك"
                : isFr
                ? "Traitement crypté SSL 256 bits • Conforme PCI-DSS Niveau 1 • Règlement cargaisons de banque à banque"
                : "256-Bit SSL Encrypted Processing • PCI-DSS Level 1 Certified • Direct Bank-to-Bank Cargo Clearing"}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <TrustpilotBadge locale={locale} variant="mini" />
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 [html.light_&]:text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>
                {isAr ? "دفع آمن 100% ومحمي" : "100% Secure Checkout"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Logos Strip Grid */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Consumer & Corporate Cards & Wallets */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 [html.light_&]:text-slate-500 block">
            {isAr
              ? "الاشتراكات وحسابات التداول (Cards & Digital Wallets):"
              : isFr
              ? "Abonnements et comptes (Cartes & Portefeuilles numériques) :"
              : "Subscriptions & Trading Accounts (Cards & Digital Wallets):"}
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            {PAYMENT_CARDS.map((card) => (
              <div
                key={card.id}
                title={card.name}
                className="group relative transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#b87333]/20 rounded-xl overflow-hidden shrink-0 border border-slate-200/80 dark:border-transparent [html.light_&]:border-slate-300"
              >
                <Image
                  src={card.src}
                  alt={card.name}
                  width={card.width}
                  height={card.height}
                  className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Commodity Cargo Settlement & Security Badges */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400 [html.light_&]:text-slate-500 block font-semibold">
            {isAr
              ? "تسوية الشحنات والضمانات المصرفية (Institutional Escrow):"
              : isFr
              ? "Règlement cargaisons et garanties bancaires :"
              : "Cargo Title Settlement & Banking Security:"}
          </span>
          <div className="flex flex-wrap items-center gap-2.5">
            {SETTLEMENT_BADGES.map((badge) => (
              <div
                key={badge.id}
                title={badge.name}
                className="group relative transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/20 rounded-xl overflow-hidden shrink-0 border border-slate-200/80 dark:border-transparent [html.light_&]:border-slate-300"
              >
                <Image
                  src={badge.src}
                  alt={badge.name}
                  width={badge.width}
                  height={badge.height}
                  className="h-10 sm:h-11 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Micro-Notices */}
      <div className="mt-4 pt-3 border-t border-[#23273b] flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-400 [html.light_&]:text-slate-500 font-mono">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1 text-gray-300 [html.light_&]:text-slate-700">
            <CheckCircle2 className="w-3 h-3 text-[#d4956b]" />
            <span>{isAr ? "الاشتراكات مُعالجة رسمياً عبر Lemon Squeezy" : "Subscriptions Processed via Lemon Squeezy"}</span>
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 text-gray-300 [html.light_&]:text-slate-700">
            <Landmark className="w-3 h-3 text-emerald-400" />
            <span>{isAr ? "تسوية البضائع عبر اعتمادات مستندية (DLC / SBLC)" : "Cargo Clearing via Irrevocable DLC / SBLC"}</span>
          </span>
        </div>

        <div className="text-gray-400 [html.light_&]:text-slate-500">
          {isAr
            ? "حماية بموجب عقد ICC Model 769 • المركز السويسري للتحكيم الدولي (جنيف)"
            : "Governed by ICC Model Contract 769 • Swiss Arbitration Centre (Geneva)"}
        </div>
      </div>
    </div>
  );
}
