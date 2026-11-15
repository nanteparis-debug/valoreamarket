"use client";

import React, { useEffect, useRef } from "react";
import Script from "next/script";
import { TRUSTPILOT_CONFIG } from "@/lib/trustpilot";
import { useTheme } from "@/components/theme-provider";

declare global {
  interface Window {
    Trustpilot?: {
      loadFromElement: (element: HTMLElement | null, forceReload?: boolean) => void;
      load: () => void;
    };
  }
}

interface TrustBoxWidgetProps {
  className?: string;
  locale?: string;
}

export function TrustBoxWidget({ className, locale = "en" }: TrustBoxWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Map app locale to Trustpilot supported widget locales
  const trustpilotLocale = locale === "fr" ? "fr-FR" : locale === "de" ? "de-DE" : locale === "es" ? "es-ES" : "en-US";
  const widgetTheme = theme === "light" ? "light" : "dark";

  const reloadWidget = () => {
    if (typeof window !== "undefined" && window.Trustpilot?.loadFromElement && containerRef.current) {
      window.Trustpilot.loadFromElement(containerRef.current, true);
    }
  };

  useEffect(() => {
    reloadWidget();
  }, [locale, theme]);

  return (
    <div className={className} key={`trustbox-${widgetTheme}-${trustpilotLocale}`}>
      <Script
        id="trustpilot-widget-script"
        src={TRUSTPILOT_CONFIG.scriptUrl}
        strategy="lazyOnload"
        onLoad={reloadWidget}
      />
      {/* Official TrustBox widget - Review Collector */}
      <div
        ref={containerRef}
        className="trustpilot-widget w-full flex items-center justify-center min-h-[52px]"
        data-locale={trustpilotLocale}
        data-template-id={TRUSTPILOT_CONFIG.templateId}
        data-businessunit-id={TRUSTPILOT_CONFIG.businessUnitId}
        data-style-height="52px"
        data-style-width="100%"
        data-theme={widgetTheme}
      >
        <a
          href={TRUSTPILOT_CONFIG.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-emerald-400 font-mono transition-colors"
        >
          Trustpilot
        </a>
      </div>
    </div>
  );
}
