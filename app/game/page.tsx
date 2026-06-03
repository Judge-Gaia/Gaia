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

  // 신의 권능(Power) 100% 임계점 돌파 감지 및 토스트 UI 알림:
  // 이전 렌더링 프레임의 권능 수치(prevPowerRef)와 현재 수치를 실시간 비교하여,
  // 100%에 막 도달한 최초 시점에 일회성 토스트 메시지를 표시하고 4.5초 뒤 비동기(setTimeout)로 자동 소멸시킵니다.
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

  // 미션 성공 직후의 인터랙티브 지연(Delay) 처리:
  // 정답 혹은 미션 완료 클릭 즉시 화면을 닫지 않고, isCompletingMission 상태를 활성화합니다.
  // 이로 인해 UI 배경 레이어가 복구 성공 후의 정화된 실사 이미지(definition.resolvedSceneImage)로 페이드인되며,
  // 2.8초 동안 복구의 성취감(여운 연출)을 시각적으로 즐길 수 있도록 비동기 딜레이 후 실제 스토어의 completeEvent를 호출합니다.
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
            // 영화 같은 화면 연출을 위한 다단계 로딩 트랜지션(Overwatch-style Intro):
            // 3D 지구의 오염 포인트를 클릭했을 때, 즉시 화면이 전환되면 어색하므로 
            // 1) 클릭된 대상의 배경 이미지를 로드하여 스크린 전체에 로딩창(`loading`)을 띄우고,
            // 2) 1.8초 뒤 페이드아웃 애니메이션(`fadeout`)으로 자연스러운 소프트 랜딩을 준비하며,
            // 3) 2.2초 시점에 최종적으로 미션 전체 인스턴스 뷰를 표시하여 몰입감을 높여 줍니다.
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
