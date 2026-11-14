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
