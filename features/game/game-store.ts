"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  eventById,
  eventDefinitions,
  eventLocations,
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
  RunStats,
  ResolvedEvent,
  SkillId
} from "./types";

type ResolutionNotice = {
  eventId: string;
  title: string;
  message: string;
  realWorldContext: string;
  lawOrPolicy: string;
  actionHint: string;
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

function createEvent(index: number, now: number): ActiveEvent {
  const definition = eventDefinitions[index % eventDefinitions.length];
  const location = eventLocations[index % eventLocations.length];

  return {
    instanceId: `${definition.id}-${now}-${index}`,
    eventId: definition.id,
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

function completeIfNeeded(state: GameState, now: number): Partial<GameState> {
  if (state.gameMode === "ultra") {
    return {};
  }

  const processed = state.resolvedEvents.length + state.failedEvents.length;
  if (processed < state.targetEventCount || state.completedAt) {
    return {};
  }

  const durationSeconds = state.startedAt ? Math.max(0, Math.round((now - state.startedAt) / 1000)) : 0;
  const summary: FinalSummary = {
    playerName: state.playerName,
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
      lastResolution: null,
      finalSummary: null,
      startGame: (playerName, gameMode = "basic") => {
        const now = Date.now();
        set({
          playerName: playerName.trim(),
          gameMode,
          startedAt: now,
          completedAt: null,
          targetEventCount: TARGET_EVENT_COUNT,
          activeEvents: Array.from({ length: Math.min(3, TARGET_EVENT_COUNT) }, (_, index) => createEvent(index, now)),
          resolvedEvents: [],
          failedEvents: [],
          achievements: [],
          runStats: {
            combo: 0,
            bestCombo: 0,
            power: gameMode === "ultra" ? 82 : 70,
            rescuesWithoutFail: 0
          },
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
          lastResolution: null,
          finalSummary: null
        });
      },
      tick: (now = Date.now()) => {
        const state = get();
        if (!state.startedAt || state.completedAt) return;

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

        const resolvedCount = state.resolvedEvents.length;
        const failedCount = state.failedEvents.length + failedNow.length;
        const totalCreated = resolvedCount + failedCount + stillActive.length;
        const slots = Math.max(0, MAX_ACTIVE_EVENTS - stillActive.length);
        const remainingToCreate = state.gameMode === "ultra" ? slots : state.targetEventCount - totalCreated;
        const spawnCount = Math.min(Math.max(0, remainingToCreate), slots);
        const spawned = Array.from({ length: spawnCount }, (_, index) => createEvent(totalCreated + index, now));

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
            actionHint: definition.education.actionHint
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
            actionHint: definition.education.actionHint
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
        finalSummary: state.finalSummary
      })
    }
  )
);
