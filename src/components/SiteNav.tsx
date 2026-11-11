"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

// Floating liquid-glass navbar at the bottom of every page: pages only (the home page's sections live on the ruler rail).
// A glass pill slides under the hovered or current link. The bar steps away while you scroll down and comes back
// when you scroll up, reach the end of the page, move the pointer near the bottom edge, or tab into it.
// On Chromium the backdrop also bends at the rim through an SVG displacement map built for the bar's size.

type Page = { label: string; href: string; external?: boolean };

// Displacement map for a capsule: neutral grey inside, pushed toward the centre within EDGE px of the rim.
function glassMap(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d");
  if (!g) return "";
  const img = g.createImageData(w, h), r = h / 2, EDGE = Math.min(18, r);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - w / 2, py = y + 0.5 - h / 2, qx = Math.abs(px) - (w / 2 - r), qy = Math.abs(py) - (h / 2 - r);
      const d = -(Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r);
      let nx = 0, ny = 0;
      if (qx > 0 && qy > 0) { const l = Math.hypot(qx, qy) || 1; nx = (qx / l) * Math.sign(px); ny = (qy / l) * Math.sign(py); }
      else if (qx > qy) nx = Math.sign(px);
      else ny = Math.sign(py);
      const k = d < EDGE ? Math.pow(1 - Math.max(0, d) / EDGE, 2) : 0, i = (y * w + x) * 4;
      img.data[i] = 128 - nx * k * 127; img.data[i + 1] = 128 - ny * k * 127; img.data[i + 2] = 128; img.data[i + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  return c.toDataURL();
}

export function SiteNav({ shortName, pages }: { shortName: string; pages: Page[] }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const indRef = useRef<HTMLSpanElement>(null);
  const mapRef = useRef<SVGFEImageElement>(null);

  const placeInd = useCallback((a: HTMLElement | null) => {
    const ind = indRef.current;
    if (!ind) return;
    if (!a) { ind.style.opacity = "0"; return; }
    ind.style.opacity = "1";
    ind.style.width = a.offsetWidth + "px";
    ind.style.transform = `translateX(${a.offsetLeft}px)`;
  }, []);
  const active = useCallback(() => pagesRef.current?.querySelector<HTMLElement>('a[aria-current="page"]') ?? null, []);

  // the pill follows the current page
  useEffect(() => {
    placeInd(active());
    const onResize = () => placeInd(active());
    document.fonts?.ready.then(onResize);
    addEventListener("resize", onResize);
    return () => removeEventListener("resize", onResize);
  }, [pathname, placeInd, active]);

  // step away while scrolling down
  useEffect(() => {
    const root = document.documentElement, nav = navRef.current!;
    let lastY = scrollY, acc = 0, nearBottom = false;
    const away = (on: boolean) => root.classList.toggle("nav-away", on && !nearBottom && !nav.matches(":focus-within"));
    const onScroll = () => {
      const y = scrollY, dy = y - lastY;
      lastY = y;
      root.classList.toggle("scrolled", y > 40);
      acc = Math.sign(dy) === Math.sign(acc) ? acc + dy : dy; // distance scrolled in the current direction
      const atEnd = y >= root.scrollHeight - innerHeight - 160;
      if (y < 120 || atEnd || acc < -24) away(false);
      else if (acc > 48) away(true);
    };
    const onMove = (e: PointerEvent) => {
      const nb = e.pointerType === "mouse" && e.clientY > innerHeight - 110;
      if (nb !== nearBottom) { nearBottom = nb; if (nb) away(false); }
    };
    const onFocus = () => away(false);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("pointermove", onMove, { passive: true });
    nav.addEventListener("focusin", onFocus);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("pointermove", onMove);
      nav.removeEventListener("focusin", onFocus);
      root.classList.remove("nav-away", "scrolled");
    };
  }, [pathname]);

  // rim refraction, Chromium only (other engines ignore an SVG filter in backdrop-filter)
  useEffect(() => {
    const root = document.documentElement, nav = navRef.current!, map = mapRef.current!;
    if (!/Chrome\//.test(navigator.userAgent) || matchMedia("(prefers-reduced-transparency: reduce)").matches) return;
    root.classList.add("refract");
    let raf = 0;
    const rebuild = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = Math.round(nav.offsetWidth), h = Math.round(nav.offsetHeight);
        if (!w || !h) return;
        map.setAttribute("width", String(w));
        map.setAttribute("height", String(h));
        map.setAttribute("href", glassMap(w, h));
      });
    };
    const ro = new ResizeObserver(rebuild);
    ro.observe(nav);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); root.classList.remove("refract"); };
  }, []);

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
        <filter id="lg" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage ref={mapRef} x="0" y="0" width="640" height="52" preserveAspectRatio="none" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale="26" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <nav className="nav" ref={navRef} aria-label="Pages">
        <div className="nav-in">
          <Link className="me" href="/">{shortName}</Link>
          <div
            className="pages"
            ref={pagesRef}
            onPointerOver={(e) => placeInd((e.target as Element).closest("a"))}
            onPointerLeave={() => placeInd(active())}
            onFocus={(e) => placeInd((e.target as Element).closest("a"))}
            onBlur={() => placeInd(active())}
          >
            <span className="ind" ref={indRef} aria-hidden="true" />
            {pages.map((p) =>
              p.external ? (
                <a key={p.href} href={p.href}>{p.label} ↗</a>
              ) : (
                <Link key={p.href} href={p.href} aria-current={p.href === pathname ? "page" : undefined}>{p.label}</Link>
              ),
            )}
          </div>
          <a className="cta" href="#contact">Contact</a>
        </div>
      </nav>
    </>
  );
}
