"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Play } from "lucide-react";
import { EarthSceneSafe } from "@/components/earth/EarthSceneSafe";
import { useGameStore } from "@/features/game/game-store";
import type { GameMode } from "@/features/game/types";

export default function HomePage() {
  const router = useRouter();
  const startGame = useGameStore((state) => state.startGame);
  const [name, setName] = useState("");
  const [gameMode, setGameMode] = useState<GameMode>("basic");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim().slice(0, 24);
    if (!trimmed) return;
    startGame(trimmed, gameMode);
    router.push("/game");
  };

  return (
    <main className="shell">
      <div className="noise" />
      <div className="space-backdrop" aria-hidden="true">
        <EarthSceneSafe events={[]} />
      </div>
      <section className="intro">
        <div className="intro-grid">
          <div>
            <h1>GAIA</h1>
            <p className="intro-copy">
              이름을 입력하고 지구 위에 나타나는 자연 파괴 이벤트를 해결하세요. 포인트가 검정으로
              변하기 전에 각 현장의 미션을 직접 조작해 끝내야 합니다.
            </p>
            <form className="start-form" onSubmit={handleSubmit}>
              <div className="mode-selector" aria-label="게임 모드">
                <button
                  aria-pressed={gameMode === "basic"}
                  className={gameMode === "basic" ? "mode-option mode-option-active" : "mode-option"}
                  onClick={() => setGameMode("basic")}
                  type="button"
                >
                  기본 모드
                </button>
                <button
                  aria-pressed={gameMode === "ultra"}
                  className={gameMode === "ultra" ? "mode-option mode-option-active" : "mode-option"}
                  onClick={() => setGameMode("ultra")}
                  type="button"
                >
                  울트라 모드
                </button>
              </div>
              <input
                aria-label="플레이어 이름"
                maxLength={24}
                onChange={(event) => setName(event.target.value)}
                placeholder="이름 입력"
                value={name}
              />
              <button className="primary-button" disabled={!name.trim()} type="submit">
                <Play size={18} aria-hidden="true" />
                시작
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
