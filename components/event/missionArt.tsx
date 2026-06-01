"use client";

import { useId } from "react";

/* Detailed inline-SVG illustrations for mission objects. Each uses layered
   gradients, specular highlights and soft shading so the objects read as
   tangible materials rather than flat shapes. Gradient ids are namespaced
   with useId so multiple instances never collide. */

type ArtProps = { className?: string };

/* ---------------- OCEAN: trash items ---------------- */

export function PlasticBottleArt({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 48 104" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#cfeefb" />
          <stop offset="0.32" stopColor="#eafaff" />
          <stop offset="0.55" stopColor="#b7e4f5" />
          <stop offset="1" stopColor="#6fb9d6" />
        </linearGradient>
        <linearGradient id={`${id}-cap`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#5fb6e6" />
          <stop offset="0.5" stopColor="#2f87c4" />
          <stop offset="1" stopColor="#1d5f93" />
        </linearGradient>
      </defs>
      <path
        d="M16 30 C16 21 18 15 24 15 C30 15 32 21 32 30 L33 60 C34 66 34 70 33 76 L33 92 C33 98 30 101 24 101 C18 101 15 98 15 92 L15 76 C14 70 14 66 15 60 Z"
        fill={`url(#${id}-body)`}
        stroke="#3f8aa8"
        strokeOpacity="0.35"
        strokeWidth="1.2"
      />
      <rect x="17" y="11" width="14" height="6" rx="1.5" fill="#bfe3ef" />
      <rect x="17.5" y="2" width="13" height="10" rx="2.4" fill={`url(#${id}-cap)`} stroke="#164b73" strokeOpacity="0.4" />
      <rect x="15" y="60" width="18.5" height="20" rx="2" fill="#ffffff" opacity="0.62" />
      <rect x="17" y="66" width="14" height="2" rx="1" fill="#7fb6c8" opacity="0.7" />
      <rect x="17" y="72" width="11" height="2" rx="1" fill="#7fb6c8" opacity="0.55" />
      <rect x="18.5" y="34" width="4.5" height="52" rx="2.2" fill="#ffffff" opacity="0.55" />
      <path d="M16 52 H32 M15.5 56 H33" stroke="#5b9fb8" strokeOpacity="0.35" strokeWidth="1" />
    </svg>
  );
}

export function CupArt({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 60 92" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-cup`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff6e6" />
          <stop offset="0.42" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e0a76a" />
        </linearGradient>
        <linearGradient id={`${id}-lid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe6c4" />
          <stop offset="1" stopColor="#caa06f" />
        </linearGradient>
      </defs>
      <path d="M11 18 L49 18 L42 86 C42 89 38 90 30 90 C22 90 18 89 18 86 Z" fill={`url(#${id}-cup)`} stroke="#a9763e" strokeOpacity="0.4" strokeWidth="1.2" />
      <ellipse cx="30" cy="18" rx="20" ry="6.5" fill={`url(#${id}-lid)`} stroke="#a9763e" strokeOpacity="0.45" />
      <ellipse cx="30" cy="16.5" rx="15" ry="4" fill="#fff3df" />
      <path d="M22 30 L20 84" stroke="#ffffff" strokeOpacity="0.7" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M16 44 H44 M17 58 H43" stroke="#c99a64" strokeOpacity="0.4" strokeWidth="1.1" />
    </svg>
  );
}

export function CanArt({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 52 96" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9aa6ae" />
          <stop offset="0.22" stopColor="#eef3f6" />
          <stop offset="0.5" stopColor="#c2ccd3" />
          <stop offset="0.78" stopColor="#f2f6f8" />
          <stop offset="1" stopColor="#7e8a92" />
        </linearGradient>
        <linearGradient id={`${id}-label`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b3322a" />
          <stop offset="0.3" stopColor="#ff7a4f" />
          <stop offset="0.5" stopColor="#e63d2f" />
          <stop offset="1" stopColor="#9a261f" />
        </linearGradient>
      </defs>
      <rect x="9" y="14" width="34" height="70" rx="4" fill={`url(#${id}-metal)`} stroke="#5e6970" strokeOpacity="0.5" strokeWidth="1.2" />
      <rect x="9" y="34" width="34" height="30" fill={`url(#${id}-label)`} />
      <rect x="9" y="40" width="34" height="3.5" fill="#ffffff" opacity="0.85" />
      <ellipse cx="26" cy="14" rx="17" ry="5.5" fill="#dfe6ea" stroke="#8a949b" strokeOpacity="0.5" />
      <ellipse cx="26" cy="13" rx="13" ry="3.6" fill="#aeb8bf" />
      <ellipse cx="26" cy="12.5" rx="6" ry="1.8" fill="#7d878e" />
      <rect x="14" y="18" width="3.5" height="62" rx="1.75" fill="#ffffff" opacity="0.6" />
      <rect x="36" y="18" width="2.4" height="62" rx="1.2" fill="#ffffff" opacity="0.32" />
    </svg>
  );
}

export function GlassBottleArt({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 44 104" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7fcfa8" />
          <stop offset="0.34" stopColor="#cdfbe2" />
          <stop offset="0.6" stopColor="#5cae84" />
          <stop offset="1" stopColor="#2f6f50" />
        </linearGradient>
        <linearGradient id={`${id}-gcap`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e7c98a" />
          <stop offset="1" stopColor="#a17b3e" />
        </linearGradient>
      </defs>
      <rect x="17" y="2" width="10" height="13" rx="1.6" fill={`url(#${id}-gcap)`} stroke="#7a5a2c" strokeOpacity="0.4" />
      <path
        d="M17 15 L27 15 L27 30 C27 34 31 36 31 44 L31 92 C31 98 28 101 22 101 C16 101 13 98 13 92 L13 44 C13 36 17 34 17 30 Z"
        fill={`url(#${id}-glass)`}
        stroke="#235a40"
        strokeOpacity="0.4"
        strokeWidth="1.2"
      />
      <rect x="14.5" y="46" width="3.6" height="48" rx="1.8" fill="#ffffff" opacity="0.5" />
      <rect x="13" y="58" width="18" height="20" rx="2" fill="#ffffff" opacity="0.32" />
    </svg>
  );
}

export function NetArt({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 80 72" role="img" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-net`} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#3c8f87" />
          <stop offset="1" stopColor="#1c4f4a" />
        </radialGradient>
        <clipPath id={`${id}-clip`}>
          <path d="M14 22 C20 8 56 6 66 20 C76 34 70 60 50 66 C28 72 8 56 10 40 C11 32 11 30 14 22 Z" />
        </clipPath>
      </defs>
      <path d="M14 22 C20 8 56 6 66 20 C76 34 70 60 50 66 C28 72 8 56 10 40 C11 32 11 30 14 22 Z" fill={`url(#${id}-net)`} stroke="#123c38" strokeWidth="2" />
      <g clipPath={`url(#${id}-clip)`} stroke="#0e3733" strokeWidth="2.2" opacity="0.85">
        <path d="M-4 8 L52 80 M8 0 L72 76 M24 -6 L88 64 M40 -10 L96 56" />
        <path d="M84 8 L28 80 M72 0 L8 76 M56 -6 L-8 64 M40 -10 L-20 56" />
      </g>
      <g fill="#cdeee9" opacity="0.5">
        <circle cx="30" cy="26" r="2" />
        <circle cx="50" cy="38" r="2" />
        <circle cx="34" cy="50" r="2" />
      </g>
    </svg>
  );
}

export function FoamArt({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 70 60" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-foam`} x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#d2dae3" />
        </linearGradient>
      </defs>
      <path d="M8 16 C8 10 14 8 20 8 L52 8 C60 8 64 12 64 20 L64 42 C64 50 58 53 50 53 L18 53 C10 53 6 48 6 40 Z" fill={`url(#${id}-foam)`} stroke="#aeb8c4" strokeWidth="1.4" />
      <path d="M16 8 L12 53 M30 8 L28 53 M46 8 L46 53" stroke="#c6ced8" strokeWidth="1" opacity="0.7" />
      <g fill="#ffffff" stroke="#cfd6df" strokeWidth="0.6">
        <circle cx="18" cy="18" r="3.4" />
        <circle cx="28" cy="14" r="2.8" />
        <circle cx="40" cy="20" r="3.6" />
        <circle cx="52" cy="16" r="3" />
        <circle cx="24" cy="30" r="3.2" />
        <circle cx="46" cy="34" r="3.4" />
        <circle cx="34" cy="42" r="3" />
      </g>
    </svg>
  );
}

/* ---------------- OCEAN: full scene backdrop ---------------- */

export function OceanBackdrop({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fd9f6" />
          <stop offset="1" stopColor="#dff5ff" />
        </linearGradient>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fc9e8" />
          <stop offset="0.32" stopColor="#4ea9d2" />
          <stop offset="0.7" stopColor="#2b8bbd" />
          <stop offset="1" stopColor="#136d97" />
        </linearGradient>
        <linearGradient id={`${id}-sand`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#f7e2a4" />
          <stop offset="0.5" stopColor="#ebcd83" />
          <stop offset="1" stopColor="#d6b264" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffef2" />
          <stop offset="0.4" stopColor="#fff3c4" />
          <stop offset="1" stopColor="#fff3c4" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-glit`} cx="0.5" cy="0" r="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-soft`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <pattern id={`${id}-grain`} width="46" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
          <circle cx="6" cy="8" r="1.5" fill="#b58e4a" opacity="0.28" />
          <circle cx="28" cy="22" r="1.2" fill="#a8813f" opacity="0.24" />
          <circle cx="38" cy="6" r="1" fill="#c79c54" opacity="0.3" />
        </pattern>
      </defs>

      {/* sky */}
      <rect x="0" y="0" width="1000" height="300" fill={`url(#${id}-sky)`} />
      <ellipse cx="150" cy="120" rx="220" ry="200" fill={`url(#${id}-sun)`} />
      <circle cx="150" cy="118" r="52" fill="#fffdf0" opacity="0.95" />
      <g filter={`url(#${id}-soft)`} fill="#ffffff">
        <g className="ocean-cloud-a">
          <ellipse cx="640" cy="90" rx="80" ry="26" opacity="0.9" />
          <ellipse cx="690" cy="74" rx="52" ry="24" opacity="0.85" />
        </g>
        <g className="ocean-cloud-b">
          <ellipse cx="380" cy="150" rx="60" ry="18" opacity="0.7" />
        </g>
      </g>

      {/* sea */}
      <rect x="0" y="150" width="1000" height="450" fill={`url(#${id}-sea)`} />
      {/* sun glitter path */}
      <ellipse className="ocean-glitter" cx="150" cy="260" rx="120" ry="120" fill={`url(#${id}-glit)`} opacity="0.5" />
      {/* foam wave crests */}
      <g className="ocean-foam" stroke="#eafaff" strokeLinecap="round" fill="none">
        <path d="M40 250 q60 -14 120 0 t120 0" strokeWidth="4" opacity="0.5" />
        <path d="M520 210 q70 -16 140 0 t140 0" strokeWidth="4" opacity="0.45" />
        <path d="M120 320 q80 -16 160 0 t160 0" strokeWidth="5" opacity="0.4" />
      </g>

      {/* beach */}
      <path d="M0 470 C 240 452 360 360 1000 196 L1000 600 L0 600 Z" fill={`url(#${id}-sand)`} />
      <path d="M0 470 C 240 452 360 360 1000 196 L1000 600 L0 600 Z" fill={`url(#${id}-grain)`} />
      {/* wet sand band + foam line along the shore */}
      <path d="M0 470 C 240 452 360 360 1000 196" stroke="#c9a35e" strokeWidth="20" fill="none" opacity="0.4" />
      <path className="ocean-shoreline" d="M-6 476 C 240 458 360 366 1006 202" stroke="#ffffff" strokeWidth="9" fill="none" opacity="0.92" strokeLinecap="round" />
      <path d="M-6 486 C 240 468 360 376 1006 212" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.5" strokeLinecap="round" />
    </svg>
  );
}

const trashArt = {
  bottle: PlasticBottleArt,
  cup: CupArt,
  can: CanArt,
  glass: GlassBottleArt,
  net: NetArt,
  foam: FoamArt
} as const;

export type TrashKind = keyof typeof trashArt;

export function TrashArt({ kind, className }: { kind: TrashKind; className?: string }) {
  const Art = trashArt[kind];
  return <Art className={className} />;
}

/* ---------------- OCEAN: recycle bin ---------------- */

export function RecycleBinArt({ category, className }: { category: "plastic" | "metal" | "other"; className?: string }) {
  const id = useId();
  const accents: Record<string, [string, string]> = {
    plastic: ["#ffd24a", "#c79a1f"],
    metal: ["#6ad7ff", "#2f8bca"],
    other: ["#b79bff", "#6f4ad6"]
  };
  const [accent, accentDark] = accents[category];
  return (
    <svg className={className} viewBox="0 0 120 132" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#26405a" />
          <stop offset="0.5" stopColor="#33567a" />
          <stop offset="1" stopColor="#1b2f44" />
        </linearGradient>
        <linearGradient id={`${id}-lid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent} />
          <stop offset="1" stopColor={accentDark} />
        </linearGradient>
      </defs>
      {/* body */}
      <path d="M16 34 L104 34 L98 124 C98 128 95 130 90 130 L30 130 C25 130 22 128 22 124 Z" fill={`url(#${id}-body)`} stroke={accentDark} strokeWidth="2" />
      {/* vertical ribs */}
      <path d="M44 40 L42 126 M60 40 L60 126 M76 40 L78 126" stroke="#0c1828" strokeOpacity="0.4" strokeWidth="2" />
      <rect x="24" y="40" width="6" height="86" rx="3" fill="#ffffff" opacity="0.14" />
      {/* opening / inner shadow */}
      <rect x="20" y="20" width="80" height="20" rx="5" fill="#0a1422" stroke={accent} strokeWidth="2.5" />
      <ellipse cx="60" cy="26" rx="34" ry="6" fill="#060d18" />
      {/* lid lifted at back */}
      <rect x="14" y="12" width="92" height="12" rx="6" fill={`url(#${id}-lid)`} stroke={accentDark} strokeWidth="1.5" />
      <rect x="52" y="6" width="16" height="8" rx="4" fill={`url(#${id}-lid)`} stroke={accentDark} strokeWidth="1.2" />
    </svg>
  );
}

/* ============================================================
   WILDFIRE art
   ============================================================ */

export function WildfireBackdrop({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1430" />
          <stop offset="0.45" stopColor="#7a2f25" />
          <stop offset="0.7" stopColor="#cf5a23" />
          <stop offset="1" stopColor="#f29a3c" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="1" r="0.8">
          <stop offset="0" stopColor="#ffd071" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffd071" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2415" />
          <stop offset="1" stopColor="#1c1109" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="430" fill={`url(#${id}-sky)`} />
      <ellipse cx="500" cy="430" rx="520" ry="200" fill={`url(#${id}-glow)`} />
      {/* distant ridge silhouette */}
      <path d="M0 360 L120 320 L240 350 L380 300 L520 345 L660 305 L820 350 L1000 315 L1000 430 L0 430 Z" fill="#3a1c1a" opacity="0.75" />
      {/* burning forest line */}
      <g fill="#23120c">
        <path d="M40 430 L70 320 L100 430 Z" />
        <path d="M150 430 L185 300 L220 430 Z" />
        <path d="M280 430 L315 320 L350 430 Z" />
        <path d="M430 430 L470 290 L510 430 Z" />
        <path d="M600 430 L640 315 L680 430 Z" />
        <path d="M760 430 L800 300 L840 430 Z" />
        <path d="M880 430 L915 325 L950 430 Z" />
      </g>
      <rect x="0" y="410" width="1000" height="190" fill={`url(#${id}-ground)`} />
      {/* embers on the ground */}
      <g fill="#ff8a3c" opacity="0.5">
        <circle cx="160" cy="470" r="3" /><circle cx="380" cy="500" r="2.4" /><circle cx="600" cy="475" r="3" /><circle cx="820" cy="505" r="2.6" />
      </g>
    </svg>
  );
}

export function FlameArt({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 60 96" role="img" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-f`} cx="0.5" cy="0.78" r="0.7">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset="0.32" stopColor="#ffd24a" />
          <stop offset="0.62" stopColor="#ff7a1f" />
          <stop offset="1" stopColor="#d62f19" />
        </radialGradient>
        <radialGradient id={`${id}-i`} cx="0.5" cy="0.82" r="0.5">
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset="1" stopColor="#ffd24a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M30 4 C40 26 54 38 54 60 C54 80 44 92 30 92 C16 92 6 80 6 60 C6 42 18 36 22 24 C24 34 30 36 30 30 C30 22 26 14 30 4 Z" fill={`url(#${id}-f)`} />
      <path d="M30 34 C36 46 42 52 42 64 C42 76 37 84 30 84 C23 84 18 76 18 64 C18 54 24 50 27 42 C28 48 30 50 30 46 Z" fill={`url(#${id}-i)`} />
    </svg>
  );
}

export function PineTreeArt({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 80 120" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-p`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2f6b3e" />
          <stop offset="0.5" stopColor="#1f4d2b" />
          <stop offset="1" stopColor="#143620" />
        </linearGradient>
      </defs>
      <rect x="35" y="96" width="10" height="22" rx="2" fill="#3e2613" />
      <path d="M40 6 L62 44 L48 44 L68 78 L52 78 L74 108 L6 108 L28 78 L12 78 L32 44 L18 44 Z" fill={`url(#${id}-p)`} stroke="#0f2c19" strokeWidth="1.5" />
      <path d="M40 6 L52 26 L40 26 Z" fill="#3f8051" opacity="0.6" />
    </svg>
  );
}

/* ============================================================
   OIL SPILL art
   ============================================================ */

export function OilBackdrop({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2da0c2" />
          <stop offset="0.5" stopColor="#147ba2" />
          <stop offset="1" stopColor="#0a4f6e" />
        </linearGradient>
        <radialGradient id={`${id}-shine`} cx="0.3" cy="0.2" r="0.8">
          <stop offset="0" stopColor="#bfeffc" stopOpacity="0.4" />
          <stop offset="1" stopColor="#bfeffc" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="600" fill={`url(#${id}-sea)`} />
      <rect x="0" y="0" width="1000" height="600" fill={`url(#${id}-shine)`} />
      <g stroke="#7fd6ef" strokeWidth="3" fill="none" opacity="0.3">
        <path d="M0 120 q120 -18 240 0 t240 0 t240 0 t240 0" />
        <path d="M0 260 q120 -18 240 0 t240 0 t240 0 t240 0" />
        <path d="M0 400 q120 -18 240 0 t240 0 t240 0 t240 0" />
        <path d="M0 520 q120 -18 240 0 t240 0 t240 0 t240 0" />
      </g>
    </svg>
  );
}

export function OilBargeArt({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 140 96" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-hull`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2b53c" />
          <stop offset="1" stopColor="#c5781d" />
        </linearGradient>
      </defs>
      <rect x="34" y="20" width="20" height="40" fill="#5a6b76" />
      <rect x="30" y="12" width="28" height="12" rx="2" fill="#cfe0ea" />
      <path d="M6 58 L134 58 L120 86 C118 90 114 92 108 92 L32 92 C26 92 22 90 20 86 Z" fill={`url(#${id}-hull)`} stroke="#8a5212" strokeWidth="2" />
      <rect x="64" y="30" width="60" height="28" rx="3" fill="#33567a" stroke="#1b2f44" strokeWidth="1.5" />
      <rect x="70" y="36" width="48" height="6" rx="3" fill="#6ad7ff" opacity="0.8" />
      <rect x="70" y="46" width="34" height="6" rx="3" fill="#6ad7ff" opacity="0.5" />
    </svg>
  );
}

/* ============================================================
   LOGGING art
   ============================================================ */

export function LoggingBackdrop({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe9ff" />
          <stop offset="1" stopColor="#eafaf0" />
        </linearGradient>
        <linearGradient id={`${id}-soil`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a5a30" />
          <stop offset="1" stopColor="#4f351d" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fffce6" />
          <stop offset="1" stopColor="#fffce6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="360" fill={`url(#${id}-sky)`} />
      <ellipse cx="830" cy="110" rx="170" ry="160" fill={`url(#${id}-sun)`} />
      <circle cx="830" cy="108" r="46" fill="#fff7cf" />
      {/* far hills */}
      <path d="M0 300 C 180 250 320 290 500 260 C 680 230 820 290 1000 255 L1000 360 L0 360 Z" fill="#7fae5c" opacity="0.65" />
      <path d="M0 330 C 220 295 360 330 560 305 C 760 285 880 325 1000 305 L1000 380 L0 380 Z" fill="#5d934a" opacity="0.8" />
      {/* stumps on the hill (deforested) */}
      <g fill="#5a3a20">
        <ellipse cx="120" cy="320" rx="14" ry="6" /><ellipse cx="300" cy="312" rx="12" ry="5" /><ellipse cx="640" cy="318" rx="13" ry="6" />
      </g>
      <rect x="0" y="345" width="1000" height="255" fill={`url(#${id}-soil)`} />
      {/* tilled furrows */}
      <g stroke="#3c2614" strokeWidth="6" opacity="0.3">
        <path d="M0 400 L1000 380 M0 460 L1000 440 M0 520 L1000 500 M0 580 L1000 560" />
      </g>
    </svg>
  );
}

export function SaplingArt({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 48 60" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-l`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a6ef7a" />
          <stop offset="1" stopColor="#3f9a44" />
        </linearGradient>
      </defs>
      <rect x="22" y="34" width="4" height="22" rx="2" fill="#5a8f3a" />
      <path d="M24 40 C12 40 6 30 6 20 C18 22 24 30 24 40 Z" fill={`url(#${id}-l)`} />
      <path d="M24 36 C36 36 42 26 42 16 C30 18 24 26 24 36 Z" fill={`url(#${id}-l)`} />
      <path d="M24 30 C24 18 30 8 24 2 C18 8 24 18 24 30 Z" fill={`url(#${id}-l)`} />
    </svg>
  );
}

export function TreeArt({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 90 110" role="img" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-c`} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#8fe06a" />
          <stop offset="1" stopColor="#2f7b3f" />
        </radialGradient>
        <linearGradient id={`${id}-t`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6b4423" />
          <stop offset="1" stopColor="#3e2613" />
        </linearGradient>
      </defs>
      <rect x="40" y="70" width="12" height="36" rx="3" fill={`url(#${id}-t)`} />
      <circle cx="45" cy="44" r="34" fill={`url(#${id}-c)`} />
      <circle cx="26" cy="52" r="22" fill={`url(#${id}-c)`} />
      <circle cx="64" cy="52" r="22" fill={`url(#${id}-c)`} />
      <ellipse cx="36" cy="32" rx="14" ry="10" fill="#b6f291" opacity="0.6" />
    </svg>
  );
}

/* ============================================================
   AIR art
   ============================================================ */

export function AirBackdrop({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9aa9b4" />
          <stop offset="0.5" stopColor="#b6a596" />
          <stop offset="1" stopColor="#caa985" />
        </linearGradient>
        <linearGradient id={`${id}-bld`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a5d6e" />
          <stop offset="1" stopColor="#26323e" />
        </linearGradient>
        <linearGradient id={`${id}-bld2`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3c4d5c" />
          <stop offset="1" stopColor="#1d2731" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="600" fill={`url(#${id}-sky)`} />
      {/* haze band */}
      <rect x="0" y="250" width="1000" height="160" fill="#caa985" opacity="0.25" />
      {/* back skyline */}
      <g fill={`url(#${id}-bld2)`} opacity="0.7">
        <rect x="60" y="300" width="90" height="300" /><rect x="200" y="250" width="70" height="350" /><rect x="330" y="320" width="80" height="280" />
        <rect x="600" y="270" width="76" height="330" /><rect x="760" y="310" width="90" height="290" /><rect x="880" y="260" width="80" height="340" />
      </g>
      {/* front skyline */}
      <g fill={`url(#${id}-bld)`}>
        <rect x="120" y="360" width="110" height="240" /><rect x="280" y="320" width="96" height="280" /><rect x="430" y="380" width="120" height="220" />
        <rect x="600" y="330" width="104" height="270" /><rect x="760" y="370" width="118" height="230" />
      </g>
      {/* lit windows */}
      <g fill="#ffe39a" opacity="0.5">
        <rect x="140" y="380" width="10" height="14" /><rect x="170" y="380" width="10" height="14" /><rect x="140" y="410" width="10" height="14" />
        <rect x="300" y="340" width="10" height="14" /><rect x="330" y="340" width="10" height="14" /><rect x="620" y="350" width="10" height="14" /><rect x="650" y="350" width="10" height="14" />
      </g>
    </svg>
  );
}

export function FactoryStackArt({ filtered, className }: { filtered?: boolean; className?: string }) {
  const id = useId();
  const a = filtered ? "#43b27e" : "#b56a4a";
  const b = filtered ? "#1f6e54" : "#6a3d30";
  return (
    <svg className={className} viewBox="0 0 70 120" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={b} />
          <stop offset="0.45" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <rect x="22" y="20" width="26" height="98" rx="3" fill={`url(#${id}-s)`} stroke="#1c1109" strokeOpacity="0.5" strokeWidth="1.5" />
      <rect x="18" y="14" width="34" height="10" rx="2" fill={`url(#${id}-s)`} stroke="#1c1109" strokeOpacity="0.5" />
      <rect x="27" y="40" width="16" height="4" fill="#1c1109" opacity="0.3" />
      <rect x="27" y="54" width="16" height="4" fill="#1c1109" opacity="0.3" />
      {filtered && <path d="M28 76 l6 7 l11 -13" stroke="#eafff3" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
}

/* ============================================================
   DROUGHT art
   ============================================================ */

export function DroughtBackdrop({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4d98c" />
          <stop offset="1" stopColor="#f0b25e" />
        </linearGradient>
        <linearGradient id={`${id}-land`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d49a52" />
          <stop offset="1" stopColor="#a9682f" />
        </linearGradient>
        <radialGradient id={`${id}-sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff4cf" />
          <stop offset="0.5" stopColor="#ffe39a" />
          <stop offset="1" stopColor="#ffe39a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="340" fill={`url(#${id}-sky)`} />
      <ellipse cx="800" cy="120" rx="200" ry="180" fill={`url(#${id}-sun)`} />
      <circle cx="800" cy="118" r="60" fill="#fff2b8" />
      <path d="M0 300 L1000 270 L1000 340 L0 340 Z" fill="#c98a44" opacity="0.5" />
      <rect x="0" y="320" width="1000" height="280" fill={`url(#${id}-land)`} />
      {/* cracked earth lines */}
      <g stroke="#7a4a22" strokeWidth="3" opacity="0.5" fill="none">
        <path d="M80 400 l40 30 l-20 40 M120 430 l50 -10" />
        <path d="M400 460 l30 40 l-40 30 M430 500 l60 5" />
        <path d="M720 420 l-30 40 l40 30 M690 460 l-60 10" />
        <path d="M880 520 l-40 30 M860 500 l30 40" />
      </g>
    </svg>
  );
}

export function ReservoirArt({ className }: ArtProps) {
  const id = useId();
  return (
    <svg className={className} viewBox="0 0 90 110" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-tank`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6a7c88" />
          <stop offset="0.5" stopColor="#aab8c2" />
          <stop offset="1" stopColor="#56676f" />
        </linearGradient>
        <linearGradient id={`${id}-w`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fe6ff" />
          <stop offset="1" stopColor="#2f8bff" />
        </linearGradient>
      </defs>
      <rect x="18" y="70" width="10" height="36" fill="#46555f" />
      <rect x="62" y="70" width="10" height="36" fill="#46555f" />
      <rect x="10" y="24" width="70" height="52" rx="8" fill={`url(#${id}-tank)`} stroke="#33424b" strokeWidth="2" />
      <rect x="16" y="34" width="58" height="30" rx="5" fill={`url(#${id}-w)`} />
      <rect x="16" y="34" width="58" height="6" rx="3" fill="#cdf3ff" opacity="0.7" />
      <path d="M30 8 L60 8 L66 24 L24 24 Z" fill="#5b6e78" stroke="#33424b" strokeWidth="1.5" />
    </svg>
  );
}

export function CropArt({ lush, className }: { lush?: boolean; className?: string }) {
  const id = useId();
  if (!lush) {
    return (
      <svg className={className} viewBox="0 0 80 60" role="img" aria-hidden="true">
        <g stroke="#9a7038" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.85">
          <path d="M20 56 L18 30" /><path d="M40 56 L42 26" /><path d="M60 56 L58 32" />
          <path d="M18 30 l-6 -6 M18 36 l6 -5 M42 26 l-7 -6 M42 32 l7 -6 M58 32 l-6 -5 M58 38 l6 -5" />
        </g>
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 80 60" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a6ef7a" />
          <stop offset="1" stopColor="#3f9a44" />
        </linearGradient>
      </defs>
      <g fill={`url(#${id}-g)`} stroke="#2f7b3f" strokeWidth="1">
        <path d="M20 58 C8 44 12 26 20 14 C28 26 32 44 20 58 Z" />
        <path d="M40 58 C26 42 30 20 40 6 C50 20 54 42 40 58 Z" />
        <path d="M60 58 C48 44 52 26 60 14 C68 26 72 44 60 58 Z" />
      </g>
      <g fill="#ffd24a"><circle cx="40" cy="12" r="4" /><circle cx="20" cy="20" r="3" /><circle cx="60" cy="20" r="3" /></g>
    </svg>
  );
}
