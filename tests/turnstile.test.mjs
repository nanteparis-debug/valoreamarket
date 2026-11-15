import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { verifyTurnstileToken } from "../src/lib/turnstile.ts";

test("Turnstile: server utility rejects empty, missing, or malformed tokens", async () => {
  const emptyRes = await verifyTurnstileToken("");
  assert.equal(emptyRes.success, false);
  assert.match(emptyRes.error, /missing or invalid/i);

  const spacesRes = await verifyTurnstileToken("   ");
  assert.equal(spacesRes.success, false);
  assert.match(spacesRes.error, /missing or invalid/i);

  const giantToken = "a".repeat(2049);
  const giantRes = await verifyTurnstileToken(giantToken);
  assert.equal(giantRes.success, false);
  assert.match(giantRes.error, /malformed/i);
});

test("Turnstile: client widget component exists with official Cloudflare challenges script", () => {
  const widgetPath = path.resolve("src/components/ui/turnstile-widget.tsx");
  assert.ok(fs.existsSync(widgetPath), "TurnstileWidget component must exist");
  const content = fs.readFileSync(widgetPath, "utf8");

  assert.ok(
    content.includes("https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"),
    "Widget must load Cloudflare explicit Turnstile script"
  );
  assert.ok(content.includes("window.turnstile.render"), "Widget must call window.turnstile.render");
  assert.ok(content.includes("0x4AAAAAAGBOhEcFpwojfIkZ"), "Widget must use active sitekey");
  assert.ok(content.includes("callbacksRef"), "Widget must store callbacks in ref to prevent teardown loop");
  assert.ok(content.includes("useImperativeHandle"), "Widget must support imperative reset via ref");
});

test("Turnstile: admin login, signin and register pages integrate bot protection with loop protection", () => {
  const adminPath = path.resolve("src/app/[locale]/admin/login/page.tsx");
  const adminContent = fs.readFileSync(adminPath, "utf8");
  assert.ok(adminContent.includes("TurnstileWidget"), "Admin page must import TurnstileWidget");
  assert.ok(adminContent.includes("action=\"admin_signin\""), "Admin page must use action='admin_signin'");
  assert.ok(adminContent.includes("turnstileToken"), "Admin page must check turnstileToken");
  assert.ok(adminContent.includes("turnstileRef"), "Admin page must connect turnstileRef");

  const signinPath = path.resolve("src/app/[locale]/auth/signin/page.tsx");
  const signinContent = fs.readFileSync(signinPath, "utf8");
  assert.ok(signinContent.includes("TurnstileWidget"), "SignIn page must import TurnstileWidget");
  assert.ok(signinContent.includes("action=\"signin\""), "SignIn page must use action='signin'");
  assert.ok(signinContent.includes("turnstileToken"), "SignIn page must check turnstileToken");
  assert.ok(signinContent.includes("turnstileRef"), "SignIn page must connect turnstileRef");

  const registerPath = path.resolve("src/app/[locale]/auth/register/page.tsx");
  const registerContent = fs.readFileSync(registerPath, "utf8");
  assert.ok(registerContent.includes("TurnstileWidget"), "Register page must import TurnstileWidget");
  assert.ok(registerContent.includes("action=\"register\""), "Register page must use action='register'");
  assert.ok(registerContent.includes("turnstileToken"), "Register page must check turnstileToken");
  assert.ok(registerContent.includes("turnstileRef"), "Register page must connect turnstileRef");
});

test("Turnstile: API verification route exists", () => {
  const routePath = path.resolve("src/app/api/auth/verify-turnstile/route.ts");
  assert.ok(fs.existsSync(routePath), "Turnstile API route must exist");
  const content = fs.readFileSync(routePath, "utf8");
  assert.ok(content.includes("verifyTurnstileToken"), "API route must call verifyTurnstileToken");
});
