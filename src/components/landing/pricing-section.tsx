"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { Check, Sparkles, ArrowRight, ShieldCheck, Landmark, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PLATFORM_PRICING_PLANS,
  BROKERAGE_COMMISSION_POLICY,
  SALES_CONTACT_EMAIL,
} from "@/lib/pricing-data";

interface PricingSectionProps {
  locale?: string;
  translations: {
    title: string;
    subtitle: string;
    monthly: string;
    annually: string;
    save: string;
    perMonth: string;
    perYear: string;
    upgrade: string;
    contactSales: string;
    registerFree?: string;
    getStarted?: string;
    usdHeader?: string;
    note?: string;
    savePercent?: string;
    recommended?: string;
    usdCurrency?: string;
    starter: { name: string; description: string; features: string[] };
    professional: { name: string; description: string; features: string[] };
    enterprise: { name: string; description: string; features: string[] };
  };
}

interface SettlementLocaleContent {
  badgeRate: string;
  title: string;
  description: string;
  governance: string;
  readPolicy: string;
  seatsLabel: (seats: number) => string;
  perMonthAnnualEquiv: string;
  billedAnnuallyText: (total: number) => string;
  saveAnnuallyText: (savings: number) => string;
  billedMonthlyNote: string;
  freePlanNote: string;
}

const SETTLEMENT_LOCALES: Record<string, SettlementLocaleContent> = {
  fr: {
    badgeRate: "Taux de courtage indépendant par transaction : 0,50 % - 1,50 %",
    title: "Avis de règlement non-dépositaire des matières premières physiques",
    description:
      "VALOREA MARKET ne détient ni ne compense les fonds d'achat des cargaisons de matières premières physiques. La valeur des marchandises est réglée directement de banque à banque via lettre de crédit documentaire (DLC / SBLC). La plateforme facture uniquement l'accès aux adhésions et les commissions de courtage de transaction au succès. Le barème standard de 1,25 % s'applique aux expéditions uniques Professionnel, dégressif jusqu'à 0,50 % pour les contrats Entreprise récurrents à fort volume.",
    governance:
      "Régie par le modèle de contrat 769 de la CCI (NCNDA) • Indemnités forfaitaires pour contournement : 3x la commission totale anticipée de courtage (CCI 769) • Centre d'arbitrage suisse, Genève",
    readPolicy: "Consulter la politique de courtage",
    seatsLabel: (s) => (s === 1 ? "1 poste de négociation" : `${s} postes de négociation`),
    perMonthAnnualEquiv: "USD / mois (équivalent annuel)",
    billedAnnuallyText: (total) => `${total.toLocaleString()} $ facturé annuellement`,
    saveAnnuallyText: (savings) => `Économisez ${savings.toLocaleString()} $/an`,
    billedMonthlyNote: "Abonnement mensuel • Résiliation à tout moment",
    freePlanNote: "Gratuit pour les participants de marché vérifiés",
  },
  ar: {
    badgeRate: "عمولة الوساطة المؤسسية المستقلة: 0.50% - 1.50%",
    title: "تسوية الشحنات المصرفية المباشرة غير الإيداعية",
    description:
      "تنبيه هام: VALOREA MARKET وسيط تقني وتنظيمي ولا يستقبل أو يحتفظ بأموال شراء البضائع المادية إطلاقاً. تتم تسوية الشحنات المادية حصرياً بين بنوك المشتري والمورد مباشرة عبر اعتمادات مستندية (DLC / SBLC). تُفوتر المنصة فقط رسوم الوصول وعمولات الوساطة عند إتمام الشحن. النسبة 1.25% هي العمولة القياسية التقديرية للشحنات المفردة بالخطة الاحترافية، وتصل إلى 0.50% للشحنات المؤسسية الكبرى والمتكررة.",
    governance:
      "خاضع لنموذج ICC 769 • تعويضات الالتفاف الاتفاقية: 3 أضعاف العمولة • اختصاص تحكيم جنيف، سويسرا",
    readPolicy: "قراءة سياسة الوساطة والتسوية",
    seatsLabel: (s) => (s === 1 ? "مقعد تداول واحد" : `${s} مقاعد تداول`),
    perMonthAnnualEquiv: "دولار / شهر (مكافئ سنوي)",
    billedAnnuallyText: (total) => `$${total.toLocaleString()} دولار يُدفع سنوياً`,
    saveAnnuallyText: (savings) => `وفر $${savings.toLocaleString()} سنوياً`,
    billedMonthlyNote: "اشتراك شهري • إلغاء في أي وقت",
    freePlanNote: "مجاني للمشاركين المعتمدين في السوق",
  },
  en: {
    badgeRate: "Independent Transaction Brokerage Rate: 0.50% - 1.50%",
    title: "Non-Custodial Physical Commodity Settlement Notice",
    description:
      "VALOREA MARKET does not hold or clear purchase funds for physical commodity shipments. Cargo value is settled directly bank-to-bank via Documentary Letters of Credit (DLC / SBLC). The platform invoices only for membership access and success-based transaction brokerage fees. The 1.25% standard benchmark applies to single Professional shipments, tiered down to 0.50% for recurring high-volume Enterprise contracts.",
    governance:
      "Governed by ICC Model Contract 769 (NCNDA) • Liquidated circumvention damages: 3x total anticipated brokerage commission (ICC 769) • Swiss Arbitration Centre, Geneva",
    readPolicy: "Read Brokerage Policy",
    seatsLabel: (s) => `${s} ${s === 1 ? "Seat" : "Seats"}`,
    perMonthAnnualEquiv: "USD / month (annual equivalent)",
    billedAnnuallyText: (total) => `$${total.toLocaleString()} billed annually`,
    saveAnnuallyText: (savings) => `Save $${savings.toLocaleString()}/yr`,
    billedMonthlyNote: "Billed monthly • Cancel anytime",
    freePlanNote: "Free for verified market participants",
  },
  es: {
    badgeRate: "Tasa de corretaje independiente por transacción: 0.50% - 1.50%",
    title: "Aviso de liquidación no custodia de materias primas físicas",
    description:
      "VALOREA MARKET no retiene ni liquida fondos de compra para cargamentos de materias primas físicas. El valor de la carga se liquida directamente de banco a banco mediante cartas de crédito documentarias (DLC / SBLC). La plataforma factura únicamente el acceso a membresías y las comisiones de corretaje de transacciones basadas en el éxito. La referencia estándar del 1.25% se aplica a envíos individuales Profesionales, reduciéndose hasta el 0.50% para contratos Enterprise recurrentes de alto volumen.",
    governance:
      "Regido por el contrato modelo 769 de la CCI (NCNDA) • Daños y perjuicios liquidados por elusión: 3x la comisión total de corretaje prevista (CCI 769) • Centro Suizo de Arbitraje, Ginebra",
    readPolicy: "Leer política de corretaje",
    seatsLabel: (s) => (s === 1 ? "1 puesto de negociación" : `${s} puestos de negociación`),
    perMonthAnnualEquiv: "USD / mes (equiv. anual)",
    billedAnnuallyText: (total) => `$${total.toLocaleString()} facturado anualmente`,
    saveAnnuallyText: (savings) => `Ahorra $${savings.toLocaleString()}/año`,
    billedMonthlyNote: "Facturado mensualmente • Cancela en cualquier momento",
    freePlanNote: "Gratis para participantes de mercado verificados",
  },
  de: {
    badgeRate: "Unabhängiger Transaktions-Maklersatz: 0,50 % - 1,50 %",
    title: "Hinweis zur verwahrungsfreien Abwicklung physischer Rohstoffe",
    description:
      "VALOREA MARKET hält oder verwahrt keine Kaufgelder für physische Rohstofflieferungen. Der Frachtwert wird direkt von Bank zu Bank über Dokumentenakkreditive (DLC / SBLC) abgewickelt. Die Plattform stellt lediglich Mitgliedschaften und erfolgsbasierte Transaktions-Maklergebühren in Rechnung. Der Standard-Richtsatz von 1,25 % gilt für einzelne Professional-Lieferungen und sinkt auf 0,50 % für wiederkehrende Enterprise-Großverträge.",
    governance:
      "Unterliegt dem ICC-Modellvertrag 769 (NCNDA) • Pauschalierter Schadenersatz bei Umgehung: 3x gesamte erwartete Maklerprovision (ICC 769) • Swiss Arbitration Centre, Genf",
    readPolicy: "Maklerrichtlinie lesen",
    seatsLabel: (s) => (s === 1 ? "1 Handelsplatz" : `${s} Handelsplätze`),
    perMonthAnnualEquiv: "USD / Monat (Jahresäquivalent)",
    billedAnnuallyText: (total) => `$${total.toLocaleString()} jährlich abgerechnet`,
    saveAnnuallyText: (savings) => `Sparen Sie $${savings.toLocaleString()}/Jahr`,
    billedMonthlyNote: "Monatlich abgerechnet • Jederzeit kündbar",
    freePlanNote: "Kostenlos für verifizierte Marktteilnehmer",
  },
  zh: {
    badgeRate: "独立交易经纪费率：0.50% - 1.50%",
    title: "非托管大宗实物商品结算须知",
    description:
      "VALOREA MARKET 不持有亦不清算任何大宗实物商品货款。货款直接通过银行间跟单信用证（DLC / SBLC）点对点结算。平台仅收取企业会员费及基于成功交付的交易经纪费。1.25% 的基准费率适用于单笔专业版货物，针对高频次大交易量企业合同可递减至 0.50%。",
    governance:
      "受国际商会 ICC 769 示范合同（NCNDA）管辖 • 反规避违约赔偿金：预估总经纪佣金的 3 倍（ICC 769）• 瑞士日内瓦仲裁中心",
    readPolicy: "阅读经纪与结算政策",
    seatsLabel: (s) => `${s} 个交易席位`,
    perMonthAnnualEquiv: "美元 / 月（年付等效）",
    billedAnnuallyText: (total) => `每年结算 $${total.toLocaleString()} 美元`,
    saveAnnuallyText: (savings) => `每年节省 $${savings.toLocaleString()} 美元`,
    billedMonthlyNote: "按月结算 • 随时取消",
    freePlanNote: "对已认证市场参与者免费",
  },
  ja: {
    badgeRate: "独立取引仲介手数料率：0.50% - 1.50%",
    title: "非保管型（ノンカストディアル）実物コモディティ決済通知",
    description:
      "VALOREA MARKET は実物コモディティ貨物の購入代金を保管または決済しません。貨物代金は荷為替信用状（DLC / SBLC）を介して銀行間直接で決済されます。当プラットフォームは会員アクセス料および成約ベースの取引仲介手数料のみを請求します。標準基準1.25%はプロフェッショナル単発出荷に適用され、反復的な大口エンタープライズ契約では0.50%まで段階的に引き下げられます。`",
    governance:
      "国際商業会議所（ICC）モデル契約769（NCNDA）に準拠 • 迂回違反違約金：見込み仲介手数料総額の3倍（ICC 769）• スイス仲裁センター（ジュネーブ）",
    readPolicy: "仲介ポリシーを確認",
    seatsLabel: (s) => `${s} 取引シート`,
    perMonthAnnualEquiv: "USD / 月（年間換算）",
    billedAnnuallyText: (total) => `年額 $${total.toLocaleString()} の請求`,
    saveAnnuallyText: (savings) => `年間 $${savings.toLocaleString()} を節約`,
    billedMonthlyNote: "月額課金 • いつでも解約可能",
    freePlanNote: "認証済み市場参加者は無料",
  },
  ru: {
    badgeRate: "Ставка независимой транзакционной комиссии брокера: 0,50% - 1,50%",
    title: "Уведомление о некастодиальных расчетах по физическим сырьевым товарам",
    description:
      "VALOREA MARKET не удерживает и не клирингует средства для оплаты физических партий сырьевых товаров. Стоимость груза рассчитывается напрямую между банками через документарные аккредитивы (DLC / SBLC). Платформа выставляет счета только за членство и брокерскую комиссию по результатам сделки. Стандартная ставка 1,25% применяется к разовым поставкам уровня Professional и снижается до 0,50% для регулярных крупных контрактов Enterprise.",
    governance:
      "Регулируется типовым контрактом ICC 769 (NCNDA) • Заранее оцененные убытки за обход: 3-кратный размер ожидаемой комиссии брокера (ICC 769) • Швейцарский арбитражный центр, Женева",
    readPolicy: "Ознакомиться с регламентом брокерских услуг",
    seatsLabel: (s) => `${s} ${s === 1 ? "торговое место" : "торговых мест"}`,
    perMonthAnnualEquiv: "USD / мес (эквив. в год)",
    billedAnnuallyText: (total) => `$${total.toLocaleString()} оплачивается ежегодно`,
    saveAnnuallyText: (savings) => `Экономия $${savings.toLocaleString()}/год`,
    billedMonthlyNote: "Ежемесячная оплата • Отмена в любое время",
    freePlanNote: "Бесплатно для проверенных участников рынка",
  },
};

export function PricingSection({ locale = "en", translations }: PricingSectionProps) {
  const langKey = (locale || "en").toLowerCase().split("-")[0];
  const l10n = SETTLEMENT_LOCALES[langKey] || SETTLEMENT_LOCALES.en;

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "annually"
  );

  const plans = [
    {
      ...PLATFORM_PRICING_PLANS[0],
      name: translations.starter.name,
      description: translations.starter.description,
      features: translations.starter.features,
      isPopular: false,
      isExternal: false,
      cta: translations.registerFree || "Register Free",
      href: "/auth/register",
    },
    {
      ...PLATFORM_PRICING_PLANS[1],
      name: translations.professional.name,
      description: translations.professional.description,
      features: translations.professional.features,
      isPopular: true,
      isExternal: false,
      cta: translations.getStarted || "Get Started",
      href: "/auth/register",
    },
    {
      ...PLATFORM_PRICING_PLANS[2],
      name: translations.enterprise.name,
      description: translations.enterprise.description,
      features: translations.enterprise.features,
      isPopular: false,
      cta: translations.contactSales,
      href: `mailto:${SALES_CONTACT_EMAIL}?subject=VALOREA%20MARKET%20Enterprise%20Commodity%20Desk%20Inquiry`,
      isExternal: true,
    },
  ];

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121420] border border-[#23273b] text-xs font-mono text-[#d4956b] mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{translations.usdHeader || "USD Denominated • Corporate Membership & Non-Custodial Brokerage"}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {translations.title}
        </h2>
        <p className="mt-4 text-base sm:text-lg text-gray-400">
          {translations.subtitle}
        </p>

        {/* Billing Cycle Switcher */}
        <div className="mt-8 inline-flex items-center p-1 rounded-2xl bg-[#0e1017] border border-[#23273b]">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all",
              billingCycle === "monthly"
                ? "bg-[#181b29] text-white shadow"
                : "text-gray-400 hover:text-white"
            )}
          >
            {translations.monthly}
          </button>
          <button
            onClick={() => setBillingCycle("annually")}
            className={cn(
              "px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2",
              billingCycle === "annually"
                ? "bg-[#b87333] text-white shadow-lg shadow-[#b87333]/25"
                : "text-gray-400 hover:text-white"
            )}
          >
            <span>{translations.annually}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] text-white font-mono uppercase">
              {translations.savePercent || "Save 20%"}
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {plans.map((plan) => {
          const displayPrice =
            billingCycle === "monthly"
              ? plan.priceMonthly
              : plan.priceAnnuallyMonthlyEquivalent;

          return (
            <div
              key={plan.id}
              className={cn(
                "rounded-3xl p-8 flex flex-col justify-between transition-all relative",
                plan.isPopular
                  ? "bg-[#0e111a] border-2 border-[#b87333] shadow-2xl shadow-[#b87333]/15 lg:-translate-y-2"
                  : "bg-[#0c0e17] border border-[#23273b] hover:border-[#383d5a]"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#b87333] to-[#c9a961] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3" /> {translations.recommended || "Recommended"}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <span className="text-[11px] font-mono text-gray-400 px-2 py-0.5 rounded bg-[#161824] border border-[#23273b]">
                    {l10n.seatsLabel(plan.seats)}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-2 min-h-[32px]">
                  {plan.description}
                </p>

                {/* Price Display in USD */}
                <div className="mt-6 flex flex-col">
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="text-sm font-semibold text-[#d4956b]">
                      {translations.usdCurrency || "USD"}
                    </span>
                    <span className="text-4xl font-extrabold text-white">
                      ${displayPrice}
                    </span>
                    <span className="text-xs text-gray-400 font-sans">
                      {billingCycle === "monthly" ? translations.perMonth : l10n.perMonthAnnualEquiv}
                    </span>
                  </div>

                  {/* Full Annual Amount Due */}
                  {billingCycle === "annually" && plan.annualBilledTotal > 0 && (
                    <div className="mt-1.5 text-xs text-[#d4956b] font-mono flex items-center gap-1.5 flex-wrap">
                      <span>
                        {l10n.billedAnnuallyText(plan.annualBilledTotal)}
                      </span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                        {l10n.saveAnnuallyText(plan.annualSavingsUsd)}
                      </span>
                    </div>
                  )}
                  {billingCycle === "monthly" && plan.priceMonthly > 0 && (
                    <div className="mt-1.5 text-xs text-gray-500 font-mono">
                      {l10n.billedMonthlyNote}
                    </div>
                  )}
                  {plan.priceMonthly === 0 && (
                    <div className="mt-1.5 text-xs text-emerald-400 font-mono">
                      {l10n.freePlanNote}
                    </div>
                  )}
                </div>

                {/* Feature List */}
                <div className="mt-8 space-y-3">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3 text-xs sm:text-sm">
                      <div className="p-0.5 rounded-full bg-[#1b1f2e] text-[#d4956b] shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plan Action CTA */}
              <div className="mt-10 pt-6 border-t border-[#1f2233]">
                {plan.isExternal ? (
                  <a
                    href={plan.href}
                    className="w-full py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 bg-[#141724] hover:bg-[#1a1f30] text-gray-200 border border-[#23273b] transition-all"
                  >
                    <Mail className="w-4 h-4 text-[#d4956b]" />
                    <span>{plan.cta}</span>
                  </a>
                ) : (
                  <Link
                    href={plan.href}
                    className={cn(
                      "w-full py-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all",
                      plan.isPopular
                        ? "bg-gradient-to-r from-[#b87333] to-[#8b5a2b] hover:from-[#d4956b] hover:to-[#b87333] text-white shadow-lg shadow-[#b87333]/20"
                        : "bg-[#141724] hover:bg-[#1a1f30] text-gray-200 border border-[#23273b]"
                    )}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </Link>
                )}
                <p className="text-[10px] text-gray-500 text-center mt-2.5">
                  {translations.note || "Platform subscription fees billed in USD • Brokerage commissions separate"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Independent Brokerage Commission & Non-Custodial Cargo Settlement Policy Banner */}
      <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-[#0c0e17] border border-[#23273b] shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-start max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121420] border border-[#b87333]/40 text-xs font-mono text-[#d4956b]">
            <Landmark className="w-3.5 h-3.5" />
            <span>{l10n.badgeRate}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            {l10n.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            {l10n.description}
          </p>
          <div className="text-[11px] text-gray-500 font-mono pt-1">
            {l10n.governance}
          </div>
        </div>

        <div className="shrink-0">
          <Link
            href="/legal/brokerage"
            className="px-6 py-3 rounded-xl bg-[#141724] hover:bg-[#1c2133] border border-[#23273b] text-gray-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <span>{l10n.readPolicy}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </section>
  );
}
