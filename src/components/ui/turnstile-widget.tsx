"use client";

import React, {
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
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

export interface TurnstileRef {
  reset: () => void;
  getWidgetId: () => TurnstileWidgetId | null;
}

export interface TurnstileWidgetProps {
  action?: string;
  onVerify: (token: string) => void;
  onError?: (err?: string) => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
  className?: string;
}

export const TurnstileWidget = forwardRef<TurnstileRef, TurnstileWidgetProps>(
  function TurnstileWidget(
    {
      action = "general",
      onVerify,
      onError,
      onExpire,
      theme = "dark",
      className = "",
    },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<TurnstileWidgetId | null>(null);

    // Keep callbacks in ref to avoid re-triggering widget render / removal cycle on parent state changes
    const callbacksRef = useRef({ onVerify, onError, onExpire });
    useEffect(() => {
      callbacksRef.current = { onVerify, onError, onExpire };
    });

    const siteKey =
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAGBOhEcFpwojfIkZ";

    // Imperative handle to allow programmatic reset when needed
    useImperativeHandle(ref, () => ({
      reset: () => {
        if (
          widgetIdRef.current !== null &&
          typeof window !== "undefined" &&
          window.turnstile
        ) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch (e: any) {
            console.warn("Turnstile reset error:", e?.message);
          }
        }
      },
      getWidgetId: () => widgetIdRef.current,
    }));

    const renderWidget = useCallback(() => {
      if (
        !containerRef.current ||
        typeof window === "undefined" ||
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
            callbacksRef.current.onVerify?.(token);
          },
          "error-callback": (err: any) => {
            callbacksRef.current.onError?.(
              typeof err === "string" ? err : err?.toString() || "Turnstile challenge failed"
            );
          },
          "expired-callback": () => {
            callbacksRef.current.onExpire?.();
          },
        });
      } catch (e: any) {
        console.warn("Turnstile render error:", e?.message);
      }
    }, [action, siteKey, theme]);

    useEffect(() => {
      // If turnstile script was already loaded on window, render immediately
      if (typeof window !== "undefined" && window.turnstile) {
        renderWidget();
      }

      return () => {
        if (
          widgetIdRef.current !== null &&
          typeof window !== "undefined" &&
          window.turnstile
        ) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // ignore
          }
          widgetIdRef.current = null;
        }
      };
    }, [renderWidget]);

    return (
      <div className={`turnstile-wrapper my-3 flex justify-center ${className}`}>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={renderWidget}
        />
        <div ref={containerRef} className="min-h-[65px]" />
      </div>
    );
  }
);

TurnstileWidget.displayName = "TurnstileWidget";
export default TurnstileWidget;
