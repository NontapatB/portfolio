import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BaojaiDiagram, ScaiDiagram } from "@/components/Diagrams";
import { Desk, Phones } from "@/components/Plate";
import { Presenter } from "@/components/Presenter";
import { caseStudies, getCaseStudy } from "@/content/caseStudies";
import { site } from "@/content/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cs = getCaseStudy((await params).slug);
  return cs ? { title: `${cs.name} case study`, description: cs.lede } : {};
}

function Bar({ label, detail, meta }: { label: string; detail: string; meta: string }) {
  return (
    <div className="secbar">
      <div className="inner">
        <span className="label"><b>{label}</b> · {detail}</span>
        <span className="label meta">{meta}</span>
      </div>
    </div>
  );
}

function Head({ eyebrow, heading }: { eyebrow: string; heading: string }) {
  return (
    <div className="sec-head">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{heading}</h2>
    </div>
  );
}

function Tiles({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className={`tiles n${items.length}`}>
      {items.map((i) => (
        <div key={i.title} className="tile"><h3>{i.title}</h3><p>{i.body}</p></div>
      ))}
    </div>
  );
}

const presentIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="12" rx="1.5" />
    <path d="M12 16v4M8 20h8" />
  </svg>
);

export default async function CaseStudyPage({ params }: Props) {
  const cs = getCaseStudy((await params).slug);
  if (!cs) notFound();
  const next = getCaseStudy(cs.next)!;
  const Diagram = cs.diagram === "baojai" ? BaojaiDiagram : ScaiDiagram;
  const n = (k: number, word: string) => `${k} ${word}${k === 1 ? "" : "s"}`;
  // cover, what it does, screens, system, constraints, quality, outcome, questions
  const slides = 8;

  return (
    <main className="cs">
      <section className="sec" id="overview">
        <div className="secbar">
          <div className="inner">
            <Link className="label back" href="/#work">← All work</Link>
            {cs.deck && (
              <button className="pill-btn present-btn" type="button" data-present>
                {presentIcon}Present
              </button>
            )}
          </div>
        </div>
        <div className="inner">
          <header className="cs-hero">
            <p className="label">{cs.eyebrow}</p>
            <h1>{cs.name}</h1>
            <p className="lede">{cs.lede}</p>
            {cs.deck && (
              <div className="hero-cta">
                <button className="pill-btn" type="button" data-present>Present this case study</button>
                <span className="hint">
                  Opens {slides} slides. <kbd>←</kbd> <kbd>→</kbd> to move, <kbd>N</kbd> for notes.
                </span>
              </div>
            )}
            <dl className="facts">
              {cs.facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            {cs.links && (
              <div className="links">
                {cs.links.map((l) => (
                  <a key={l.href} className="u" href={l.href}>{l.label} ↗</a>
                ))}
              </div>
            )}
          </header>

          {cs.galleries.map((g) => (
            <figure key={g.caption} className="cs-gallery">
              {g.kind === "desk" ? <Desk shot={g.shots[0]} className="duo" /> : <Phones shots={g.shots} className={`strip n${g.shots.length}`} />}
              <figcaption className="mono muted">{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {cs.whatItDoes && cs.headings.whatItDoes && (
        <section className="sec" id="what-it-does">
          <Bar label="What it does" detail="Features" meta={n(cs.whatItDoes.length, "part")} />
          <div className="inner">
            <Head eyebrow="What it does" heading={cs.headings.whatItDoes} />
            <Tiles items={cs.whatItDoes} />
          </div>
        </section>
      )}

      <section className="sec" id="system">
        <Bar label="The system" detail="Architecture" meta={cs.name} />
        <div className="inner">
          <Head eyebrow="The system" heading={cs.headings.system} />
          <div className="two">
            <p>{cs.system}</p>
            <div className="diagram"><Diagram /></div>
          </div>
        </div>
      </section>

      <section className="sec" id="decisions">
        <Bar label="Problems" detail="Problem, choice, result" meta={n(cs.decisions.length, "problem")} />
        <div className="inner">
          <Head eyebrow="Problems" heading={cs.headings.decisions} />
          <div className="decs">
            {cs.decisions.map((d, i) => (
              <article key={d.title} className="dec">
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{d.title}</h3>
                  <div className="pcr">
                    <div><b>Problem</b><p>{d.problem}</p></div>
                    <div><b>Choice</b><p>{d.choice}</p></div>
                    <div><b>Result</b><p>{d.result}</p></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`sec ${cs.outcome ? "" : "last"}`} id="quality">
        <Bar label="Quality" detail="How it is tested" meta={n(cs.quality.length, "practice")} />
        <div className="inner">
          <Head eyebrow="Quality" heading={cs.headings.quality} />
          <Tiles items={cs.quality} />
        </div>
      </section>

      {cs.outcome && (
        <section className="sec last" id="outcome">
          <Bar label="Outcome" detail="Shipped and recognized" meta="2026" />
          <div className={`inner ${cs.outcomePhoto ? "outcome" : ""}`}>
            {cs.outcomePhoto && (
              <div className="photo">
                <Image src={cs.outcomePhoto.src} alt={cs.outcomePhoto.alt} width={cs.outcomePhoto.width} height={cs.outcomePhoto.height} sizes="(max-width: 900px) 92vw, 440px" />
              </div>
            )}
            <div>
              {cs.headings.outcome && <Head eyebrow="Outcome" heading={cs.headings.outcome} />}
              <ul className="olist">
                {cs.outcome.map((o) => (
                  <li key={o.title}><b>{o.title}</b><span>{o.body}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <div className="inner">
        <Link className="next" href={`/case-studies/${next.slug}`}>
          <span className="label">Next case study</span>
          <span>{next.name} →</span>
        </Link>
      </div>

      {cs.deck && (
        <Presenter
          cs={cs}
          deck={cs.deck}
          diagram={<Diagram />}
          galleryShots={cs.galleries[0].shots}
          outcomePhoto={cs.outcomePhoto}
          person={{
            name: site.name,
            role: `${site.jobTitle} · ${site.employer}`,
            email: site.email,
            phone: site.phone,
            links: `${site.github.replace("https://", "")} · ${site.url.replace("https://", "")}`,
          }}
        />
      )}
    </main>
  );
}
