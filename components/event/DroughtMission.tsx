"use client";

import { type CSSProperties, useMemo, useRef, useState } from "react";
import type { DangerStatus } from "@/features/game/types";
import { MissionHud, MissionStage } from "./missionShared";
import { CropArt, DroughtBackdrop, ReservoirArt } from "./missionArt";

const SEGMENT_COUNT = 5;
const CANAL_LEFT = 17;
const CANAL_RIGHT = 93;
const SEGMENT_WIDTH = (CANAL_RIGHT - CANAL_LEFT) / SEGMENT_COUNT;

export function DroughtMission({
  disabled = false,
  status,
  onComplete
}: {
  disabled?: boolean;
  status: DangerStatus;
  onComplete: () => void;
}) {
  const completedRef = useRef(false);
  const [open, setOpen] = useState<boolean[]>(() => Array(SEGMENT_COUNT).fill(false));

  // Water flows from the reservoir through contiguously opened gates.
  const reach = useMemo(() => {
    let count = 0;
    for (const isOpen of open) {
      if (!isOpen) break;
      count += 1;
    }
    return count;
  }, [open]);

  const toggle = (index: number) => {
    if (disabled || open[index]) return;
    setOpen((current) => {
      const next = current.slice();
      next[index] = true;
      let count = 0;
      for (const isOpen of next) {
        if (!isOpen) break;
        count += 1;
      }
      if (count === SEGMENT_COUNT && !completedRef.current) {
        completedRef.current = true;
        window.setTimeout(onComplete, 560);
      }
      return next;
    });
  };

  const progress = reach / SEGMENT_COUNT;

  return (
    <MissionStage
      ariaLabel="가뭄 관개 미션"
      className="drought-stage"
      status={status}
      disabled={disabled}
      cleared={completedRef.current}
      clearText="물길 회복"
      style={{ "--reach": String(reach) } as CSSProperties}
    >
      <DroughtBackdrop className="mission-backdrop" />
      <div className="drought-heat" aria-hidden="true" />

      <MissionHud
        phase="관개 복구 작전"
        title="저수지 물길을 이어주세요"
        instruction="저수지에서 가까운 수문부터 차례로 눌러 물을 흘려보내세요."
        progress={progress}
        countLabel={`${reach} / ${SEGMENT_COUNT}`}
        badgeLabel={`마른 농지 ${SEGMENT_COUNT - reach}`}
        gauge={{ label: "관개율", value: progress, tone: "water" }}
      />

      <div className="reservoir" aria-hidden="true">
        <ReservoirArt className="reservoir-art" />
        <span className="reservoir-label">저수지</span>
      </div>

      <div className="canal" aria-hidden="true">
        <span className="canal-water" style={{ "--reach-frac": String(reach / SEGMENT_COUNT) } as CSSProperties} />
      </div>

      {Array.from({ length: SEGMENT_COUNT }).map((_, index) => {
        const left = CANAL_LEFT + SEGMENT_WIDTH * index;
        const isOpen = open[index];
        const watered = index < reach;
        const isNext = index === reach;
        return (
          <div className="canal-cell" key={index} style={{ left: `${left}%`, width: `${SEGMENT_WIDTH}%` } as CSSProperties}>
            <div className={`crop-field ${watered ? "watered" : "dry"}`}>
              <span className="field-soil" aria-hidden="true" />
              <CropArt lush={watered} className="field-crop" />
            </div>
            <button
              aria-label={`수문 ${index + 1} 열기`}
              className={`canal-gate ${isOpen ? "open" : ""} ${watered ? "flowing" : ""} ${isNext ? "next" : ""}`}
              disabled={disabled || isOpen}
              onClick={() => toggle(index)}
              type="button"
            >
              <span className="gate-valve" aria-hidden="true" />
              <small className="target-hint">{isOpen ? "열림" : "수문 열기"}</small>
            </button>
          </div>
        );
      })}
    </MissionStage>
  );
}
