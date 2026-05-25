"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock } from "lucide-react";
import { AchievementPanel } from "@/components/achievements/AchievementPanel";
import { EventScene } from "@/components/event/EventScene";
import { DangerBadge } from "@/components/game/DangerBadge";
import { ResolutionModal } from "@/components/game/ResolutionModal";
import { SkillDeck } from "@/components/skills/SkillDeck";
import { TopBar } from "@/components/TopBar";
import { eventById } from "@/features/game/game-data";
import { useGameStore } from "@/features/game/game-store";
import { formatDuration } from "@/features/game/scoring";
import type { ActiveEvent, SkillId } from "@/features/game/types";

export default function EventPage() {
  const params = useParams<{ instanceId: string }>();
  const router = useRouter();
  const [feedback, setFeedback] = useState("");
  const [eventSnapshot, setEventSnapshot] = useState<Pick<ActiveEvent, "eventId" | "status"> | null>(null);
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
  const displayEvent = activeEvent ?? eventSnapshot ?? (lastResolution ? { eventId: lastResolution.eventId, status: "red" as const } : null);
  const definition = displayEvent ? eventById.get(displayEvent.eventId) : null;

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
      setEventSnapshot({ eventId: activeEvent.eventId, status: activeEvent.status });
    }
  }, [activeEvent]);

  const elapsed = startedAt ? Math.max(0, Math.round((Date.now() - startedAt) / 1000)) : 0;

  const handleUseSkill = (skillId: SkillId) => {
    if (activeEvent) {
      setEventSnapshot({ eventId: activeEvent.eventId, status: activeEvent.status });
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
      <TopBar
        right={
          <div className="hud-pill">
            <Clock size={17} aria-hidden="true" />
            {formatDuration(elapsed)}
          </div>
        }
      />
      <section className="event-layout">
        <div className="event-stage">
          <EventScene eventId={definition.id} />
          <div className="event-info">
            <DangerBadge status={displayEvent.status} />
            <h1>{definition.title}</h1>
            <p>{definition.description}</p>
            <button className="secondary-button" onClick={() => router.push("/game")} style={{ marginTop: 16 }}>
              <ArrowLeft size={17} aria-hidden="true" />
              지구로
            </button>
          </div>
          {feedback && <div className="toast">{feedback}</div>}
          <SkillDeck disabled={Boolean(lastResolution)} onUse={handleUseSkill} />
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
