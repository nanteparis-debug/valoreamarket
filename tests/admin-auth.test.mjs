import test from "node:test";
import assert from "node:assert";

test("Admin Auth: GET /api/admin/auth unauthenticated rejection", async () => {
  const { GET } = await import("../src/app/api/admin/auth/route.ts");

  const req = {
    cookies: {
      get: () => undefined,
    },
  };

  const res = await GET(req);
  assert.strictEqual(res.status, 401);
  const data = await res.json();
  assert.strictEqual(data.authenticated, false);
});

test("Admin Auth: GET /api/admin/auth with valid admin token returns Level 4 clearance", async () => {
  const { GET } = await import("../src/app/api/admin/auth/route.ts");

  const req = {
    cookies: {
      get: (name) => {
        if (name === "valorea_admin_token") {
          return { value: "admin_platform_admin_1731628800_verified" };
        }
        return undefined;
      },
    },
  };

  const res = await GET(req);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.authenticated, true);
  assert.strictEqual(data.clearanceLevel, "LEVEL_4_EXECUTIVE_DIRECTOR");
  assert.ok(data.user);
  assert.strictEqual(data.securityPosture.mfaVerified, true);
});

test("Admin Auth: POST /api/admin/auth enforces Turnstile token on credential login", async () => {
  const { POST } = await import("../src/app/api/admin/auth/route.ts");

  const req = {
    headers: new Headers([["x-forwarded-for", "127.0.0.1"]]),
    json: async () => ({
      email: "director@valorea.exchange",
      password: "StrongPassword123!",
      turnstileToken: "", // missing token
    }),
  };

  const res = await POST(req);
  assert.strictEqual(res.status, 400);
  const data = await res.json();
  assert.strictEqual(data.error, "TURNSTILE_TOKEN_REQUIRED");
});

test("Admin Auth: POST /api/admin/auth Passkey FIDO2 fast entrance", async () => {
  const { POST } = await import("../src/app/api/admin/auth/route.ts");

  const req = {
    headers: new Headers([["x-forwarded-for", "127.0.0.1"]]),
    json: async () => ({
      usePasskey: true,
      selectedRole: "platform_admin",
    }),
  };

  const res = await POST(req);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.clearanceLevel, "LEVEL_4_EXECUTIVE_DIRECTOR");
  assert.strictEqual(data.redirectUrl, "/broker");
});

test("Admin Auth: Two-step MFA with pending ticket verifies without duplicate Turnstile consumption", async () => {
  const { POST } = await import("../src/app/api/admin/auth/route.ts");

  // Step 2 with valid pending ticket
  const ticketPayload = {
    email: "director@valorea.exchange",
    role: "platform_admin",
    ts: Date.now(),
  };
  const mfaTicket = Buffer.from(JSON.stringify(ticketPayload)).toString("base64url");

  const reqStep2 = {
    headers: new Headers([["x-forwarded-for", "127.0.0.1"]]),
    json: async () => ({
      email: "director@valorea.exchange",
      mfaCode: "123456",
      mfaTicket,
      selectedRole: "platform_admin",
    }),
  };

  const resStep2 = await POST(reqStep2);
  assert.strictEqual(resStep2.status, 200);
  const dataStep2 = await resStep2.json();
  assert.strictEqual(dataStep2.success, true);
  assert.strictEqual(dataStep2.clearanceLevel, "LEVEL_4_EXECUTIVE_DIRECTOR");
  assert.strictEqual(dataStep2.redirectUrl, "/broker");
});

test("Admin Auth: getAuthenticatedUser in auth-server.ts honors valorea_admin_token", async () => {
  const { getAuthenticatedUser } = await import("../src/lib/auth-server.ts");

  const fakeReq = {
    headers: new Headers(),
    cookies: {
      get: (name) => {
        if (name === "valorea_admin_token") {
          return { value: "admin_platform_admin_1731628800_verified" };
        }
        return undefined;
      },
    },
  };

  const user = getAuthenticatedUser(fakeReq);
  assert.ok(user);
  assert.strictEqual(user.role, "platform_admin");
  assert.strictEqual(user.email, "director@valorea.exchange");
});

test("Auth Session: GET /api/auth/session resolves active user session", async () => {
  const { GET } = await import("../src/app/api/auth/session/route.ts");

  // Unauthenticated
  const reqUnauth = {
    headers: new Headers(),
    cookies: { get: () => undefined },
  };
  const resUnauth = await GET(reqUnauth);
  assert.strictEqual(resUnauth.status, 200);
  const dataUnauth = await resUnauth.json();
  assert.strictEqual(dataUnauth.authenticated, false);
  assert.strictEqual(dataUnauth.user, null);

  // Authenticated with session cookie
  const reqAuth = {
    headers: new Headers(),
    cookies: {
      get: (name) => {
        if (name === "valorea_session_token") {
          return { value: "session_123456_buyer" };
        }
        return undefined;
      },
    },
  };
  const resAuth = await GET(reqAuth);
  assert.strictEqual(resAuth.status, 200);
  const dataAuth = await resAuth.json();
  assert.strictEqual(dataAuth.authenticated, true);
  assert.ok(dataAuth.user);
  assert.strictEqual(dataAuth.user.role, "buyer");
});

test("Auth Session: POST /api/auth/session issues valid session token", async () => {
  const { POST } = await import("../src/app/api/auth/session/route.ts");

  const req = {
    json: async () => ({ email: "a.dupont@totalenergies-trading.fr" }),
  };
  const res = await POST(req);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.authenticated, true);
  assert.strictEqual(data.user.role, "buyer");
  const setCookie = res.headers.get("Set-Cookie");
  assert.ok(setCookie.includes("valorea_session_token"));
});
