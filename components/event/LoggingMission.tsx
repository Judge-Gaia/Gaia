"use client";

import { type CSSProperties, type PointerEvent, useRef, useState } from "react";
import type { DangerStatus } from "@/features/game/types";
import { MissionHud, MissionStage, distance, pointerToPercent } from "./missionShared";
import { LoggingBackdrop, SaplingArt, TreeArt } from "./missionArt";

type Stage = "empty" | "planted" | "grown";
type Plot = { id: string; x: number; y: number; stage: Stage };

const INITIAL_PLOTS: Plot[] = [
  { id: "plot-1", x: 20, y: 58, stage: "empty" },
  { id: "plot-2", x: 36, y: 70, stage: "empty" },
  { id: "plot-3", x: 52, y: 56, stage: "empty" },
  { id: "plot-4", x: 67, y: 71, stage: "empty" },
  { id: "plot-5", x: 82, y: 60, stage: "empty" }
];

const PLANT_RADIUS = 11;

export function LoggingMission({
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
  const [plots, setPlots] = useState(INITIAL_PLOTS);
  const [ghost, setGhost] = useState<{ x: number; y: number; active: boolean }>({ x: 50, y: 88, active: false });
  const [nearPlot, setNearPlot] = useState<string | null>(null);

  const planted = plots.filter((plot) => plot.stage !== "empty").length;
  const grown = plots.filter((plot) => plot.stage === "grown").length;
  const progress = (planted + grown) / (plots.length * 2);

  const findEmptyPlot = (x: number, y: number) => {
    let best: { id: string; d: number } | null = null;
    for (const plot of plots) {
      if (plot.stage !== "empty") continue;
      const d = distance(x, y, plot.x, plot.y);
      if (d < PLANT_RADIUS && (!best || d < best.d)) best = { id: plot.id, d };
    }
    return best?.id ?? null;
  };

  const onNurseryMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!stageRef.current) return null;
    const { x, y } = pointerToPercent(event.clientX, event.clientY, stageRef.current);
    setGhost({ x, y, active: true });
    setNearPlot(findEmptyPlot(x, y));
    return { x, y };
  };

  const water = (id: string) => {
    if (disabled) return;
    setPlots((current) => {
      const next = current.map((plot) => (plot.id === id && plot.stage === "planted" ? { ...plot, stage: "grown" as Stage } : plot));
      if (next.every((plot) => plot.stage === "grown") && !completedRef.current) {
        completedRef.current = true;
        window.setTimeout(onComplete, 540);
      }
      return next;
    });
  };

  return (
    <MissionStage
      ariaLabel="숲 복원 미션"
      className="logging-stage"
      status={status}
      disabled={disabled}
      cleared={completedRef.current}
      clearText="복원 완료"
      stageRef={stageRef}
    >
      <LoggingBackdrop className="mission-backdrop" />

      <MissionHud
        phase="산림 복원 작전"
        title="묘목을 심고 길러내세요"
        instruction={
          ghost.active
            ? "빈 식재 구덩이 위에서 손을 떼어 묘목을 심으세요."
            : planted < plots.length
              ? "아래 묘목을 끌어 구덩이에 심으세요."
              : "어린 나무를 눌러 물을 주고 키우세요."
        }
        progress={progress}
        countLabel={`${grown} / ${plots.length}`}
        badgeLabel={planted < plots.length ? `심을 곳 ${plots.length - planted}` : `물 줄 곳 ${plots.length - grown}`}
      />

      {plots.map((plot) => (
        <div
          className={`plot plot-${plot.stage} ${nearPlot === plot.id ? "target" : ""}`}
          key={plot.id}
          style={{ left: `${plot.x}%`, top: `${plot.y}%` } as CSSProperties}
        >
          {plot.stage === "empty" && <span className="plot-hole" aria-hidden="true" />}
          {plot.stage === "planted" && (
            <button
              aria-label="물 주기"
              className="plot-sprout"
              disabled={disabled}
              onClick={() => water(plot.id)}
              type="button"
            >
              <SaplingArt className="sprout-art" />
              <small className="target-hint">물 주기</small>
            </button>
          )}
          {plot.stage === "grown" && <TreeArt className="plot-tree" />}
        </div>
      ))}

      <div className="nursery" aria-hidden={false}>
        <button
          aria-label="묘목 꺼내기"
          className={`nursery-sapling ${ghost.active ? "dragging" : ""}`}
          disabled={disabled || planted >= plots.length}
          onPointerDown={(event) => {
            if (disabled || planted >= plots.length) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            onNurseryMove(event);
          }}
          onPointerMove={(event) => {
            if (!ghost.active) return;
            onNurseryMove(event);
          }}
          onPointerUp={(event) => {
            const position = onNurseryMove(event);
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
            setGhost((current) => ({ ...current, active: false }));
            setNearPlot(null);
            if (position) {
              const targetId = findEmptyPlot(position.x, position.y);
              if (targetId) {
                setPlots((current) =>
                  current.map((plot) => (plot.id === targetId ? { ...plot, stage: "planted" as Stage } : plot))
                );
              }
            }
          }}
          onPointerCancel={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
            setGhost((current) => ({ ...current, active: false }));
            setNearPlot(null);
          }}
          type="button"
        >
          <SaplingArt className="nursery-art" />
        </button>
        <span className="nursery-label">묘목 묘판</span>
      </div>

      {ghost.active && (
        <span className="sapling-ghost" style={{ left: `${ghost.x}%`, top: `${ghost.y}%` }} aria-hidden="true">
          <SaplingArt className="sapling-ghost-art" />
        </span>
      )}
    </MissionStage>
  );
}
