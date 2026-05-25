"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Clock, MapPin, ShieldAlert, Target, Timer, Zap } from "lucide-react";
import { AchievementPanel } from "@/components/achievements/AchievementPanel";
import { EventScene } from "@/components/event/EventScene";
import { DangerBadge } from "@/components/game/DangerBadge";
import { ResolutionModal } from "@/components/game/ResolutionModal";
import { SkillDeck } from "@/components/skills/SkillDeck";
import { eventById, skillById } from "@/features/game/game-data";
import { useGameStore } from "@/features/game/game-store";
import { formatDuration } from "@/features/game/scoring";
import type { ActiveEvent, SkillId } from "@/features/game/types";

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

const resolveDurationByEventId: Record<string, number> = {
  wildfire: 2600,
  ocean_trash: 2300,
  oil_spill: 2400,
  illegal_logging: 2500,
  air_pollution: 2200,
  drought: 2600
};

export default function EventPage() {
  const params = useParams<{ instanceId: string }>();
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [isResolvingSkill, setIsResolvingSkill] = useState(false);
  const [sceneSkillEffect, setSceneSkillEffect] = useState<SkillId | null>(null);
  const [suppressionProgress, setSuppressionProgress] = useState(0);
  const [eventSnapshot, setEventSnapshot] = useState<Pick<ActiveEvent, "eventId" | "status" | "latitude" | "longitude"> | null>(null);
  const {
    activeEvents,
    achievements,
    attemptSkill,
    completedAt,
    consumeResolution,
    lastResolution,
    playerName,
    startedAt,
    tick
  } = useGameStore();

  const instanceId = decodeURIComponent(params.instanceId);
  const activeEvent = activeEvents.find((event) => event.instanceId === instanceId);
  const displayEvent =
    activeEvent ?? eventSnapshot ?? (lastResolution ? { eventId: lastResolution.eventId, status: "red" as const, latitude: 0, longitude: 0 } : null);
  const definition = displayEvent ? eventById.get(displayEvent.eventId) : null;

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
    if (!activeEvent && !lastResolution) {
      router.replace("/game");
    }
  }, [activeEvent, lastResolution, router]);

  useEffect(() => {
    if (activeEvent) {
      setEventSnapshot({
        eventId: activeEvent.eventId,
        status: activeEvent.status,
        latitude: activeEvent.latitude,
        longitude: activeEvent.longitude
      });
    }
  }, [activeEvent]);

  const elapsed = startedAt ? Math.max(0, Math.round((Date.now() - startedAt) / 1000)) : 0;

  const handleUseSkill = (skillId: SkillId) => {
    if (isResolvingSkill) return;
    if (activeEvent) {
      setEventSnapshot({
        eventId: activeEvent.eventId,
        status: activeEvent.status,
        latitude: activeEvent.latitude,
        longitude: activeEvent.longitude
      });
    }

    if (activeEvent && definition && definition.requiredSkillIds.includes(skillId)) {
      setIsResolvingSkill(true);
      setSceneSkillEffect(skillId);
      setSuppressionProgress(0);
      const started = performance.now();
      const duration = resolveDurationByEventId[activeEvent.eventId] ?? 2400;

      const animate = (now: number) => {
        const progress = Math.min(1, (now - started) / duration);
        setSuppressionProgress(progress);
        if (progress < 1) {
          window.requestAnimationFrame(animate);
          return;
        }
        const result = attemptSkill(instanceId, skillId);
        if (result === "missing") {
          router.replace("/game");
        }
        window.setTimeout(() => {
          setSceneSkillEffect(null);
          setSuppressionProgress(0);
          setIsResolvingSkill(false);
        }, 240);
      };

      window.requestAnimationFrame(animate);
      return;
    }

    const result = attemptSkill(instanceId, skillId);
    if (result === "wrong") {
      setFeedback("이 상황에는 효과가 없는 스킬입니다.");
      window.setTimeout(() => setFeedback(""), 1500);
    }
    if (result === "missing") {
      router.replace("/game");
    }
  };

  if (!displayEvent || !definition) {
    return null;
  }

  return (
    <main className="shell">
      <div className="noise" />
      <section className="event-layout">
        <div className="event-stage">
          <EventScene
            eventId={definition.id}
            status={displayEvent.status}
            activeSkill={sceneSkillEffect}
            suppressionProgress={suppressionProgress}
          />
          <div className="event-info">
            <DangerBadge status={displayEvent.status} />
            <h1>{definition.title}</h1>
            <p>{definition.description}</p>
            <div className="mission-brief">
              <h3><Target size={15} /> 미션 브리핑</h3>
              <ul>
                <li>목표: 재난 확산을 차단하고 생태계 피해를 최소화</li>
                <li>권장 스킬: {recommendedSkills.join(", ")}</li>
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
            <button className="secondary-button" onClick={() => router.push("/game")} style={{ marginTop: 16 }}>
              <ArrowLeft size={17} aria-hidden="true" />
              지구로
            </button>
          </div>
          {feedback && <div className="toast">{feedback}</div>}
          <SkillDeck disabled={Boolean(lastResolution) || isResolvingSkill} onUse={handleUseSkill} />
        </div>
        <AchievementPanel achievements={achievements} />
      </section>
      {lastResolution && (
        <ResolutionModal
          notice={lastResolution}
          onConfirm={() => {
            consumeResolution();
            router.push(completedAt ? "/result" : "/game");
          }}
        />
      )}
    </main>
  );
}
