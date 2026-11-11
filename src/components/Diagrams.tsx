// Architecture diagrams for the case studies. Colors come from CSS tokens so both themes work.

function Arrow({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0L10 5L0 10z" className="arrowhead" />
      </marker>
    </defs>
  );
}

function Node({ x, y, w, h, title, lines = [], strong = false }: { x: number; y: number; w: number; h: number; title: string; lines?: string[]; strong?: boolean }) {
  return (
    <g className="node">
      <rect x={x} y={y} width={w} height={h} rx={6} className={strong ? "strong" : undefined} />
      <text x={x + 16} y={y + 26}>{title}</text>
      {lines.map((l, i) => (
        <text key={i} x={x + 16} y={y + 46 + i * 18} className="sub">{l}</text>
      ))}
    </g>
  );
}

export function BaojaiDiagram() {
  return (
    <svg
      viewBox="0 0 1000 400"
      role="img"
      aria-label="Baojai architecture: rings and headbands connect over BLE to the mobile app; the app, baojai.com and the admin console call one API gateway; the gateway routes to nine API services, which use Supabase and external AI services and publish jobs to three workers; the app streams camera frames directly to realtime CV services."
    >
      <Arrow id="ah-bj" />
      <g className="edges" markerEnd="url(#ah-bj)">
        <path d="M170 70H201" />
        <path d="M405 70H427V160H441" />
        <path d="M405 180H441" />
        <path d="M405 290H427V200H441" />
        <path d="M405 86H415V330H441" />
        <path d="M605 150H641" />
        <path d="M835 105H861" />
        <path d="M835 150H848V255H861" />
        <path d="M740 205V246" />
      </g>
      <g className="edge-label">
        <text x={174} y={62}>BLE</text>
        <text x={609} y={142}>routes</text>
        <text x={748} y={230}>Pub/Sub</text>
        <text x={449} y={382}>WebSocket</text>
      </g>
      <Node x={20} y={40} w={150} h={60} title="Rings, headbands" lines={["5 devices"]} />
      <Node x={205} y={40} w={200} h={60} title="Mobile app" lines={["Expo React Native"]} />
      <Node x={205} y={150} w={200} h={60} title="baojai.com" lines={["Next.js · Stripe · LiveKit"]} />
      <Node x={205} y={260} w={200} h={60} title="Admin console" lines={["Next.js · roles · 2FA"]} />
      <Node x={445} y={120} w={160} h={100} title="API gateway" lines={["routing · CORS", "auth · rate limit"]} strong />
      <Node x={445} y={300} w={160} h={60} title="Realtime CV" lines={["breathing · stress"]} />
      <Node
        x={645}
        y={40}
        w={190}
        h={165}
        title="9 API services"
        lines={["auth · user · content", "booking · generate", "chat · notification", "media · admin", "", "FastAPI on Cloud Run"]}
        strong
      />
      <Node x={645} y={250} w={190} h={60} title="3 workers" lines={["video · overlay · report"]} />
      <Node x={865} y={70} w={125} h={70} title="Supabase" lines={["Postgres · auth"]} />
      <Node x={865} y={220} w={125} h={70} title="AI and media" lines={["Gemini · Suno"]} />
    </svg>
  );
}

const scaiServices: { label: string; x: number; y: number; w: number }[] = [
  { label: "account", x: 476, y: 76, w: 92 },
  { label: "auth", x: 576, y: 76, w: 92 },
  { label: "site", x: 676, y: 76, w: 98 },
  { label: "patrol", x: 476, y: 114, w: 92 },
  { label: "visitors", x: 576, y: 114, w: 92 },
  { label: "notify", x: 676, y: 114, w: 98 },
  { label: "reports", x: 476, y: 152, w: 92 },
  { label: "AI chat", x: 576, y: 152, w: 92 },
  { label: "vision", x: 676, y: 152, w: 98 },
  { label: "reminder (scheduler)", x: 476, y: 190, w: 192 },
];

export function ScaiDiagram() {
  return (
    <svg
      viewBox="0 0 960 330"
      role="img"
      aria-label="SCAI Security architecture: the web dashboard and the Sunmi handheld app call one API gateway, which checks the token and role with a Redis cache and routes to eleven services and a reminder worker; services use Supabase Postgres and Storage."
    >
      <Arrow id="ah-sc" />
      <g className="edges" markerEnd="url(#ah-sc)">
        <path d="M200 80H226V140H246" />
        <path d="M200 230H226V170H246" />
        <path d="M420 155H456" />
        <path d="M335 210V246" />
        <path d="M790 155H816" />
      </g>
      <Node x={20} y={50} w={180} h={60} title="Web dashboard" lines={["Next.js · 4 role views"]} />
      <Node x={20} y={200} w={180} h={60} title="Handheld app" lines={["Sunmi · scan · print"]} />
      <Node x={250} y={110} w={170} h={100} title="API gateway" lines={["auth · role check", "routing"]} strong />
      <Node x={250} y={250} w={170} h={56} title="Redis" lines={["permission cache"]} />
      <Node x={460} y={30} w={330} h={250} title="11 services + reminder worker" strong />
      <g className="pills">
        {scaiServices.map((s) => (
          <g key={s.label}>
            <rect x={s.x} y={s.y} width={s.w} height={28} rx={14} />
            <text x={s.x + 14} y={s.y + 18}>{s.label}</text>
          </g>
        ))}
        <text x={476} y={256} className="muted-text">FastAPI · Docker · Cloud Run</text>
      </g>
      <Node x={820} y={115} w={120} h={80} title="Supabase" lines={["Postgres", "Storage"]} />
    </svg>
  );
}
