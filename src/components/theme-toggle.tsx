"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  locale?: string;
}

export function ThemeToggle({
  className,
  showLabel = false,
  locale = "en",
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAr = locale === "ar";
  const isDark = theme === "dark";

  const label = isDark
    ? isAr
      ? "المظهر الفاتح"
      : "Light Mode"
    : isAr
    ? "المظهر الداكن"
    : "Dark Mode";

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-9 h-9 rounded-xl border border-[#23273b] bg-[#0f1118]/80 animate-pulse",
          className
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={label}
      aria-label={label}
      className={cn(
        "relative flex items-center justify-center gap-2 rounded-xl transition-all duration-300",
        "bg-[#0f1118]/80 hover:bg-[#161824] border border-[#23273b] hover:border-[#b87333]/50",
        "text-gray-300 hover:text-white shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b87333]",
        showLabel ? "px-3 py-1.5 text-xs font-medium" : "p-2",
        className
      )}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-[#d4956b] transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Moon className="w-4 h-4 text-[#8b5a2b] transition-transform duration-300 rotate-0 scale-100" />
        )}
      </div>

      {showLabel && <span className="font-mono text-xs">{label}</span>}
    </button>
  );
}
