"use client";

import React from "react";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { TRUSTPILOT_CONFIG } from "@/lib/trustpilot";

interface TrustpilotBadgeProps {
  locale?: string;
  variant?: "pill" | "card" | "mini";
  className?: string;
  reviewUrl?: string;
}

export function TrustpilotBadge({
  locale = "en",
  variant = "pill",
  className,
  reviewUrl = TRUSTPILOT_CONFIG.profileUrl,
}: TrustpilotBadgeProps) {
  const isAr = locale === "ar";

  if (variant === "mini") {
    return (
      <a
        href={reviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="View VALOREA MARKET on Trustpilot"
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0c0e17] border border-[#23273b] hover:border-[#00B67A]/60 transition-all text-xs font-mono text-gray-300 hover:text-white shadow-sm group",
          className
        )}
      >
        <Image
          src="/images/trustpilot-logo.svg"
          alt="Trustpilot"
          width={88}
          height={20}
          className="h-4 w-auto"
        />
        <div className="flex items-center gap-1">
          <Image
            src="/images/trustpilot-stars.svg"
            alt="5 Stars"
            width={72}
            height={14}
            className="h-3 w-auto"
          />
          <span className="text-[11px] font-bold text-emerald-400 font-sans">4.9</span>
        </div>
        <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-emerald-400 transition-colors" />
      </a>
    );
  }

  if (variant === "card") {
    return (
      <a
        href={reviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "p-4 rounded-2xl bg-[#0c0e17] border border-[#23273b] hover:border-[#00B67A]/60 transition-all shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#121624] border border-[#23273b] group-hover:border-[#00B67A]/40 transition-colors shrink-0">
            <Image
              src="/images/trustpilot-logo.svg"
              alt="Trustpilot"
              width={100}
              height={24}
              className="h-5 w-auto"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-white [html.light_&]:text-slate-900">
                {isAr ? "ممتاز 4.9 من 5" : "Rated Excellent 4.9 / 5"}
              </span>
              <Image
                src="/images/trustpilot-stars.svg"
                alt="5 Stars"
                width={80}
                height={16}
                className="h-3.5 w-auto"
              />
            </div>
            <p className="text-[11px] text-gray-300 dark:text-gray-400 [html.light_&]:text-slate-600 mt-0.5">
              {isAr
                ? "تقييمات موثقة من بيوت التجارة والمشترين والموردين الدوليين"
                : "Verified reviews from international commodity trading desks"}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141a29] [html.light_&]:bg-slate-100 border border-[#23273b] [html.light_&]:border-slate-300 text-xs font-mono text-emerald-400 [html.light_&]:text-emerald-700 group-hover:bg-[#00B67A]/10 group-hover:border-[#00B67A]/40 transition-all shrink-0">
          <span>{isAr ? "عرض التقييمات على Trustpilot" : "See Trustpilot Profile"}</span>
          <ExternalLink className="w-3.5 h-3.5 rtl:rotate-180" />
        </div>
      </a>
    );
  }

  // Default "pill" variant
  return (
    <a
      href={reviewUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0c0e17] border border-[#23273b] hover:border-[#00B67A]/60 transition-all shadow-md group",
        className
      )}
    >
      <span className="text-[11px] font-medium text-gray-300 [html.light_&]:text-slate-700">
        {isAr ? "تقييم ممتاز على" : "Rated Excellent on"}
      </span>
      <Image
        src="/images/trustpilot-logo.svg"
        alt="Trustpilot"
        width={76}
        height={18}
        className="h-3.5 w-auto"
      />
      <Image
        src="/images/trustpilot-stars.svg"
        alt="5 Stars"
        width={68}
        height={13}
        className="h-3 w-auto"
      />
      <span className="text-[11px] font-bold text-white [html.light_&]:text-slate-900 font-mono">4.9/5</span>
    </a>
  );
}
