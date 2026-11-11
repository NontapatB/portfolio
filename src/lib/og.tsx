import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Shared pieces for the Open Graph images (the preview card shown when a link is shared).
// Images render with next/og, which needs explicit fonts and flex layout on every element with children.

export const ogSize = { width: 1200, height: 630 };

export const ogColors = { ink: "#eeeef0", muted: "#9a9da5", plate: "#2b2c30", page: "#121315" };

export async function ogFonts() {
  const dir = join(process.cwd(), "assets/fonts");
  const [bold, medium, mono] = await Promise.all([
    readFile(join(dir, "manrope-latin-800-normal.ttf")),
    readFile(join(dir, "manrope-latin-500-normal.ttf")),
    readFile(join(dir, "geist-mono-latin-400-normal.ttf")),
  ]);
  return [
    { name: "Manrope", data: bold, weight: 800 as const, style: "normal" as const },
    { name: "Manrope", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Geist Mono", data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

// Reads an image from /public and returns it as a data URI for <img src>.
export async function publicImage(path: string) {
  const data = await readFile(join(process.cwd(), "public", path), "base64");
  return `data:image/jpeg;base64,${data}`;
}
