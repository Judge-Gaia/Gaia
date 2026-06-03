"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import type { DangerStatus } from "@/features/game/types";
import { MissionHud, MissionStage } from "./missionShared";
import { AirBackdrop, FactoryStackArt } from "./missionArt";

type Pollutant = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  density: number;
  popped: boolean;
};

const STACKS = [
  { id: "stack-1", x: 22 },
  { id: "stack-2", x: 50 },
  { id: "stack-3", x: 78 }
];

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
  const completedRef = useRef(false);
  const filteredRef = useRef<Set<string>>(new Set());
  
  // Track active pollutants
  const nextIdRef = useRef(5);
  const pollutantsRef = useRef<Pollutant[]>([
    { id: "pollutant-0", x: 20, y: 35, vx: 7, vy: -6, density: 1, popped: false },
    { id: "pollutant-1", x: 38, y: 42, vx: -6, vy: 8, density: 1, popped: false },
    { id: "pollutant-2", x: 54, y: 38, vx: 9, vy: -5, density: 1, popped: false },
    { id: "pollutant-3", x: 70, y: 45, vx: -8, vy: -7, density: 1, popped: false },
    { id: "pollutant-4", x: 84, y: 40, vx: 5, vy: 9, density: 1, popped: false }
  ]);

  const [pollutants, setPollutants] = useState<Pollutant[]>(pollutantsRef.current);
  const [filtered, setFiltered] = useState<Set<string>>(new Set());

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let emitAccumulator = 0;

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const unfilteredStacks = STACKS.filter(s => !filteredRef.current.has(s.id));

      // Periodic smog generation from unfiltered stacks (every 2.3 seconds)
      if (unfilteredStacks.length > 0 && !disabled && !completedRef.current) {
        emitAccumulator += dt;
        if (emitAccumulator >= 2.3) {
          emitAccumulator = 0;
          unfilteredStacks.forEach((stack) => {
            const angle = Math.random() * Math.PI * 2;
            const speed = 7 + Math.random() * 6;
            pollutantsRef.current.push({
              id: `pollutant-${nextIdRef.current++}`,
              x: stack.x,
              y: 44, // Emit near chimney level
              vx: Math.cos(angle) * speed,
              vy: -Math.abs(Math.sin(angle)) * speed - 2, // Float upwards
              density: 1,
              popped: false
            });
          });
        }
      }

      // Update positions
      pollutantsRef.current.forEach((p) => {
        if (p.popped) {
          // Fade density to zero
          if (p.density > 0) {
            p.density = Math.max(0, p.density - 5 * dt);
          }
          return;
        }

        // Float movement
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Bounce horizontally
        if (p.x < 5 || p.x > 95) {
          p.vx = -p.vx;
          p.x = Math.max(5, Math.min(95, p.x));
        }

        // Bounce vertically in play bounds (28% to 78%)
        if (p.y < 28 || p.y > 78) {
          p.vy = -p.vy;
          p.y = Math.max(28, Math.min(78, p.y));
        }
      });

      // Filter out completely faded popped pollutants to keep the array clean
      pollutantsRef.current = pollutantsRef.current.filter(p => !p.popped || p.density > 0.01);

      setPollutants([...pollutantsRef.current]);

      // Check win condition: all stacks filtered and all active pollutants popped
      const win =
        filteredRef.current.size === STACKS.length &&
        pollutantsRef.current.every((p) => p.popped);

      if (win && !completedRef.current) {
        completedRef.current = true;
        window.setTimeout(onComplete, 540);
      }

      raf = window.requestAnimationFrame(step);
    };

    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [disabled, onComplete]);

  const filterStack = (id: string) => {
    if (disabled || filteredRef.current.has(id)) return;
    filteredRef.current.add(id);
    setFiltered(new Set(filteredRef.current));
  };

  const popPollutant = (id: string) => {
    if (disabled || completedRef.current) return;
    const target = pollutantsRef.current.find((p) => p.id === id);
    if (target && !target.popped) {
      target.popped = true;
      setPollutants([...pollutantsRef.current]);
    }
  };

  const activeCount = pollutants.filter((p) => !p.popped).length;
  const filterCount = filtered.size;
  
  // Progress calculation
  const totalSteps = STACKS.length + 5; // Chimneys + starting pollutants
  const progress = (filterCount + (5 - Math.min(5, activeCount))) / totalSteps;
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
    >
      <AirBackdrop className="mission-backdrop" />

      <MissionHud
        phase="대기질 회복 작전"
        title="오염원을 차단하고 대기를 정화하세요"
        instruction={
          sourcesLeft > 0
            ? "1. 먼저 굴뚝을 클릭하여 매연 방지 정화 필터를 장착하세요."
            : "2. 공중에 떠다니는 먼지(스모그)를 클릭하여 깨끗이 정화하세요."
        }
        progress={progress}
        countLabel={sourcesLeft > 0 ? `${filterCount} / ${STACKS.length} 필터` : `${activeCount} 남음`}
        badgeLabel={sourcesLeft > 0 ? `오염원 차단 필요` : `먼지 정화 단계`}
        gauge={{ label: "정화도", value: progress, tone: "wind" }}
      />

      {pollutants.map((p) => (
        <button
          aria-label="오염 먼지 정화"
          className="smog-cloud"
          key={p.id}
          onClick={() => popPollutant(p.id)}
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              "--density": String(p.density)
            } as CSSProperties
          }
          type="button"
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
              <span className="stack-emit" aria-hidden="true" />
              <FactoryStackArt filtered={isFiltered} className="stack-art" />
              <small className="target-hint">{isFiltered ? "필터 완료" : "필터 설치"}</small>
            </button>
          );
        })}
      </div>
    </MissionStage>
  );
}
