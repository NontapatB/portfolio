import { ImageResponse } from "next/og";
import { intro, portrait, site } from "@/content/site";
import { ogColors, ogFonts, ogSize, publicImage } from "@/lib/og";

export const alt = `${site.name}: ${intro.headline}`;
export const size = ogSize;
export const contentType = "image/png";

// Home preview: the headline on the left, the studio portrait on its own black ground on the right.
export default async function Image() {
  const photo = await publicImage(portrait.src);
  const photoWidth = Math.round((ogSize.height * portrait.width) / portrait.height);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#000", color: ogColors.ink, fontFamily: "Manrope" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 0 60px 72px" }}>
          <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 22, color: ogColors.muted }}>nontapat.vercel.app</div>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.035em", maxWidth: 640 }}>
            {intro.headline}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", fontSize: 30, fontWeight: 800, letterSpacing: "-0.01em" }}>{site.name}</div>
            <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 20, color: ogColors.muted }}>
              {`${site.jobTitle} · ${site.employer} · Thailand`}
            </div>
          </div>
        </div>
        <img src={photo} alt="" width={photoWidth} height={ogSize.height} style={{ objectFit: "cover" }} />
      </div>
    ),
    { ...ogSize, fonts: await ogFonts() },
  );
}
