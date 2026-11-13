"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingThemeToggleProps {
  locale?: string;
}

export function FloatingThemeToggle({ locale = "en" }: FloatingThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAr = locale === "ar";
  const isDark = theme === "dark";

  const label = isDark
    ? isAr
      ? "التبديل إلى المظهر الفاتح"
      : "Switch to Light Mode"
    : isAr
    ? "التبديل إلى المظهر الداكن"
    : "Switch to Dark Mode";

  const currentThemeName = isDark
    ? isAr
      ? "المظهر الداكن"
      : "Dark Mode"
    : isAr
    ? "المظهر الفاتح"
    : "Light Mode";

  if (!mounted) return null;

  return (
    <aside
      aria-label="Theme Switcher"
      className="fixed bottom-5 left-5 rtl:left-auto rtl:right-5 z-40 print:hidden"
    >
      <button
        type="button"
        onClick={toggleTheme}
        title={label}
        aria-label={label}
        className={cn(
          "group flex items-center gap-2.5 px-3.5 py-2 rounded-full",
          "bg-[#0e1018]/90 hover:bg-[#161824] backdrop-blur-md",
          "border border-[#23273b] hover:border-[#b87333]/60",
          "shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-[#b87333]/20",
          "transition-all duration-300 hover:scale-105 active:scale-95"
        )}
      >
        <div className="w-5 h-5 rounded-full bg-[#161824] border border-[#2b334d] flex items-center justify-center group-hover:border-[#b87333]/50 transition-colors">
          {isDark ? (
            <Sun className="w-3.5 h-3.5 text-[#d4956b] group-hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-[#8b5a2b] group-hover:-rotate-12 transition-transform duration-300" />
          )}
        </div>
        <span className="text-xs font-medium text-gray-200 group-hover:text-white hidden sm:inline-block font-mono">
          {currentThemeName}
        </span>
      </button>
    </aside>
  );
}
