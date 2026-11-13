export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "zh-Hans", name: "Chinese (Simplified)", nativeName: "简体中文", flag: "🇨🇳", dir: "ltr" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", dir: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", dir: "ltr" },
];

export const COMMODITY_SECTORS = [
  {
    id: "crude_oil_condensates",
    slug: "crude-oil-condensates",
    titleKey: "crudeOil",
    icon: "Fuel",
    color: "#b87333",
    materialsCount: 14,
    items: [
      { name: "Light Sweet Crude (Brent / WTI)", specs: "API 38-42°, Sulfur < 0.5%" },
      { name: "Medium Sour Crude (Arabian Light)", specs: "API 33-34°, Sulfur 1.8%" },
      { name: "Heavy Sour Crude", specs: "API < 28°, High TAN" },
      { name: "Ultra-Light Condensate", specs: "API 55-65°, Reid Vapour Pressure" },
    ],
  },
  {
    id: "refined_petroleum",
    slug: "refined-petroleum",
    titleKey: "refinedPetroleum",
    icon: "Gauge",
    color: "#d4956b",
    materialsCount: 22,
    items: [
      { name: "Ultra-Low Sulfur Diesel (EN 590)", specs: "10 PPM Max, Euro 5 / 6" },
      { name: "Aviation Kerosene (Jet A-1)", specs: "DEF STAN 91-091, ASTM D1655" },
      { name: "Motor Gasoline (RON 95 / 98)", specs: "Euro 6, Oxygenates < 2.7%" },
      { name: "Heavy Fuel Oil (VLSFO 0.5%)", specs: "IMO 2020 Compliant, ISO 8217" },
    ],
  },
  {
    id: "natural_gas_ngls",
    slug: "natural-gas-ngls",
    titleKey: "naturalGas",
    icon: "Flame",
    color: "#38bdf8",
    materialsCount: 9,
    items: [
      { name: "Liquefied Natural Gas (LNG)", specs: "95%+ Methane, -162°C Cryogenic" },
      { name: "Liquefied Petroleum Gas (LPG)", specs: "Propane 70% / Butane 30% Commercial Mix" },
      { name: "Pure Ethane & Ethylene Grade", specs: "Purity 99.5% Min" },
      { name: "Natural Gasoline (Pentanes Plus)", specs: "RVP 10-14 psi" },
    ],
  },
  {
    id: "petrochemicals",
    slug: "petrochemicals",
    titleKey: "petrochemicals",
    icon: "Atom",
    color: "#a855f7",
    materialsCount: 18,
    items: [
      { name: "Polyethylene (HDPE / LDPE / LLDPE)", specs: "Film / Blow Molding, MFI 0.05-20" },
      { name: "Polypropylene (PP Homopolymer)", specs: "Raffia / Injection, Melt Flow 3-12" },
      { name: "Methanol (Chemical Grade AA)", specs: "Purity 99.85% Min, ASTM D1152" },
      { name: "Monoethylene Glycol (MEG)", specs: "Fiber Grade 99.9% Purity" },
    ],
  },
  {
    id: "sulfur_fertilizers",
    slug: "sulfur-fertilizers",
    titleKey: "sulfurFertilizers",
    icon: "Sprout",
    color: "#eab308",
    materialsCount: 12,
    items: [
      { name: "Granular Urea 46% N", specs: "Biuret 1.0% Max, Moisture 0.5% Max" },
      { name: "Prilled Urea (Technical & Agro)", specs: "Biuret 0.8% Max, Formaldehyde treated" },
      { name: "Granular Sulfur (Bright Yellow)", specs: "Purity 99.5% Min, Ash 0.05% Max" },
      { name: "Diammonium Phosphate (DAP 18-46-0)", specs: "Total Nitrogen 18%, P2O5 46%" },
    ],
  },
  {
    id: "metals_industrial",
    slug: "metals-industrial",
    titleKey: "metalsIndustrial",
    icon: "Coins",
    color: "#c9a961",
    materialsCount: 35,
    items: [
      { name: "Copper Cathodes Grade A", specs: "Purity 99.9935% Cu, LME Registered" },
      { name: "Refined Cobalt Metal (Cathode / Briquettes)", specs: "Purity 99.8% Min, Low Nickel" },
      { name: "Primary Aluminium Ingots (P1020A)", specs: "Al 99.7% Min, High Electrical Purity" },
      { name: "Battery-Grade Lithium Hydroxide / Carbonate", specs: "LiOH.H2O 56.5% Min, Fe < 5ppm" },
    ],
  },
  {
    id: "sugar",
    slug: "sugar",
    titleKey: "sugar",
    icon: "Package",
    color: "#f43f5e",
    materialsCount: 6,
    items: [
      { name: "Refined White Sugar ICUMSA 45", specs: "Polarization 99.80% Min, Ash 0.04% Max" },
      { name: "Raw Centrifugal Sugar VHP", specs: "Polarization 99.20-99.50% Min, ICUMSA 600-1200" },
      { name: "Cane Molasses & Beet Molasses", specs: "Brix 80° Min, Total Sugars 48%+" },
      { name: "Direct White Sugar ICUMSA 100/150", specs: "Moisture 0.08% Max" },
    ],
  },
];

export const INCOTERMS = [
  "EXW", "FCA", "FAS", "FOB", "CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"
];

export const SECTOR_TITLE_TRANSLATIONS: Record<string, Record<string, string>> = {
  ar: {
    crudeOil: "النفط الخام والمكثفات",
    refinedPetroleum: "المنتجات النفطية المكررة",
    naturalGas: "الغاز الطبيعي وسوائله",
    petrochemicals: "البتروكيماويات",
    sulfurFertilizers: "الكبريت والأسمدة",
    metalsIndustrial: "المعادن والمواد الصناعية",
    sugar: "السكر",
  },
  en: {
    crudeOil: "Crude Oil & Condensates",
    refinedPetroleum: "Refined Petroleum Products",
    naturalGas: "Natural Gas & NGLs",
    petrochemicals: "Petrochemicals",
    sulfurFertilizers: "Sulfur & Fertilizers",
    metalsIndustrial: "Metals & Industrial Materials",
    sugar: "Sugar",
  },
  fr: {
    crudeOil: "Pétrole Brut et Condensats",
    refinedPetroleum: "Produits Pétroliers Raffinés",
    naturalGas: "Gaz Naturel et LGN",
    petrochemicals: "Pétrochimie",
    sulfurFertilizers: "Soufre et Engrais",
    metalsIndustrial: "Métaux et Matériaux Industriels",
    sugar: "Sucre",
  },
  es: {
    crudeOil: "Petróleo Crudo y Condensados",
    refinedPetroleum: "Productos Petrolíferos Refinados",
    naturalGas: "Gas Natural y LGN",
    petrochemicals: "Petroquímica",
    sulfurFertilizers: "Azufre y Fertilizantes",
    metalsIndustrial: "Metales y Materiales Industriales",
    sugar: "Azúcar",
  },
  "zh-Hans": {
    crudeOil: "原油与凝析油",
    refinedPetroleum: "成品油与精炼产品",
    naturalGas: "天然气及液化气",
    petrochemicals: "石化产品",
    sulfurFertilizers: "硫磺与化肥",
    metalsIndustrial: "金属与工业原料",
    sugar: "食糖",
  },
  ja: {
    crudeOil: "原油およびコンデンセート",
    refinedPetroleum: "石油精製製品",
    naturalGas: "天然ガスおよびNGL",
    petrochemicals: "石油化学製品",
    sulfurFertilizers: "硫黄および肥料",
    metalsIndustrial: "金属および工業原料",
    sugar: "砂糖",
  },
  de: {
    crudeOil: "Rohöl und Kondensate",
    refinedPetroleum: "Raffinierte Erdölprodukte",
    naturalGas: "Erdgas und NGLs",
    petrochemicals: "Petrochemikalien",
    sulfurFertilizers: "Schwefel und Düngemittel",
    metalsIndustrial: "Metalle und Industriematerialien",
    sugar: "Zucker",
  },
  ru: {
    crudeOil: "Сырая нефть и газовый конденсат",
    refinedPetroleum: "Нефтепродукты переработки",
    naturalGas: "Природный газ и ШФЛУ",
    petrochemicals: "Нефтехимия",
    sulfurFertilizers: "Сера и удобрения",
    metalsIndustrial: "Металлы и промышленные материалы",
    sugar: "Сахар",
  },
};

export const COMMODITY_ITEM_TRANSLATIONS: Record<string, Record<string, string>> = {
  ar: {
    "Light Sweet Crude (Brent / WTI)": "النفط الخام الخفيف الحلو (برنت / غرب تكساس)",
    "Medium Sour Crude (Arabian Light)": "النفط الخام المتوسط عالي الكبريت (العربي الخفيف)",
    "Heavy Sour Crude": "النفط الخام الثقيل عالي الكبريت",
    "Ultra-Light Condensate": "المكثفات فائقة الخفة",
    "Ultra-Low Sulfur Diesel (EN 590)": "ديزل منخفض الكبريت للغاية (EN 590)",
    "Aviation Kerosene (Jet A-1)": "كيروسين وقود الطيران (Jet A-1)",
    "Motor Gasoline (RON 95 / 98)": "بنزين سيارات ممتاز (RON 95 / 98)",
    "Heavy Fuel Oil (VLSFO 0.5%)": "زيت الوقود الثقيل منخفض الكبريت (VLSFO 0.5%)",
    "Liquefied Natural Gas (LNG)": "الغاز الطبيعي المسال (LNG)",
    "Liquefied Petroleum Gas (LPG)": "غاز البترول المسال (LPG)",
    "Pure Ethane & Ethylene Grade": "إيثان وإيثيلين عالي النقاوة",
    "Natural Gasoline (Pentanes Plus)": "بنزين طبيعي (بنتان بلس C5+)",
    "Polyethylene (HDPE / LDPE / LLDPE)": "بولي إيثيلين (HDPE / LDPE / LLDPE)",
    "Polypropylene (PP Homopolymer)": "بولي بروبيلين (بوليمر متجانس)",
    "Methanol (Chemical Grade AA)": "ميثانول (درجة كيميائية نقية AA)",
    "Monoethylene Glycol (MEG)": "أحادي إيثيلين جليكول (MEG)",
    "Granular Urea 46% N": "يوريا محببة 46% نيتروجين",
    "Prilled Urea (Technical & Agro)": "يوريا بريل (صناعية وزراعية)",
    "Granular Sulfur (Bright Yellow)": "كبريت محبب (أصفر ناصع)",
    "Diammonium Phosphate (DAP 18-46-0)": "فوسفات ثنائي الأمونيوم (DAP 18-46-0)",
    "Copper Cathodes Grade A": "كاثودات نحاس الدرجة A (نقاء 99.99%)",
    "Refined Cobalt Metal (Cathode / Briquettes)": "معدن الكوبالت المكرر (كاثودات / قوالب)",
    "Primary Aluminium Ingots (P1020A)": "سبائك الألومنيوم الأولية (P1020A)",
    "Battery-Grade Lithium Hydroxide / Carbonate": "هيدروكسيد وكربونات الليثيوم للبطاريات",
    "Refined White Sugar ICUMSA 45": "سكر أبيض مكرر (ICUMSA 45)",
    "Raw Centrifugal Sugar VHP": "سكر خام طرد مركزي (VHP صب)",
    "Cane Molasses & Beet Molasses": "دبس قصب السكر والشمندر",
    "Direct White Sugar ICUMSA 100/150": "سكر أبيض مباشر (ICUMSA 100/150)",
  },
  fr: {
    "Light Sweet Crude (Brent / WTI)": "Pétrole Brut Léger non corrosif (Brent / WTI)",
    "Medium Sour Crude (Arabian Light)": "Pétrole Brut Moyen Soufré (Arabian Light)",
    "Heavy Sour Crude": "Pétrole Brut Lourd Soufré",
    "Ultra-Light Condensate": "Condensat Ultra-Léger",
    "Ultra-Low Sulfur Diesel (EN 590)": "Gazole à Très Faible Teneur en Soufre (EN 590)",
    "Aviation Kerosene (Jet A-1)": "Kérosène d'Aviation (Jet A-1)",
    "Motor Gasoline (RON 95 / 98)": "Essence Moteur (RON 95 / 98)",
    "Heavy Fuel Oil (VLSFO 0.5%)": "Fioul Lourd à Très Basse Teneur en Soufre (VLSFO 0.5%)",
    "Liquefied Natural Gas (LNG)": "Gaz Naturel Liquéfié (GNL)",
    "Liquefied Petroleum Gas (LPG)": "Gaz de Pétrole Liquéfié (GPL)",
    "Pure Ethane & Ethylene Grade": "Éthane et Éthylène de Qualité Pure",
    "Natural Gasoline (Pentanes Plus)": "Essence Naturelle (Pentanes Plus)",
    "Polyethylene (HDPE / LDPE / LLDPE)": "Polyéthylène (PEHD / PEBD / PEBDL)",
    "Polypropylene (PP Homopolymer)": "Polypropylène (Homopolymère PP)",
    "Methanol (Chemical Grade AA)": "Méthanol (Qualité Chimique AA)",
    "Monoethylene Glycol (MEG)": "Monoéthylène Glycol (MEG)",
    "Granular Urea 46% N": "Urée Granulée 46% N",
    "Prilled Urea (Technical & Agro)": "Urée Perlée (Technique & Agricole)",
    "Granular Sulfur (Bright Yellow)": "Soufre Granulé (Jaune Vif)",
    "Diammonium Phosphate (DAP 18-46-0)": "Phosphate Diammonique (DAP 18-46-0)",
    "Copper Cathodes Grade A": "Cathodes de Cuivre Grade A (99,99%)",
    "Refined Cobalt Metal (Cathode / Briquettes)": "Cobalt Métallique Raffiné (Cathodes / Briquettes)",
    "Primary Aluminium Ingots (P1020A)": "Lingots d'Aluminium Primaire (P1020A)",
    "Battery-Grade Lithium Hydroxide / Carbonate": "Hydroxyde & Carbonate de Lithium Qualité Batterie",
    "Refined White Sugar ICUMSA 45": "Sucre Blanc Raffiné (ICUMSA 45)",
    "Raw Centrifugal Sugar VHP": "Sucre Brut Centrifugé (VHP Vrac)",
    "Cane Molasses & Beet Molasses": "Mélasse de Canne & Mélasse de Betterave",
    "Direct White Sugar ICUMSA 100/150": "Sucre Blanc Direct (ICUMSA 100/150)",
  },
};

export function getSectorTitle(titleKey: string, locale: string): string {
  return SECTOR_TITLE_TRANSLATIONS[locale]?.[titleKey] || SECTOR_TITLE_TRANSLATIONS.en[titleKey] || titleKey;
}

export function getCommodityItemName(originalName: string, locale: string): string {
  return COMMODITY_ITEM_TRANSLATIONS[locale]?.[originalName] || originalName;
}
