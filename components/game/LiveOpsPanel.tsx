"use client";

import { Activity, Flame, Radio, Zap } from "lucide-react";
import { eventById } from "@/features/game/game-data";
import { formatDuration } from "@/features/game/scoring";
import type { ActiveEvent, FailedEvent, GameMode, ResolvedEvent, RunStats } from "@/features/game/types";

export function LiveOpsPanel({
  activeEvents,
  elapsed,
  failedEvents,
  gameMode,
  resolvedEvents,
  runStats
}: {
  activeEvents: ActiveEvent[];
  elapsed: number;
  failedEvents: FailedEvent[];
  gameMode: GameMode;
  resolvedEvents: ResolvedEvent[];
  runStats: RunStats;
}) {
  const urgentEvent = [...activeEvents].sort((a, b) => {
    const order = { black: 4, red: 3, orange: 2, yellow: 1 };
    return order[b.status] - order[a.status] || a.spawnedAt - b.spawnedAt;
  })[0];
  const urgentDefinition = urgentEvent ? eventById.get(urgentEvent.eventId) : null;

  return (
    <aside className="live-ops-panel" aria-label="실시간 작전 정보">
      <section className="live-card power-card">
        <div className="live-card-head">
          <span>
            <Zap size={15} aria-hidden="true" />
            신의 힘
          </span>
          <strong>{Math.round(runStats.power)}%</strong>
        </div>
        <div className="power-track" aria-hidden="true">
          <i style={{ width: `${runStats.power}%` }} />
        </div>
        <div className="combo-strip">
          <span>
            <Flame size={14} aria-hidden="true" />
            현재 콤보 {runStats.combo}
          </span>
          <span>최고 {runStats.bestCombo}</span>
        </div>
      </section>

      <section className="live-card">
        <h2 className="live-title">
          <Radio size={16} aria-hidden="true" />
          작전 로그
        </h2>
        <div className="ops-log">
          <p>
            <Activity size={14} aria-hidden="true" />
            {gameMode === "ultra" ? "울트라 러시 진행 중" : `${formatDuration(elapsed)} 경과`}
          </p>
          <p>
            <Activity size={14} aria-hidden="true" />
            해결 {resolvedEvents.length} · 실패 {failedEvents.length} · 현장 {activeEvents.length}
          </p>
          <p className={urgentEvent?.status === "red" ? "urgent" : ""}>
            <Activity size={14} aria-hidden="true" />
            {urgentDefinition ? `최우선: ${urgentDefinition.shortTitle} / ${urgentEvent?.status}` : "새 이벤트 대기 중"}
          </p>
        </div>
      </section>
    </aside>
  );
}
