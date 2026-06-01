"use client";

import { type CSSProperties, type PointerEvent, useEffect, useRef, useState } from "react";
import type { DangerStatus } from "@/features/game/types";
import { MissionHud, MissionStage, distance, pointerToPercent } from "./missionShared";

type Flame = { id: string; x: string; y: string; nx: number; ny: number; heat: number; scale: number };

const FLAME_SEEDS: Array<{ x: number; y: number; scale: number }> = [
  { x: 18, y: 68, scale: 1.05 },
  { x: 31, y: 58, scale: 0.85 },
  { x: 44, y: 70, scale: 1.15 },
  { x: 57, y: 60, scale: 0.95 },
  { x: 70, y: 71, scale: 1.1 },
  { x: 82, y: 62, scale: 0.8 }
];

const SPRAY_RADIUS = 13; // % of stage
const DRAIN_PER_SEC = 0.34; // water tank usage while spraying
const REFILL_PER_SEC = 0.46; // tank recovery while idle
const DOUSE_PER_SEC = 0.78; // heat removed at point-blank range

export function WildfireMission({
  disabled = false,
  status,
  onComplete
}: {
  disabled?: boolean;
  status: DangerStatus;
  onComplete: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 50, y: 60, active: false });
  const flamesRef = useRef<Flame[]>(
    FLAME_SEEDS.map((seed, index) => ({
      id: `flame-${index}`,
      x: `${seed.x}%`,
      y: `${seed.y}%`,
      nx: seed.x,
      ny: seed.y,
      heat: 1,
      scale: seed.scale
    }))
  );
  const waterRef = useRef(1);
  const completedRef = useRef(false);
  const [flames, setFlames] = useState<Flame[]>(flamesRef.current);
  const [water, setWater] = useState(1);
  const [spraying, setSpraying] = useState(false);
  const [cursor, setCursor] = useState({ x: 50, y: 60, visible: false });

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const active = pointer.current.active && !disabled;
      const hasWater = waterRef.current > 0.02;

      if (active && hasWater) {
        waterRef.current = Math.max(0, waterRef.current - DRAIN_PER_SEC * dt);
      } else {
        waterRef.current = Math.min(1, waterRef.current + REFILL_PER_SEC * dt);
      }

      let changed = false;
      if (active && hasWater) {
        for (const flame of flamesRef.current) {
          if (flame.heat <= 0) continue;
          const d = distance(pointer.current.x, pointer.current.y, flame.nx, flame.ny);
          if (d < SPRAY_RADIUS) {
            const intensity = 1 - d / SPRAY_RADIUS;
            flame.heat = Math.max(0, flame.heat - DOUSE_PER_SEC * dt * (0.4 + intensity));
            changed = true;
          }
        }
      }

      if (changed) setFlames(flamesRef.current.map((flame) => ({ ...flame })));
      setWater(waterRef.current);

      if (!completedRef.current && flamesRef.current.every((flame) => flame.heat <= 0)) {
        completedRef.current = true;
        window.setTimeout(onComplete, 520);
      }
      raf = window.requestAnimationFrame(step);
    };
    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [disabled, onComplete]);

  const updatePointer = (event: PointerEvent<HTMLDivElement>, active: boolean) => {
    if (!stageRef.current) return;
    const { x, y } = pointerToPercent(event.clientX, event.clientY, stageRef.current);
    pointer.current = { x, y, active };
    setCursor({ x, y, visible: true });
  };

  const remaining = flames.filter((flame) => flame.heat > 0.05).length;
  const progress = 1 - flames.reduce((sum, flame) => sum + Math.max(0, flame.heat), 0) / flames.length;
  const lowWater = water < 0.18;

  return (
    <MissionStage
      ariaLabel="산불 진압 미션"
      className="wildfire-stage"
      status={status}
      disabled={disabled}
      cleared={completedRef.current}
      clearText="진압 완료"
      style={{ "--spray": spraying ? "1" : "0" } as CSSProperties}
      stageRef={stageRef}
      onPointerDown={(event) => {
        if (disabled) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        setSpraying(true);
        updatePointer(event, true);
      }}
      onPointerMove={(event) => updatePointer(event, pointer.current.active)}
      onPointerUp={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        pointer.current.active = false;
        setSpraying(false);
      }}
      onPointerCancel={() => {
        pointer.current.active = false;
        setSpraying(false);
      }}
      onPointerLeave={() => setCursor((current) => ({ ...current, visible: false }))}
    >
      <div className="wildfire-sky" aria-hidden="true">
        <span className="smoke-plume plume-a" />
        <span className="smoke-plume plume-b" />
        <span className="smoke-plume plume-c" />
      </div>
      <div className="wildfire-ridge" aria-hidden="true" />
      <div className="wildfire-forest" aria-hidden="true">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((tree) => (
          <span className="forest-tree" key={tree} style={{ "--tree": String(tree) } as CSSProperties} />
        ))}
      </div>

      <MissionHud
        phase="긴급 진화 작전"
        title="번지는 불길을 잡으세요"
        instruction={lowWater ? "물탱크가 비었습니다. 잠시 손을 떼 재충전하세요." : "불길을 누른 채 쓸어 물을 분사하세요."}
        progress={progress}
        countLabel={`${flames.length - remaining} / ${flames.length}`}
        badgeLabel={`잔불 ${remaining}`}
        gauge={{ label: "물탱크", value: water, tone: "water" }}
      />

      {flames.map((flame) => {
        const out = flame.heat <= 0.05;
        return (
          <div
            aria-hidden="true"
            className={`wildfire-flame ${out ? "out" : ""}`}
            key={flame.id}
            style={
              {
                left: flame.x,
                top: flame.y,
                "--heat": String(Math.max(0, flame.heat)),
                "--scale": String(flame.scale)
              } as CSSProperties
            }
          >
            <span className="flame-core" />
            <span className="flame-glow" />
            <span className="flame-smoke" />
          </div>
        );
      })}

      <div
        className={`hose-cursor ${spraying ? "spraying" : ""} ${lowWater ? "empty" : ""}`}
        style={{ left: `${cursor.x}%`, top: `${cursor.y}%`, opacity: cursor.visible ? 1 : 0 }}
        aria-hidden="true"
      >
        <span className="hose-jet" />
        <span className="hose-mist" />
      </div>
    </MissionStage>
  );
}
