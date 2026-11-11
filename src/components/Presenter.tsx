"use client";

import Image from "next/image";
import { type MouseEvent as ReactMouseEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import type { CaseStudy, Deck } from "@/content/caseStudies";

// Present mode for a case study: the page's own content as 16:9 slides for screen sharing in an interview.
// Opened by any [data-present] button on the page or by a #slide-N link. Arrow keys, space, 1-9, Home and End move;
// N shows speaker notes, F goes full screen, Esc exits. A slide ruler on the right jumps to any slide.

type Props = {
  cs: Pick<CaseStudy, "name" | "eyebrow" | "system">;
  deck: Deck;
  diagram: ReactNode;
  galleryShots: CaseStudy["galleries"][number]["shots"];
  outcomePhoto?: CaseStudy["outcomePhoto"];
  person: { name: string; role: string; email: string; phone: string; links: string };
};

type Slide = { title: string; notes: string; className: string; body: ReactNode };

const pad = (n: number) => String(n).padStart(2, "0");

export function Presenter({ cs, deck, diagram, galleryShots, outcomePhoto, person }: Props) {
  const slides: Slide[] = [
    {
      title: cs.name,
      notes: deck.cover.notes,
      className: "s-cover",
      body: (
        <>
          <div className="bits">
            <p className="label">{cs.eyebrow}</p>
            <h1>{cs.name}</h1>
            <p className="sub">{deck.cover.sub}</p>
            <dl className="facts">
              {deck.cover.facts.map((f) => (
                <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
              ))}
            </dl>
          </div>
          <div className="plate bit">
            {deck.cover.phones.map((s) => (
              <Image key={s.src} className="phone" src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="300px" />
            ))}
          </div>
        </>
      ),
    },
    {
      title: "What it does",
      notes: deck.what.notes,
      className: "s-what",
      body: (
        <div className="bits">
          <p className="kick">What it does</p>
          <h2>{deck.what.heading}</h2>
          <div className="points">
            {deck.what.points.map((p) => (
              <div key={p.title} className="point"><span className="k">{p.code}</span><h3>{p.title}</h3><p>{p.body}</p></div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "The app",
      notes: deck.screens.notes,
      className: "s-screens",
      body: (
        <>
          <div className="bits"><p className="kick">The app</p></div>
          <div className="plate bit">
            {galleryShots.map((s) => (
              <Image key={s.src} className="phone" src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="240px" />
            ))}
          </div>
          <div className="flow bit">{deck.screens.flow.map((f) => <span key={f}>{f}</span>)}</div>
        </>
      ),
    },
    {
      title: "The system",
      notes: cs.system,
      className: "s-system",
      body: (
        <>
          <div className="bits"><p className="kick">The system</p></div>
          <div className="diagram bit">{diagram}</div>
        </>
      ),
    },
    {
      title: "Constraints",
      notes: deck.constraints.notes,
      className: "s-quality",
      body: (
        <>
          <div className="bits"><p className="kick">Constraints</p><h2>{deck.constraints.heading}</h2></div>
          <div className="tiles bits">
            {deck.constraints.tiles.map((t) => (
              <div key={t.title} className="tile"><span className="big">{t.big}</span><h3>{t.title}</h3><p>{t.body}</p></div>
            ))}
          </div>
        </>
      ),
    },
    {
      title: "Quality",
      notes: deck.quality.notes,
      className: "s-quality",
      body: (
        <>
          <div className="bits"><p className="kick">Quality</p><h2>{deck.quality.heading}</h2></div>
          <div className="tiles bits">
            {deck.quality.tiles.map((t) => (
              <div key={t.title} className="tile"><span className="big">{t.big}</span><h3>{t.title}</h3><p>{t.body}</p></div>
            ))}
          </div>
        </>
      ),
    },
    {
      title: "Outcome",
      notes: deck.outcome.notes,
      className: "s-out",
      body: (
        <>
          {outcomePhoto && (
            <div className="photo bit">
              <Image src={outcomePhoto.src} alt={outcomePhoto.alt} width={outcomePhoto.width} height={outcomePhoto.height} sizes="600px" />
            </div>
          )}
          <div className="bits">
            <p className="kick">Outcome</p>
            <ul className="olist">
              {deck.outcome.items.map((o) => (
                <li key={o.title}><b>{o.title}</b><span>{o.body}</span></li>
              ))}
            </ul>
          </div>
        </>
      ),
    },
    {
      title: "Questions",
      notes: deck.end.notes,
      className: "s-end",
      body: (
        <div className="bits">
          <p className="kick">Thank you</p>
          <h2>Questions?</h2>
          <div className="contact">
            <span>{person.email}</span>
            <span>{person.phone}</span>
            <span className="muted">{person.links}</span>
          </div>
        </div>
      ),
    },
  ];
  const n = slides.length;

  const [open, setOpen] = useState(false);
  const [cur, setCur] = useState(0);
  const [notes, setNotes] = useState(false);
  const viewRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [fsError, setFsError] = useState(false);

  const go = useCallback((i: number) => setCur(Math.max(0, Math.min(n - 1, i))), [n]);
  const fit = useCallback(() => {
    const view = viewRef.current, deckEl = deckRef.current;
    if (!view || !deckEl) return;
    const r = view.getBoundingClientRect(), s = Math.min(r.width / 1600, r.height / 900) * 0.96;
    deckEl.style.transform = `scale(${s}) translate(-50%, -50%)`;
  }, []);
  const exit = useCallback(() => {
    setOpen(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    history.replaceState(null, "", location.pathname + location.search);
  }, []);
  const toggleFs = useCallback(() => {
    if (document.fullscreenElement) { document.exitFullscreen().catch(() => {}); return; }
    const p = stageRef.current?.requestFullscreen?.();
    if (!p) setFsError(true); else p.catch(() => setFsError(true));
  }, []);

  // open from any Present button on the page, or from a #slide-N link
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest?.("[data-present]")) return;
      setCur(0); setOpen(true);
    };
    const fromHash = () => {
      const m = /^#slide-(\d+)$/.exec(location.hash);
      if (m) { setCur(Math.max(0, Math.min(n - 1, +m[1] - 1))); setOpen(true); }
    };
    document.addEventListener("click", onClick);
    addEventListener("hashchange", fromHash);
    fromHash();
    return () => { document.removeEventListener("click", onClick); removeEventListener("hashchange", fromHash); };
  }, [n]);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("presenting");
    fit();
    const onResize = () => fit();
    const onFs = () => setTimeout(fit, 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (k === "ArrowRight" || k === "PageDown" || k === " " || k === "ArrowDown") { e.preventDefault(); setCur((c) => Math.min(n - 1, c + 1)); }
      else if (k === "ArrowLeft" || k === "PageUp" || k === "ArrowUp") { e.preventDefault(); setCur((c) => Math.max(0, c - 1)); }
      else if (k === "Home") { e.preventDefault(); setCur(0); }
      else if (k === "End") { e.preventDefault(); setCur(n - 1); }
      else if (k === "n" || k === "N") setNotes((v) => !v);
      else if (k === "f" || k === "F") toggleFs();
      else if (k === "Escape" && !document.fullscreenElement) exit();
      else if (/^[1-9]$/.test(k)) setCur(Math.min(n - 1, +k - 1));
    };
    addEventListener("resize", onResize);
    addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      document.body.classList.remove("presenting");
      removeEventListener("resize", onResize);
      removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, [open, n, fit, exit, toggleFs]);

  useEffect(() => { if (open) fit(); }, [notes, open, fit]);
  useEffect(() => { if (open) history.replaceState(null, "", "#slide-" + (cur + 1)); }, [open, cur]);
  useEffect(() => {
    if (!fsError) return;
    const t = setTimeout(() => setFsError(false), 2600);
    return () => clearTimeout(t);
  }, [fsError]);

  const onViewClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest("button, a")) return;
    const r = e.currentTarget.getBoundingClientRect();
    go(e.clientX - r.left > r.width / 3 ? cur + 1 : cur - 1);
  };

  return (
    <div className="stage" ref={stageRef} hidden={!open} role="dialog" aria-modal="true" aria-label={`${cs.name} presentation`}>
      <div className="view" ref={viewRef} onClick={onViewClick}>
        <div className="deck" ref={deckRef}>
          {slides.map((s, i) => (
            <section key={i} className={`slide ${s.className} ${i === cur ? "on" : ""}`} aria-hidden={i !== cur}>
              {i > 0 && (
                <div className="s-top"><span><b>{cs.name}</b> · {s.title}</span><span>{pad(i + 1)} / {n}</span></div>
              )}
              {s.body}
              {i > 0 && i < n - 1 && (
                <div className="s-foot"><span>{person.name}</span><span>{person.role}</span></div>
              )}
            </section>
          ))}
        </div>
        <div className="ctrl">
          <button type="button" aria-label="Previous slide" onClick={() => go(cur - 1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
          </button>
          <span className="count">{pad(cur + 1)} / {n}</span>
          <button type="button" aria-label="Next slide" onClick={() => go(cur + 1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
          </button>
          <button type="button" aria-pressed={notes} onClick={() => setNotes(!notes)}>Notes <kbd>N</kbd></button>
          <button type="button" onClick={toggleFs}>Full screen <kbd>F</kbd></button>
          <button type="button" onClick={exit}>Exit <kbd>Esc</kbd></button>
        </div>
        {fsError && <div className="stage-msg" role="status">Full screen is not available here. Use your browser&apos;s full screen instead.</div>}
      </div>
      <nav className="srail" aria-label="Slides">
        <div className="smap" aria-hidden="true">
          {slides.map((s, i) => (
            <div key={i} className={i === cur ? "on" : ""} style={{ top: `${6 + (i / (n - 1)) * 88}%` }}>{s.title}</div>
          ))}
        </div>
        {slides.map((s, i) => (
          <button
            key={i}
            type="button"
            className={`t ${i === cur ? "on" : ""}`}
            style={{ top: `${6 + (i / (n - 1)) * 88}%` }}
            aria-label={`Slide ${i + 1}: ${s.title}`}
            aria-current={i === cur ? "step" : undefined}
            onClick={() => go(i)}
          >
            <span>{pad(i + 1)}</span>
          </button>
        ))}
      </nav>
      {notes && (
        <div className="notes">
          <span className="label"><b>{slides[cur].title}</b> · Speaker notes</span>
          <p>{slides[cur].notes}</p>
          <span className="warn">Share only the browser tab or window that shows the slides if you don&apos;t want the notes on screen.</span>
        </div>
      )}
    </div>
  );
}

