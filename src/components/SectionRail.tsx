"use client";

import { useEffect, useRef } from "react";

// Ruler rail for the home page, modeled on getartcraft.com's ruler.
// Every element with data-label is a section. Each label has three resting layouts: queued (small, bottom right),
// riding (vertical on the ruler, moving with its section) and piled (top right, the current one large).
// Between two layouts every letter flies its own curved path with a small per-letter delay,
// so a word leaves as a word and lands as a word. Positions come from the scroll position each frame, not from timers.

const TOP = 44; // height of the sticky section bars; the top label pile starts below them
const RAIL = 60, PADX = 14, HEAD = 34, RIDE = 20, QUEUE = 15, TOPPAD = 26, GAP = 26, SLOT = 21, QPAD = 34;
const FLIP_AT = 0.12, FLIP = 220, DETACH = 260, STAGGER = 0.16, ARC = 30, QALPHA = 0.36, MAPA = 0.85;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Pose = { x: number; y: number; rot: number; sc: number; al: number };
type Label = {
  s: HTMLElement; letters: HTMLSpanElement[]; hit: HTMLButtonElement;
  adv: number[]; cum: number[]; total: number; glow: number; over: boolean; dk: boolean[]; col: number[];
};

export function SectionRail() {
  const lettersRef = useRef<HTMLElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const miniRef = useRef<HTMLDivElement>(null);
  const vwinRef = useRef<HTMLDivElement>(null);
  const vpctRef = useRef<HTMLSpanElement>(null);
  const hlineRef = useRef<HTMLDivElement>(null);
  const poolTRef = useRef<HTMLDivElement>(null);
  const poolBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const rlWrap = lettersRef.current!, ruler = rulerRef.current!, strip = stripRef.current!, mini = miniRef.current!;
    const vwin = vwinRef.current!, vpct = vpctRef.current!, hline = hlineRef.current!, poolT = poolTRef.current!, poolB = poolBRef.current!;
    const secs = [...document.querySelectorAll<HTMLElement>("[data-label]")];
    const band = document.querySelector<HTMLElement>(".band");
    const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollToY = (y: number) => scrollTo({ top: y, behavior: reduced() ? "auto" : "smooth" });
    const scrollToEl = (el: HTMLElement) => scrollToY(el.getBoundingClientRect().top + scrollY);

    const L: Label[] = secs.map((s, i) => {
      const letters = [...(s.dataset.label ?? "").toUpperCase()].map((ch) => {
        const el = document.createElement("span");
        el.className = "rl"; el.textContent = ch; el.setAttribute("aria-hidden", "true");
        rlWrap.appendChild(el);
        return el;
      });
      const hit = document.createElement("button");
      hit.type = "button"; hit.className = "rhit"; hit.setAttribute("aria-label", "Go to " + s.dataset.label);
      const l: Label = { s, letters, hit, adv: [], cum: [], total: 0, glow: 0, over: false, dk: [], col: [] };
      hit.addEventListener("click", () => (i === 0 ? scrollToY(0) : scrollToEl(s)));
      hit.addEventListener("pointerenter", () => { l.over = true; });
      hit.addEventListener("pointerleave", () => { l.over = false; });
      rlWrap.appendChild(hit);
      return l;
    });

    let maxW = 0;
    const measure = () => {
      maxW = 0;
      for (const l of L) {
        let acc = 0;
        l.letters.forEach((el, k) => { const w = el.offsetWidth / HEAD; l.adv[k] = w; l.cum[k] = acc; acc += w; });
        l.total = acc; maxW = Math.max(maxW, acc * HEAD);
      }
      const w = maxW + RAIL + PADX + 64;
      poolT.style.width = poolB.style.width = w + "px";
      poolT.style.height = TOPPAD + (L.length - 1) * SLOT + GAP + HEAD + 64 + "px";
      poolB.style.height = QPAD + L.length * SLOT + 64 + "px";
    };
    const buildRuler = () => {
      const h = root.scrollHeight;
      strip.replaceChildren(); strip.style.height = h + "px";
      for (let y = 0, n = 0; y < h; y += 80, n++) {
        const t = document.createElement("div");
        t.className = "tick" + (n % 5 === 0 ? " major" : ""); t.style.top = y + "px";
        if (n % 5 === 0) { const s = document.createElement("span"); s.textContent = String(n); t.appendChild(s); }
        strip.appendChild(t);
      }
    };
    mini.replaceChildren();
    for (let i = 0; i <= 100; i++) {
      const t = document.createElement("div");
      t.className = "tick" + (i % 5 === 0 ? " major" : ""); t.style.top = i + "%";
      if (i % 10 === 0) { const s = document.createElement("span"); s.textContent = String(i); t.appendChild(s); }
      mini.appendChild(t);
    }
    const remeasure = () => { measure(); buildRuler(); };
    remeasure();
    document.fonts?.ready.then(remeasure);
    addEventListener("load", remeasure);
    let rT = 0;
    const onResize = () => { clearTimeout(rT); rT = window.setTimeout(remeasure, 120); };
    addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);

    // hover: every label lines up where its section sits on a 0-100 map of the page; press or drag the ruler to scrub
    let hy = 0, hs = 0, hsT = 0, drag = false, hTimer = 0;
    const scrubTo = (clientY: number) => {
      const top = ruler.getBoundingClientRect().top, rh = innerHeight - top;
      scrollTo({ top: clamp((clientY - top) / rh) * (root.scrollHeight - innerHeight), behavior: "instant" });
    };
    const setHover = (on: boolean) => {
      clearTimeout(hTimer);
      hTimer = window.setTimeout(() => { hsT = on ? 1 : 0; ruler.classList.toggle("hover", on); }, 150);
    };
    const onMove = (e: PointerEvent) => {
      hy = e.clientY;
      if (drag) { scrubTo(e.clientY); return; }
      if (hsT && (e.clientX < innerWidth - maxW - RAIL - 40 || e.clientY < TOP)) setHover(false);
    };
    const onEnter = () => { if (innerWidth >= 1024) setHover(true); };
    const onDown = (e: PointerEvent) => { e.preventDefault(); drag = true; root.classList.add("scrubbing"); ruler.setPointerCapture(e.pointerId); scrubTo(e.clientY); };
    const endScrub = (e: PointerEvent) => { drag = false; root.classList.remove("scrubbing"); try { ruler.releasePointerCapture(e.pointerId); } catch {} };
    const onLeave = () => { if (!drag) setHover(false); };
    addEventListener("pointermove", onMove, { passive: true });
    ruler.addEventListener("pointerenter", onEnter);
    ruler.addEventListener("pointerdown", onDown);
    ruler.addEventListener("pointerup", endScrub);
    ruler.addEventListener("pointercancel", endScrub);
    root.addEventListener("pointerleave", onLeave);

    let current = -1, last = performance.now(), raf = 0;
    const applyCurrent = (cur: number) => {
      if (cur === current) return;
      current = cur;
      L.forEach((l, i) => l.hit.setAttribute("aria-current", i === cur ? "true" : "false"));
    };
    const setCurrent = (vh: number) => {
      let cur = 0;
      secs.forEach((s, j) => { if (s.getBoundingClientRect().top < vh * 0.4) cur = j; });
      if (scrollY >= root.scrollHeight - vh - 2) cur = secs.length - 1;
      applyCurrent(cur);
    };

    const frame = (tNow: number) => {
      const dt = Math.min(0.1, (tNow - last) / 1000) || 0.016; last = tNow;
      const vw = innerWidth, vh = innerHeight, sy = scrollY, H = root.scrollHeight, M = Math.max(1, H - vh), top = TOP;
      hs += (hsT - hs) * (1 - Math.exp(-10 * dt));
      strip.style.transform = `translate3d(0, ${-sy}px, 0)`;
      const rh = vh, wh = Math.max(22, (vh / H) * rh), wy = (sy / H) * rh;
      vwin.style.transform = `translate3d(0, ${wy}px, 0)`; vwin.style.height = wh + "px";
      vpct.textContent = String(Math.round(clamp(sy / M) * 100)).padStart(3, "0") + "%";
      hline.style.transform = `translate3d(0, ${hy}px, 0)`;
      if (vw < 1024) { setCurrent(vh); return; }

      const n = L.length, Lth = top + FLIP_AT * vh, A = top + TOPPAD + HEAD / 2, I = vh - QPAD;
      const z = QUEUE / HEAD, rz = RIDE / HEAD, xRail = vw - RAIL / 2, bandTop = band ? band.getBoundingClientRect().top : Infinity;
      const st = L.map((l, j) => {
        const r = l.s.getBoundingClientRect(), v = r.top, rideLen = l.total * HEAD * rz;
        let flipP = 1;
        if (j > 0) {
          flipP = clamp((Lth + FLIP - v) / FLIP);
          // a section that can never scroll up to the flip line (the last one) flips over the last stretch of scroll instead
          if (r.top + sy - M > Lth) {
            const t0 = Math.min(r.bottom + sy - vh, M - 24), span = Math.max(24, M - t0);
            flipP = Math.max(flipP, clamp((sy - t0) / span));
          }
        }
        return { v, rideLen, flipP, detachP: 1, yq: I, docTop: j === 0 ? 0 : r.top + sy };
      });
      // the bottom queue closes ranks as labels leave it
      for (let j = n - 1, c = 0; j >= 1; j--) {
        const s = st[j];
        s.yq = I - SLOT * c;
        s.detachP = clamp((s.yq + DETACH - (s.v + s.rideLen)) / DETACH);
        c += 1 - s.detachP;
      }
      let Y = 0, U = 0, qT = 0, qB = 0;
      st.forEach((s, j) => {
        if (s.flipP >= 1) Y++; else if (s.flipP > 0) U += s.flipP;
        if (j > 0) { qT = Math.max(qT, s.flipP); qB = Math.max(qB, 1 - s.detachP); }
      });
      const cur = Math.max(0, Y - 1);
      const mTop = top + 14, mH = vh - top - 28, mapY: number[] = [];
      let minY = -1e9;
      st.forEach((s, j) => { let y = mTop + (s.docTop / H) * mH; y = Math.max(y, minY + SLOT + 2); mapY[j] = y; minY = y; });

      const B = (l: Label, k: number, y: number, sc: number, al: number): Pose => {
        const s = (l.cum[k] + l.adv[k] / 2) * HEAD * sc;
        return { x: vw - RAIL - PADX - (l.total * HEAD * sc - s), y, rot: 0, sc, al };
      };
      const Z = (l: Label, k: number, r: number): Pose => ({ x: xRail, y: r + (l.total - l.cum[k] - l.adv[k] / 2) * HEAD * rz, rot: -90, sc: rz, al: QALPHA });

      L.forEach((l, j) => {
        const { v, rideLen, flipP, detachP, yq } = st[j];
        let t: number, from: (k: number) => Pose, to: (k: number) => Pose, rev = false;
        if (flipP > 0) {
          t = flipP; rev = true; from = (k) => Z(l, k, v);
          if (flipP >= 1) {
            const tt = j === Y - 1 ? U : 1, y = A + j * SLOT + GAP * (1 - tt), sc = 1 - (1 - z) * tt, al = 1 - (1 - QALPHA) * tt;
            to = (k) => B(l, k, y, sc, al);
          } else to = (k) => B(l, k, A + j * SLOT + GAP, 1, 1);
        } else if (detachP < 1) {
          t = detachP; rev = true;
          const yr = yq - rideLen;
          from = (k) => B(l, k, yq, z, QALPHA); to = (k) => Z(l, k, yr);
        } else { t = 1; from = to = (k) => Z(l, k, v); }

        l.glow += ((l.over ? 1 : 0) - l.glow) * (1 - Math.exp(-dt / 0.08));
        const N = l.letters.length, O = 1 + (N - 1) * STAGGER;
        let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, amax = 0;
        for (let k = 0; k < N; k++) {
          const el = l.letters[k], o = rev ? N - 1 - k : k, d = ease(clamp(t * O - o * STAGGER));
          const h = from(k), m = to(k), gx = (h.x + m.x) / 2 - ARC, gy = (h.y + m.y) / 2, b = 1 - d;
          let x = b * b * h.x + 2 * b * d * gx + d * d * m.x, y = b * b * h.y + 2 * b * d * gy + d * d * m.y;
          let rot = lerp(h.rot, m.rot, d), sc = lerp(h.sc, m.sc, d), al = lerp(h.al, m.al, d);
          if (hs > 0.001) {
            const p = B(l, k, mapY[j], z, j === cur ? 1 : MAPA);
            x += (p.x - x) * hs; y += (p.y - y) * hs; rot *= 1 - hs; sc += (p.sc - sc) * hs; al += (p.al - al) * hs;
          }
          al += (1 - al) * l.glow;
          const dk = y > bandTop;
          if (dk !== l.dk[k]) { el.classList.toggle("dk", dk); l.dk[k] = dk; }
          const pct = Math.round(clamp(al) * 100);
          if (pct !== l.col[k]) { el.style.setProperty("--a", pct + "%"); l.col[k] = pct; }
          el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
          const hw = (l.adv[k] * HEAD * sc) / 2 + 2, hh = (HEAD * sc) / 2 + 2, side = Math.abs(rot) > 45;
          const ex = side ? hh : hw, ey = side ? hw : hh;
          x0 = Math.min(x0, x - ex); x1 = Math.max(x1, x + ex); y0 = Math.min(y0, y - ey); y1 = Math.max(y1, y + ey); amax = Math.max(amax, al);
        }
        const hit = l.hit;
        hit.style.transform = `translate3d(${(x0 - 2).toFixed(1)}px, ${(y0 - 2).toFixed(1)}px, 0)`;
        hit.style.width = x1 - x0 + 4 + "px"; hit.style.height = y1 - y0 + 4 + "px";
        hit.style.pointerEvents = amax > 0.05 ? "auto" : "none";
      });
      // blurred pools keep the stacks readable over content; they step aside over the charcoal band
      poolT.style.opacity = String(bandTop < top + poolT.offsetHeight ? 0 : qT);
      poolB.style.opacity = String(bandTop < vh ? 0 : qB);
      applyCurrent(cur);
    };
    const loop = (t: number) => { frame(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf); clearTimeout(rT); clearTimeout(hTimer); ro.disconnect();
      removeEventListener("resize", onResize); removeEventListener("load", remeasure); removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave); root.classList.remove("scrubbing");
      ruler.removeEventListener("pointerenter", onEnter); ruler.removeEventListener("pointerdown", onDown);
      ruler.removeEventListener("pointerup", endScrub); ruler.removeEventListener("pointercancel", endScrub);
      rlWrap.replaceChildren();
    };
  }, []);

  return (
    <>
      <div className="pool t" ref={poolTRef} aria-hidden="true" />
      <div className="pool b" ref={poolBRef} aria-hidden="true" />
      <nav className="rletters" ref={lettersRef} aria-label="Sections on this page" />
      <div className="ruler" ref={rulerRef} aria-hidden="true">
        <div className="strip" ref={stripRef} />
        <div className="mini" ref={miniRef} />
        <div className="vwin" ref={vwinRef}><span ref={vpctRef}>000%</span></div>
        <div className="hline" ref={hlineRef} />
      </div>
    </>
  );
}
