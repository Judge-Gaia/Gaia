"use client";

import { type CSSProperties, useMemo, useRef, useState } from "react";
import type { DangerStatus } from "@/features/game/types";
import { MissionHud, MissionStage } from "./missionShared";
import { OilBackdrop, OilBargeArt } from "./missionArt";

type Slick = { id: string; x: number; y: number; size: number };

const SLICKS: Slick[] = [
  { id: "slick-a", x: 27, y: 56, size: 200 },
  { id: "slick-b", x: 55, y: 46, size: 240 },
  { id: "slick-c", x: 75, y: 62, size: 180 }
];

const BUOY_ANGLES = [40, 140, 220, 320];

export function OilSpillMission({
  disabled = false,
  status,
  onComplete
}: {
  disabled?: boolean;
  status: DangerStatus;
  onComplete: () => void;
}) {
  const [booms, setBooms] = useState<Set<string>>(new Set());
  const [skimmed, setSkimmed] = useState<Set<string>>(new Set());
  const completedRef = useRef(false);

  const contained = useMemo(() => {
    const set = new Set<string>();
    for (const slick of SLICKS) {
      if (BUOY_ANGLES.every((_, index) => booms.has(`${slick.id}:${index}`))) {
        set.add(slick.id);
      }
    }
    return set;
  }, [booms]);

  const placeBoom = (key: string) => {
    if (disabled) return;
    setBooms((current) => {
      if (current.has(key)) return current;
      const next = new Set(current);
      next.add(key);
      return next;
    });
  };

  const skim = (slickId: string) => {
    if (disabled || !contained.has(slickId) || skimmed.has(slickId)) return;
    setSkimmed((current) => {
      const next = new Set(current);
      next.add(slickId);
      if (next.size === SLICKS.length && !completedRef.current) {
        completedRef.current = true;
        window.setTimeout(onComplete, 520);
      }
      return next;
    });
  };

  const totalSteps = SLICKS.length * (BUOY_ANGLES.length + 1);
  const progress = (booms.size + skimmed.size) / totalSteps;
  const allContained = contained.size === SLICKS.length;
  const remaining = SLICKS.length - skimmed.size;

  return (
    <MissionStage
      ariaLabel="기름 유출 방제 미션"
      className="oil-stage"
      status={status}
      disabled={disabled}
      cleared={completedRef.current}
      clearText="방제 완료"
    >
      <OilBackdrop className="mission-backdrop" />
      <div className="oil-barge" aria-hidden="true">
        <OilBargeArt className="barge-art" />
        <span className="barge-label">방제선</span>
      </div>

      <MissionHud
        phase="해양 방제 작전"
        title="기름띠를 막고 회수하세요"
        instruction={
          allContained
            ? "차단막이 완성됐습니다. 기름띠를 눌러 회수하세요."
            : "기름띠 둘레의 부표를 눌러 오일펜스를 설치하세요."
        }
        progress={progress}
        countLabel={`${skimmed.size} / ${SLICKS.length}`}
        badgeLabel={`잔여 기름띠 ${remaining}`}
      />

      {SLICKS.map((slick) => {
        const isContained = contained.has(slick.id);
        const isSkimmed = skimmed.has(slick.id);
        return (
          <div
            className={`oil-cluster ${isContained ? "contained" : ""} ${isSkimmed ? "skimmed" : ""}`}
            key={slick.id}
            style={{ left: `${slick.x}%`, top: `${slick.y}%` } as CSSProperties}
          >
            <button
              aria-label="기름띠 회수"
              className="oil-slick"
              disabled={disabled || !isContained || isSkimmed}
              onClick={() => skim(slick.id)}
              style={{ "--size": `${slick.size}px` } as CSSProperties}
              type="button"
            >
              <span className="slick-sheen" aria-hidden="true" />
              {isContained && !isSkimmed && <small className="slick-hint">회수</small>}
            </button>
            <span className="boom-ring" style={{ "--size": `${slick.size}px` } as CSSProperties} aria-hidden="true" />
            {BUOY_ANGLES.map((angle, index) => {
              const key = `${slick.id}:${index}`;
              const placed = booms.has(key);
              const rad = (angle * Math.PI) / 180;
              const radius = slick.size / 2 + 4;
              // Round to avoid SSR/client float drift (hydration mismatch).
              const dx = Math.round(Math.cos(rad) * radius * 100) / 100;
              const dy = Math.round(Math.sin(rad) * radius * 100) / 100;
              return (
                <button
                  aria-label="오일펜스 부표 설치"
                  className={`oil-buoy ${placed ? "placed" : ""}`}
                  disabled={disabled || placed || isSkimmed}
                  key={key}
                  onClick={() => placeBoom(key)}
                  style={{ "--dx": `${dx}px`, "--dy": `${dy}px` } as CSSProperties}
                  type="button"
                >
                  <span aria-hidden="true" />
                </button>
              );
            })}
          </div>
        );
      })}
    </MissionStage>
  );
}
