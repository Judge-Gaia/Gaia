import type { Achievement, DangerStatus, FailedEvent, ResolvedEvent } from "./types";

const statusBonus: Record<Exclude<DangerStatus, "black">, number> = {
  yellow: 60,
  orange: 40,
  red: 20
};

export function calculateScore({
  resolvedEvents,
  failedEvents,
  achievements,
  durationSeconds,
  limitSeconds = 360
}: {
  resolvedEvents: ResolvedEvent[];
  failedEvents: FailedEvent[];
  achievements: Achievement[];
  durationSeconds: number;
  limitSeconds?: number;
}) {
  const baseScore = resolvedEvents.length * 100;
  const dangerBonus = resolvedEvents.reduce((total, event) => total + statusBonus[event.resolvedStatus], 0);
  const timeBonus = Math.max(0, limitSeconds - durationSeconds) * 2;
  const achievementBonus = achievements.length * 25;
  const failurePenalty = failedEvents.length * 50;

  return Math.max(0, baseScore + dangerBonus + timeBonus + achievementBonus - failurePenalty);
}

export function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

