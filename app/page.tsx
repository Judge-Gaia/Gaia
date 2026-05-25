"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Play } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { useGameStore } from "@/features/game/game-store";

const EarthScene = dynamic(() => import("@/components/earth/EarthScene").then((mod) => mod.EarthScene), {
  ssr: false
});

export default function HomePage() {
  const router = useRouter();
  const startGame = useGameStore((state) => state.startGame);
  const [name, setName] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim().slice(0, 24);
    if (!trimmed) return;
    startGame(trimmed);
    router.push("/game");
  };

  return (
    <main className="shell">
      <div className="noise" />
      <div className="space-backdrop" aria-hidden="true">
        <EarthScene events={[]} />
      </div>
      <TopBar />
      <section className="intro">
        <div className="intro-grid">
          <div>
            <h1>GAIA</h1>
            <p className="intro-copy">
              이름을 입력하고 지구 위에 나타나는 자연 파괴 이벤트를 해결하세요. 포인트가 검정으로
              변하기 전에 올바른 스킬을 선택해야 합니다.
            </p>
            <form className="start-form" onSubmit={handleSubmit}>
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
