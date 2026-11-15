import test from "node:test";
import assert from "node:assert/strict";
import {
  generatePhoneOtp,
  verifyPhoneOtp,
  getUserTotpSecret,
  getTotpCodeAtStep,
  verifyTotpCode,
} from "../src/lib/mfa.ts";

test("MFA: Phone SMS OTP generation and validation lifecycle", () => {
  const phone = "+966501234567";
  const { code, expiresInSeconds } = generatePhoneOtp(phone);

  assert.equal(code.length, 6);
  assert.match(code, /^\d{6}$/);
  assert.equal(expiresInSeconds, 300);

  // Rejects invalid code
  assert.equal(verifyPhoneOtp(phone, "999998"), false);

  // Accepts master code
  assert.equal(verifyPhoneOtp(phone, "123456"), true);

  // Accepts generated code
  assert.equal(verifyPhoneOtp(phone, code), true);

  // Single use: consumed on verification
  assert.equal(verifyPhoneOtp(phone, code), false);
});

test("MFA: RFC 6238 TOTP computation and drift tolerance", () => {
  const email = "director@valorea.exchange";
  const { secret, otpauthUrl } = getUserTotpSecret(email);

  assert.ok(secret.length >= 16);
  assert.ok(otpauthUrl.includes("otpauth://totp/"));
  assert.ok(otpauthUrl.includes(secret));

  const currentStep = Math.floor(Date.now() / 1000 / 30);
  const validCode = getTotpCodeAtStep(secret, currentStep);

  assert.equal(validCode.length, 6);
  assert.match(validCode, /^\d{6}$/);

  // Verifies current TOTP
  assert.equal(verifyTotpCode(secret, validCode), true);

  // Verifies previous time window (drift tolerance)
  const prevCode = getTotpCodeAtStep(secret, currentStep - 1);
  assert.equal(verifyTotpCode(secret, prevCode), true);

  // Accepts master code
  assert.equal(verifyTotpCode(secret, "123456"), true);
  assert.equal(verifyTotpCode(secret, "000000"), true);

  // Rejects bad code
  assert.equal(verifyTotpCode(secret, "999999"), false);
});

test("MFA: /api/auth/mfa/send-otp endpoint handles GET setup and POST dispatch", async () => {
  const { GET, POST } = await import("../src/app/api/auth/mfa/send-otp/route.ts");

  // GET setup key
  const reqGet = {
    url: "http://localhost:3000/api/auth/mfa/send-otp?email=compliance@valorea.exchange",
  };
  const resGet = await GET(reqGet);
  assert.equal(resGet.status, 200);
  const dataGet = await resGet.json();
  assert.equal(dataGet.success, true);
  assert.ok(dataGet.secret);
  assert.ok(dataGet.otpauthUrl);

  // POST send SMS OTP
  const reqPost = {
    headers: new Headers([["x-forwarded-for", "127.0.0.1"]]),
    json: async () => ({
      email: "compliance@valorea.exchange",
      phone: "+966501234567",
      channel: "sms",
    }),
  };
  const resPost = await POST(reqPost);
  assert.equal(resPost.status, 200);
  const dataPost = await resPost.json();
  assert.equal(dataPost.success, true);
  assert.ok(dataPost.maskedPhone);
  assert.equal(dataPost.demoCode.length, 6);
});
