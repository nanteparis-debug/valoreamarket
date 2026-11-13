import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/landing/navbar";
import { AuroraHero } from "@/components/landing/aurora-hero";
import { SectorsBento } from "@/components/landing/sectors-bento";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturesSection } from "@/components/landing/features-section";
import { DealRoomPreview } from "@/components/landing/deal-room-preview";
import { PricingSection } from "@/components/landing/pricing-section";
import { AnimatedFooter } from "@/components/landing/animated-footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tHero = await getTranslations({ locale, namespace: "hero" });
  const tSectors = await getTranslations({ locale, namespace: "sectors" });
  const tHowItWorks = await getTranslations({ locale, namespace: "howItWorks" });
  const tFeatures = await getTranslations({ locale, namespace: "features" });
  const tDealRoom = await getTranslations({ locale, namespace: "dealRoomPreview" });
  const tPricing = await getTranslations({ locale, namespace: "pricing" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  return (
    <div className="relative min-h-screen bg-[#07080c] text-[#f8fafc]">
      {/* Top Navbar */}
      <Navbar
        currentLocale={locale}
        translations={{
          home: tNav("home"),
          commodities: tNav("commodities"),
          howItWorks: tNav("howItWorks"),
          pricing: tNav("pricing"),
          signIn: tNav("signIn"),
          getStarted: tNav("getStarted"),
          language: tNav("language"),
          brokerDesk: tNav("brokerDesk"),
          compliance: tNav("compliance"),
          security: tNav("security"),
          dealRooms: tNav("dealRooms"),
          billing: tNav("billing"),
          verifiedBadge: tNav("verifiedBadge"),
          siteSubtitle: tNav("siteSubtitle"),
          referenceCurrency: tNav("referenceCurrency"),
        }}
      />

      {/* Main Landing Sections */}
      <main>
        {/* 1. Aurora Hero with Live Stats & Brokerage Badges */}
        <AuroraHero
          translations={{
            badge: tHero("badge"),
            title: tHero("title"),
            subtitle: tHero("subtitle"),
            cta: tHero("cta"),
            secondaryCta: tHero("secondaryCta"),
            stats: {
              countries: tHero("stats.countries"),
              deals: tHero("stats.deals"),
              companies: tHero("stats.companies"),
              volume: tHero("stats.volume"),
            },
            subhead: tHero("subhead"),
            asvsBadge: tHero("asvsBadge"),
            pillarKyc: tHero("pillarKyc"),
            pillarDealRooms: tHero("pillarDealRooms"),
            pillarDocs: tHero("pillarDocs"),
            pillarLangs: tHero("pillarLangs"),
          }}
        />

        {/* 2. Commodity Catalog Bento (7 Sectors & Specs) */}
        <SectorsBento
          translations={{
            title: tSectors("title"),
            subtitle: tSectors("subtitle"),
            viewAll: tSectors("viewAll"),
            buyRequest: tSectors("buyRequest"),
            supplyOffer: tSectors("supplyOffer"),
            badge: tSectors("badge"),
            catalogCode: tSectors("catalogCode"),
            usdDenominated: tSectors("usdDenominated"),
            delivery: tSectors("delivery"),
            verifiedSpecs: tSectors("verifiedSpecs"),
            benchmarkSpecs: tSectors("benchmarkSpecs"),
            coaInspection: tSectors("coaInspection"),
            usdPerTon: tSectors("usdPerTon"),
            supportedIncoterms: tSectors("supportedIncoterms"),
            sectors: {
              crudeOil: tSectors("crudeOil"),
              refinedPetroleum: tSectors("refinedPetroleum"),
              naturalGas: tSectors("naturalGas"),
              petrochemicals: tSectors("petrochemicals"),
              sulfurFertilizers: tSectors("sulfurFertilizers"),
              metalsIndustrial: tSectors("metalsIndustrial"),
              sugar: tSectors("sugar"),
            },
          }}
        />

        {/* 3. Four-Step Journey: How It Works */}
        <HowItWorks
          translations={{
            title: tHowItWorks("title"),
            subtitle: tHowItWorks("subtitle"),
            phaseOf: tHowItWorks("phaseOf"),
            step1: {
              title: tHowItWorks("step1.title"),
              description: tHowItWorks("step1.description"),
            },
            step2: {
              title: tHowItWorks("step2.title"),
              description: tHowItWorks("step2.description"),
            },
            step3: {
              title: tHowItWorks("step3.title"),
              description: tHowItWorks("step3.description"),
            },
            step4: {
              title: tHowItWorks("step4.title"),
              description: tHowItWorks("step4.description"),
            },
          }}
        />

        {/* 4. Supervised Anonymous Deal Room Interactive Simulator */}
        <DealRoomPreview
          translations={{
            badge: tDealRoom("badge"),
            title: tDealRoom("title"),
            subtitle: tDealRoom("subtitle"),
            roomReference: tDealRoom("roomReference"),
            e2eeActive: tDealRoom("e2eeActive"),
            dealSummary: tDealRoom("dealSummary"),
            buyerAlias: tDealRoom("buyerAlias"),
            supplierAlias: tDealRoom("supplierAlias"),
            brokerLead: tDealRoom("brokerLead"),
            tabChat: tDealRoom("tabChat"),
            tabDocuments: tDealRoom("tabDocuments"),
            tabAgreements: tDealRoom("tabAgreements"),
            sampleMessage1: tDealRoom("sampleMessage1"),
            sampleMessage2: tDealRoom("sampleMessage2"),
            leakNotice: tDealRoom("leakNotice"),
            enterRoomBtn: tDealRoom("enterRoomBtn"),
            doc1Title: tDealRoom("doc1Title"),
            doc1Type: tDealRoom("doc1Type"),
            doc2Title: tDealRoom("doc2Title"),
            doc2Type: tDealRoom("doc2Type"),
            previewBtn: tDealRoom("previewBtn"),
            agreementTitle: tDealRoom("agreementTitle"),
            agreementTerms: tDealRoom("agreementTerms"),
          }}
        />

        {/* 5. Enterprise Verification & Security Features */}
        <FeaturesSection
          translations={{
            title: tFeatures("title"),
            subtitle: tFeatures("subtitle"),
            verification: {
              title: tFeatures("verification.title"),
              description: tFeatures("verification.description"),
            },
            dealRooms: {
              title: tFeatures("dealRooms.title"),
              description: tFeatures("dealRooms.description"),
            },
            multiLanguage: {
              title: tFeatures("multiLanguage.title"),
              description: tFeatures("multiLanguage.description"),
            },
            security: {
              title: tFeatures("security.title"),
              description: tFeatures("security.description"),
            },
            documents: {
              title: tFeatures("documents.title"),
              description: tFeatures("documents.description"),
            },
            commissions: {
              title: tFeatures("commissions.title"),
              description: tFeatures("commissions.description"),
            },
            eyebrow: tFeatures("eyebrow"),
            step1Badge: tFeatures("step1Badge"),
            step1Title: tFeatures("step1Title"),
            step1Desc: tFeatures("step1Desc"),
            step2Badge: tFeatures("step2Badge"),
            step2Title: tFeatures("step2Title"),
            step2Desc: tFeatures("step2Desc"),
            step3Badge: tFeatures("step3Badge"),
            step3Title: tFeatures("step3Title"),
            step3Desc: tFeatures("step3Desc"),
            passkeyBadge: tFeatures("passkeyBadge"),
            passkeySub: tFeatures("passkeySub"),
            dealRoomsBadge: tFeatures("dealRoomsBadge"),
            dealRoomsSub: tFeatures("dealRoomsSub"),
            watermarkSample: tFeatures("watermarkSample"),
            ownerConsent: tFeatures("ownerConsent"),
            antiCopy: tFeatures("antiCopy"),
            originalEncrypted: tFeatures("originalEncrypted"),
          }}
        />

        {/* 6. Subscription Plans in USD */}
        <PricingSection
          translations={{
            title: tPricing("title"),
            subtitle: tPricing("subtitle"),
            monthly: tPricing("monthly"),
            annually: tPricing("annually"),
            save: tPricing("save", { percent: 20 }),
            perMonth: tPricing("perMonth"),
            perYear: tPricing("perYear"),
            upgrade: tPricing("upgrade"),
            contactSales: tPricing("contactSales"),
            registerFree: tPricing("registerFree"),
            getStarted: tPricing("getStarted"),
            usdHeader: tPricing("usdHeader"),
            note: tPricing("note"),
            savePercent: tPricing("savePercent"),
            recommended: tPricing("recommended"),
            usdCurrency: tPricing("usdCurrency"),
            starter: {
              name: tPricing("starter.name"),
              description: tPricing("starter.description"),
              features: [
                tPricing("starter.features.0"),
                tPricing("starter.features.1"),
                tPricing("starter.features.2"),
                tPricing("starter.features.3"),
              ],
            },
            professional: {
              name: tPricing("professional.name"),
              description: tPricing("professional.description"),
              features: [
                tPricing("professional.features.0"),
                tPricing("professional.features.1"),
                tPricing("professional.features.2"),
                tPricing("professional.features.3"),
                tPricing("professional.features.4"),
                tPricing("professional.features.5"),
              ],
            },
            enterprise: {
              name: tPricing("enterprise.name"),
              description: tPricing("enterprise.description"),
              features: [
                tPricing("enterprise.features.0"),
                tPricing("enterprise.features.1"),
                tPricing("enterprise.features.2"),
                tPricing("enterprise.features.3"),
                tPricing("enterprise.features.4"),
                tPricing("enterprise.features.5"),
              ],
            },
          }}
        />
      </main>

      {/* 7. Animated Corporate Footer */}
      <AnimatedFooter
        currentLocale={locale}
        translations={{
          description: tFooter("description"),
          platform: tFooter("platform"),
          company: tFooter("company"),
          legal: tFooter("legal"),
          support: tFooter("support"),
          termsOfService: tFooter("termsOfService"),
          privacyPolicy: tFooter("privacyPolicy"),
          cookiePolicy: tFooter("cookiePolicy"),
          helpCenter: tFooter("helpCenter"),
          contactUs: tFooter("contactUs"),
          aboutUs: tFooter("aboutUs"),
          rights: tFooter("rights"),
          platformCatalog: tFooter("platformCatalog"),
          platformBroker: tFooter("platformBroker"),
          platformCompliance: tFooter("platformCompliance"),
          platformBilling: tFooter("platformBilling"),
          platformSecurity: tFooter("platformSecurity"),
          legalNcnda: tFooter("legalNcnda"),
          legalBrokerage: tFooter("legalBrokerage"),
          badgeUsd: tFooter("badgeUsd"),
          badgeBanks: tFooter("badgeBanks"),
          badgeVerified: tFooter("badgeVerified"),
          languagesTitle: tNav("language"),
        }}
      />
    </div>
  );
}
