import Image from "next/image";
import type { Shot } from "@/content/site";

// A charcoal plate with screens floating on it. Phones sit in a row; a desktop shot can carry one phone overlapping its corner.

export function Phones({ shots, className = "" }: { shots: Shot[]; className?: string }) {
  return (
    <div className={`plate phones n${shots.length} ${className}`}>
      {shots.map((s) => (
        <Image key={s.src} className="phone" src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 760px) 30vw, 220px" />
      ))}
    </div>
  );
}

export function Desk({ shot, float, className = "" }: { shot: Shot; float?: Shot; className?: string }) {
  return (
    <div className={`plate desk-plate ${float ? "with-float" : ""} ${className}`}>
      <Image className="desk" src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 760px) 90vw, 900px" />
      {float && <Image className="float" src={float.src} alt={float.alt} width={float.width} height={float.height} sizes="(max-width: 760px) 22vw, 140px" />}
    </div>
  );
}

export function Sheet({ kicker, name, line, foot }: { kicker: string; name: string; line: string; foot: [string, string] }) {
  return (
    <div className="plate">
      <div className="sheet">
        <span className="kicker">{kicker}</span>
        <div className="sheet-body">
          <span className="name">{name}</span>
          <span className="line">{line}</span>
        </div>
        <div className="sheet-foot">
          <span>{foot[0]}</span>
          <span>{foot[1]}</span>
        </div>
      </div>
    </div>
  );
}
