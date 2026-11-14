"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowRight,
  Coins,
  Fuel,
  Flame,
  Package,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface HeroSlideTranslation {
  badge: string;
  headline: string;
  description: string;
  sector: string;
}

export interface HeroCarouselTranslations {
  ariaLabel: string;
  prevSlide: string;
  nextSlide: string;
  slideCounter: string;
  goToSlide: string;
  pauseAutoplay: string;
  resumeAutoplay: string;
  statusActive: string;
  exploreSector: string;
  submitRequest: string;
  slide1: HeroSlideTranslation;
  slide2: HeroSlideTranslation;
  slide3: HeroSlideTranslation;
  slide4: HeroSlideTranslation;
}

export interface HeroCarouselProps {
  translations: HeroCarouselTranslations;
  className?: string;
}

interface SlideConfig {
  id: string;
  imageSrc: string;
  imageAlt: string;
  key: "slide1" | "slide2" | "slide3" | "slide4";
  catalogLink: string;
  requestLink: string;
  icon: LucideIcon;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  objectPosition: string;
}

const SLIDES_CONFIG: SlideConfig[] = [
  {
    id: "metals",
    imageSrc: "/images/hero/cuivre-et-aluminium-au-port.png",
    imageAlt:
      "Industrial port terminal with stacked copper cathodes and aluminium extrusion billets beside shipping cranes and cargo freighter at sunset",
    key: "slide1",
    catalogLink: "/catalog?sector=metals_industrial",
    requestLink: "/deals/new?side=buy&sector=metals_industrial",
    icon: Coins,
    accentColor: "#c9a961",
    badgeBg: "rgba(201, 169, 97, 0.15)",
    badgeBorder: "rgba(201, 169, 97, 0.35)",
    badgeText: "#f1d48b",
    objectPosition: "center right",
  },
  {
    id: "petroleum",
    imageSrc: "/images/hero/raffinerie-et-terminal-petrolier-au-crepuscule.png",
    imageAlt:
      "Petroleum refinery distillation units, industrial piping manifolds, and crude tanker berthed at marine terminal at dusk",
    key: "slide2",
    catalogLink: "/catalog?sector=refined_petroleum",
    requestLink: "/deals/new?side=buy&sector=refined_petroleum",
    icon: Fuel,
    accentColor: "#d4956b",
    badgeBg: "rgba(212, 149, 107, 0.15)",
    badgeBorder: "rgba(212, 149, 107, 0.35)",
    badgeText: "#f0b992",
    objectPosition: "center right",
  },
  {
    id: "gas",
    imageSrc: "/images/hero/navire-gnl-et-terminal-a-laube.png",
    imageAlt:
      "Spherical tank LNG carrier ship navigating open sea channel towards cryogenic liquefied gas terminal storage tanks at dawn",
    key: "slide3",
    catalogLink: "/catalog?sector=natural_gas_ngls",
    requestLink: "/deals/new?side=buy&sector=natural_gas_ngls",
    icon: Flame,
    accentColor: "#38bdf8",
    badgeBg: "rgba(56, 189, 248, 0.15)",
    badgeBorder: "rgba(56, 189, 248, 0.35)",
    badgeText: "#7dd3fc",
    objectPosition: "center center",
  },
  {
    id: "sugar",
    imageSrc: "/images/hero/sucre-raffine-et-port-industriel.png",
    imageAlt:
      "Stainless steel testing tray with high-grade refined white sugar crystals in foreground with port storage silos and bulk conveyor loading ship",
    key: "slide4",
    catalogLink: "/catalog?sector=sugar",
    requestLink: "/deals/new?side=buy&sector=sugar",
    icon: Package,
    accentColor: "#f43f5e",
    badgeBg: "rgba(244, 63, 94, 0.15)",
    badgeBorder: "rgba(244, 63, 94, 0.35)",
    badgeText: "#fda4af",
    objectPosition: "center right",
  },
];

const AUTOPLAY_INTERVAL = 6000; // 6 seconds

export function HeroCarousel({ translations, className }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  const totalSlides = SLIDES_CONFIG.length;

  const goToSlide = useCallback(
    (index: number) => {
      const nextIndex = (index + totalSlides) % totalSlides;
      setCurrentIndex(nextIndex);
      setProgressKey((k) => k + 1);
    },
    [totalSlides]
  );

  const nextSlide = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  const isAutoplayActive =
    !prefersReducedMotion && !isPausedByUser && !isHovered && !isFocused;

  // Autoplay timer
  useEffect(() => {
    if (!isAutoplayActive) return;

    const timer = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isAutoplayActive, nextSlide]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      // In RTL, visual direction flips or standard advance
      nextSlide();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "Home") {
      e.preventDefault();
      goToSlide(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goToSlide(totalSlides - 1);
    }
  };

  // Touch swipe handling
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null)
      return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartXRef.current;
    const deltaY = touchEndY - touchStartYRef.current;

    // Ensure horizontal gesture is dominant
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swiped left
        nextSlide();
      } else {
        // Swiped right
        prevSlide();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  const activeSlideConfig = SLIDES_CONFIG[currentIndex];
  const activeSlideData = translations[activeSlideConfig.key];

  return (
    <section
      ref={carouselRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={translations.ariaLabel || "Featured Commodity Markets"}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={() => setIsFocused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={cn(
        "relative w-full max-w-7xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border border-[#23273b] shadow-2xl bg-[#07080c] select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b87333]",
        "h-[580px] sm:h-[620px] lg:h-[680px]",
        className
      )}
    >
      {/* Screen Reader Live Announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {translations.slideCounter
          ?.replace("{current}", (currentIndex + 1).toString())
          ?.replace("{total}", totalSlides.toString()) ||
          `Slide ${currentIndex + 1} of ${totalSlides}`}
        : {activeSlideData.headline} — {activeSlideData.description}
      </div>

      {/* Slides Deck */}
      <div className="relative w-full h-full">
        {SLIDES_CONFIG.map((slide, index) => {
          const isActive = index === currentIndex;
          const slideData = translations[slide.key];
          const Icon = slide.icon;

          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={translations.slideCounter
                ?.replace("{current}", (index + 1).toString())
                ?.replace("{total}", totalSlides.toString())}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 w-full h-full",
                prefersReducedMotion
                  ? isActive
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0 pointer-events-none"
                  : "transition-opacity duration-700 ease-in-out",
                isActive
                  ? "opacity-100 z-10 pointer-events-auto"
                  : "opacity-0 z-0 pointer-events-none"
              )}
            >
              {/* Background Next.js Optimized Image */}
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <Image
                  src={slide.imageSrc}
                  alt={slide.imageAlt}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 1280px"
                  className={cn(
                    "object-cover transition-transform duration-1000 ease-out",
                    isActive ? "scale-100" : "scale-105"
                  )}
                  style={{ objectPosition: slide.objectPosition }}
                />
              </div>

              {/* Ambient Dark Gradient Overlays (Tailored for LTR & RTL copy visibility) */}
              <div
                className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#07080c]/95 via-[#07080c]/60 to-transparent sm:hidden"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 pointer-events-none hidden sm:block bg-gradient-to-r from-[#07080c]/95 via-[#07080c]/75 via-45% to-[#07080c]/15 rtl:bg-gradient-to-l"
                aria-hidden="true"
              />
              {/* Top ambient luxury copper glow */}
              <div
                className="absolute top-0 inset-x-0 h-28 pointer-events-none bg-gradient-to-b from-[#07080c]/70 via-[#07080c]/20 to-transparent"
                aria-hidden="true"
              />

              {/* Slide Content Card in Open Area */}
              <div className="relative z-10 w-full h-full flex flex-col justify-end sm:justify-center p-5 sm:p-10 lg:p-14">
                <div
                  className={cn(
                    "max-w-xl lg:max-w-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10",
                    "bg-[#07080c]/75 backdrop-blur-md border border-white/10 shadow-2xl",
                    "transition-all duration-500 ease-out",
                    isActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  )}
                >
                  {/* Sector Pill Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-4 shadow-sm backdrop-blur-sm"
                    style={{
                      backgroundColor: slide.badgeBg,
                      borderColor: slide.badgeBorder,
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: slide.accentColor }} />
                    <span
                      className="text-xs sm:text-sm font-semibold tracking-wide"
                      style={{ color: slide.badgeText }}
                    >
                      {slideData.badge}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: slide.accentColor }}
                    />
                  </div>

                  {/* Localized Headline */}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-[1.18]">
                    {slideData.headline}
                  </h2>

                  {/* Factual Localized Description */}
                  <p className="mt-3.5 text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
                    {slideData.description}
                  </p>

                  {/* Call-to-Action Buttons */}
                  <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
                    <Link
                      href={slide.requestLink}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#b87333] via-[#c9a961] to-[#8b5a2b] text-white font-semibold text-sm sm:text-base shadow-lg shadow-[#b87333]/30 hover:shadow-xl hover:shadow-[#b87333]/45 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                    >
                      <span>{translations.submitRequest}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
                    </Link>

                    <Link
                      href={slide.catalogLink}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0f1118]/80 hover:bg-[#161824] border border-[#23273b] hover:border-[#b87333]/50 text-gray-200 hover:text-white font-medium text-sm sm:text-base backdrop-blur-md transition-all"
                    >
                      <span>{translations.exploreSector}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Arrow Controls (Desktop & Tablet) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label={translations.prevSlide || "Previous slide"}
        className="absolute left-3 sm:left-4 rtl:left-auto rtl:right-3 rtl:sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#07080c]/80 hover:bg-[#b87333] border border-white/15 hover:border-[#b87333] text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white group"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 rtl:rotate-180 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 transition-transform" />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label={translations.nextSlide || "Next slide"}
        className="absolute right-3 sm:right-4 rtl:right-auto rtl:left-3 rtl:sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#07080c]/80 hover:bg-[#b87333] border border-white/15 hover:border-[#b87333] text-white flex items-center justify-center backdrop-blur-md shadow-xl transition-all hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white group"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 rtl:rotate-180 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
      </button>

      {/* Bottom Bar: Indicators & Autoplay Control */}
      <div className="absolute bottom-3 sm:bottom-5 inset-x-4 sm:inset-x-8 z-20 flex items-center justify-between gap-3 pointer-events-none">
        {/* Manual Autoplay Pause/Resume Button (WCAG 2.2.2) */}
        <button
          type="button"
          onClick={() => setIsPausedByUser((p) => !p)}
          aria-label={
            isPausedByUser
              ? translations.resumeAutoplay || "Resume automatic slide rotation"
              : translations.pauseAutoplay || "Pause automatic slide rotation"
          }
          className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#07080c]/80 hover:bg-[#161824] border border-white/15 text-gray-300 hover:text-white backdrop-blur-md text-xs font-mono transition-all shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b87333]"
        >
          {isPausedByUser ? (
            <>
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              <span className="hidden sm:inline">Play</span>
            </>
          ) : (
            <>
              <Pause className="w-3.5 h-3.5 text-[#d4956b]" />
              <span className="hidden sm:inline">6s</span>
            </>
          )}
        </button>

        {/* 4 Segmented Interactive Slide Indicators */}
        <div
          role="tablist"
          aria-label="Slides"
          className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 bg-[#07080c]/70 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10 shadow-lg"
        >
          {SLIDES_CONFIG.map((slide, idx) => {
            const isActive = idx === currentIndex;
            const slideData = translations[slide.key];

            return (
              <button
                key={slide.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-current={isActive ? "true" : undefined}
                aria-label={
                  translations.goToSlide
                    ?.replace("{slide}", (idx + 1).toString()) ||
                    `Go to slide ${idx + 1}`
                }
                onClick={() => goToSlide(idx)}
                className={cn(
                  "relative group px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-1.5 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b87333]",
                  isActive
                    ? "bg-[#b87333]/30 text-white border border-[#b87333] shadow-md shadow-[#b87333]/20"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent"
                )}
              >
                {/* Visual Progress Bar for active playing slide */}
                {isActive && isAutoplayActive && (
                  <span
                    key={progressKey}
                    className="absolute inset-0 bg-[#b87333]/30 animate-carousel-progress origin-left rtl:origin-right pointer-events-none"
                    style={{ animationDuration: `${AUTOPLAY_INTERVAL}ms` }}
                  />
                )}
                <span className="font-mono text-[11px] sm:text-xs font-semibold relative z-10" dir="ltr">
                  0{idx + 1}
                </span>
                <span className="hidden md:inline relative z-10 truncate max-w-[90px] text-xs">
                  {slideData.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Slide Counter Pill */}
        <div
          className="pointer-events-auto hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-[#07080c]/80 border border-white/15 text-gray-300 text-xs font-mono backdrop-blur-md shadow-lg"
          dir="ltr"
        >
          <span className="text-white font-bold">{currentIndex + 1}</span>
          <span className="mx-1 text-gray-500">/</span>
          <span>{totalSlides}</span>
        </div>
      </div>
    </section>
  );
}
