"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Clock, Flag, RotateCcw, ShieldCheck } from "lucide-react";
import { AchievementPanel } from "@/components/achievements/AchievementPanel";
import { EventMiniGame } from "@/components/event/EventMiniGame";
import { LiveOpsPanel } from "@/components/game/LiveOpsPanel";
import { ResolutionModal } from "@/components/game/ResolutionModal";
import { eventById, TARGET_EVENT_COUNT } from "@/features/game/game-data";
import { useGameStore } from "@/features/game/game-store";
import { formatDuration } from "@/features/game/scoring";
import type { ActiveEvent } from "@/features/game/types";

const EarthSceneSafe = dynamic(() => import("@/components/earth/EarthSceneSafe").then((mod) => mod.EarthSceneSafe), {
  ssr: false
});

export default function GamePage() {
  const router = useRouter();
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [selectedSnapshot, setSelectedSnapshot] = useState<Pick<ActiveEvent, "eventId" | "status" | "latitude" | "longitude"> | null>(null);
  const [isCompletingMission, setIsCompletingMission] = useState(false);
  const resolutionTimerRef = useRef<number | null>(null);
  const {
    playerName,
    gameMode,
    startedAt,
    completedAt,
    activeEvents,
    resolvedEvents,
    failedEvents,
    achievements,
    runStats,
    completeEvent,
    consumeResolution,
    lastResolution,
    resetGame,
    tick
  } = useGameStore();

  const selectedActiveEvent = selectedInstanceId
    ? activeEvents.find((event) => event.instanceId === selectedInstanceId)
    : null;
  const displayEvent =
    selectedActiveEvent ??
    selectedSnapshot ??
    (lastResolution ? { eventId: lastResolution.eventId, status: "red" as const, latitude: 0, longitude: 0 } : null);
  const definition = displayEvent ? eventById.get(displayEvent.eventId) : null;
  const neonTone = displayEvent?.status === "yellow" ? "safe" : "danger";

  useEffect(() => {
    if (!playerName || !startedAt) {
      router.replace("/");
      return;
    }

    const interval = window.setInterval(() => tick(), 500);
    tick();
    return () => window.clearInterval(interval);
  }, [playerName, router, startedAt, tick]);

  useEffect(() => {
    if (completedAt && !lastResolution) {
      router.replace("/result");
    }
  }, [completedAt, lastResolution, router]);

  useEffect(() => {
    if (selectedActiveEvent) {
      setSelectedSnapshot({
        eventId: selectedActiveEvent.eventId,
        status: selectedActiveEvent.status,
        latitude: selectedActiveEvent.latitude,
        longitude: selectedActiveEvent.longitude
      });
    }
  }, [selectedActiveEvent]);

  useEffect(() => {
    if (selectedInstanceId && !selectedActiveEvent && !lastResolution && !isCompletingMission) {
      closeEventPanel();
    }
  }, [isCompletingMission, lastResolution, selectedActiveEvent, selectedInstanceId]);

  useEffect(() => () => {
    if (resolutionTimerRef.current) {
      window.clearTimeout(resolutionTimerRef.current);
    }
  }, []);

  const elapsed = startedAt ? Math.max(0, Math.round((Date.now() - startedAt) / 1000)) : 0;

  const closeEventPanel = () => {
    setSelectedInstanceId(null);
    setSelectedSnapshot(null);
    setIsCompletingMission(false);
    if (resolutionTimerRef.current) {
      window.clearTimeout(resolutionTimerRef.current);
      resolutionTimerRef.current = null;
    }
  };

  const handleMissionComplete = () => {
    if (!selectedInstanceId || !selectedActiveEvent || isCompletingMission) return;
    setSelectedSnapshot({
      eventId: selectedActiveEvent.eventId,
      status: selectedActiveEvent.status,
      latitude: selectedActiveEvent.latitude,
      longitude: selectedActiveEvent.longitude
    });
    setIsCompletingMission(true);
    resolutionTimerRef.current = window.setTimeout(() => {
      const result = completeEvent(selectedInstanceId);
      if (result === "missing") {
        closeEventPanel();
      }
    }, 420);
  };

  return (
    <main className="shell">
      <div className="noise" />
      <section className="game-layout">
        <div className="earth-stage">
          <EarthSceneSafe
            events={activeEvents}
            onSelectEvent={(event) => {
              if (!selectedInstanceId) {
                setSelectedInstanceId(event.instanceId);
                setSelectedSnapshot({
                  eventId: event.eventId,
                  status: event.status,
                  latitude: event.latitude,
                  longitude: event.longitude
                });
              }
            }}
          />
          <div className="floating-hud" aria-label="게임 상태">
            <div className="hud-pill">
              <Flag size={17} aria-hidden="true" />
              {gameMode === "ultra"
                ? `${resolvedEvents.length + failedEvents.length} / 무한`
                : `${resolvedEvents.length + failedEvents.length}/${TARGET_EVENT_COUNT}`}
            </div>
            <div className="hud-pill">
              <ShieldCheck size={17} aria-hidden="true" />
              해결 {resolvedEvents.length}
            </div>
            <div className="hud-pill combo-pill">
              콤보 {runStats.combo} · 힘 {Math.round(runStats.power)}%
            </div>
            <div className="hud-pill">
              <Clock size={17} aria-hidden="true" />
              {formatDuration(elapsed)}
            </div>
            <button
              className="secondary-button"
              onClick={() => {
                router.push("/result");
              }}
            >
              <Flag size={17} aria-hidden="true" />
              작전 종료
            </button>
            <button
              className="secondary-button"
              onClick={() => {
                resetGame();
                router.replace("/");
              }}
            >
              <RotateCcw size={17} aria-hidden="true" />
              다시 시작
            </button>
          </div>
        </div>
        <LiveOpsPanel
          activeEvents={activeEvents}
          elapsed={elapsed}
          failedEvents={failedEvents}
          gameMode={gameMode}
          resolvedEvents={resolvedEvents}
          runStats={runStats}
        />
        <AchievementPanel achievements={achievements} />
      </section>
      {definition && displayEvent && (selectedInstanceId || lastResolution) && (
        <section className="game-event-overlay" aria-label="이벤트 대응 화면">
          <div className={`inline-event-stage neon-${neonTone}`}>
            <EventMiniGame
              disabled={isCompletingMission || Boolean(lastResolution)}
              eventId={definition.id}
              status={displayEvent.status}
              onComplete={handleMissionComplete}
            />
            <button className="mission-back-button" onClick={closeEventPanel}>
              <ArrowLeft size={17} aria-hidden="true" />
              지구로
            </button>
          </div>
        </section>
      )}
      {lastResolution && (
        <ResolutionModal
          notice={lastResolution}
          onConfirm={() => {
            consumeResolution();
            closeEventPanel();
            if (completedAt) {
              router.push("/result");
            }
          }}
        />
      )}
    </main>
  );
}
