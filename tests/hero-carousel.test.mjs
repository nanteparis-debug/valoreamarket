import test from "node:test";
import assert from "node:assert";
import fs from "node:fs/promises";
import path from "node:path";

const HERO_DIR = path.resolve("public/images/hero");
const MESSAGES_DIR = path.resolve("src/messages");

test("Hero Carousel: All 4 supplied commodity images exist directly on disk", async () => {
  const expectedFiles = [
    "Cuivre et aluminium au port.png",
    "cuivre-et-aluminium-au-port.png",
    "Raffinerie et terminal pétrolier au crépuscule.png",
    "raffinerie-et-terminal-petrolier-au-crepuscule.png",
    "Navire GNL et terminal à l’aube.png",
    "navire-gnl-et-terminal-a-laube.png",
    "Sucre raffiné et port industriel.png",
    "sucre-raffine-et-port-industriel.png",
  ];

  for (const filename of expectedFiles) {
    const filePath = path.join(HERO_DIR, filename);
    const stat = await fs.stat(filePath);
    assert.ok(stat.isFile(), `Hero image file ${filename} must exist as a file`);
    assert.ok(stat.size > 500000, `Hero image ${filename} must be high-res (>500KB)`);
  }
});

test("Hero Carousel: Complete 8-locale coverage with factual localized content", async () => {
  const locales = ["ar", "fr", "en", "es", "de", "zh-Hans", "ja", "ru"];

  for (const locale of locales) {
    const jsonPath = path.join(MESSAGES_DIR, `${locale}.json`);
    const raw = await fs.readFile(jsonPath, "utf-8");
    const json = JSON.parse(raw);

    assert.ok(json.heroCarousel, `heroCarousel section must exist in ${locale}.json`);

    const hc = json.heroCarousel;
    assert.ok(hc.ariaLabel, `ariaLabel missing in ${locale}`);
    assert.ok(hc.prevSlide, `prevSlide missing in ${locale}`);
    assert.ok(hc.nextSlide, `nextSlide missing in ${locale}`);
    assert.ok(hc.goToSlide, `goToSlide missing in ${locale}`);
    assert.ok(hc.pauseAutoplay, `pauseAutoplay missing in ${locale}`);
    assert.ok(hc.resumeAutoplay, `resumeAutoplay missing in ${locale}`);
    assert.ok(hc.exploreSector, `exploreSector missing in ${locale}`);
    assert.ok(hc.submitRequest, `submitRequest missing in ${locale}`);

    // Verify 4 slides
    const slides = [hc.slide1, hc.slide2, hc.slide3, hc.slide4];
    assert.strictEqual(slides.length, 4, `Must have exactly 4 slides in ${locale}`);

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      assert.ok(slide.badge, `slide${i + 1}.badge missing in ${locale}`);
      assert.ok(slide.headline, `slide${i + 1}.headline missing in ${locale}`);
      assert.ok(slide.description, `slide${i + 1}.description missing in ${locale}`);
      assert.ok(slide.sector, `slide${i + 1}.sector missing in ${locale}`);
    }
  }
});

test("Hero Carousel: Component behaviors, accessibility, and event handlers", async () => {
  const carouselSource = await fs.readFile(
    "src/components/landing/hero-carousel.tsx",
    "utf-8"
  );

  // 1. Autoplay 6 seconds
  assert.ok(
    carouselSource.includes("AUTOPLAY_INTERVAL = 6000") ||
      carouselSource.includes("6000"),
    "Autoplay interval must be set to 6 seconds (6000ms)"
  );

  // 2. Reduced motion compliance
  assert.ok(
    carouselSource.includes("prefers-reduced-motion"),
    "Must respect window.matchMedia('(prefers-reduced-motion: reduce)')"
  );

  // 3. Pause on hover and focus
  assert.ok(
    carouselSource.includes("onPointerEnter") &&
      carouselSource.includes("onPointerLeave"),
    "Must pause on pointer hover and resume on leave"
  );
  assert.ok(
    carouselSource.includes("onFocusCapture") &&
      carouselSource.includes("onBlurCapture"),
    "Must pause on keyboard focus inside and resume on blur"
  );

  // 4. Touch swipe handling
  assert.ok(
    carouselSource.includes("onTouchStart") &&
      carouselSource.includes("onTouchEnd"),
    "Must support touch swipe navigation"
  );

  // 5. Keyboard navigation
  assert.ok(
    carouselSource.includes("ArrowRight") &&
      carouselSource.includes("ArrowLeft"),
    "Must support Arrow key navigation"
  );

  // 6. WCAG 2.2 accessibility roles
  assert.ok(
    carouselSource.includes('role="region"') &&
      carouselSource.includes('aria-roledescription="carousel"'),
    "Must have role='region' and aria-roledescription='carousel'"
  );
  assert.ok(
    carouselSource.includes('aria-live="polite"'),
    "Must have live region with aria-live='polite' for screen readers"
  );
  assert.ok(
    carouselSource.includes('role="tablist"') &&
      carouselSource.includes('role="tab"'),
    "Indicators must have tablist and tab roles"
  );

  // 7. Verified platform routes
  assert.ok(
    carouselSource.includes("/catalog?sector=metals_industrial"),
    "Must link to metals_industrial in catalog"
  );
  assert.ok(
    carouselSource.includes("/catalog?sector=refined_petroleum"),
    "Must link to refined_petroleum in catalog"
  );
  assert.ok(
    carouselSource.includes("/catalog?sector=natural_gas_ngls"),
    "Must link to natural_gas_ngls in catalog"
  );
  assert.ok(
    carouselSource.includes("/catalog?sector=sugar"),
    "Must link to sugar in catalog"
  );
});

test("Hero Carousel: Global CSS animations and progress keyframes", async () => {
  const cssSource = await fs.readFile("src/app/globals.css", "utf-8");

  assert.ok(
    cssSource.includes("@keyframes carouselProgress"),
    "globals.css must define @keyframes carouselProgress"
  );
  assert.ok(
    cssSource.includes(".animate-carousel-progress"),
    "globals.css must define .animate-carousel-progress class"
  );
  assert.ok(
    cssSource.includes("@keyframes slideInFromRight") &&
      cssSource.includes("@keyframes slideInFromLeft") &&
      cssSource.includes("@keyframes slideOutToLeft") &&
      cssSource.includes("@keyframes slideOutToRight"),
    "globals.css must define all 4 directional sliding keyframes"
  );
  assert.ok(
    cssSource.includes(".animate-slide-in-from-right") &&
      cssSource.includes(".animate-slide-in-from-left") &&
      cssSource.includes(".animate-slide-out-to-left") &&
      cssSource.includes(".animate-slide-out-to-right"),
    "globals.css must define all 4 directional sliding animation classes"
  );
});

test("Hero Carousel: RTL vs LTR language-aware sliding direction logic", async () => {
  const carouselSource = await fs.readFile(
    "src/components/landing/hero-carousel.tsx",
    "utf-8"
  );

  assert.ok(
    carouselSource.includes("isRtl"),
    "hero-carousel must detect RTL direction based on locale or document direction"
  );
  assert.ok(
    carouselSource.includes("animate-slide-in-from-left") &&
      carouselSource.includes("animate-slide-in-from-right"),
    "hero-carousel must use directional sliding classes based on isRtl and direction"
  );
  assert.ok(
    carouselSource.includes("isTransitioning"),
    "hero-carousel must track transition state between outgoing and incoming slides"
  );
});
