import { NextRequest, NextResponse } from "next/server";
import { gvceStore, type DealItem } from "@/lib/store";
import { verifyServerSession } from "@/lib/auth-server";
import { z } from "zod";

const dealSchema = z.object({
  idempotencyKey: z.string().optional(),
  sector: z.string().min(2),
  commodityName: z.string().min(2),
  side: z.enum(["buy", "sell"]),
  quantity: z.number().positive(),
  unit: z.string().min(1),
  pricePerUnit: z.number().positive(),
  currency: z.string().default("USD"),
  incoterm: z.string().min(2),
  deliveryPort: z.string().min(2),
  deliveryDateRange: z.string().min(2),
  specs: z.record(z.string(), z.string()).optional(),
});

// Server-side submission cache for idempotency & deduplication
const submissionCache = new Map<string, { deal: DealItem; timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes deduplication window

export async function GET(req: NextRequest) {
  try {
    const authResult = verifyServerSession(req, {
      allowExplicitDemo: true,
    });

    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }

    const { user } = authResult;
    const allDeals = gvceStore.getAllDeals();

    // In demo mode: strictly return the sandboxed demo deal, tagged as simulation
    if (user.isDemoSimulation) {
      const demoDeals = allDeals
        .filter((d) => d.id === "deal-en590-rotterdam")
        .map((d) => ({
          ...d,
          commodityName: `[نموذج محاكاة • DEMO] ${d.commodityName}`,
        }));
      return NextResponse.json({
        success: true,
        isDemoSimulation: true,
        count: demoDeals.length,
        deals: demoDeals,
      });
    }

    // Multi-tenant isolation:
    // Brokers and compliance officers supervise all deals.
    // Trading companies ONLY see deals where their orgId is an active participant!
    const deals =
      user.role === "broker" || user.role === "compliance_officer" || user.role === "platform_admin"
        ? allDeals
        : allDeals.filter((d) => d.participants.some((p) => p.orgId === user.orgId));

    return NextResponse.json({
      success: true,
      count: deals.length,
      deals,
      actor: {
        orgId: user.orgId,
        role: user.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to retrieve deals" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authResult = verifyServerSession(req, {
      allowExplicitDemo: true,
    });

    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }

    const { user } = authResult;
    const body = await req.json();
    const validated = dealSchema.parse(body);

    // 1. Server-side Recalculation of Total Value & Estimated Brokerage Fee
    const recalculatedTotal = Math.round(validated.quantity * validated.pricePerUnit * 100) / 100;
    const standardCommissionRate = 1.25; // Standard 1.25% (range: 0.50% - 1.50%)
    const calculatedCommissionUsd = Math.round(recalculatedTotal * (standardCommissionRate / 100) * 100) / 100;

    // 2. Server-side Deduplication / Idempotency Check
    const dedupeKey =
      validated.idempotencyKey ||
      `${user.orgId}:${validated.side}:${validated.sector}:${validated.commodityName}:${validated.quantity}:${validated.pricePerUnit}:${validated.deliveryPort}:${validated.deliveryDateRange}`;

    const now = Date.now();
    const existing = submissionCache.get(dedupeKey);
    if (existing && now - existing.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(
        {
          success: true,
          deduplicated: true,
          message: "Request recognized and deduplicated; returning existing registered deal",
          deal: existing.deal,
          calculatedTotalContractValue: recalculatedTotal,
          estimatedCommissionUsd: calculatedCommissionUsd,
        },
        { status: 200 }
      );
    }

    // In demo mode: create a transient simulation deal without mutating live enterprise deals
    if (user.isDemoSimulation) {
      const demoDeal: DealItem = {
        id: `deal-demo-${Date.now().toString(36)}`,
        referenceNumber: `VALOREA-DEMO-${Date.now().toString(36).toUpperCase()}`,
        sector: validated.sector,
        commodityName: `[نموذج محاكاة • DEMO] ${validated.commodityName}`,
        side: validated.side,
        quantity: validated.quantity,
        unit: validated.unit,
        pricePerUnit: validated.pricePerUnit,
        currency: validated.currency,
        incoterm: validated.incoterm,
        deliveryPort: validated.deliveryPort,
        deliveryDateRange: validated.deliveryDateRange,
        specs: validated.specs || {},
        status: "open",
        brokerLead: "Geneva Neutral Brokerage Desk",
        commissionRate: standardCommissionRate,
        commissionDueEvent: "B/L handover and DLC/SBLC unconditional release",
        participants: [
          {
            id: `part-${user.orgId}`,
            orgId: user.orgId,
            orgCountry: user.orgCountry || "CH",
            alias: `Demo-${validated.side === "buy" ? "Buyer" : "Supplier"}`,
            role: validated.side === "buy" ? "buyer" : "supplier",
            isVerified: true,
          },
        ],
        documents: [],
        messages: [],
        auditLog: [
          {
            action: "SIMULATION_DEAL_CREATED",
            actor: "Demo Persona",
            timestamp: new Date().toISOString(),
          },
        ],
      };

      return NextResponse.json(
        {
          success: true,
          deduplicated: false,
          isDemoSimulation: true,
          message: "Simulation deal registered in sandbox environment",
          deal: demoDeal,
          calculatedTotalContractValue: recalculatedTotal,
          estimatedCommissionUsd: calculatedCommissionUsd,
        },
        { status: 201 }
      );
    }

    // 3. Register authentic corporate deal with creator organization tenancy
    const newDeal = gvceStore.createDeal({
      ...validated,
      pricePerUnit: validated.pricePerUnit,
      quantity: validated.quantity,
      commissionRate: standardCommissionRate,
    });

    // Ensure the creator organization is recorded as a participant
    if (!newDeal.participants.some((p) => p.orgId === user.orgId)) {
      newDeal.participants.push({
        id: `part-${user.orgId}`,
        orgId: user.orgId,
        orgCountry: user.orgCountry || "CH",
        alias: `${validated.side === "buy" ? "Buyer" : "Supplier"}-${user.orgId.split("-")[1] || "Lead"}`,
        role: validated.side === "buy" ? "buyer" : "supplier",
        isVerified: user.isVerified,
      });
    }

    // Cache submission for deduplication window
    submissionCache.set(dedupeKey, { deal: newDeal, timestamp: now });

    // Clean old entries
    for (const [k, v] of submissionCache.entries()) {
      if (now - v.timestamp > CACHE_TTL_MS) {
        submissionCache.delete(k);
      }
    }

    return NextResponse.json(
      {
        success: true,
        deduplicated: false,
        message: "Deal successfully registered with VALOREA MARKET Brokerage Clearing",
        deal: newDeal,
        calculatedTotalContractValue: recalculatedTotal,
        estimatedCommissionUsd: calculatedCommissionUsd,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Invalid deal payload" },
      { status: 400 }
    );
  }
}
