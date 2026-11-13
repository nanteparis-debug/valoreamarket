import { NextRequest, NextResponse } from "next/server";
import { gvceStore } from "@/lib/store";
import { messageRateLimiter } from "@/lib/rate-limiter";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { senderAlias, senderRole, text } = body;

    // Rate Limiting Enforcement
    const ip = req.headers.get("x-forwarded-for") || "client-local";
    const rateCheck = messageRateLimiter.check(`${ip}:${senderAlias || "anon"}`);
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: "RATE_LIMIT_EXCEEDED: Message rate limit exceeded. Please wait before posting.",
        },
        { status: 429 }
      );
    }

    if (!senderAlias || !text) {
      return NextResponse.json(
        { success: false, error: "Missing required sender or message text" },
        { status: 400 }
      );
    }

    const result = gvceStore.addMessage(
      id,
      senderAlias,
      senderRole || "buyer",
      text
    );

    if ("error" in result) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result,
      warning: result.contactViolation
        ? "Contact information leak was detected and sanitized."
        : undefined,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
