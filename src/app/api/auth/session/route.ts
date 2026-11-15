import { getAuthenticatedUser, TEST_PERSONAS, type PlatformRole } from "../../../../lib/auth-server.ts";

function jsonResponse(data: any, init?: { status?: number }) {
  return new Response(JSON.stringify(data), {
    status: init?.status || 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(req: Request | any) {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return jsonResponse({
        success: false,
        authenticated: false,
        user: null,
        message: "No active session found",
      });
    }

    return jsonResponse({
      success: true,
      authenticated: true,
      user,
    });
  } catch (error: any) {
    return jsonResponse(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request | any) {
  try {
    const body = await req.json().catch(() => ({}));
    const { email, role: requestedRole } = body;

    const isProd = process.env.NODE_ENV === "production";
    const headers = new Headers({ "Content-Type": "application/json" });

    // Determine target persona based on corporate email or role
    let user = TEST_PERSONAS.buyer;
    let role: PlatformRole = "buyer";

    if (email && typeof email === "string") {
      const lower = email.toLowerCase();
      if (lower.includes("director") || lower.includes("admin")) {
        user = TEST_PERSONAS.platform_admin;
        role = "platform_admin";
      } else if (lower.includes("broker") || lower.includes("desk")) {
        user = TEST_PERSONAS.broker;
        role = "broker";
      } else if (lower.includes("compliance")) {
        user = TEST_PERSONAS.compliance;
        role = "compliance_officer";
      } else if (lower.includes("nordic") || lower.includes("supplier")) {
        user = TEST_PERSONAS.supplier;
        role = "supplier";
      }
    } else if (requestedRole && TEST_PERSONAS[requestedRole]) {
      user = TEST_PERSONAS[requestedRole];
      role = requestedRole as PlatformRole;
    }

    // Set standard session cookie
    headers.append(
      "Set-Cookie",
      `valorea_session_token=session_${Date.now()}_${role}; Path=/; HttpOnly; SameSite=Strict; Max-Age=14400${
        isProd ? "; Secure" : ""
      }`
    );

    // If executive or compliance role, also set admin cookie
    if (role === "platform_admin" || role === "broker" || role === "compliance_officer") {
      headers.append(
        "Set-Cookie",
        `valorea_admin_token=admin_${role}_${Date.now()}_verified; Path=/; HttpOnly; SameSite=Strict; Max-Age=14400${
          isProd ? "; Secure" : ""
        }`
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        authenticated: true,
        user,
        redirectUrl:
          role === "compliance_officer"
            ? "/compliance"
            : role === "broker" || role === "platform_admin"
            ? "/broker"
            : "/deals/deal-en590-rotterdam/room",
      }),
      { status: 200, headers }
    );
  } catch (error: any) {
    return jsonResponse(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const headers = new Headers({ "Content-Type": "application/json" });
  headers.append("Set-Cookie", "valorea_session_token=; Path=/; HttpOnly; Max-Age=0");
  headers.append("Set-Cookie", "valorea_admin_token=; Path=/; HttpOnly; Max-Age=0");

  return new Response(
    JSON.stringify({ success: true, message: "Session ended successfully" }),
    { status: 200, headers }
  );
}
