"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Clock, Flag, RotateCcw, ShieldCheck } from "lucide-react";
import { AchievementPanel } from "@/components/achievements/AchievementPanel";
import { TopBar } from "@/components/TopBar";
import { TARGET_EVENT_COUNT } from "@/features/game/game-data";
import { useGameStore } from "@/features/game/game-store";
import { formatDuration } from "@/features/game/scoring";

const EarthScene = dynamic(() => import("@/components/earth/EarthScene").then((mod) => mod.EarthScene), {
  ssr: false
});

export default function GamePage() {
  const router = useRouter();
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

  const elapsed = startedAt ? Math.max(0, Math.round((Date.now() - startedAt) / 1000)) : 0;

  return (
    <main className="shell">
      <div className="noise" />
      <TopBar
        right={
          <div className="hud-pill">
            <ShieldCheck size={17} aria-hidden="true" />
            {playerName}
          </div>
        }
      />
      <section className="game-layout">
        <div className="earth-stage">
          <EarthScene events={activeEvents} />
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
    </main>
  );
}
