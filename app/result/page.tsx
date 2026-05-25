"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { RotateCcw, Trophy } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { useGameStore } from "@/features/game/game-store";
import { formatDuration } from "@/features/game/scoring";
import type { FinalSummary } from "@/features/game/types";

type RankingItem = {
  rank: number;
  playerName: string;
  score: number;
  durationSeconds: number;
};

const LOCAL_RANKINGS_KEY = "gaia-local-rankings-v1";

function readLocalRankings(): RankingItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_RANKINGS_KEY) ?? "[]") as RankingItem[];
  } catch {
    return [];
  }
}

function writeLocalRanking(summary: FinalSummary) {
  const rankings = readLocalRankings();
  const next = [
    ...rankings,
    {
      rank: 0,
      playerName: summary.playerName,
      score: summary.score,
      durationSeconds: summary.durationSeconds
    }
  ]
    .sort((a, b) => b.score - a.score || a.durationSeconds - b.durationSeconds)
    .slice(0, 20)
    .map((item, index) => ({ ...item, rank: index + 1 }));
  window.localStorage.setItem(LOCAL_RANKINGS_KEY, JSON.stringify(next));
  return next;
}

export default function ResultPage() {
  const router = useRouter();
  const { finalSummary, finishGame, resetGame } = useGameStore();
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [rankLabel, setRankLabel] = useState("저장 중");

  const summary = useMemo(() => finalSummary ?? finishGame(), [finalSummary, finishGame]);

  useEffect(() => {
    if (!summary) {
      router.replace("/");
      return;
    }

    let cancelled = false;

    async function saveRanking() {
      if (!summary) return;
      try {
        const response = await fetch("/api/rankings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            playerName: summary.playerName,
            score: summary.score,
            durationSeconds: summary.durationSeconds,
            resolvedCount: summary.resolvedCount,
            failedCount: summary.failedCount,
            achievements: summary.achievements.map((achievement) => achievement.id)
          })
        });
        const result = (await response.json()) as { configured?: boolean; rank?: number | null };

        if (cancelled) return;

        if (result.configured && result.rank) {
          setRankLabel(`${result.rank}위`);
          const list = await fetch("/api/rankings").then((res) => res.json());
          setRankings(list.items ?? []);
        } else {
          const local = writeLocalRanking(summary);
          const rank = local.findIndex(
            (item) =>
              item.playerName === summary.playerName &&
              item.score === summary.score &&
              item.durationSeconds === summary.durationSeconds
          );
          setRankLabel(rank >= 0 ? `로컬 ${rank + 1}위` : "로컬 저장");
          setRankings(local);
        }
      } catch {
        if (cancelled) return;
        const local = writeLocalRanking(summary);
        setRankLabel("로컬 저장");
        setRankings(local);
      }
    }

    saveRanking();

    return () => {
      cancelled = true;
    };
  }, [router, summary]);

  if (!summary) return null;

  return (
    <main className="shell">
      <div className="noise" />
      <TopBar
        right={
          <div className="hud-pill">
            <Trophy size={17} aria-hidden="true" />
            {rankLabel}
          </div>
        }
      />
      <section className="result-page">
        <div className="result-grid">
          <div className="result-card">
            <h1>작전 종료</h1>
            <p>{summary.playerName}의 가이아 회복 기록입니다.</p>
            <div className="score">{summary.score}</div>
            <div className="stat-grid">
              <div className="stat">
                <strong>{formatDuration(summary.durationSeconds)}</strong>
                <span>완료 시간</span>
              </div>
              <div className="stat">
                <strong>{summary.resolvedCount}</strong>
                <span>해결</span>
              </div>
              <div className="stat">
                <strong>{summary.failedCount}</strong>
                <span>실패</span>
              </div>
              <div className="stat">
                <strong>{summary.achievements.length}</strong>
                <span>업적</span>
              </div>
            </div>
            <button
              className="primary-button"
              onClick={() => {
                resetGame();
                router.replace("/");
              }}
            >
              <RotateCcw size={18} aria-hidden="true" />
              새 게임
            </button>
          </div>
          <aside className="side-panel">
            <h2 className="panel-title">
              <Trophy size={18} aria-hidden="true" />
              랭킹
            </h2>
            {rankings.length === 0 ? (
              <p className="empty-text">랭킹을 불러오는 중입니다.</p>
            ) : (
              <ol className="rank-list">
                {rankings.map((item) => (
                  <li className="rank-item" key={`${item.rank}-${item.playerName}-${item.score}`}>
                    <strong>
                      {item.rank}위 · {item.playerName}
                    </strong>
                    <span className="muted">
                      {item.score}점 · {formatDuration(item.durationSeconds)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}

