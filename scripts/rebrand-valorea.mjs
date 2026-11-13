import fs from "fs";
import path from "path";

// 1. Update src/lib/store.ts
const storePath = path.join(process.cwd(), "src/lib/store.ts");
let storeContent = fs.readFileSync(storePath, "utf8");
storeContent = storeContent
  .replace(/CO-GVCE-/g, "CO-VALOREA-")
  .replace(/GVCE-MATCH-/g, "VALOREA-MATCH-")
  .replace(/Broker-GVCE-/g, "Broker-VALOREA-")
  .replace(/GVCE-INV-/g, "VALOREA-INV-")
  .replace(/GVCE-2026-/g, "VALOREA-2026-")
  .replace(/org-gvce-clearing/g, "org-valorea-clearing");

if (!storeContent.includes("export const valoreaStore")) {
  storeContent = storeContent.replace(
    "export const gvceStore = new GVCEDataStore();",
    "export const gvceStore = new GVCEDataStore();\nexport const valoreaStore = gvceStore;"
  );
}
fs.writeFileSync(storePath, storeContent, "utf8");
console.log("Updated src/lib/store.ts");

// 2. Update src/lib/i18n-subpages.ts
const i18nSubpagesPath = path.join(process.cwd(), "src/lib/i18n-subpages.ts");
let subpagesContent = fs.readFileSync(i18nSubpagesPath, "utf8");
subpagesContent = subpagesContent
  .replace(/GVCE International AG/g, "VALOREA MARKET International AG")
  .replace(/GVCE/g, "VALOREA MARKET")
  .replace(/gvce\.exchange/g, "valorea.exchange")
  .replace(/gvce_session_token/g, "valorea_session_token");
fs.writeFileSync(i18nSubpagesPath, subpagesContent, "utf8");
console.log("Updated src/lib/i18n-subpages.ts");

// 3. Update all src/messages/*.json
const messagesDir = path.join(process.cwd(), "src/messages");
const messageFiles = fs.readdirSync(messagesDir).filter(f => f.endsWith(".json"));

for (const file of messageFiles) {
  const filePath = path.join(messagesDir, file);
  let raw = fs.readFileSync(filePath, "utf8");
  raw = raw
    .replace(/GVCE International AG/g, "VALOREA MARKET International AG")
    .replace(/GVCE/g, "VALOREA MARKET")
    .replace(/gvce\.exchange/g, "valorea.exchange");
  fs.writeFileSync(filePath, raw, "utf8");
  console.log(`Updated src/messages/${file}`);
}

// 4. Update src/app/api/deals/route.ts
const apiDealsPath = path.join(process.cwd(), "src/app/api/deals/route.ts");
if (fs.existsSync(apiDealsPath)) {
  let apiDealsContent = fs.readFileSync(apiDealsPath, "utf8");
  apiDealsContent = apiDealsContent.replace(/GVCE/g, "VALOREA MARKET");
  fs.writeFileSync(apiDealsPath, apiDealsContent, "utf8");
  console.log("Updated src/app/api/deals/route.ts");
}

console.log("All rebranding updates completed successfully!");
