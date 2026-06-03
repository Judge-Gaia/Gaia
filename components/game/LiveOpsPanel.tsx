"use client";

import { Activity, Flame, Zap } from "lucide-react";
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
  // 최우선 위험 현장 정렬 (검정 -> 빨강 -> 주황 -> 노랑 순서)
  const urgentEvent = [...activeEvents].sort((a, b) => {
    const order = { black: 4, red: 3, orange: 2, yellow: 1 };
    return order[b.status] - order[a.status] || a.spawnedAt - b.spawnedAt;
  })[0];
  const urgentDefinition = urgentEvent ? eventById.get(urgentEvent.eventId) : null;

  // 배터리 세그먼트 충전량 표시기 (총 10칸)
  const renderPowerSegments = () => {
    const totalSegments = 10;
    const filledSegments = Math.round((runStats.power / 100) * totalSegments);
    return Array.from({ length: totalSegments }).map((_, i) => (
      <span
        key={i}
        className={i < filledSegments ? "power-segment active" : "power-segment"}
        style={{
          backgroundColor: i < filledSegments 
            ? runStats.power > 60 ? "var(--green)" : runStats.power > 30 ? "var(--orange)" : "var(--red)" 
            : "rgba(255, 255, 255, 0.05)"
        }}
      />
    ));
  };

  const getUrgentStatusText = (status: string) => {
    if (status === "red") return "긴급 (RED)";
    if (status === "orange") return "확산 중 (ORANGE)";
    if (status === "yellow") return "발생 (YELLOW)";
    return "실패 (BLACK)";
  };

  return (
    <aside className="cyber-panel live-ops-panel" aria-label="실시간 작전 정보">
      <div className="hud-corner-marker top-left"></div>
      <div className="hud-corner-marker top-right"></div>
      <div className="hud-corner-marker bottom-left"></div>
      <div className="hud-corner-marker bottom-right"></div>

      {/* 남은 신의 권능 세션 */}
      <section className="live-card power-card">
        <div className="live-card-head">
          <span>
            <Zap size={14} className="icon-pulse" />
            신의 권능
          </span>
          <strong style={{ color: runStats.power > 30 ? "var(--green)" : "var(--red)" }}>
            {Math.round(runStats.power)}%
          </strong>
        </div>
        
        {/* 배터리 세그먼트 충전 바 */}
        <div className="power-track-segmented">
          {renderPowerSegments()}
        </div>

        <div className="combo-strip">
          <span>
            <Flame size={13} fill="currentColor" />
            콤보 {runStats.combo}
          </span>
          <span>최고 {runStats.bestCombo}</span>
        </div>
      </section>

      {/* 단일 실시간 작전 로그 창 */}
      <section className="live-card feed-card">
        <div className="live-card-head" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "10px", paddingLeft: "4px" }}>
          <span>
            <Activity size={14} />
            실시간 작전 로그
          </span>
        </div>

        <div className="ops-log-window">
          <div className="ops-log">
            <p>
              <Activity size={13} />
              {gameMode === "ultra" ? "작전 상태: 울트라 무한 챌린지" : `경과 시간: ${formatDuration(elapsed)}`}
            </p>
            <p>
              <Activity size={13} />
              해결 현장: {resolvedEvents.length}개소
            </p>
            <p>
              <Activity size={13} />
              실패 소멸: {failedEvents.length}개소
            </p>
            <p>
              <Activity size={13} />
              대기 중인 오염 구역: {activeEvents.length}개소
            </p>
            
            {urgentEvent ? (
              <p className={urgentEvent.status === "red" ? "urgent animate-pulse" : "urgent"} style={{ borderTop: "1px dashed var(--line)", paddingTop: "8px", marginTop: "8px" }}>
                <Activity size={13} />
                최우선 작전: {urgentDefinition?.shortTitle} [{getUrgentStatusText(urgentEvent.status)}]
              </p>
            ) : (
              <p style={{ borderTop: "1px dashed var(--line)", paddingTop: "8px", marginTop: "8px" }}>
                <Activity size={13} />
                현장 경보: 특이 오염 현장 없음
              </p>
            )}
          </div>
        </div>
      </section>
    </aside>
  );
}
