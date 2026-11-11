// All portfolio copy lives here and in caseStudies.ts. Edit these files to update the site.

export type Shot = { src: string; alt: string; width: number; height: number };

const phone = (src: string, alt: string): Shot => ({ src, alt, width: 640, height: 1385 });
// Baojai UI v3 screenshots, iPhone 17 Pro (1206 × 2622) scaled to 640 wide.
const v3 = (src: string, alt: string): Shot => ({ src, alt, width: 640, height: 1391 });

export const site = {
  name: "Nontapat Wongpatarajitkul",
  shortName: "Nontapat W.",
  jobTitle: "Full-Stack Developer",
  employer: "SCAI",
  location: "Pathum Thani, Thailand",
  email: "b.nontapat.work@gmail.com",
  phone: "080-619-8235",
  url: "https://nontapat.vercel.app",
  github: "https://github.com/NontapatB",
  resumePdf: "/Nontapat-Wongpatarajitkul-Resume.pdf",
  education: "B.Eng. Software Engineering, Thammasat University",
};

export const intro = {
  headline: "Mobile, web and AI products, built end to end.",
  body: "I'm Nontapat, a full-stack developer at SCAI in Thailand. Lately: a wellness app that reads smart rings and EEG headbands, and the cloud backend behind it.",
};

export const portrait: Shot = {
  src: "/images/me/nontapat.jpg",
  alt: "Nontapat smiling, in a black long-sleeve top",
  width: 900,
  height: 1350,
};

export const baojaiLinks = [
  { label: "App Store", href: "https://apps.apple.com/th/app/baojai/id6759597745" },
  { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.scai.baojai" },
  { label: "baojai.com", href: "https://baojai.com/" },
];

export const shots = {
  baojai: {
    home: v3("/images/work/baojai/home.jpg", "Home screen with today's pick, a slow breathing session suggested from HRV, and a 12-day practice streak"),
    sleep: v3("/images/work/baojai/sleep.jpg", "Sleep detail with 7 h 08 m last night, sleep stages and the REM, light and deep split"),
    health: v3("/images/work/baojai/health.jpg", "Health 360° with the Body and Mind overview ring and today's heart rate from the ring"),
    trends: v3("/images/work/baojai/trends.jpg", "Weekly trends for resting heart rate, sleep, SpO2, blood pressure, HRV and stress measured by the ring"),
    assistant: v3("/images/work/baojai/assistant.jpg", "Baojai Assistant explaining why HRV is below usual today, from the last 7 days of ring data"),
    calmCheck: v3("/images/work/baojai/calm-check.jpg", "Calm Check result: 72 bpm pulse from the phone camera plus how the user feels, with a suggested practice"),
    onboarding: v3("/images/work/baojai/onboarding.jpg", "Sign-in screen: see your body while you practice, not just the feeling"),
    breathingLive: v3("/images/work/baojai/breathing-live.jpg", "Live paced breathing session with heart rate, HRV and calm from the ring and headband"),
    summary: v3("/images/work/baojai/session-summary.jpg", "Session summary: HRV rose from 41 to 58 ms, with heart rate and headband calm over the whole session"),
    headband: v3("/images/work/baojai/headband.jpg", "EEG headband V2 with live attention, meditation, calmness and awareness scores"),
  },
  scai: {
    operations: {
      src: "/images/work/scai-security/operations-center.jpg",
      alt: "Manager operations center with patrol completion, incidents by severity and live alerts",
      width: 1280,
      height: 986,
    },
    walkIn: phone("/images/work/scai-security/walk-in.jpg", "Walk-in visitor form with a Scan ID Card button"),
    start: phone("/images/work/scai-security/start-patrol.jpg", "Start patrol screen in Thai"),
    progress: phone("/images/work/scai-security/patrol-progress.jpg", "Patrol in progress, 1 of 7 checkpoints, with the remaining checkpoints listed"),
    scan: phone("/images/work/scai-security/scan-checkpoint.jpg", "Scan a checkpoint by QR code or type its code"),
  },
} satisfies Record<string, Record<string, Shot>>;

type Visual =
  | { kind: "phones"; shots: Shot[] }
  | { kind: "desk"; shot: Shot; float?: Shot }
  | { kind: "sheet"; kicker: string; name: string; line: string; foot: [string, string] };

export type Work = {
  title: string;
  when: string;
  summary: string;
  wide?: boolean;
  visual: Visual;
  links?: { label: string; href: string }[];
  caseStudy?: string;
};

export const work: Work[] = [
  {
    title: "Baojai",
    when: "Feb 2026 – now",
    wide: true,
    summary:
      "Wellness and biofeedback on iOS and Android. Reads smart rings and EEG headbands over BLE and measures vital signs with the camera. Lead developer. Shown: UI v3 design.",
    visual: { kind: "phones", shots: [shots.baojai.home, shots.baojai.sleep, shots.baojai.health, shots.baojai.trends] },
    links: baojaiLinks,
    caseStudy: "baojai",
  },
  {
    title: "Baojai, assistant and Calm Check",
    when: "UI v3",
    summary: "An assistant that answers from the user's own ring data, and Calm Check: a 60-second pulse reading from the phone camera, plus how you feel.",
    visual: { kind: "phones", shots: [shots.baojai.assistant, shots.baojai.calmCheck] },
    caseStudy: "baojai",
  },
  {
    title: "SCAI Security",
    when: "2025 – 2026",
    summary:
      "Patrol and visitor management. FastAPI services, a role-based dashboard and an app for Sunmi handhelds that scans and prints.",
    visual: { kind: "desk", shot: shots.scai.operations, float: shots.scai.walkIn },
    caseStudy: "scai-security",
  },
  {
    title: "ME TIME",
    when: "2025",
    summary: "A wellbeing chatbot with prompt classification, tracing in Langfuse and a dashboard for the team.",
    visual: {
      kind: "sheet",
      kicker: "Insurance client · Chatbot",
      name: "ME TIME",
      line: "Chats about your mood and free time, then suggests an activity to do for yourself.",
      foot: ["LangChain · Gemini", "Langfuse"],
    },
  },
  {
    title: "AI-Company v2",
    when: "2026",
    summary: "Gemini handles the volume work and Claude makes the high-stakes calls. Pushes to GitLab after approval.",
    visual: {
      kind: "sheet",
      kicker: "Internal · Multi-agent",
      name: "AI-Company v2",
      line: "A plain-language requirement goes in. Agents design, build, test and review it, then a person approves.",
      foot: ["Gemini · Claude", "Playwright"],
    },
  },
  {
    title: "Ruthi",
    when: "2025 – 2026",
    summary: "Top contributor across three redesign rounds.",
    visual: {
      kind: "sheet",
      kicker: "Mobile · Land records",
      name: "Ruthi",
      line: "Land and title-deed details with a minimap, in several languages.",
      foot: ["Expo · React Native", "i18n"],
    },
  },
  {
    title: "Punpleng",
    when: "2025 – 2026",
    summary: "AI jingle generator with payments built in.",
    visual: {
      kind: "sheet",
      kicker: "Web · AI music",
      name: "Punpleng",
      line: "Fill one form, pick a voice and a style, pay by PromptPay QR, get a brand jingle.",
      foot: ["Next.js · Supabase", "PromptPay"],
    },
  },
];

// Home page section headings. Each section also shows a sticky bar (label · detail, meta on the right).
export const homeSections = {
  intro: { bar: "Full-stack developer", meta: "SCAI · Pathum Thani, TH" },
  work: { bar: "7 projects", meta: "2025 – 2026", heading: "Apps, backends and AI tools from the last two years.", sub: "Two products have full case studies. Click a plate to read one." },
  inside: { bar: "Engineering", meta: "4 parts", heading: "From the ring on your finger to the cloud.", sub: "The parts of Baojai I built: device links, the backend, and vital signs from the camera." },
  side: { bar: "Automation", meta: "2026", heading: "Things I automate on my own time." },
  recognition: { bar: "Awards and events", meta: "2026", heading: "Platinum and Gold at BME IIF 2026.", sub: "Fukuoka, Japan, October 2026. Team of six, SCAI with KMITL." },
};

export const heroFacts = [
  { value: "5", label: "wearables over BLE" },
  { value: "9", label: "FastAPI services on Cloud Run" },
  { value: "2,000", label: "concurrent-user target" },
  { value: "Platinum", label: "BME IIF 2026, Fukuoka" },
];

export const tools = ["Expo", "React Native", "TypeScript", "FastAPI", "Cloud Run", "BLE", "WebSocket", "Next.js", "Supabase", "LangChain", "Gemini", "Claude", "Langfuse", "Playwright"];

// Short codes shown in the black squares beside each "Inside Baojai" row.
export const insideBaojai = [
  { code: "BLE", title: "Wearables over BLE", body: "Five devices, smart rings and EEG headbands, in Expo React Native, with ring firmware updates over BLE." },
  { code: "API", title: "Backend on Cloud Run", body: "9 FastAPI services and 3 workers behind one gateway. Tokens verified on the server for a 2,000-concurrent-user target." },
  { code: "CAM", title: "Camera vital signs", body: "Heart rate by rPPG on the device. Breathing rate by optical flow over WebSocket." },
  { code: "EEG", title: "EEG from a vendor module", body: "Ported only the vendor SDK's protocol layer and wrote a new BLE client. Tests on captured frames found a parser bug." },
];

export const sideProjects = [
  { name: "autoclip", when: "2026", summary: "Cuts vertical clips around the speaker's face from Creative Commons videos and posts them as Shorts on three channels." },
  { name: "jpmusic-channel", when: "2026", summary: "An AI Japanese music channel. Automates song production, lyric timing and video rendering." },
  { name: "trading-bot", when: "2026", summary: "Rebalances a stock and crypto portfolio to target weights, with risk guards and paper trading first." },
];

export const recognition: { title: string; when: string; detail: string; shot: Shot; paper?: boolean }[] = [
  {
    title: "Platinum Award, highest distinction",
    when: "Oct 2026",
    detail: "BME IIF 2026, Fukuoka, Japan. Team of six, SCAI with KMITL.",
    shot: {
      src: "/images/awards/bme-iif-2026-platinum-announcement.jpg",
      alt: "The Baojai team on stage at BME IIF 2026 receiving the Platinum Award",
      width: 1122,
      height: 1402,
    },
  },
  {
    title: "Gold Medal with Jury Congratulations",
    when: "Oct 2026",
    detail: "Same fair, same entry: Baojai Wellness Ecosystem, a multimodal AI biofeedback platform.",
    paper: true,
    shot: {
      src: "/images/awards/bme-iif-2026-gold-diploma.jpg",
      alt: "BME IIF 2026 diploma: Gold Medal with Jury Congratulations to the Baojai Team, including N. Wongpatarajitkul, Fukuoka, 11 October 2026",
      width: 1110,
      height: 1534,
    },
  },
  {
    title: "Thailand Wellness & Healthcare Expo",
    when: "Jun 2026",
    detail: "Ran the Baojai booth at BITEC Bangkok.",
    shot: {
      src: "/images/events/wellness-expo-2026-team-1.jpg",
      alt: "The Baojai team in branded T-shirts at their booth at BITEC",
      width: 1021,
      height: 1604,
    },
  },
];
