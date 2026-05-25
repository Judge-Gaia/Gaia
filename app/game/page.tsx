"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { type CSSProperties, useEffect, useState } from "react";
import { Clock, Flag, RotateCcw, ShieldCheck } from "lucide-react";
import { AchievementPanel } from "@/components/achievements/AchievementPanel";
import { eventById, TARGET_EVENT_COUNT } from "@/features/game/game-data";
import { useGameStore } from "@/features/game/game-store";
import { formatDuration } from "@/features/game/scoring";
import type { ActiveEvent } from "@/features/game/types";

const EarthSceneSafe = dynamic(() => import("@/components/earth/EarthSceneSafe").then((mod) => mod.EarthSceneSafe), {
  ssr: false
});

type LocationTransition = {
  event: ActiveEvent;
  x: number;
  y: number;
};

export default function GamePage() {
  const router = useRouter();
  const [locationTransition, setLocationTransition] = useState<LocationTransition | null>(null);
  const {
    playerName,
    startedAt,
    completedAt,
    activeEvents,
    resolvedEvents,
    failedEvents,
    achievements,
    resetGame,
    tick
  } = useGameStore();

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
    if (completedAt) {
      router.replace("/result");
    }
  }, [completedAt, router]);

  useEffect(() => {
    if (!locationTransition) return;

    const timer = window.setTimeout(() => {
      router.push(`/event/${encodeURIComponent(locationTransition.event.instanceId)}`);
    }, 940);

    return () => window.clearTimeout(timer);
  }, [locationTransition, router]);

  const elapsed = startedAt ? Math.max(0, Math.round((Date.now() - startedAt) / 1000)) : 0;
  const transitionDefinition = locationTransition ? eventById.get(locationTransition.event.eventId) : null;
  const transitionStyle = locationTransition && transitionDefinition
    ? ({
        "--entry-x": `${locationTransition.x}px`,
        "--entry-y": `${locationTransition.y}px`,
        "--scene-image": `url("${transitionDefinition.sceneImage}")`
      } as CSSProperties)
    : undefined;

  return (
    <main className="shell">
      <div className="noise" />
      <section className="game-layout">
        <div className="earth-stage">
          <EarthSceneSafe
            events={activeEvents}
            onSelectEvent={(event, anchor) => {
              if (!locationTransition) {
                setLocationTransition({ event, ...anchor });
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
      {locationTransition && transitionDefinition && (
        <div className="location-transition" style={transitionStyle} aria-hidden="true">
          <div className="location-transition-label">
            <span>현장 접근 중</span>
            <strong>{transitionDefinition.title}</strong>
          </div>
        </div>
      )}
    </main>
  );
}
