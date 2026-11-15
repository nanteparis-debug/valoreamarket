import { NextRequest, NextResponse } from "next/server";
import { getLemonSqueezyConfig, verifyLemonSqueezyWebhookSignature } from "@/lib/lemonsqueezy";
import { gvceStore, type InvoiceItem } from "@/lib/store";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature");
    const config = getLemonSqueezyConfig();

    // Verify signature if secret is configured
    if (config.webhookSecret) {
      const isValid = verifyLemonSqueezyWebhookSignature(
        rawBody,
        signature,
        config.webhookSecret
      );

      if (!isValid) {
        return NextResponse.json(
          { error: "INVALID_WEBHOOK_SIGNATURE" },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name || req.headers.get("x-event-name");
    const customData = payload.meta?.custom_data || {};
    const attributes = payload.data?.attributes || {};

    const productName = (attributes.product_name || "").toLowerCase();
    const customPlan = (customData.plan || "").toLowerCase();

    // Determine target plan
    let targetPlan: "professional" | "enterprise" | null = null;
    if (productName.includes("enterprise") || customPlan === "enterprise") {
      targetPlan = "enterprise";
    } else if (productName.includes("professional") || customPlan === "professional") {
      targetPlan = "professional";
    }

    // Handle Subscription Creation or Update
    if (
      eventName === "subscription_created" ||
      eventName === "subscription_updated" ||
      eventName === "order_created"
    ) {
      if (targetPlan) {
        gvceStore.updateSubscriptionPlan(targetPlan);
      }

      // Record invoice if price is present
      const amountCents = attributes.total || attributes.first_subscription_item?.price || 0;
      const amountUsd = amountCents > 0 ? amountCents / 100 : targetPlan === "enterprise" ? 1999 : 499;

      const invoiceRecord: InvoiceItem = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `LS-${attributes.identifier || Math.floor(100000 + Math.random() * 900000)}`,
        type: "subscription",
        orgId: customData.orgId || "org-01",
        orgName: customData.orgName || "Institutional Trading Member",
        amount: amountUsd,
        currency: "USD",
        status: "paid",
        issueDate: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        pdfUrl: attributes.urls?.receipt || "#",
      };

      // Add to store invoices
      const currentInvoices = gvceStore.getInvoices();
      currentInvoices.unshift(invoiceRecord);
    }

    return NextResponse.json({
      received: true,
      event: eventName,
      targetPlan,
    });
  } catch (error: any) {
    console.error("Lemon Squeezy Webhook Error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "Lemon Squeezy Webhook Handler",
    url: "https://valoreamarket.com/api/billing/webhook/lemonsqueezy",
  });
}
