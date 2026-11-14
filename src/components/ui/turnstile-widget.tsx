"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";

type TurnstileWidgetId = string;

interface TurnstileRenderOptions {
  sitekey: string;
  action?: string;
  theme?: "light" | "dark" | "auto";
  callback?: (token: string) => void;
  "error-callback"?: (error?: any) => void;
  "expired-callback"?: () => void;
  size?: "normal" | "compact" | "flexible";
}

interface TurnstileApi {
  render: (
    container: HTMLElement | string,
    options: TurnstileRenderOptions
  ) => TurnstileWidgetId;
  reset: (widgetId: TurnstileWidgetId) => void;
  remove: (widgetId: TurnstileWidgetId) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface TurnstileWidgetProps {
  action?: string;
  onVerify: (token: string) => void;
  onError?: (err?: string) => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
  className?: string;
}

export function TurnstileWidget({
  action = "general",
  onVerify,
  onError,
  onExpire,
  theme = "dark",
  className = "",
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<TurnstileWidgetId | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const siteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAGBOhEcFpwojfIkZ";

  const renderWidget = useCallback(() => {
    if (
      !containerRef.current ||
      !window.turnstile ||
      widgetIdRef.current !== null
    ) {
      return;
    }

    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action,
        theme,
        callback: (token: string) => {
          onVerify(token);
        },
        "error-callback": (err: any) => {
          onError?.(err?.toString() || "Turnstile challenge failed");
        },
        "expired-callback": () => {
          onExpire?.();
        },
      });
    } catch (e: any) {
      console.warn("Turnstile render error:", e?.message);
    }
  }, [action, onExpire, onError, onVerify, siteKey, theme]);

  useEffect(() => {
    if (scriptLoaded && window.turnstile) {
      renderWidget();
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [scriptLoaded, renderWidget]);

  return (
    <div className={`turnstile-wrapper my-3 flex justify-center ${className}`}>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div ref={containerRef} className="min-h-[65px]" />
    </div>
  );
}

export default TurnstileWidget;
