"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Clock, Flag, MapPin, RotateCcw, ShieldAlert, ShieldCheck, Target, Timer, Zap } from "lucide-react";
import { AchievementPanel } from "@/components/achievements/AchievementPanel";
import { EventScene } from "@/components/event/EventScene";
import { OceanTrashMission } from "@/components/event/OceanTrashMission";
import { DangerBadge } from "@/components/game/DangerBadge";
import { ResolutionModal } from "@/components/game/ResolutionModal";
import { eventById, TARGET_EVENT_COUNT } from "@/features/game/game-data";
import { useGameStore } from "@/features/game/game-store";
import { formatDuration } from "@/features/game/scoring";
import type { ActiveEvent } from "@/features/game/types";

const EarthSceneSafe = dynamic(() => import("@/components/earth/EarthSceneSafe").then((mod) => mod.EarthSceneSafe), {
  ssr: false
});

function statusPercent(status: ActiveEvent["status"]) {
  if (status === "yellow") return 24;
  if (status === "orange") return 53;
  if (status === "red") return 81;
  return 100;
}

const deadlineByStatus: Record<ActiveEvent["status"], string> = {
  yellow: "45초 이내 안정화",
  orange: "30초 이내 개입 필요",
  red: "15초 내 긴급 대응",
  black: "임계 도달"
};

export default function GamePage() {
  const router = useRouter();
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [selectedSnapshot, setSelectedSnapshot] = useState<Pick<ActiveEvent, "eventId" | "status" | "latitude" | "longitude"> | null>(null);
  const [isCompletingMission, setIsCompletingMission] = useState(false);
  const resolutionTimerRef = useRef<number | null>(null);
  const {
    playerName,
    startedAt,
    completedAt,
    activeEvents,
    resolvedEvents,
    failedEvents,
    achievements,
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
  const isOceanTrashMission = definition?.id === "ocean_trash";

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
              {resolvedEvents.length + failedEvents.length}/{TARGET_EVENT_COUNT}
            </div>
            <div className="hud-pill">
              <ShieldCheck size={17} aria-hidden="true" />
              해결 {resolvedEvents.length}
            </div>
            <div className="hud-pill">
              <Clock size={17} aria-hidden="true" />
              {formatDuration(elapsed)}
            </div>
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
        <AchievementPanel achievements={achievements} />
      </section>
      {definition && displayEvent && (selectedInstanceId || lastResolution) && (
        <section className="game-event-overlay" aria-label="이벤트 대응 화면">
          <div className={`inline-event-stage neon-${neonTone}`}>
            {isOceanTrashMission ? (
              <OceanTrashMission
                disabled={isCompletingMission || Boolean(lastResolution)}
                status={displayEvent.status}
                onComplete={handleMissionComplete}
              />
            ) : (
              <EventScene
                eventId={definition.id}
                status={displayEvent.status}
              />
            )}
            <div className="event-info">
              <DangerBadge status={displayEvent.status} />
              <h1>{definition.title}</h1>
              <p>{definition.description}</p>
              <div className="mission-brief">
                <h3><Target size={15} /> 미션 브리핑</h3>
                <ul>
                  <li>목표: 현장 안의 문제 요소를 직접 조작해 해결하세요.</li>
                  <li>{isOceanTrashMission ? "쓰레기를 끌어서 오른쪽 수거함에 정확히 버리세요." : "이 이벤트의 직접 조작 미션은 준비 중입니다."}</li>
                  <li>대응 한계: {deadlineByStatus[displayEvent.status]}</li>
                </ul>
              </div>
              <div className="event-meta-grid">
                <div className="event-meta-card">
                  <span><ShieldAlert size={14} /> 위험 확산</span>
                  <strong>{statusPercent(displayEvent.status)}%</strong>
                  <div className="threat-meter"><i style={{ width: `${statusPercent(displayEvent.status)}%` }} /></div>
                </div>
                <div className="event-meta-card">
                  <span><MapPin size={14} /> 좌표</span>
                  <strong>
                    {displayEvent.latitude.toFixed(1)}, {displayEvent.longitude.toFixed(1)}
                  </strong>
                </div>
                <div className="event-meta-card">
                  <span><Timer size={14} /> 대응 윈도우</span>
                  <strong>{deadlineByStatus[displayEvent.status]}</strong>
                </div>
                <div className="event-meta-card">
                  <span><Zap size={14} /> 작전 우선도</span>
                  <strong>{displayEvent.status === "yellow" ? "중간" : displayEvent.status === "orange" ? "높음" : "최우선"}</strong>
                </div>
              </div>
              <button className="secondary-button" onClick={closeEventPanel} style={{ marginTop: 16 }}>
                <ArrowLeft size={17} aria-hidden="true" />
                지구로
              </button>
            </div>
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
