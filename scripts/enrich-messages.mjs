import fs from "fs";
import path from "path";

const locales = ["ar", "en", "fr", "es", "zh-Hans", "ja", "de", "ru"];

const sectorAdditions = {
  ar: {
    badge: "7 قطاعات سلع موثقة ومطابقة",
    catalogCode: "رمز الكتالوج:",
    usdDenominated: "تسعير بالدولار الأمريكي",
    delivery: "التسليم: FOB / CIF / CFR",
    verifiedSpecs: "مواصفات موثقة ومطابقة",
    benchmarkSpecs: "المواصفات القياسية المعتمدة:",
    coaInspection: "شهادات التحليل وفحص SGS جاهزة",
    usdPerTon: "دولار / طن متري",
    supportedIncoterms: "مصطلحات التجارة الدولية المدعومة (Incoterms):"
  },
  en: {
    badge: "7 Verified Commodity Sectors",
    catalogCode: "Catalog Code:",
    usdDenominated: "USD Denominated",
    delivery: "Delivery: FOB / CIF / CFR",
    verifiedSpecs: "Verified Specs",
    benchmarkSpecs: "Benchmark Specs:",
    coaInspection: "COA & SGS Inspection Ready",
    usdPerTon: "USD / Metric Ton",
    supportedIncoterms: "Supported Incoterms:"
  },
  fr: {
    badge: "7 secteurs de matières premières vérifiés",
    catalogCode: "Code catalogue :",
    usdDenominated: "Libellé en USD",
    delivery: "Livraison : FOB / CIF / CFR",
    verifiedSpecs: "Spécifications vérifiées",
    benchmarkSpecs: "Spécifications de référence :",
    coaInspection: "Certificat d'analyse & inspection SGS prêts",
    usdPerTon: "USD / Tonne métrique",
    supportedIncoterms: "Incoterms supportés :"
  },
  es: {
    badge: "7 sectores de materias primas verificados",
    catalogCode: "Código de catálogo:",
    usdDenominated: "Denominado en USD",
    delivery: "Entrega: FOB / CIF / CFR",
    verifiedSpecs: "Especificaciones verificadas",
    benchmarkSpecs: "Especificaciones de referencia:",
    coaInspection: "COA e inspección SGS listos",
    usdPerTon: "USD / Tonelada métrica",
    supportedIncoterms: "Incoterms admitidos:"
  },
  "zh-Hans": {
    badge: "7大经过验证的大宗商品领域",
    catalogCode: "目录代码：",
    usdDenominated: "美元计价",
    delivery: "交货方式：FOB / CIF / CFR",
    verifiedSpecs: "已验证规格",
    benchmarkSpecs: "基准规格：",
    coaInspection: "COA及SGS检验已就绪",
    usdPerTon: "美元 / 公吨",
    supportedIncoterms: "支持的国际贸易术语："
  },
  ja: {
    badge: "検証済みの7つのコモディティセクター",
    catalogCode: "カタログコード：",
    usdDenominated: "米ドル建",
    delivery: "引渡条件：FOB / CIF / CFR",
    verifiedSpecs: "検証済み仕様",
    benchmarkSpecs: "基準仕様：",
    coaInspection: "COAおよびSGS検査準備完了",
    usdPerTon: "米ドル / メトリックトン",
    supportedIncoterms: "対応インコタームズ："
  },
  de: {
    badge: "7 verifizierte Rohstoffsektoren",
    catalogCode: "Katalogcode:",
    usdDenominated: "In USD denominiert",
    delivery: "Lieferung: FOB / CIF / CFR",
    verifiedSpecs: "Geprüfte Spezifikationen",
    benchmarkSpecs: "Benchmark-Spezifikationen:",
    coaInspection: "COA & SGS-Inspektion bereit",
    usdPerTon: "USD / Metrische Tonne",
    supportedIncoterms: "Unterstützte Incoterms:"
  },
  ru: {
    badge: "7 верифицированных сырьевых секторов",
    catalogCode: "Код каталога:",
    usdDenominated: "Номинировано в USD",
    delivery: "Поставка: FOB / CIF / CFR",
    verifiedSpecs: "Верифицированные характеристики",
    benchmarkSpecs: "Базовые спецификации:",
    coaInspection: "Сертификаты COA и инспекция SGS готовы",
    usdPerTon: "USD / Метрическая тонна",
    supportedIncoterms: "Поддерживаемые Incoterms:"
  }
};

const howItWorksAdditions = {
  ar: { phaseOf: "المرحلة {num} من 04" },
  en: { phaseOf: "Phase {num} of 04" },
  fr: { phaseOf: "Phase {num} sur 04" },
  es: { phaseOf: "Fase {num} de 04" },
  "zh-Hans": { phaseOf: "第 {num} 阶段（共 4 阶段）" },
  ja: { phaseOf: "フェーズ {num} / 04" },
  de: { phaseOf: "Phase {num} von 04" },
  ru: { phaseOf: "Этап {num} из 04" }
};

const pricingAdditions = {
  ar: {
    savePercent: "وفّر 20%",
    recommended: "الخيار الموصى به",
    usdCurrency: "دولار أمريكي",
    usdHeader: "التسعير بالدولار الأمريكي • على مستوى الشركة",
    note: "الاشتراكات بالدولار الأمريكي • عمولات الصفقات منفصلة"
  },
  en: {
    savePercent: "Save 20%",
    recommended: "Recommended",
    usdCurrency: "USD",
    usdHeader: "USD Denominated • Company Level",
    note: "Subscription billed in USD • Brokerage commissions separate"
  },
  fr: {
    savePercent: "Économisez 20%",
    recommended: "Recommandé",
    usdCurrency: "USD",
    usdHeader: "Libellé en USD • Niveau Entreprise",
    note: "Abonnement facturé en USD • Commissions de courtage distinctes"
  },
  es: {
    savePercent: "Ahorre 20%",
    recommended: "Recomendado",
    usdCurrency: "USD",
    usdHeader: "Denominado en USD • Nivel Corporativo",
    note: "Suscripción facturada en USD • Comisiones de corretaje separadas"
  },
  "zh-Hans": {
    savePercent: "立省 20%",
    recommended: "推荐方案",
    usdCurrency: "USD",
    usdHeader: "美元计价 • 企业级别",
    note: "订阅按美元结算 • 经纪佣金按交易单独结算"
  },
  ja: {
    savePercent: "20% 割引",
    recommended: "おすすめ",
    usdCurrency: "USD",
    usdHeader: "米ドル建 • 企業プラン",
    note: "サブスクリプションは米ドル請求 • 取引仲介手数料は別途"
  },
  de: {
    savePercent: "20% sparen",
    recommended: "Empfohlen",
    usdCurrency: "USD",
    usdHeader: "In USD denominiert • Unternehmensebene",
    note: "Abonnement in USD abgerechnet • Vermittlungsprovisionen separat"
  },
  ru: {
    savePercent: "Скидка 20%",
    recommended: "Рекомендуемый",
    usdCurrency: "USD",
    usdHeader: "Номинировано в USD • Корпоративный уровень",
    note: "Подписка тарифицируется в USD • Брокерская комиссия начисляется отдельно"
  }
};

for (const loc of locales) {
  const filePath = path.join(process.cwd(), "src", "messages", `${loc}.json`);
  if (!fs.existsSync(filePath)) continue;
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  data.sectors = { ...data.sectors, ...sectorAdditions[loc] };
  data.howItWorks = { ...data.howItWorks, ...howItWorksAdditions[loc] };
  data.pricing = { ...data.pricing, ...pricingAdditions[loc] };

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Updated messages/${loc}.json`);
}
