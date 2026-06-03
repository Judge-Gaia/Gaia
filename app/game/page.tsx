"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Clock, Flag, RotateCcw, ShieldCheck, Globe2, Zap } from "lucide-react";
import { AchievementPanel } from "@/components/achievements/AchievementPanel";
import { EventMiniGame } from "@/components/event/EventMiniGame";
import { LiveOpsPanel } from "@/components/game/LiveOpsPanel";
import { ResolutionModal } from "@/components/game/ResolutionModal";
import { eventById, TARGET_EVENT_COUNT } from "@/features/game/game-data";
import { useGameStore } from "@/features/game/game-store";
import { formatDuration } from "@/features/game/scoring";
import type { ActiveEvent, EventDefinition } from "@/features/game/types";

const EarthSceneSafe = dynamic(() => import("@/components/earth/EarthSceneSafe").then((mod) => mod.EarthSceneSafe), {
  ssr: false
});

export default function GamePage() {
  const router = useRouter();
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [selectedSnapshot, setSelectedSnapshot] = useState<Pick<ActiveEvent, "eventId" | "status" | "latitude" | "longitude"> | null>(null);
  const [isCompletingMission, setIsCompletingMission] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState<EventDefinition | null>(null);
  const [loadingStep, setLoadingStep] = useState<"none" | "loading" | "fadeout">("none");
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
    tick,
    finishGame
  } = useGameStore();

  const [powerNotification, setPowerNotification] = useState<string | null>(null);
  const prevPowerRef = useRef(runStats.power);

  useEffect(() => {
    const currentPower = Math.round(runStats.power);
    const prevPower = Math.round(prevPowerRef.current);

    if (currentPower === 100 && prevPower < 100) {
      setPowerNotification("⚡ 신의 권능 최대 활성화: 모든 정화 능력과 오염 영역 복구 효율이 극대화되었습니다! (점수 획득 배율 최대)");
      
      const timer = setTimeout(() => {
        setPowerNotification(null);
      }, 4500);
      return () => clearTimeout(timer);
    } else if (currentPower < 100 && prevPower === 100) {
      setPowerNotification(null);
    }

    prevPowerRef.current = runStats.power;
  }, [runStats.power]);

  const selectedActiveEvent = selectedInstanceId
    ? activeEvents.find((event) => event.instanceId === selectedInstanceId)
    : null;
  
  const displayEvent =
    selectedActiveEvent ??
    selectedSnapshot ??
    (lastResolution ? { eventId: lastResolution.eventId, status: "red" as const, latitude: 0, longitude: 0 } : null);
  
  const definition = displayEvent ? eventById.get(displayEvent.eventId) : null;
  const neonTone = displayEvent?.status === "yellow" ? "safe" : "danger";

  // Restore client-side UI skin choice
  useEffect(() => {
    const savedTheme = localStorage.getItem("gaia-user-theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

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
    }, 2800); // 2.8초 복구 이미지 페이드인 노출 여운 연출
  };

  return (
    <main className="shell">
      <div className="noise" />
      <section className="game-layout">
        <div className="earth-stage">
          <EarthSceneSafe
            events={activeEvents}
            onSelectEvent={(event) => {
              if (!selectedInstanceId && loadingStep === "none") {
                const targetDef = eventById.get(event.eventId);
                if (targetDef) {
                  setLoadingEvent(targetDef);
                  setLoadingStep("loading");
                  
                  window.setTimeout(() => {
                    setLoadingStep("fadeout");
                  }, 1800);
                  
                  window.setTimeout(() => {
                    setSelectedInstanceId(event.instanceId);
                    setSelectedSnapshot({
                      eventId: event.eventId,
                      status: event.status,
                      latitude: event.latitude,
                      longitude: event.longitude
                    });
                    setLoadingStep("none");
                    setLoadingEvent(null);
                  }, 2200);
                }
              }
            }}
          />
          {!selectedInstanceId && !lastResolution && (
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
                  finishGame();
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
          )}
        </div>
        {!selectedInstanceId && !lastResolution && (
          <LiveOpsPanel
            activeEvents={activeEvents}
            elapsed={elapsed}
            failedEvents={failedEvents}
            gameMode={gameMode}
            resolvedEvents={resolvedEvents}
            runStats={runStats}
          />
        )}
        {!selectedInstanceId && !lastResolution && (
          <AchievementPanel achievements={achievements} />
        )}
      </section>
      {definition && displayEvent && (selectedInstanceId || lastResolution) && (
        <section className="fullscreen-event-stage" aria-label="이벤트 대응 화면">
          {/* 실사 배경 이미지 레이어 */}
          <div className={`fullscreen-event-bg-layer ${isCompletingMission || lastResolution ? "resolved-state" : ""}`} aria-hidden="true">
            <div 
              className="event-bg-image" 
              style={{ backgroundImage: `url(${definition.sceneImage})` }} 
            />
            <div 
              className={`event-bg-image resolved-bg ${isCompletingMission || lastResolution ? "active" : ""}`} 
              style={{ backgroundImage: `url(${definition.resolvedSceneImage})` }} 
            />
          </div>

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
      {loadingEvent && loadingStep !== "none" && (
        <div className={`overwatch-loading-screen ${loadingStep === "fadeout" ? "overwatch-loading-fade-out" : ""}`}>
          <div 
            className="overwatch-loading-bg" 
            style={{ backgroundImage: `url(${loadingEvent.sceneImage})` }} 
          />
          <div className="overwatch-loading-vignette" />
          <div className="overwatch-loading-content">
            <span className="overwatch-loading-kicker">재난 복구 프로토콜 시동</span>
            <h1 className="overwatch-loading-title">
              <span className="overwatch-loading-icon">
                <Globe2 size={42} />
              </span>
              {loadingEvent.shortTitle} 재난 구역 진입 중...
            </h1>
          </div>
          <div className="overwatch-loading-bar" />
        </div>
      )}
      {powerNotification && (
        <div className="cyber-toast power-toast" role="alert">
          <div className="hud-corner-marker top-left"></div>
          <div className="hud-corner-marker top-right"></div>
          <div className="hud-corner-marker bottom-left"></div>
          <div className="hud-corner-marker bottom-right"></div>
          <div className="toast-content">
            <Zap size={18} className="icon-pulse text-cyan animate-pulse" />
            <p>{powerNotification}</p>
          </div>
        </div>
      )}
    </main>
  );
}
