import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, action } = body;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Missing Turnstile verification token" },
        { status: 400 }
      );
    }

    const remoteip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      undefined;

    const result = await verifyTurnstileToken(token, action, remoteip);

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error || "Turnstile verification failed" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      ok: true,
      hostname: result.hostname,
      action: result.action,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
