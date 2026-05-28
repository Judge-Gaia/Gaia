"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Clock, Flag, MapPin, RotateCcw, ShieldAlert, ShieldCheck, Target, Timer, Zap } from "lucide-react";
import { AchievementPanel } from "@/components/achievements/AchievementPanel";
import { EventScene } from "@/components/event/EventScene";
import { DangerBadge } from "@/components/game/DangerBadge";
import { ResolutionModal } from "@/components/game/ResolutionModal";
import { SkillDeck } from "@/components/skills/SkillDeck";
import { eventById, skillById, TARGET_EVENT_COUNT } from "@/features/game/game-data";
import { useGameStore } from "@/features/game/game-store";
import { formatDuration } from "@/features/game/scoring";
import type { ActiveEvent, SkillId } from "@/features/game/types";

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
  const [feedback, setFeedback] = useState("");
  const [isResolvingSkill, setIsResolvingSkill] = useState(false);
  const [equippedSkill, setEquippedSkill] = useState<SkillId | null>(null);
  const [suppressionProgress, setSuppressionProgress] = useState(0);
  const progressRef = useRef(0);
  const resolutionTimerRef = useRef<number | null>(null);
  const {
    playerName,
    startedAt,
    completedAt,
    activeEvents,
    resolvedEvents,
    failedEvents,
    achievements,
    attemptSkill,
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
  const recommendedSkills = useMemo(() => {
    if (!definition) return [];
    return definition.requiredSkillIds.map((id) => skillById.get(id)?.name ?? id);
  }, [definition]);

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
    if (selectedInstanceId && !selectedActiveEvent && !lastResolution && !isResolvingSkill) {
      closeEventPanel();
    }
  }, [isResolvingSkill, lastResolution, selectedActiveEvent, selectedInstanceId]);

  useEffect(() => () => {
    if (resolutionTimerRef.current) {
      window.clearTimeout(resolutionTimerRef.current);
    }
  }, []);

  const elapsed = startedAt ? Math.max(0, Math.round((Date.now() - startedAt) / 1000)) : 0;

  const closeEventPanel = () => {
    setSelectedInstanceId(null);
    setSelectedSnapshot(null);
    setFeedback("");
    setIsResolvingSkill(false);
    setEquippedSkill(null);
    setSuppressionProgress(0);
    progressRef.current = 0;
    if (resolutionTimerRef.current) {
      window.clearTimeout(resolutionTimerRef.current);
      resolutionTimerRef.current = null;
    }
  };

  const handleSelectSkill = (skillId: SkillId) => {
    if (isResolvingSkill) return;
    if (selectedActiveEvent) {
      setSelectedSnapshot({
        eventId: selectedActiveEvent.eventId,
        status: selectedActiveEvent.status,
        latitude: selectedActiveEvent.latitude,
        longitude: selectedActiveEvent.longitude
      });
    }

    if (selectedActiveEvent && definition && definition.requiredSkillIds.includes(skillId)) {
      setEquippedSkill(skillId);
      progressRef.current = 0;
      setSuppressionProgress(0);
      setFeedback("");
      return;
    }

    if (!selectedActiveEvent) {
      closeEventPanel();
      return;
    }

    setEquippedSkill(null);
    progressRef.current = 0;
    setSuppressionProgress(0);
    setFeedback("이 상황에는 효과가 없는 도구입니다. 다른 도구를 선택하세요.");
    window.setTimeout(() => setFeedback(""), 1800);
  };

  const handleOperate = (strength: number) => {
    if (!selectedInstanceId || !selectedActiveEvent || !equippedSkill || isResolvingSkill || progressRef.current >= 1) return;
    const progress = Math.min(1, progressRef.current + strength);
    progressRef.current = progress;
    setSuppressionProgress(progress);

    if (progress < 1) return;

    setIsResolvingSkill(true);
    resolutionTimerRef.current = window.setTimeout(() => {
      const result = attemptSkill(selectedInstanceId, equippedSkill);
      if (result === "missing") {
        closeEventPanel();
      }
    }, 720);
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
            <EventScene
              eventId={definition.id}
              status={displayEvent.status}
              activeSkill={equippedSkill}
              interactionDisabled={isResolvingSkill || Boolean(lastResolution)}
              onOperate={handleOperate}
              suppressionProgress={suppressionProgress}
            />
            <div className="event-info">
              <DangerBadge status={displayEvent.status} />
              <h1>{definition.title}</h1>
              <p>{definition.description}</p>
              <div className="mission-brief">
                <h3><Target size={15} /> 미션 브리핑</h3>
                <ul>
                  <li>목표: 도구를 조작해 재난 확산을 차단하세요.</li>
                  <li>필요 도구: {recommendedSkills.join(", ")}</li>
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
            {feedback && <div className="toast">{feedback}</div>}
            {equippedSkill && (
              <div className="operation-console" role="status">
                <div>
                  <strong>{definition.interaction.toolLabel}</strong>
                  <span>{definition.interaction.instruction}</span>
                </div>
                <label>
                  {definition.interaction.progressLabel}
                  <b>{Math.round(suppressionProgress * 100)}%</b>
                </label>
                <div className="operation-meter">
                  <i style={{ width: `${suppressionProgress * 100}%` }} />
                </div>
              </div>
            )}
            <SkillDeck
              activeSkill={equippedSkill}
              disabled={Boolean(lastResolution) || isResolvingSkill}
              onSelect={handleSelectSkill}
            />
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
