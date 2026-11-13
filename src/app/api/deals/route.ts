import { NextRequest, NextResponse } from "next/server";
import { gvceStore } from "@/lib/store";
import { z } from "zod";

const dealSchema = z.object({
  sector: z.string(),
  commodityName: z.string().min(2),
  side: z.enum(["buy", "sell"]),
  quantity: z.number().positive(),
  unit: z.string(),
  pricePerUnit: z.number().positive(),
  currency: z.string().default("USD"),
  incoterm: z.string(),
  deliveryPort: z.string().min(2),
  deliveryDateRange: z.string(),
  specs: z.record(z.string(), z.string()).optional(),
});

export async function GET() {
  const deals = gvceStore.getAllDeals();
  return NextResponse.json({ success: true, count: deals.length, deals });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = dealSchema.parse(body);

    const newDeal = gvceStore.createDeal(validated);
    return NextResponse.json(
      {
        success: true,
        message: "Deal successfully registered with GVCE Brokerage Clearing",
        deal: newDeal,
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
