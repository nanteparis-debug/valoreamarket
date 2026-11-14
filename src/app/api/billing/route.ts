import { NextRequest, NextResponse } from "next/server";
import { gvceStore } from "@/lib/store";
import { verifyServerSession } from "@/lib/auth-server";
import { PLATFORM_PRICING_PLANS } from "@/lib/pricing-data";

export async function GET(req: NextRequest) {
  try {
    const authResult = verifyServerSession(req, {
      allowExplicitDemo: true, // Only allows preview if ?demo=true is explicitly in URL
    });

    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }

    const { user } = authResult;
    const subscription = gvceStore.getSubscription();
    const allInvoices = gvceStore.getInvoices();

    // Multi-tenant invoice filtering:
    // Brokers and admins see all; Companies see ONLY their own invoices!
    const baseInvoices =
      user.role === "broker" || user.role === "platform_admin"
        ? allInvoices
        : allInvoices.filter((inv) => inv.orgId === user.orgId);

    const invoices = user.isDemoSimulation
      ? baseInvoices.map((inv) => ({
          ...inv,
          invoiceNumber: `DEMO-${inv.invoiceNumber}`,
          orgName: `[نموذج محاكاة • DEMO] ${inv.orgName}`,
        }))
      : baseInvoices;

    return NextResponse.json({
      success: true,
      isDemoSimulation: Boolean(user.isDemoSimulation),
      simulationNotice: user.isDemoSimulation
        ? "SAMPLE_DATA_FOR_DEMONSTRATION_ONLY"
        : undefined,
      subscription,
      invoices,
      availablePlans: PLATFORM_PRICING_PLANS,
      actor: {
        orgId: user.orgId,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch billing data" },
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

    const body = await req.json();
    const { plan } = body;

    if (!["starter", "professional", "enterprise"].includes(plan)) {
      return NextResponse.json(
        { success: false, error: "Invalid plan identifier" },
        { status: 400 }
      );
    }

    if (authResult.user.isDemoSimulation) {
      return NextResponse.json({
        success: true,
        isDemoSimulation: true,
        subscription: {
          plan,
          status: "active",
          validUntil: "2027-11-14T00:00:00Z",
          billingCycle: "annual",
        },
        message: `Simulation subscription plan switched to ${plan.toUpperCase()} tier`,
      });
    }

    const updated = gvceStore.updateSubscriptionPlan(plan);
    return NextResponse.json({
      success: true,
      subscription: updated,
      message: `Subscription successfully updated to ${plan.toUpperCase()} tier`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
