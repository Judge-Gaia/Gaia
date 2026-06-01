"use client";

import { type CSSProperties, type PointerEvent, useEffect, useRef, useState } from "react";
import type { DangerStatus } from "@/features/game/types";
import { MissionHud, MissionStage, distance, pointerToPercent } from "./missionShared";

type Cloud = { id: string; x: number; y: number; density: number };

const STACKS = [
  { id: "stack-1", x: 22 },
  { id: "stack-2", x: 50 },
  { id: "stack-3", x: 78 }
];

const CLOUD_SEEDS: Array<{ x: number; y: number }> = [
  { x: 20, y: 30 },
  { x: 38, y: 22 },
  { x: 54, y: 32 },
  { x: 70, y: 24 },
  { x: 84, y: 34 }
];

const SWEEP_RADIUS = 15;
const DISPERSE_PER_SEC = 0.95;
const REGEN_PER_STACK = 0.05;

export function AirMission({
  disabled = false,
  status,
  onComplete
}: {
  disabled?: boolean;
  status: DangerStatus;
  onComplete: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 50, y: 30, active: false });
  const cloudsRef = useRef<Cloud[]>(
    CLOUD_SEEDS.map((seed, index) => ({ id: `cloud-${index}`, x: seed.x, y: seed.y, density: 1 }))
  );
  const filteredRef = useRef<Set<string>>(new Set());
  const completedRef = useRef(false);
  const [clouds, setClouds] = useState<Cloud[]>(cloudsRef.current);
  const [filtered, setFiltered] = useState<Set<string>>(new Set());
  const [cursor, setCursor] = useState({ x: 50, y: 30, visible: false });
  const [sweeping, setSweeping] = useState(false);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const unfiltered = STACKS.length - filteredRef.current.size;
      let changed = false;

      for (const cloud of cloudsRef.current) {
        if (pointer.current.active && !disabled) {
          const d = distance(pointer.current.x, pointer.current.y, cloud.x, cloud.y);
          if (d < SWEEP_RADIUS && cloud.density > 0) {
            cloud.density = Math.max(0, cloud.density - DISPERSE_PER_SEC * dt * (1 - d / SWEEP_RADIUS + 0.3));
            changed = true;
          }
        }
        if (unfiltered > 0 && cloud.density < 1) {
          cloud.density = Math.min(1, cloud.density + REGEN_PER_STACK * unfiltered * dt);
          changed = true;
        }
      }

      if (changed) setClouds(cloudsRef.current.map((cloud) => ({ ...cloud })));

      if (
        !completedRef.current &&
        filteredRef.current.size === STACKS.length &&
        cloudsRef.current.every((cloud) => cloud.density < 0.05)
      ) {
        completedRef.current = true;
        window.setTimeout(onComplete, 540);
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

  const filterStack = (id: string) => {
    if (disabled || filteredRef.current.has(id)) return;
    filteredRef.current.add(id);
    setFiltered(new Set(filteredRef.current));
  };

  const clearedClouds = clouds.filter((cloud) => cloud.density < 0.05).length;
  const filterCount = filtered.size;
  const progress = (filterCount + clearedClouds) / (STACKS.length + clouds.length);
  const sourcesLeft = STACKS.length - filterCount;

  return (
    <MissionStage
      ariaLabel="대기 오염 정화 미션"
      className="air-stage"
      status={status}
      disabled={disabled}
      cleared={completedRef.current}
      clearText="대기 회복"
      stageRef={stageRef}
      onPointerDown={(event) => {
        if (disabled) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        setSweeping(true);
        updatePointer(event, true);
      }}
      onPointerMove={(event) => updatePointer(event, pointer.current.active)}
      onPointerUp={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
        pointer.current.active = false;
        setSweeping(false);
      }}
      onPointerCancel={() => {
        pointer.current.active = false;
        setSweeping(false);
      }}
      onPointerLeave={() => setCursor((current) => ({ ...current, visible: false }))}
    >
      <div className="air-skyline" aria-hidden="true">
        <span className="sky-building b1" />
        <span className="sky-building b2" />
        <span className="sky-building b3" />
        <span className="sky-building b4" />
        <span className="sky-building b5" />
      </div>

      <MissionHud
        phase="대기질 회복 작전"
        title="오염원을 막고 스모그를 걷어내세요"
        instruction={
          sourcesLeft > 0
            ? "먼저 굴뚝을 눌러 정화 필터를 설치하세요."
            : "남은 스모그를 눌러 쓸어내며 흩어주세요."
        }
        progress={progress}
        countLabel={`${clearedClouds} / ${clouds.length}`}
        badgeLabel={sourcesLeft > 0 ? `오염원 ${sourcesLeft}` : "오염원 차단"}
        gauge={{ label: "대기질", value: progress, tone: "wind" }}
      />

      {clouds.map((cloud) => (
        <span
          aria-hidden="true"
          className="smog-cloud"
          key={cloud.id}
          style={
            {
              left: `${cloud.x}%`,
              top: `${cloud.y}%`,
              "--density": String(cloud.density)
            } as CSSProperties
          }
        />
      ))}

      <div className="air-stacks" aria-hidden="false">
        {STACKS.map((stack) => {
          const isFiltered = filtered.has(stack.id);
          return (
            <button
              aria-label="굴뚝 필터 설치"
              className={`air-stack ${isFiltered ? "filtered" : ""}`}
              disabled={disabled || isFiltered}
              key={stack.id}
              onClick={() => filterStack(stack.id)}
              style={{ left: `${stack.x}%` } as CSSProperties}
              type="button"
            >
              <span className="stack-body" aria-hidden="true" />
              <span className="stack-emit" aria-hidden="true" />
              <small className="target-hint">{isFiltered ? "필터 완료" : "필터 설치"}</small>
            </button>
          );
        })}
      </div>

      <div
        className={`wind-cursor ${sweeping ? "active" : ""}`}
        style={{ left: `${cursor.x}%`, top: `${cursor.y}%`, opacity: cursor.visible ? 1 : 0 }}
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </div>
    </MissionStage>
  );
}
