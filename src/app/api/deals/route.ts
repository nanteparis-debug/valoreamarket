import { NextRequest, NextResponse } from "next/server";
import { gvceStore, type DealItem } from "@/lib/store";
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

export async function GET() {
  const deals = gvceStore.getAllDeals();
  return NextResponse.json({ success: true, count: deals.length, deals });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = dealSchema.parse(body);

    // 1. Server-side Recalculation of Total Value & Estimated Brokerage Fee
    const recalculatedTotal = Math.round(validated.quantity * validated.pricePerUnit * 100) / 100;
    const standardCommissionRate = 1.25; // Standard 1.25% (range: 0.50% - 1.50%)
    const calculatedCommissionUsd = Math.round(recalculatedTotal * (standardCommissionRate / 100) * 100) / 100;

    // 2. Server-side Deduplication / Idempotency Check
    const dedupeKey =
      validated.idempotencyKey ||
      `${validated.side}:${validated.sector}:${validated.commodityName}:${validated.quantity}:${validated.pricePerUnit}:${validated.deliveryPort}:${validated.deliveryDateRange}`;

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

    // 3. Register deal with verified clearing store
    const newDeal = gvceStore.createDeal({
      ...validated,
      pricePerUnit: validated.pricePerUnit,
      quantity: validated.quantity,
      commissionRate: standardCommissionRate,
    });

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
