import Image from "next/image";
import Link from "next/link";
import { Desk, Phones, Sheet } from "@/components/Plate";
import { SectionRail } from "@/components/SectionRail";
import {
  heroFacts,
  homeSections as hs,
  insideBaojai,
  intro,
  portrait,
  recognition,
  sideProjects,
  site,
  tools,
  work,
  type Work,
} from "@/content/site";

function Visual({ v }: { v: Work["visual"] }) {
  if (v.kind === "phones") return <Phones shots={v.shots} className={v.shots.length === 2 ? "pair" : ""} />;
  if (v.kind === "desk") return <Desk shot={v.shot} float={v.float} />;
  return <Sheet kicker={v.kicker} name={v.name} line={v.line} foot={v.foot} />;
}

// Sticky bar at the top of each section: label · detail on the left, meta on the right.
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

function Head({ eyebrow, heading, sub, center }: { eyebrow: string; heading: string; sub?: string; center?: boolean }) {
  return (
    <div className={`sec-head ${center ? "statement" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{heading}</h2>
      {sub && <p>{sub}</p>}
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <SectionRail />

      <section className="sec" id="intro" data-label="Intro">
        <Bar label={site.name} detail={hs.intro.bar} meta={hs.intro.meta} />
        <div className="inner">
          <div className="hero-grid">
            <div className="hero-text">
              <h1>{intro.headline}</h1>
              <p>{intro.body}</p>
              <div className="hero-cta">
                <a className="pill-btn" href="#work">See the work</a>
                <a className="pill-btn light" href={site.resumePdf}>Resume ↗</a>
              </div>
            </div>
            <div className="portrait">
              <Image
                src={portrait.src}
                alt={portrait.alt}
                width={portrait.width}
                height={portrait.height}
                sizes="(max-width: 1023px) 80vw, 400px"
                preload
              />
            </div>
          </div>
          <div className="hero-facts">
            {heroFacts.map((f) => (
              <div key={f.label}><b>{f.value}</b><span>{f.label}</span></div>
            ))}
          </div>
          <div className="marquee" aria-label="Tools I use">
            <div className="mtrack">
              {tools.map((t) => <span key={t}>{t}</span>)}
              {tools.map((t) => <span key={`${t}-2`} aria-hidden="true">{t}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="sec" id="work" data-label="Work">
        <Bar label="Selected work" detail={hs.work.bar} meta={hs.work.meta} />
        <div className="inner">
          <Head eyebrow="Selected work" heading={hs.work.heading} sub={hs.work.sub} />
          <div className="gallery">
            {work.map((w) => (
              <article key={w.title} className={`shot ${w.wide ? "wide" : ""}`}>
                {w.caseStudy ? (
                  <Link href={`/case-studies/${w.caseStudy}`} aria-label={`${w.title} case study`} className="plate-link">
                    <Visual v={w.visual} />
                  </Link>
                ) : (
                  <Visual v={w.visual} />
                )}
                <div className="cap">
                  <h3>{w.title}</h3>
                  <span className="when mono">{w.when}</span>
                  <p>{w.summary}</p>
                  {(w.links || w.caseStudy) && (
                    <div className="links">
                      {w.links?.map((l) => (
                        <a key={l.href} className="u" href={l.href}>{l.label} ↗</a>
                      ))}
                      {w.caseStudy && (
                        <Link className="u strong" href={`/case-studies/${w.caseStudy}`}>Read the case study →</Link>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="inside-baojai" data-label="Inside Baojai">
        <Bar label="Inside Baojai" detail={hs.inside.bar} meta={hs.inside.meta} />
        <div className="inner split">
          <div className="left">
            <Head eyebrow="Inside Baojai" heading={hs.inside.heading} sub={hs.inside.sub} />
            <Link className="pill-btn" href="/case-studies/baojai">Read the case study</Link>
          </div>
          <div className="rows">
            {insideBaojai.map((d) => (
              <div key={d.title} className="row">
                <span className="k">{d.code}</span>
                <div><h3>{d.title}</h3><p>{d.body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="side-projects" data-label="Side projects">
        <Bar label="Side projects" detail={hs.side.bar} meta={hs.side.meta} />
        <div className="inner">
          <Head eyebrow="Side projects" heading={hs.side.heading} />
          <div className="cards">
            {sideProjects.map((p) => (
              <article key={p.name} className="pcard">
                <span className="tag">{p.when}</span>
                <h3>{p.name}</h3>
                <p>{p.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec last" id="recognition" data-label="Recognition">
        <Bar label="Recognition" detail={hs.recognition.bar} meta={hs.recognition.meta} />
        <div className="inner">
          <Head eyebrow="Recognition" heading={hs.recognition.heading} sub={hs.recognition.sub} center />
          <div className="photos">
            {recognition.map((r) => (
              <figure key={r.title}>
                <div className={`plate ${r.paper ? "paper" : ""}`}>
                  <Image src={r.shot.src} alt={r.shot.alt} width={r.shot.width} height={r.shot.height} sizes="(max-width: 760px) 92vw, 360px" />
                </div>
                <figcaption className="cap">
                  <h3>{r.title}</h3>
                  <span className="when mono">{r.when}</span>
                  <p>{r.detail}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
