import { NextRequest, NextResponse } from "next/server";
import { gvceStore } from "@/lib/store";

export async function GET() {
  try {
    const subscription = gvceStore.getSubscription();
    const invoices = gvceStore.getInvoices();
    return NextResponse.json({ success: true, subscription, invoices });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch billing data" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { plan } = body;

    if (!["starter", "professional", "enterprise"].includes(plan)) {
      return NextResponse.json(
        { success: false, error: "Invalid plan" },
        { status: 400 }
      );
    }

    const updated = gvceStore.updateSubscriptionPlan(plan);
    return NextResponse.json({ success: true, subscription: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
