/**
 * Cloudflare Turnstile Server-Side Verification Utility
 * Conforms to Cloudflare Siteverify Specification
 */

export interface TurnstileVerificationResult {
  success: boolean;
  error?: string;
  challengeTs?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

export async function verifyTurnstileToken(
  token: string,
  expectedAction?: string,
  remoteip?: string
): Promise<TurnstileVerificationResult> {
  const secretKey =
    process.env.TURNSTILE_SECRET_KEY || "0x4AAAAAAGBOhC40q1uLsQX-Z9cgSQWT0Rc";

  if (!token || typeof token !== "string" || token.trim().length === 0) {
    return {
      success: false,
      error: "Missing or invalid verification token",
    };
  }

  // Token length safeguard per Cloudflare spec (max 2048 chars)
  if (token.length > 2048) {
    return {
      success: false,
      error: "Malformed verification token",
    };
  }

  const expectedHostnames = new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "localhost,127.0.0.1,valoreamarket.vercel.app,valoreamarket.com,www.valoreamarket.com")
      .split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean)
  );

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteip) {
      formData.append("remoteip", remoteip);
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }
    );

    if (!response.ok) {
      return {
        success: false,
        error: `Cloudflare siteverify service returned HTTP ${response.status}`,
      };
    }

    const data = await response.json();

    if (!data.success) {
      const errorCodes = Array.isArray(data["error-codes"])
        ? data["error-codes"].join(", ")
        : "Turnstile validation failed";
      return {
        success: false,
        error: errorCodes,
      };
    }

    // Hostname validation
    if (data.hostname && expectedHostnames.size > 0) {
      const returnedHostname = data.hostname.toLowerCase();
      if (!expectedHostnames.has(returnedHostname)) {
        return {
          success: false,
          error: `Untrusted hostname: ${returnedHostname}`,
        };
      }
    }

    // Action validation
    if (expectedAction && data.action && data.action !== expectedAction) {
      return {
        success: false,
        error: `Action mismatch: expected ${expectedAction}, got ${data.action}`,
      };
    }

    return {
      success: true,
      challengeTs: data.challenge_ts,
      hostname: data.hostname,
      action: data.action,
      cdata: data.cdata,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to reach Cloudflare verification service",
    };
  }
}
