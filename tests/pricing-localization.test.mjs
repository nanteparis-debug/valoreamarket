import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("Pricing Localization: French Settlement Notice and Cards coverage", () => {
  const pricingSectionPath = path.resolve("D:/Utilitaires/gvce/src/components/landing/pricing-section.tsx");
  const content = fs.readFileSync(pricingSectionPath, "utf8");

  // Verify SETTLEMENT_LOCALES exists and covers French, Arabic, English, Spanish, German, Chinese, Japanese, Russian
  assert.ok(content.includes("SETTLEMENT_LOCALES"), "SETTLEMENT_LOCALES dictionary must exist");
  assert.ok(content.includes("fr: {"), "French locale dictionary must exist");
  assert.ok(content.includes("ar: {"), "Arabic locale dictionary must exist");
  assert.ok(content.includes("en: {"), "English locale dictionary must exist");
  assert.ok(content.includes("es: {"), "Spanish locale dictionary must exist");
  assert.ok(content.includes("de: {"), "German locale dictionary must exist");
  assert.ok(content.includes("zh: {"), "Chinese locale dictionary must exist");
  assert.ok(content.includes("ja: {"), "Japanese locale dictionary must exist");
  assert.ok(content.includes("ru: {"), "Russian locale dictionary must exist");

  // Verify exact French wording for the settlement banner
  assert.ok(
    content.includes("Taux de courtage indépendant par transaction : 0,50 % - 1,50 %"),
    "French badge rate must be localized"
  );
  assert.ok(
    content.includes("Avis de règlement non-dépositaire des matières premières physiques"),
    "French settlement title must be localized"
  );
  assert.ok(
    content.includes("VALOREA MARKET ne détient ni ne compense les fonds d'achat"),
    "French settlement description must be localized"
  );
  assert.ok(
    content.includes("Régie par le modèle de contrat 769 de la CCI (NCNDA)"),
    "French legal governance line must be localized"
  );
  assert.ok(
    content.includes("Consulter la politique de courtage"),
    "French read policy button must be localized"
  );
  assert.ok(
    content.includes("poste de négociation"),
    "French seats label must be localized"
  );
});

test("French JSON dictionary: pricing messages valid", () => {
  const frJsonPath = path.resolve("D:/Utilitaires/gvce/src/messages/fr.json");
  const fr = JSON.parse(fs.readFileSync(frJsonPath, "utf8"));

  assert.ok(fr.pricing, "fr.json must have pricing section");
  assert.equal(fr.pricing.usdHeader, "Libellé en USD • Adhésion d'Entreprise et Courtage Non-Dépositaire");
  assert.ok(fr.pricing.note.includes("facturé en USD"));
});
