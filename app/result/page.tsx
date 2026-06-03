"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RotateCcw, Trophy, Share2, Twitter, Copy, Award, Globe2 } from "lucide-react";
import { useGameStore } from "@/features/game/game-store";
import { formatDuration } from "@/features/game/scoring";
import type { FinalSummary, GameMode } from "@/features/game/types";
import { eventById } from "@/features/game/game-data";

type RankingItem = {
  rank: number;
  playerName: string;
  score: number;
  durationSeconds: number;
  resolvedCount?: number;
  failedCount?: number;
};

const LOCAL_RANKINGS_KEY_BASIC = "gaia-local-rankings-basic-v1";
const LOCAL_RANKINGS_KEY_ULTRA = "gaia-local-rankings-ultra-v1";

function getLocalKey(mode: string) {
  return mode === "ultra" ? LOCAL_RANKINGS_KEY_ULTRA : LOCAL_RANKINGS_KEY_BASIC;
}

function readLocalRankings(mode: string): RankingItem[] {
  if (typeof window === "undefined") return [];
  const key = getLocalKey(mode);
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as RankingItem[];
  } catch {
    return [];
  }
}

function writeLocalRanking(summary: FinalSummary) {
  const mode = summary.gameMode;
  const rankings = readLocalRankings(mode);
  const next = [
    ...rankings,
    {
      rank: 0,
      playerName: summary.playerName,
      score: summary.score,
      durationSeconds: summary.durationSeconds,
      resolvedCount: summary.resolvedCount,
      failedCount: summary.failedCount
    }
  ]
    .sort((a, b) => b.score - a.score || a.durationSeconds - b.durationSeconds)
    .slice(0, 20)
    .map((item, index) => ({ ...item, rank: index + 1 }));
  window.localStorage.setItem(getLocalKey(mode), JSON.stringify(next));
  return next;
}

export default function ResultPage() {
  const router = useRouter();
  const { finalSummary, finishGame, resetGame, resolvedEvents, startedAt } = useGameStore();
  const [summary, setSummary] = useState<FinalSummary | null>(null);
  const [rankings, setRankings] = useState<RankingItem[]>([]);
  const [activeTab, setActiveTab] = useState<GameMode>("basic");
  const [submitted, setSubmitted] = useState(false);
  const [playerRank, setPlayerRank] = useState<{ [key in GameMode]?: string }>({});

  // SDGs 기여도 집계
  const sdgContributions = {
    13: { count: 0, title: "기후변화 대응", englishTitle: "Climate Action" },
    14: { count: 0, title: "해양생태계 보전", englishTitle: "Life Below Water" },
    15: { count: 0, title: "육상생태계 보전", englishTitle: "Life on Land" }
  };

  resolvedEvents.forEach((event) => {
    const def = eventById.get(event.eventId);
    if (def?.sdgInfo) {
      const num = def.sdgInfo.number;
      if (num === 13 || num === 14 || num === 15) {
        sdgContributions[num].count++;
      }
    }
  });

  // 전역 데이터 테마 설정 초기화 (Cyan 테마 고정)
  useEffect(() => {
    const savedTheme = localStorage.getItem("gaia-user-theme") || "cyan";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    const s = finalSummary ?? finishGame();
    setSummary(s);
    if (s) {
      setActiveTab(s.gameMode);
    }
  }, [finalSummary, finishGame]);

  // 1. 점수 등록 (최초 1회 실행)
  useEffect(() => {
    if (!summary || submitted) {
      return;
    }

    const gameId = startedAt ?? 0;
    if (gameId > 0) {
      try {
        const submittedList = JSON.parse(localStorage.getItem("gaia-submitted-games-v1") ?? "[]");
        if (submittedList.includes(gameId)) {
          setSubmitted(true);
          return;
        }
      } catch (e) {
        console.error(e);
      }
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
            achievements: summary.achievements.map((achievement) => achievement.id),
            gameMode: summary.gameMode
          })
        });
        const result = (await response.json()) as { configured?: boolean; rank?: number | null };

        if (cancelled) return;

        const markAsSubmitted = () => {
          if (gameId > 0) {
            try {
              const list = JSON.parse(localStorage.getItem("gaia-submitted-games-v1") ?? "[]");
              if (!list.includes(gameId)) {
                localStorage.setItem("gaia-submitted-games-v1", JSON.stringify([...list, gameId]));
              }
            } catch (e) {
              console.error(e);
            }
          }
        };

        if (result.configured && result.rank) {
          setPlayerRank(prev => ({ ...prev, [summary.gameMode]: `전체 순위: ${result.rank}위` }));
          markAsSubmitted();
          setSubmitted(true);
        } else {
          const local = writeLocalRanking(summary);
          const idx = local.findIndex(
            (item) =>
              item.playerName === summary.playerName &&
              item.score === summary.score &&
              item.durationSeconds === summary.durationSeconds &&
              item.resolvedCount === summary.resolvedCount &&
              item.failedCount === summary.failedCount
          );
          setPlayerRank(prev => ({
            ...prev,
            [summary.gameMode]: idx >= 0 ? `로컬 순위: ${idx + 1}위` : "로컬 저장 완료"
          }));
          markAsSubmitted();
          setSubmitted(true);
        }
      } catch (err) {
        console.error(err);
        if (cancelled) return;
        const local = writeLocalRanking(summary);
        setPlayerRank(prev => ({ ...prev, [summary.gameMode]: "로컬 저장 완료" }));
        if (gameId > 0) {
          try {
            const list = JSON.parse(localStorage.getItem("gaia-submitted-games-v1") ?? "[]");
            if (!list.includes(gameId)) {
              localStorage.setItem("gaia-submitted-games-v1", JSON.stringify([...list, gameId]));
            }
          } catch (e) {
            console.error(e);
          }
        }
        setSubmitted(true);
      }
    }

    saveRanking();

    return () => {
      cancelled = true;
    };
  }, [summary, submitted, startedAt]);

  // 2. 현재 선택된 탭의 랭킹 리스트 조회
  useEffect(() => {
    if (!summary) return;

    let cancelled = false;

    async function fetchRankings() {
      try {
        const response = await fetch(`/api/rankings?mode=${activeTab}`);
        const result = (await response.json()) as { configured?: boolean; items?: RankingItem[] };

        if (cancelled) return;

        if (result.configured && result.items) {
          setRankings(result.items);
        } else {
          setRankings(readLocalRankings(activeTab));
        }
      } catch (err) {
        console.error(err);
        if (cancelled) return;
        setRankings(readLocalRankings(activeTab));
      }
    }

    fetchRankings();

    return () => {
      cancelled = true;
    };
  }, [summary, activeTab, submitted]);

  const rankLabel = activeTab === summary?.gameMode
    ? (playerRank[activeTab] ?? "데이터 저장 중")
    : (activeTab === "basic" ? "기본 작전 순위표" : "무한 챌린지 순위표");

  if (!summary) return null;

  const shareText = `[GAIA] 환경 보호 작전을 완료했습니다! 최종 점수: ${summary.score.toLocaleString()}점 | 수행 시간: ${formatDuration(summary.durationSeconds)} | 해결 현장: ${summary.resolvedCount}개 | 획득 업적: ${summary.achievements.length}개. 당신도 지구를 보호해 보세요! #Gaia #환경복구`;

  const copyResult = () => {
    navigator.clipboard.writeText(`${window.location.origin}\n${shareText}`);
    alert("결과 요약이 클립보드에 복사되었습니다!");
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  return (
    <main className="shell">
      <div className="noise" />
      <section className="result-page">
        <div className="result-grid">
          {/* 주요 통계 카드 */}
          <div className="cyber-panel result-card">
            <div className="hud-corner-marker top-left"></div>
            <div className="hud-corner-marker top-right"></div>
            <div className="hud-corner-marker bottom-left"></div>
            <div className="hud-corner-marker bottom-right"></div>

            <div className="result-title-badge">
              <Award size={16} /> 환경 정화 작전 종료
            </div>
            <h1>임무 완료 리포트</h1>
            <p className="callsign-label">작전 참가 대원: <b>{summary.playerName}</b></p>
            
            {/* 점수 요약 영역 */}
            <div className="score-grade-block">
              <div>
                <div className="score-kicker">정화 종합 득점</div>
                <div className="score mono-num">{summary.score.toLocaleString()}점</div>
              </div>
            </div>

            {/* 통계 그리드 */}
            <div className="stat-grid">
              <div className="stat">
                <strong>{formatDuration(summary.durationSeconds)}</strong>
                <span>작전 수행 시간</span>
              </div>
              <div className="stat">
                <strong style={{ color: "var(--green)" }}>{summary.resolvedCount}개소</strong>
                <span>해결한 오염 영역</span>
              </div>
              <div className="stat">
                <strong style={{ color: "var(--red)" }}>{summary.failedCount}개소</strong>
                <span>실패 소멸 영역</span>
              </div>
              <div className="stat">
                <strong style={{ color: "var(--violet)" }}>{summary.achievements.length}개</strong>
                <span>획득한 정화 배지</span>
              </div>
              <div className="stat">
                <strong>{summary.bestCombo ?? 0}회</strong>
                <span>최대 콤보 횟수</span>
              </div>
              <div className="stat">
                <strong>{Math.round(summary.power ?? 0)}%</strong>
                <span>잔여 신의 권능</span>
              </div>
            </div>

            {/* SDGs 정화 공헌도 리포트 */}
            <div className="result-sdg-section">
              <h3>
                <Globe2 size={16} aria-hidden="true" /> SDGs 부문별 정화 공헌도
              </h3>
              <div className="result-sdg-grid">
                {(Object.keys(sdgContributions) as Array<"13" | "14" | "15">).map((key) => {
                  const item = sdgContributions[key];
                  const totalResolved = summary.resolvedCount || 1;
                  const percentage = Math.min(100, (item.count / totalResolved) * 100);

                  return (
                    <div className="result-sdg-bar-group" key={key}>
                      <div className="result-sdg-bar-label">
                        <span className={`sdg-badge sdg-badge-${key}`}>
                          SDG {key}
                        </span>
                        <span className="result-sdg-bar-title">{item.title}</span>
                      </div>
                      <div className="result-sdg-bar-track">
                        <div
                          className={`result-sdg-bar-fill fill-${key}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="result-sdg-bar-count">
                        {item.count} 건 해결
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 하단 제어 및 공유 */}
            <div className="result-actions">
              <button
                className="primary-button restart-btn"
                onClick={() => {
                  resetGame();
                  router.replace("/");
                }}
              >
                <RotateCcw size={18} aria-hidden="true" />
                다시 시작하기
              </button>
              
              <div className="share-buttons">
                <button className="secondary-button" onClick={copyResult} title="결과 복사">
                  <Copy size={16} />
                  기록 복사
                </button>
                <button className="secondary-button share-x-btn" onClick={shareToTwitter} title="트위터/X 공유">
                  <Twitter size={16} fill="currentColor" />
                  결과 공유
                </button>
              </div>
            </div>
          </div>

          {/* 실시간 랭킹 보드 */}
          <aside className="cyber-panel side-panel lobby-sidebar-panel">
            <div className="hud-corner-marker top-left"></div>
            <div className="hud-corner-marker top-right"></div>
            <div className="hud-corner-marker bottom-left"></div>
            <div className="hud-corner-marker bottom-right"></div>

            <h2 className="panel-title">
              <Trophy size={16} aria-hidden="true" />
              종합 순위표
            </h2>

            {/* 탭 토글 스위치 */}
            <div className="ranking-tab-selector">
              <button
                className={`ranking-tab-btn ${activeTab === "basic" ? "active" : ""}`}
                onClick={() => setActiveTab("basic")}
              >
                기본 작전
              </button>
              <button
                className={`ranking-tab-btn ${activeTab === "ultra" ? "active" : ""}`}
                onClick={() => setActiveTab("ultra")}
              >
                무한 챌린지
              </button>
            </div>
            
            {rankings.length === 0 ? (
              <p className="empty-text">기록된 순위가 없습니다.</p>
            ) : (
              <ol className="result-rank-list">
                {rankings.map((item, idx) => {
                  const isCurrent =
                    summary &&
                    activeTab === summary.gameMode &&
                    item.playerName === summary.playerName &&
                    item.score === summary.score &&
                    item.durationSeconds === summary.durationSeconds &&
                    (item.resolvedCount ?? 0) === summary.resolvedCount &&
                    (item.failedCount ?? 0) === summary.failedCount;

                  const rankClass = idx === 0 ? "rank-1-new" : idx === 1 ? "rank-2-new" : idx === 2 ? "rank-3-new" : "";

                  return (
                    <li
                      className={`rank-item-new ${rankClass} ${isCurrent ? "highlighted" : ""}`}
                      key={`${item.rank}-${item.playerName}-${item.score}-${idx}`}
                    >
                      <div className="rank-badge-new">
                        {item.rank}
                      </div>
                      <div className="rank-info-col">
                        <span className="rank-player-name">{item.playerName}</span>
                        <div className="rank-stats-row">
                          <span className="rank-stat-resolved">
                            해결 {item.resolvedCount ?? 0}
                          </span>
                          <span className="rank-stats-divider"></span>
                          <span className="rank-stat-failed">
                            실패 {item.failedCount ?? 0}
                          </span>
                        </div>
                      </div>
                      <div className="rank-score-col-new">
                        <strong className="rank-score-val">{item.score.toLocaleString()}점</strong>
                        <span className="rank-time-val">{formatDuration(item.durationSeconds)}</span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
