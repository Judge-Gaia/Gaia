"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { Play, Trophy, Activity, Cpu, Sparkles } from "lucide-react";
import { EarthSceneSafe } from "@/components/earth/EarthSceneSafe";
import { useGameStore } from "@/features/game/game-store";
import type { GameMode } from "@/features/game/types";

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

function readLocalRankings(mode: GameMode): RankingItem[] {
  if (typeof window === "undefined") return [];
  const key = mode === "ultra" ? LOCAL_RANKINGS_KEY_ULTRA : LOCAL_RANKINGS_KEY_BASIC;
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as RankingItem[];
  } catch {
    return [];
  }
}

export default function HomePage() {
  const router = useRouter();
  const startGame = useGameStore((state) => state.startGame);
  
  // 로비 상태
  const [name, setName] = useState("");
  const [gameMode, setGameMode] = useState<GameMode>("basic");
  const [rankingTab, setRankingTab] = useState<GameMode>("basic");
  const [rankings, setRankings] = useState<RankingItem[]>([]);

  // 전역 데이터 테마 설정 초기화 (Cyan 테마 고정)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "cyan");
  }, []);

  // 랭킹 목록 로드 (선택된 탭 기준 API 페치 후 로컬 폴백)
  useEffect(() => {
    let cancelled = false;

    async function loadRankings() {
      try {
        const response = await fetch(`/api/rankings?mode=${rankingTab}`);
        const result = (await response.json()) as { configured?: boolean; items?: RankingItem[] };

        if (cancelled) return;

        if (result.configured && result.items) {
          setRankings(result.items);
        } else {
          setRankings(readLocalRankings(rankingTab));
        }
      } catch (err) {
        console.error(err);
        if (cancelled) return;
        setRankings(readLocalRankings(rankingTab));
      }
    }

    loadRankings();

    return () => {
      cancelled = true;
    };
  }, [rankingTab]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim().slice(0, 16);
    if (!trimmed) return;
    
    startGame(trimmed, gameMode);
    
    // 이전에 사용한 이름 기억
    localStorage.setItem("gaia-user-name", trimmed);
    
    router.push("/game");
  };

  // 마운트 시 이전에 설정된 이름 복구
  useEffect(() => {
    const savedName = localStorage.getItem("gaia-user-name");
    if (savedName) setName(savedName);
  }, []);

  return (
    <main className="shell lobby-shell">
      <div className="noise" />
      <div className="space-backdrop" aria-hidden="true">
        <EarthSceneSafe events={[]} />
      </div>

      <header className="lobby-topbar">
        <div className="brand" aria-label="GAIA">
          <div className="brand-mark pulsing-brand">
            <Activity size={20} />
          </div>
          <div>
            <div className="brand-title">GAIA</div>
            <div className="brand-subtitle">생태 위협 통합 관제 본부</div>
          </div>
        </div>
        <div className="lobby-stats">
          <span className="lobby-stat-pill secondary">
            시스템 상태: <b>정상 (SECURE)</b>
          </span>
        </div>
      </header>

      <section className="lobby-layout">
        <div className="lobby-grid">
          {/* 1열: 참가 제어 패널 */}
          <div className="cyber-panel lobby-card setup-card">
            <div className="lobby-card-header">
              <h2>작전 참여 통제</h2>
              <span className="lobby-version">v1.2.0</span>
            </div>
            
            <form onSubmit={handleSubmit} className="lobby-form">
              {/* 이름 입력 */}
              <div className="form-group name-input-group">
                <label>대원 콜사인 (이름 입력)</label>
                <div className="input-with-badge">
                  <input
                    maxLength={16}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="이름 입력"
                    value={name}
                    required
                  />
                </div>
              </div>

              {/* 작전 모드 선택 */}
              <div className="form-group">
                <label>수행 작전 프로토콜</label>
                <div className="mode-selector">
                  <button
                    aria-pressed={gameMode === "basic"}
                    className={gameMode === "basic" ? "mode-option mode-option-active" : "mode-option"}
                    onClick={() => setGameMode("basic")}
                    type="button"
                  >
                    기본 작전 (10회)
                  </button>
                  <button
                    aria-pressed={gameMode === "ultra"}
                    className={gameMode === "ultra" ? "mode-option mode-option-active" : "mode-option"}
                    onClick={() => setGameMode("ultra")}
                    type="button"
                  >
                    무한 울트라 챌린지
                  </button>
                </div>
              </div>

              <button className="primary-button lobby-play-button" disabled={!name.trim()} type="submit">
                <Play size={20} fill="currentColor" />
                정화 작전 시작
              </button>
            </form>
          </div>

          {/* 2열: 작전 가이드 및 타이틀 */}
          <div className="lobby-center-info">
            <div className="lobby-hero-title">
              <h1 className="glitch-text">GAIA</h1>
              <p className="hero-tagline">실시간 글로벌 생태계 환경 복구 작전</p>
            </div>

            <div className="tutorial-container">
              <h3>환경 정화 임무 행동 지침</h3>
              <div className="tutorial-steps">
                <div className="step-card">
                  <div className="step-num">01</div>
                  <h4>지구 상태 모니터링</h4>
                  <p>3D 지구를 조작/회전하며 색상이 변하는 환경 오염 현장을 탐색합니다.</p>
                </div>
                <div className="step-card">
                  <div className="step-num">02</div>
                  <h4>오염 영역 투입</h4>
                  <p>노랑, 주황, 빨강으로 격상되는 현장 포인트를 클릭해 작전 화면으로 진입합니다.</p>
                </div>
                <div className="step-card">
                  <div className="step-num">03</div>
                  <h4>복구 미션 해결</h4>
                  <p>화면 내 해로운 요소를 드래그하거나 순서대로 작동시켜 복구 목표를 끝마칩니다.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3열: 사이드바 로컬 랭킹 및 업데이트 기록 */}
          <div className="lobby-sidebar">
            {/* 실시간 로컬 랭킹 */}
            <div className="cyber-panel lobby-card rankings-panel">
              <div className="rankings-header-row">
                <h3>
                  <Trophy size={16} /> 최고 정화 기록
                </h3>
                <div className="lobby-ranking-tabs">
                  <button
                    className={`lobby-tab-btn ${rankingTab === "basic" ? "active" : ""}`}
                    onClick={() => setRankingTab("basic")}
                    type="button"
                  >
                    기본
                  </button>
                  <button
                    className={`lobby-tab-btn ${rankingTab === "ultra" ? "active" : ""}`}
                    onClick={() => setRankingTab("ultra")}
                    type="button"
                  >
                    무한
                  </button>
                </div>
              </div>
              <div className="lobby-rank-list">
                {rankings.length === 0 ? (
                  <p className="empty-text">기록된 작전 결과가 없습니다.<br />첫 정화 작전을 완료하고 기록을 확인하세요.</p>
                ) : (
                  rankings.slice(0, 5).map((item, idx) => (
                    <div className={`lobby-rank-item rank-${idx + 1}`} key={`${item.rank}-${item.playerName}-${item.score}-${idx}`}>
                      <span className="rank-badge">{idx + 1}</span>
                      <span className="player-name">{item.playerName}</span>
                      <span className="player-score">{item.score.toLocaleString()}점</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* 업데이트 로그 */}
            <div className="cyber-panel lobby-card patch-panel">
              <h3>
                <Cpu size={16} /> 시스템 업데이트 로그
              </h3>
              <div className="patch-notes">
                <div className="patch-item">
                  <span className="patch-date">06/03</span>
                  <p><b>v1.2.0</b>: 작전 통제실 HUD 한국어화 통일 및 가상 데이터(동접자 수 등) 제거 작업 완료.</p>
                </div>
                <div className="patch-item">
                  <span className="patch-date">06/01</span>
                  <p><b>v1.1.5</b>: 산불 진화 현장 수압 및 물탱크 리필 밸런스 패치 완료.</p>
                </div>
                <div className="patch-item">
                  <span className="patch-date">05/28</span>
                  <p><b>v1.1.0</b>: 무제한 진행이 가능한 울트라 챌린지 작전 추가.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
