"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  buildEventSequence,
  buildLocationSequence,
  eventById,
  MAX_ACTIVE_EVENTS,
  STATUS_TIMINGS,
  TARGET_EVENT_COUNT
} from "./game-data";
import { calculateScore } from "./scoring";
import type {
  Achievement,
  ActiveEvent,
  DangerStatus,
  FailedEvent,
  FinalSummary,
  GameMode,
  Location,
  RunStats,
  ResolvedEvent,
  SkillId,
  SdgInfo
} from "./types";

type ResolutionNotice = {
  eventId: string;
  title: string;
  message: string;
  realWorldContext: string;
  lawOrPolicy: string;
  actionHint: string;
  sdgInfo: SdgInfo;
};

type GameState = {
  playerName: string;
  gameMode: GameMode;
  startedAt: number | null;
  completedAt: number | null;
  targetEventCount: number;
  activeEvents: ActiveEvent[];
  resolvedEvents: ResolvedEvent[];
  failedEvents: FailedEvent[];
  achievements: Achievement[];
  runStats: RunStats;
  eventSequence: string[];
  locationSequence: Location[];
  lastResolution: ResolutionNotice | null;
  finalSummary: FinalSummary | null;
  startGame: (playerName: string, gameMode?: GameMode) => void;
  resetGame: () => void;
  tick: (now?: number) => void;
  attemptSkill: (instanceId: string, skillId: SkillId, now?: number) => "resolved" | "wrong" | "missing";
  completeEvent: (instanceId: string, now?: number) => "resolved" | "missing";
  consumeResolution: () => void;
  finishGame: (now?: number) => FinalSummary | null;
};

function statusForEvent(event: ActiveEvent, now: number): DangerStatus {
  const age = now - event.spawnedAt;
  if (age >= STATUS_TIMINGS.black) return "black";
  if (age >= STATUS_TIMINGS.red) return "red";
  if (age >= STATUS_TIMINGS.orange) return "orange";
  return "yellow";
}

function createEvent(
  index: number,
  now: number,
  eventSeq: string[],
  locationSeq: Location[]
): ActiveEvent {
  const eventId = eventSeq[index % eventSeq.length];
  const location = locationSeq[index % locationSeq.length];

  return {
    instanceId: `${eventId}-${now}-${index}`,
    eventId,
    latitude: location.latitude,
    longitude: location.longitude,
    spawnedAt: now + index * 40,
    status: "yellow"
  };
}

function nextAchievements(state: Pick<GameState, "resolvedEvents" | "failedEvents" | "achievements">, now: number) {
  const existing = new Set(state.achievements.map((achievement) => achievement.id));
  const additions: Achievement[] = [];
  const add = (id: string, title: string, description: string) => {
    if (!existing.has(id)) {
      existing.add(id);
      additions.push({ id, title, description, earnedAt: now });
    }
  };

  if (state.resolvedEvents.length >= 1) {
    add("first_rescue", "첫 번째 회복", "첫 자연 파괴 이벤트를 해결했습니다.");
  }

  for (const event of state.resolvedEvents) {
    const definition = eventById.get(event.eventId);
    if (definition) {
      add(`resolved_${definition.id}`, definition.shortTitle, `${definition.title} 문제를 해결했습니다.`);
    }
  }

  if (state.resolvedEvents.length >= 5) {
    add("five_rescues", "연속 회복 작전", "다섯 개 이상의 이벤트를 해결했습니다.");
  }

  if (state.resolvedEvents.length >= 3 && state.failedEvents.length === 0) {
    add("clean_sweep", "무결점 대응", "초반 세 개 이벤트를 실패 없이 해결했습니다.");
  }

  if (state.resolvedEvents.length + state.failedEvents.length >= TARGET_EVENT_COUNT && state.failedEvents.length === 0) {
    add("perfect_run", "완벽한 가이아", "검정 단계로 실패한 이벤트 없이 라운드를 끝냈습니다.");
  }

  return additions;
}

// 게임 종료(Complete) 판단 유틸리티 함수:
// 1. 무한 모드(ultra): 실패한 이벤트 개수(failedEvents)가 20개 미만이면 계속 진행되고, 20개 이상일 때 비로소 게임 오버(종료) 처리됩니다.
// 2. 기본 모드(basic): 해결했거나 실패한 이벤트의 합(processed)이 목표 개수(targetEventCount, 10개)에 도달하면 게임이 종료됩니다.
// 종료 조건 만족 시 최종 스코어, 콤보, 해결 횟수 등을 담은 FinalSummary 객체를 생성하고 상태 변화를 반환합니다.
function completeIfNeeded(state: GameState, now: number): Partial<GameState> {
  if (state.gameMode === "ultra") {
    if (state.failedEvents.length < 20 || state.completedAt) {
      return {};
    }
  } else {
    const processed = state.resolvedEvents.length + state.failedEvents.length;
    if (processed < state.targetEventCount || state.completedAt) {
      return {};
    }
  }

  const durationSeconds = state.startedAt ? Math.max(0, Math.round((now - state.startedAt) / 1000)) : 0;
  const summary: FinalSummary = {
    playerName: state.playerName,
    gameMode: state.gameMode,
    score: calculateScore({
      resolvedEvents: state.resolvedEvents,
      failedEvents: state.failedEvents,
      achievements: state.achievements,
      durationSeconds,
      bestCombo: state.runStats.bestCombo
    }),
    durationSeconds,
    resolvedCount: state.resolvedEvents.length,
    failedCount: state.failedEvents.length,
    achievements: state.achievements,
    bestCombo: state.runStats.bestCombo,
    power: state.runStats.power
  };

  return {
    completedAt: now,
    activeEvents: [],
    finalSummary: summary
  };
}

function runStatsAfterRescue(stats: RunStats): RunStats {
  const combo = stats.combo + 1;
  return {
    combo,
    bestCombo: Math.max(stats.bestCombo, combo),
    power: Math.min(100, stats.power + 9 + Math.min(combo, 6) * 2),
    rescuesWithoutFail: stats.rescuesWithoutFail + 1
  };
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      playerName: "",
      gameMode: "basic",
      startedAt: null,
      completedAt: null,
      targetEventCount: TARGET_EVENT_COUNT,
      activeEvents: [],
      resolvedEvents: [],
      failedEvents: [],
      achievements: [],
      runStats: {
        combo: 0,
        bestCombo: 0,
        power: 70,
        rescuesWithoutFail: 0
      },
      eventSequence: [],
      locationSequence: [],
      lastResolution: null,
      finalSummary: null,
      startGame: (playerName, gameMode = "basic") => {
        const now = Date.now();
        const eventSequence = buildEventSequence();
        const locationSequence = buildLocationSequence();
        set({
          playerName: playerName.trim(),
          gameMode,
          startedAt: now,
          completedAt: null,
          targetEventCount: TARGET_EVENT_COUNT,
          activeEvents: Array.from(
            { length: Math.min(3, TARGET_EVENT_COUNT) },
            (_, index) => createEvent(index, now, eventSequence, locationSequence)
          ),
          resolvedEvents: [],
          failedEvents: [],
          achievements: [],
          runStats: {
            combo: 0,
            bestCombo: 0,
            power: gameMode === "ultra" ? 82 : 70,
            rescuesWithoutFail: 0
          },
          eventSequence,
          locationSequence,
          lastResolution: null,
          finalSummary: null
        });
      },
      resetGame: () => {
        set({
          playerName: "",
          gameMode: "basic",
          startedAt: null,
          completedAt: null,
          activeEvents: [],
          resolvedEvents: [],
          failedEvents: [],
          achievements: [],
          runStats: {
            combo: 0,
            bestCombo: 0,
            power: 70,
            rescuesWithoutFail: 0
          },
          eventSequence: [],
          locationSequence: [],
          lastResolution: null,
          finalSummary: null
        });
      },
      tick: (now = Date.now()) => {
        const state = get();
        if (!state.startedAt || state.completedAt) return;

        // 1. 활성 이벤트 상태 및 만료(실패) 감지:
        // 각 활성 이벤트의 생존 시간에 따라 위험 단계를 갱신하고, 최고 위험 상태인 'black'에 도달하면
        // 활성 목록에서 제외하고 failedEvents 목록으로 즉시 이관합니다.
        const failedNow: FailedEvent[] = [];
        const stillActive = state.activeEvents
          .map((event) => ({ ...event, status: statusForEvent(event, now) }))
          .filter((event) => {
            if (event.status === "black") {
              failedNow.push({ instanceId: event.instanceId, eventId: event.eventId, failedAt: now });
              return false;
            }
            return true;
          });

        // 2. 신규 이벤트 동적 생성(Spawn) 계산:
        // - basic 모드: 누적 생성량(해결 + 실패 + 활성)이 목표 개수를 초과하지 않도록 보장하면서, 최대 동시 노출량(MAX_ACTIVE_EVENTS) 빈 슬롯만큼 추가 스폰합니다.
        // - ultra 모드: 목표 제한 없이 비어 있는 모든 슬롯을 채우도록 항상 최대 동시 노출량 크기만큼 스폰을 시도합니다.
        const resolvedCount = state.resolvedEvents.length;
        const failedCount = state.failedEvents.length + failedNow.length;
        const totalCreated = resolvedCount + failedCount + stillActive.length;
        const slots = Math.max(0, MAX_ACTIVE_EVENTS - stillActive.length);
        const remainingToCreate = state.gameMode === "ultra" ? slots : state.targetEventCount - totalCreated;
        const spawnCount = Math.min(Math.max(0, remainingToCreate), slots);
        const { eventSequence, locationSequence } = state;
        const spawned = Array.from(
          { length: spawnCount },
          (_, index) => createEvent(totalCreated + index, now, eventSequence, locationSequence)
        );

        // 3. 게임 상태 갱신:
        // 이벤트가 터져서 실패가 발생한 경우 콤보를 0으로 초기화하고, 힘(power) 스탯을 차감합니다.
        const nextState = {
          ...state,
          activeEvents: [...stillActive, ...spawned],
          failedEvents: [...state.failedEvents, ...failedNow],
          runStats:
            failedNow.length > 0
              ? {
                  ...state.runStats,
                  combo: 0,
                  power: Math.max(0, state.runStats.power - failedNow.length * 18),
                  rescuesWithoutFail: 0
                }
              : state.runStats
        };
        
        // 4. 업적(Achievements) 실시간 트리거 검사:
        const additions = nextAchievements(nextState, now);
        const withAchievements = {
          ...nextState,
          achievements: [...state.achievements, ...additions]
        };

        set({
          activeEvents: withAchievements.activeEvents,
          failedEvents: withAchievements.failedEvents,
          achievements: withAchievements.achievements,
          runStats: withAchievements.runStats,
          ...completeIfNeeded(withAchievements as GameState, now)
        });
      },
      attemptSkill: (instanceId, skillId, now = Date.now()) => {
        const state = get();
        const event = state.activeEvents.find((item) => item.instanceId === instanceId);
        if (!event) return "missing";

        const definition = eventById.get(event.eventId);
        if (!definition) return "missing";

        if (!definition.requiredSkillIds.includes(skillId)) {
          return "wrong";
        }

        const resolvedEvent: ResolvedEvent = {
          instanceId: event.instanceId,
          eventId: event.eventId,
          resolvedAt: now,
          resolvedStatus: event.status === "black" ? "red" : event.status
        };
        const nextResolved = [...state.resolvedEvents, resolvedEvent];
        const nextActive = state.activeEvents.filter((item) => item.instanceId !== instanceId);
        const nextRunStats = runStatsAfterRescue(state.runStats);
        const nextPartial = {
          ...state,
          activeEvents: nextActive,
          resolvedEvents: nextResolved,
          runStats: nextRunStats
        };
        const additions = nextAchievements(nextPartial, now);
        const nextAchievementsList = [...state.achievements, ...additions];
        const nextState = {
          ...nextPartial,
          achievements: nextAchievementsList
        };

        set({
          activeEvents: nextActive,
          resolvedEvents: nextResolved,
          achievements: nextAchievementsList,
          runStats: nextRunStats,
          lastResolution: {
            eventId: definition.id,
            title: definition.title,
            message: definition.education.resolvedMessage,
            realWorldContext: definition.education.realWorldContext,
            lawOrPolicy: definition.education.lawOrPolicy,
            actionHint: definition.education.actionHint,
            sdgInfo: definition.sdgInfo
          },
          ...completeIfNeeded(nextState as GameState, now)
        });

        return "resolved";
      },
      completeEvent: (instanceId, now = Date.now()) => {
        const state = get();
        const event = state.activeEvents.find((item) => item.instanceId === instanceId);
        if (!event) return "missing";

        const definition = eventById.get(event.eventId);
        if (!definition) return "missing";

        const resolvedEvent: ResolvedEvent = {
          instanceId: event.instanceId,
          eventId: event.eventId,
          resolvedAt: now,
          resolvedStatus: event.status === "black" ? "red" : event.status
        };
        const nextResolved = [...state.resolvedEvents, resolvedEvent];
        const nextActive = state.activeEvents.filter((item) => item.instanceId !== instanceId);
        const nextRunStats = runStatsAfterRescue(state.runStats);
        const nextPartial = {
          ...state,
          activeEvents: nextActive,
          resolvedEvents: nextResolved,
          runStats: nextRunStats
        };
        const additions = nextAchievements(nextPartial, now);
        const nextAchievementsList = [...state.achievements, ...additions];
        const nextState = {
          ...nextPartial,
          achievements: nextAchievementsList
        };

        set({
          activeEvents: nextActive,
          resolvedEvents: nextResolved,
          achievements: nextAchievementsList,
          runStats: nextRunStats,
          lastResolution: {
            eventId: definition.id,
            title: definition.title,
            message: definition.education.resolvedMessage,
            realWorldContext: definition.education.realWorldContext,
            lawOrPolicy: definition.education.lawOrPolicy,
            actionHint: definition.education.actionHint,
            sdgInfo: definition.sdgInfo
          },
          ...completeIfNeeded(nextState as GameState, now)
        });

        return "resolved";
      },
      consumeResolution: () => {
        set({ lastResolution: null });
      },
      finishGame: (now = Date.now()) => {
        const state = get();
        if (!state.startedAt) return null;
        if (state.finalSummary) return state.finalSummary;

        const durationSeconds = Math.max(0, Math.round((now - state.startedAt) / 1000));
        const summary: FinalSummary = {
          playerName: state.playerName,
          gameMode: state.gameMode,
          score: calculateScore({
            resolvedEvents: state.resolvedEvents,
            failedEvents: state.failedEvents,
            achievements: state.achievements,
            durationSeconds,
            bestCombo: state.runStats.bestCombo
          }),
          durationSeconds,
          resolvedCount: state.resolvedEvents.length,
          failedCount: state.failedEvents.length,
          achievements: state.achievements,
          bestCombo: state.runStats.bestCombo,
          power: state.runStats.power
        };
        set({ completedAt: now, activeEvents: [], finalSummary: summary });
        return summary;
      }
    }),
    {
      name: "gaia-game-v1",
      partialize: (state) => ({
        playerName: state.playerName,
        gameMode: state.gameMode,
        startedAt: state.startedAt,
        completedAt: state.completedAt,
        targetEventCount: state.targetEventCount,
        activeEvents: state.activeEvents,
        resolvedEvents: state.resolvedEvents,
        failedEvents: state.failedEvents,
        achievements: state.achievements,
        runStats: state.runStats,
        eventSequence: state.eventSequence,
        locationSequence: state.locationSequence,
        finalSummary: state.finalSummary
      })
    }
  )
);
