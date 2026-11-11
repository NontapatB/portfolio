import { recognition, shots, type Shot } from "./site";

export type Decision = { title: string; problem: string; choice: string; result: string };

type Tiles = { heading: string; tiles: { big: string; title: string; body: string }[]; notes: string };

// Present mode: the same case study as 16:9 slides for screen sharing in an interview.
// Slides run: cover, what it does, screens, system, constraints, quality, outcome, questions.
// The deck states constraints as facts and leaves the problems for the interviewer to ask about; how each was
// handled sits in the constraints slide's speaker notes.
export type Deck = {
  cover: { sub: string; facts: { label: string; value: string }[]; phones: Shot[]; notes: string };
  what: { heading: string; points: { code: string; title: string; body: string }[]; notes: string };
  screens: { flow: string[]; notes: string };
  constraints: Tiles;
  quality: Tiles;
  outcome: { items: { title: string; body: string }[]; notes: string };
  end: { notes: string };
};

export type CaseStudy = {
  slug: string;
  name: string;
  eyebrow: string;
  lede: string;
  facts: { label: string; value: string }[];
  links?: { label: string; href: string }[];
  // Each gallery is one charcoal plate with a caption under it.
  galleries: { kind: "phones" | "desk"; shots: Shot[]; caption: string }[];
  whatItDoes?: { title: string; body: string }[];
  system: string;
  diagram: "baojai" | "scai-security";
  decisions: Decision[];
  quality: { title: string; body: string }[];
  outcome?: { title: string; body: string }[];
  outcomePhoto?: Shot;
  // Section headings on the case study page.
  headings: { whatItDoes?: string; system: string; decisions: string; quality: string; outcome?: string };
  deck?: Deck;
  next: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "baojai",
    name: "Baojai",
    eyebrow: "Case study · 2026",
    lede: "A wellness platform that reads your body while you practice. The phone app talks to smart rings and EEG headbands, measures vital signs with the camera, and runs live classes with coaches.",
    facts: [
      { label: "Role", value: "Lead developer: app, website, admin console and backend" },
      { label: "Period", value: "Feb 2026 – Nov 2026" },
      { label: "Platforms", value: "iOS, Android, Web" },
      { label: "Stack", value: "Expo React Native, FastAPI, Supabase, Cloud Run, Next.js" },
    ],
    galleries: [
      {
        kind: "phones",
        shots: [shots.baojai.onboarding, shots.baojai.home, shots.baojai.breathingLive, shots.baojai.summary, shots.baojai.headband],
        caption: "Sign-in → Home → Breathing session → Summary → Headband. UI v3, Nov 2026.",
      },
    ],
    system:
      "Three clients share one backend. Every request goes through a single gateway to nine FastAPI services on Cloud Run, with Supabase for the database, sign-in and storage. Heavy jobs such as video joins and PDF health reports run as Pub/Sub workers. Camera streams for breathing and stress go to dedicated realtime services to keep latency low.",
    diagram: "baojai",
    decisions: [
      {
        title: "Record, upload and process hour-long meditation videos",
        problem:
          "A session can be recorded for an hour on a phone. Long recordings fanned out dozens of uploads at once and ran the app out of memory after 40 to 55 minutes. Locking the phone right after Save suspended the app mid-upload, so the profile showed a video the server had never received. On the server, CDN stalls and exhausted retries left videos stuck in Processing.",
        choice:
          "Record in 60-second segments and upload each one while recording, three at a time. Write the save state to a journal on disk so a suspended or killed save resumes on the next launch. On the server, a Pub/Sub worker joins the segments with ffmpeg and builds HLS, with backoff retries, a dead-letter queue, a sweep every 15 minutes for stuck jobs, and a guard that fails bad jobs once instead of looping. Music stays a separate track played over the video, so changing it never re-renders the file.",
        result:
          "Hour-long recordings upload while they record, a save cut off by a locked phone finishes when the app reopens, and stuck jobs recover on their own within 15 minutes.",
      },
      {
        title: "Support wearables from different vendors on one Bluetooth stack",
        problem:
          "Rings and EEG headbands come from different vendors. Their SDKs broke under Hermes or took over the Bluetooth radio, and every fix needed a native rebuild. The data disagreed too: one vendor's HRV is an index from 0 to 210, not milliseconds, the same stress field uses different scales, calories come in kJ or kcal, and switching rings overwrote the old ring's history.",
        choice:
          "Port only each vendor's protocol layer to TypeScript on the app's one BLE stack, tested with frames captured from the real devices. Each device has an adapter into one shared record. Data is stored per device and merged per metric and time window, taking the ring that recorded more. Values that mean different things on each ring are shown for the current ring only.",
        result:
          "Device fixes ship over the air, devices can be mocked in the simulator, the captured-frame tests caught a parser bug in a vendor's own code, and switching rings keeps the whole history.",
      },
    ],
    quality: [
      { title: "Real devices.", body: "Rings and headbands tested on real phones, since the simulator has no Bluetooth." },
      { title: "Tests at every layer.", body: "Playwright on the website and admin console, Maestro on iOS and Android simulators, pytest on the services." },
      { title: "Written down.", body: "30 architecture decision records and runbooks for every service." },
      { title: "Watched in production.", body: "Sentry for errors and PostHog for product analytics." },
    ],
    outcome: [
      { title: "Shipped.", body: "Released on the App Store and Google Play in 2026, with a booking site at baojai.com. The service has since been shut down." },
      { title: "Platinum Award, highest distinction, and Gold Medal with Jury Congratulations", body: "at BME IIF 2026 in Fukuoka, Japan." },
      { title: "On the floor.", body: "Ran the Baojai booth at Thailand Wellness & Healthcare Expo 2026, BITEC Bangkok." },
    ],
    outcomePhoto: recognition[0].shot,
    headings: {
      system: "Three clients, one gateway, nine services.",
      decisions: "Two problems I had to solve.",
      quality: "Tested on real devices, at every layer.",
      outcome: "Shipped, and Platinum in Fukuoka.",
    },
    deck: {
      cover: {
        sub: "Wellness and biofeedback that reads your body while you practice.",
        facts: [
          { label: "Role", value: "Lead developer" },
          { label: "Period", value: "Feb 2026 – Nov 2026" },
          { label: "Platforms", value: "iOS, Android, Web" },
        ],
        phones: [shots.baojai.home, shots.baojai.breathingLive],
        notes:
          "Baojai is a wellness platform that reads your body while you practice. I'm the lead developer across the app, the website, the admin console and the backend, from February 2026 until now. It runs on iOS, Android and the web.",
      },
      what: {
        heading: "The app reads your body while you practice.",
        points: [
          { code: "BLE", title: "Rings and EEG headbands", body: "Five devices read over Bluetooth, with ring firmware updates." },
          { code: "CAM", title: "Vital signs from the camera", body: "Heart rate and breathing rate, no device needed." },
          { code: "LIVE", title: "Live classes with coaches", body: "One breathing pacer shared by everyone in the room." },
        ],
        notes:
          "The phone app talks to smart rings and EEG headbands, measures vital signs with the camera, and runs live classes with coaches.",
      },
      screens: {
        flow: ["Sign-in", "Home", "Breathing", "Summary", "Headband"],
        notes:
          "Walk through the flow: sign-in, the home screen with today's pick, a live breathing session reading the ring and headband together, the session summary where HRV rose from 41 to 58 ms, and the headband dashboard. These are screenshots of UI v3 from November 2026.",
      },
      constraints: {
        heading: "The constraints it was built around.",
        tiles: [
          { big: "60 min", title: "Recorded on a phone", body: "A meditation session is recorded and uploaded from the phone, up to an hour long." },
          { big: "~30 s", title: "After the screen locks", body: "All the time iOS gives an app to finish its work once the phone is locked." },
          { big: "5", title: "Wearables, different vendors", body: "Rings and EEG headbands, each with its own Bluetooth protocol and data format." },
          { big: "2,000", title: "Concurrent users", body: "The target the backend is sized for." },
        ],
        notes:
          "Let the numbers raise the questions. If asked:\n\nVideo: recordings go up in 60-second segments while recording, three uploads at a time, so memory stays flat. A save journal on disk finishes a save that iOS suspended or killed. On the server a Pub/Sub worker joins the segments with ffmpeg and builds HLS, with retries, a dead-letter queue and a sweep every 15 minutes for stuck jobs.\n\nWearables: only each vendor's protocol layer is ported to TypeScript, on the app's one BLE stack, tested with frames captured from real devices. Each device has an adapter into one shared record, stored per device and merged per metric, so switching rings keeps the history.\n\nScale: one gateway in front of nine FastAPI services on Cloud Run, with tokens verified locally instead of calling the auth server on every request.",
      },
      quality: {
        heading: "Tested on real devices, at every layer.",
        tiles: [
          { big: "BLE", title: "Real devices", body: "Rings and headbands on real phones. The simulator has no Bluetooth." },
          { big: "3", title: "Test layers", body: "Playwright on the web, Maestro on iOS and Android, pytest on services." },
          { big: "30", title: "Decision records", body: "Plus a runbook for every service." },
          { big: "Sentry", title: "Watched in production", body: "Sentry for errors, PostHog for product analytics." },
        ],
        notes:
          "Rings and headbands are tested on real phones, since the simulator has no Bluetooth. Playwright covers the website and admin console, Maestro the iOS and Android apps, pytest the services. There are 30 architecture decision records and a runbook for every service. Sentry catches errors and PostHog tracks product analytics.",
      },
      outcome: {
        items: [
          { title: "Shipped to both stores", body: "App Store, Google Play and baojai.com, 2026. Now offline." },
          { title: "Platinum + Gold Medal", body: "BME IIF 2026, Fukuoka, Japan." },
          { title: "Ran the booth", body: "Thailand Wellness & Healthcare Expo 2026, BITEC." },
        ],
        notes:
          "It shipped: released on the App Store and Google Play, with the booking site at baojai.com. The company has since shut the service down, so the screens here are the record of it. At BME IIF 2026 in Fukuoka the team of six from SCAI and KMITL won the Platinum Award, the highest distinction, and a Gold Medal with Jury Congratulations. We also ran the Baojai booth at Thailand Wellness and Healthcare Expo 2026 at BITEC Bangkok.",
      },
      end: { notes: "Thank you. Happy to go deeper on any part: the video pipeline, the BLE layer, or the backend." },
    },
    next: "scai-security",
  },
  {
    slug: "scai-security",
    name: "SCAI Security",
    eyebrow: "Case study · 2025 – 2026",
    lede: "Patrol and visitor management for security companies. Guards scan checkpoints and log incidents on a handheld, visitors check in at the gate, and managers watch every site from one dashboard.",
    facts: [
      { label: "Role", value: "Primary developer: backend, web dashboard and handheld app" },
      { label: "Period", value: "Nov 2025 – Jun 2026" },
      { label: "Platforms", value: "Web, Android on Sunmi handhelds" },
      { label: "Stack", value: "FastAPI, Redis, Supabase, Next.js, Expo React Native" },
    ],
    galleries: [
      { kind: "desk", shots: [shots.scai.operations], caption: "Manager operations center. Demo data." },
      {
        kind: "phones",
        shots: [shots.scai.start, shots.scai.progress, shots.scai.scan, shots.scai.walkIn],
        caption: "Handheld: start a round → 1 of 7 checkpoints → scan → walk-in visitor.",
      },
    ],
    whatItDoes: [
      {
        title: "Patrol.",
        body: "Guards scan QR checkpoints, which are checked against the guard's location, answer each checkpoint's questions and attach photos. Rounds repeat on a schedule.",
      },
      { title: "Incidents.", body: "Reported as normal, warning or critical, and shown live on the dashboard." },
      { title: "Visitors.", body: "Booking, walk-in with ID card scan, check-in and check-out, a visitor pass printed on the handheld." },
      { title: "Reports.", body: "Daily PDF reports, PDF and Excel export, and an AI assistant that answers only from data the user's role can see." },
    ],
    system:
      "Eleven FastAPI services sit behind one gateway that checks every token and role before a request goes further. Each service is split into domain, application, infrastructure and presentation layers, with repository interfaces in the domain and Supabase behind them. Everything runs in Docker on Cloud Run.",
    diagram: "scai-security",
    decisions: [
      {
        title: "Roles, accounts and sites: who can do what, and where",
        problem:
          "Each customer is a security company with many sites. Its managers run the whole company, site managers run only their own sites, guards share handhelds at each post, and our admins support every customer. The first version had a role nobody used, no clear rule for who could create whom, and every new customer needed us to set up their accounts by hand.",
        choice:
          "Cut the roles to three with one hierarchy: admins can create any role, managers create site managers inside their own company and must give each one a site, and site managers create no one. Every service limits data to the signed-in user's company and sites. Sign-up creates the company, its first site and the owner's access in one step, and owners invite people with links that expire. Site managers can switch their own site's app features on or off, while the site itself stays with the manager. Handhelds sign in to a single site, shared at the post or bound to one guard.",
        result:
          "A company signs up, adds its sites and invites its people without help from us, and each person sees only the company and sites their role allows. The role rules have unit tests, and QA covered 34 pages across all three roles.",
      },
    ],
    quality: [
      { title: "Tests.", body: "130 pytest tests on the services and Playwright end-to-end specs on the dashboard." },
      { title: "Full run on production.", body: "Created a checkpoint, patrolled it on the handheld, and exported the PDF report." },
      { title: "QA across roles.", body: "34 pages checked for 3 roles, with no missing translation keys in Thai or English." },
      { title: "Security.", body: "Ran a security audit across the stack and acted on it. ID and face photos are stored privately." },
      { title: "Older guards.", body: "Audited the handheld app with Maestro for older users: Thai labels, large targets, labelled icons." },
    ],
    headings: {
      whatItDoes: "Patrol, incidents, visitors and reports.",
      system: "Eleven services behind one gateway.",
      decisions: "The problem I had to solve.",
      quality: "Tested across roles, devices and production.",
    },
    next: "baojai",
  },
];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
