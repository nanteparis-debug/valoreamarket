import { NextRequest, NextResponse } from "next/server";
import { verifyServerSession } from "@/lib/auth-server";
import { getLemonSqueezyConfig } from "@/lib/lemonsqueezy";

export async function POST(req: NextRequest) {
  try {
    const authResult = verifyServerSession(req, {
      allowExplicitDemo: true,
    });

    const isDemo = "errorResponse" in authResult || Boolean(authResult.user?.isDemoSimulation);
    const user = "user" in authResult ? authResult.user : null;

    const body = await req.json();
    const { planId, cycle } = body; // 'professional' | 'enterprise'

    if (!["professional", "enterprise"].includes(planId)) {
      return NextResponse.json(
        { error: "Invalid plan. Choose 'professional' or 'enterprise'." },
        { status: 400 }
      );
    }

    const config = getLemonSqueezyConfig();

    // 1. Direct Checkout Link from environment variables if present
    const envCheckoutUrl =
      planId === "enterprise"
        ? config.enterpriseCheckoutUrl
        : config.professionalCheckoutUrl;

    if (envCheckoutUrl) {
      const url = new URL(envCheckoutUrl);
      url.searchParams.set("embed", "1");
      if (user?.email) {
        url.searchParams.set("checkout[email]", user.email);
      }
      if (user?.name) {
        url.searchParams.set("checkout[name]", user.name);
      }
      if (user?.orgId) {
        url.searchParams.set("checkout[custom][orgId]", user.orgId);
        url.searchParams.set("checkout[custom][plan]", planId);
      }
      return NextResponse.json({
        success: true,
        checkoutUrl: url.toString(),
      });
    }

    // 2. Demo Sandbox fallback
    if (isDemo) {
      return NextResponse.json({
        success: true,
        isDemoSimulation: true,
        checkoutUrl: `/billing?demo=true&success=true&plan=${planId}`,
        message: "Simulation mode active. Redirecting to demo completion.",
      });
    }

    return NextResponse.json({
      success: false,
      error: "LEMONSQUEEZY_NOT_CONFIGURED",
      message: "Please configure LEMONSQUEEZY_CHECKOUT_PROFESSIONAL or LEMONSQUEEZY_CHECKOUT_ENTERPRISE in environment variables.",
    }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to generate checkout link" },
      { status: 500 }
    );
  }
}
