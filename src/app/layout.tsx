import type { Metadata } from "next";
import { Geist_Mono, Manrope } from "next/font/google";
import { CopyEmail } from "@/components/CopyEmail";
import { SiteNav } from "@/components/SiteNav";
import { caseStudies } from "@/content/caseStudies";
import { site } from "@/content/site";
import "./globals.css";

const sans = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

const description =
  "Full-stack developer building mobile, web and AI products end to end: React Native apps for wearables, FastAPI backends on Cloud Run.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · Portfolio`, template: `%s · ${site.name}` },
  description,
  openGraph: { type: "website", siteName: site.name, url: "/", description },
  twitter: { card: "summary_large_image" },
};

// The navbar lists pages only; the home page's sections are on its ruler rail.
const pages = [
  { label: "Home", href: "/" },
  ...caseStudies.map((c) => ({ label: c.name, href: `/case-studies/${c.slug}` })),
  { label: "Resume", href: site.resumePdf, external: true },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <div className="page">{children}</div>

        <footer className="band" id="contact" data-label="Contact">
          <div className="inner">
            <div className="band-grid">
              <div>
                <span className="label">Contact</span>
                <h2 id="email">{site.email}</h2>
                <p className="lead">Email is the fastest way to reach me.</p>
                <CopyEmail email={site.email} />
              </div>
              <div className="band-col">
                <span className="label">Reach me</span>
                <span>{site.phone}</span>
                <span>{site.location}</span>
              </div>
              <div className="band-col">
                <span className="label">Elsewhere</span>
                <a href={site.github}>GitHub ↗</a>
                <a href={site.resumePdf}>Resume (PDF) ↗</a>
              </div>
            </div>
            <div className="band-base">
              <span>{site.name}</span>
              <span>{site.education}</span>
            </div>
          </div>
        </footer>
        <SiteNav shortName={site.shortName} pages={pages} />
      </body>
    </html>
  );
}
