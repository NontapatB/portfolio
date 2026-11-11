import { ImageResponse } from "next/og";
import { caseStudies, getCaseStudy } from "@/content/caseStudies";
import { shots, type Shot } from "@/content/site";
import { ogColors, ogFonts, ogSize, publicImage } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Case study";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

// What sits on the charcoal plate for each case study.
const plates: Record<string, { desk?: Shot; phones: Shot[] }> = {
  baojai: { phones: [shots.baojai.home, shots.baojai.breathingLive, shots.baojai.headband] },
  "scai-security": { desk: shots.scai.operations, phones: [shots.scai.progress] },
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = getCaseStudy(slug)!;
  const plate = plates[slug] ?? { phones: [] };
  const phones = await Promise.all(plate.phones.map((s) => publicImage(s.src)));
  const desk = plate.desk ? await publicImage(plate.desk.src) : null;
  const shadow = "0 24px 48px rgba(0,0,0,.5)";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: ogColors.page, color: ogColors.ink, fontFamily: "Manrope", padding: 48, gap: 48 }}>
        <div style={{ width: 470, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "16px 0 12px 24px" }}>
          <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 22, color: ogColors.muted }}>{cs.eyebrow}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", fontSize: 78, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.045em" }}>{cs.name}</div>
            <div style={{ display: "flex", fontSize: 25, fontWeight: 500, lineHeight: 1.45, color: ogColors.muted }}>
              {cs.lede.split(". ")[0] + "."}
            </div>
          </div>
          <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 20, color: ogColors.muted }}>nontapat.vercel.app</div>
        </div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, background: ogColors.plate, borderRadius: 14, position: "relative", overflow: "hidden" }}>
          {desk ? (
            <>
              <img src={desk} alt="" width={500} height={385} style={{ borderRadius: 8, boxShadow: shadow, marginRight: 60 }} />
              <img src={phones[0]} alt="" width={140} height={303} style={{ position: "absolute", right: 40, bottom: 40, borderRadius: 16, boxShadow: shadow }} />
            </>
          ) : (
            phones.map((src, i) => (
              <img key={i} src={src} alt="" width={170} height={368} style={{ borderRadius: 18, boxShadow: shadow, marginTop: i % 2 ? 40 : 0 }} />
            ))
          )}
        </div>
      </div>
    ),
    { ...ogSize, fonts: await ogFonts() },
  );
}
