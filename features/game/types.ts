export type SkillId = "rain" | "wind" | "purify" | "grow";

export type GameMode = "basic" | "ultra";

export type DangerStatus = "yellow" | "orange" | "red" | "black";

export type EventDefinition = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  sceneClass: string;
  sceneImage: string;
  resolvedSceneImage: string;
  interaction: {
    toolLabel: string;
    instruction: string;
    progressLabel: string;
  };
  requiredSkillIds: SkillId[];
  education: {
    resolvedMessage: string;
    realWorldContext: string;
    lawOrPolicy: string;
    actionHint: string;
  };
};

export type SkillDefinition = {
  id: SkillId;
  name: string;
  description: string;
};

export type ActiveEvent = {
  instanceId: string;
  eventId: string;
  latitude: number;
  longitude: number;
  spawnedAt: number;
  status: DangerStatus;
};

export type ResolvedEvent = {
  instanceId: string;
  eventId: string;
  resolvedAt: number;
  resolvedStatus: Exclude<DangerStatus, "black">;
};

export type FailedEvent = {
  instanceId: string;
  eventId: string;
  failedAt: number;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  earnedAt: number;
};

export type RunStats = {
  combo: number;
  bestCombo: number;
  power: number;
  rescuesWithoutFail: number;
};

export type FinalSummary = {
  playerName: string;
  score: number;
  durationSeconds: number;
  resolvedCount: number;
  failedCount: number;
  achievements: Achievement[];
  bestCombo: number;
  power: number;
};
