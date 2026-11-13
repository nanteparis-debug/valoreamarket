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
