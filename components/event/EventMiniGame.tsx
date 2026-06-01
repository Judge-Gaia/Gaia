"use client";

import { type CSSProperties, useMemo, useState } from "react";
import { eventById } from "@/features/game/game-data";
import type { DangerStatus } from "@/features/game/types";
import { OceanTrashMission } from "./OceanTrashMission";

type MissionItem = {
  id: string;
  x: number;
  y: number;
};

type MissionConfig = {
  title: string;
  instruction: string;
  className: string;
  itemClassName: string;
  itemLabel: string;
  completeText: string;
  items: MissionItem[];
};

const missionConfigs: Record<string, MissionConfig> = {
  wildfire: {
    title: "산불 진압",
    instruction: "번지는 불씨를 모두 눌러 진압하세요.",
    className: "wildfire-mission-stage",
    itemClassName: "mini-flame",
    itemLabel: "불씨 진압",
    completeText: "진압 완료",
    items: [
      { id: "flame-1", x: 25, y: 66 },
      { id: "flame-2", x: 39, y: 57 },
      { id: "flame-3", x: 55, y: 68 },
      { id: "flame-4", x: 69, y: 56 },
      { id: "flame-5", x: 78, y: 72 }
    ]
  },
  oil_spill: {
    title: "기름막 정화",
    instruction: "검은 기름막을 모두 눌러 흡착 처리하세요.",
    className: "oil-mission-stage",
    itemClassName: "mini-oil",
    itemLabel: "기름막 정화",
    completeText: "정화 완료",
    items: [
      { id: "oil-1", x: 28, y: 55 },
      { id: "oil-2", x: 43, y: 66 },
      { id: "oil-3", x: 58, y: 51 },
      { id: "oil-4", x: 69, y: 69 },
      { id: "oil-5", x: 80, y: 58 }
    ]
  },
  illegal_logging: {
    title: "숲 복원",
    instruction: "그루터기마다 새 묘목을 심어 숲을 복구하세요.",
    className: "forest-mission-stage",
    itemClassName: "mini-stump",
    itemLabel: "묘목 심기",
    completeText: "복원 완료",
    items: [
      { id: "stump-1", x: 22, y: 68 },
      { id: "stump-2", x: 37, y: 58 },
      { id: "stump-3", x: 53, y: 72 },
      { id: "stump-4", x: 67, y: 61 },
      { id: "stump-5", x: 80, y: 73 }
    ]
  },
  air_pollution: {
    title: "스모그 정화",
    instruction: "도시 위 오염 구름을 모두 눌러 걷어내세요.",
    className: "air-mission-stage",
    itemClassName: "mini-smog",
    itemLabel: "스모그 정화",
    completeText: "대기 회복",
    items: [
      { id: "smog-1", x: 21, y: 38 },
      { id: "smog-2", x: 38, y: 29 },
      { id: "smog-3", x: 54, y: 42 },
      { id: "smog-4", x: 69, y: 31 },
      { id: "smog-5", x: 80, y: 45 }
    ]
  },
  drought: {
    title: "가뭄 회복",
    instruction: "마른 땅의 균열 지점을 모두 눌러 물을 공급하세요.",
    className: "drought-mission-stage",
    itemClassName: "mini-crack",
    itemLabel: "물 공급",
    completeText: "수분 회복",
    items: [
      { id: "crack-1", x: 23, y: 64 },
      { id: "crack-2", x: 38, y: 74 },
      { id: "crack-3", x: 52, y: 60 },
      { id: "crack-4", x: 66, y: 73 },
      { id: "crack-5", x: 79, y: 62 }
    ]
  }
};

function BasicMission({
  config,
  disabled,
  status,
  onComplete
}: {
  config: MissionConfig;
  disabled: boolean;
  status: DangerStatus;
  onComplete: () => void;
}) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const completedSet = useMemo(() => new Set(completedIds), [completedIds]);
  const progress = completedIds.length / config.items.length;

  const completeItem = (itemId: string) => {
    if (disabled || completedSet.has(itemId)) return;
    const nextCompletedIds = [...completedIds, itemId];
    setCompletedIds(nextCompletedIds);
    if (nextCompletedIds.length === config.items.length) {
      window.setTimeout(onComplete, 360);
    }
  };

  return (
    <div
      aria-label={config.title}
      className={`event-scene mini-mission-stage ${config.className} ${disabled ? "mission-disabled" : ""}`}
      style={{ "--mission-progress": String(progress) } as CSSProperties}
    >
      <div className="mini-mission-world" />
      <div className="mission-progress-card" role="status">
        <strong>{config.title}</strong>
        <span>{config.instruction}</span>
        <b>{completedIds.length}/{config.items.length}</b>
      </div>
      {config.items.map((item) => {
        const isCompleted = completedSet.has(item.id);
        return (
          <button
            aria-label={`${config.itemLabel} ${item.id}`}
            className={`mini-mission-item ${config.itemClassName} ${isCompleted ? "completed" : ""}`}
            disabled={disabled || isCompleted}
            key={item.id}
            onClick={() => completeItem(item.id)}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            type="button"
          >
            <span aria-hidden="true" />
          </button>
        );
      })}
      {progress === 1 && <div className="mission-clear-stamp">{config.completeText}</div>}
      <div className={`scene-status status-${status}`} />
    </div>
  );
}

export function EventMiniGame({
  disabled = false,
  eventId,
  status,
  onComplete
}: {
  disabled?: boolean;
  eventId: string;
  status: DangerStatus;
  onComplete: () => void;
}) {
  if (eventId === "ocean_trash") {
    return <OceanTrashMission disabled={disabled} status={status} onComplete={onComplete} />;
  }

  const config = missionConfigs[eventId] ?? {
    title: eventById.get(eventId)?.shortTitle ?? "현장 미션",
    instruction: "현장의 문제 지점을 모두 눌러 해결하세요.",
    className: "default-mission-stage",
    itemClassName: "mini-target",
    itemLabel: "문제 지점 해결",
    completeText: "해결 완료",
    items: [
      { id: "target-1", x: 32, y: 54 },
      { id: "target-2", x: 50, y: 42 },
      { id: "target-3", x: 68, y: 58 }
    ]
  };

  return <BasicMission config={config} disabled={disabled} status={status} onComplete={onComplete} />;
}
