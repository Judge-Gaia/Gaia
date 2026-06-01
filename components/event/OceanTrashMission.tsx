"use client";

import { type CSSProperties, type PointerEvent, useMemo, useRef, useState } from "react";
import type { DangerStatus } from "@/features/game/types";
import { MissionHud, MissionStage, pointerToPercent } from "./missionShared";

type Category = "plastic" | "metal" | "other";

type TrashItem = {
  id: string;
  label: string;
  kind: "bottle" | "cup" | "can" | "glass" | "net" | "foam";
  category: Category;
  x: number;
  y: number;
  homeX: number;
  homeY: number;
};

type Bin = {
  category: Category;
  label: string;
  hint: string;
  xMin: number;
  xMax: number;
};

const BIN_Y_MIN = 70;
const BINS: Bin[] = [
  { category: "plastic", label: "플라스틱", hint: "페트·컵", xMin: 5, xMax: 33 },
  { category: "metal", label: "캔·유리", hint: "캔·병", xMin: 36, xMax: 64 },
  { category: "other", label: "기타", hint: "그물·스티로폼", xMin: 67, xMax: 95 }
];

const INITIAL_TRASH: TrashItem[] = [
  { id: "bottle-1", label: "페트병", kind: "bottle", category: "plastic", x: 16, y: 40, homeX: 16, homeY: 40 },
  { id: "cup-1", label: "일회용 컵", kind: "cup", category: "plastic", x: 30, y: 52, homeX: 30, homeY: 52 },
  { id: "can-1", label: "알루미늄 캔", kind: "can", category: "metal", x: 45, y: 38, homeX: 45, homeY: 38 },
  { id: "glass-1", label: "유리병", kind: "glass", category: "metal", x: 58, y: 54, homeX: 58, homeY: 54 },
  { id: "net-1", label: "폐그물", kind: "net", category: "other", x: 72, y: 41, homeX: 72, homeY: 41 },
  { id: "foam-1", label: "스티로폼", kind: "foam", category: "other", x: 85, y: 53, homeX: 85, homeY: 53 }
];

function binAt(x: number, y: number) {
  if (y < BIN_Y_MIN) return null;
  return BINS.find((bin) => x >= bin.xMin && x <= bin.xMax) ?? null;
}

export function OceanTrashMission({
  disabled = false,
  status,
  onComplete
}: {
  disabled?: boolean;
  status: DangerStatus;
  onComplete: () => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState(INITIAL_TRASH);
  const [collectedIds, setCollectedIds] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverBin, setHoverBin] = useState<Category | null>(null);
  const [rejectedId, setRejectedId] = useState<string | null>(null);
  const completedRef = useRef(false);
  const collectedSet = useMemo(() => new Set(collectedIds), [collectedIds]);

  const move = (event: PointerEvent<HTMLButtonElement>, id: string) => {
    if (!stageRef.current) return null;
    const { x, y } = pointerToPercent(event.clientX, event.clientY, stageRef.current, 4);
    setItems((current) => current.map((item) => (item.id === id ? { ...item, x, y } : item)));
    setHoverBin(binAt(x, y)?.category ?? null);
    return { x, y };
  };

  const drop = (id: string, x: number, y: number) => {
    const item = items.find((entry) => entry.id === id);
    if (!item || collectedSet.has(id)) return;
    const bin = binAt(x, y);

    if (bin && bin.category === item.category) {
      const next = [...collectedIds, id];
      setCollectedIds(next);
      if (next.length === INITIAL_TRASH.length && !completedRef.current) {
        completedRef.current = true;
        window.setTimeout(onComplete, 520);
      }
      return;
    }

    // Wrong bin (or dropped over a bin lane) → reject and float back home.
    if (bin) {
      setRejectedId(id);
      window.setTimeout(() => setRejectedId((current) => (current === id ? null : current)), 480);
    }
    setItems((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, x: entry.homeX, y: entry.homeY } : entry))
    );
  };

  const progress = collectedIds.length / INITIAL_TRASH.length;

  return (
    <MissionStage
      ariaLabel="해양 쓰레기 분리수거 미션"
      className="ocean-stage"
      status={status}
      disabled={disabled}
      cleared={completedRef.current}
      clearText="수거 완료"
      stageRef={stageRef}
    >
      <div className="ocean-sky" aria-hidden="true">
        <span className="ocean-sun" />
        <span className="ocean-cloud cloud-a" />
        <span className="ocean-cloud cloud-b" />
        <span className="ocean-bird bird-a" />
        <span className="ocean-bird bird-b" />
      </div>
      <div className="ocean-water" aria-hidden="true">
        <span className="water-shimmer shimmer-a" />
        <span className="water-shimmer shimmer-b" />
        <span className="wave wave-a" />
        <span className="wave wave-b" />
        <span className="wave wave-c" />
      </div>
      <div className="beach-sand" aria-hidden="true">
        <span className="sand-grain grain-a" />
        <span className="sand-grain grain-b" />
        <span className="sand-grain grain-c" />
      </div>

      <MissionHud
        phase="해안 정화 작전"
        title="쓰레기를 분리배출하세요"
        instruction={
          draggingId
            ? "종류에 맞는 수거함 위에서 손을 떼세요."
            : "쓰레기를 끌어 알맞은 분리수거함에 넣으세요."
        }
        progress={progress}
        countLabel={`${collectedIds.length} / ${INITIAL_TRASH.length}`}
        badgeLabel={`남은 쓰레기 ${INITIAL_TRASH.length - collectedIds.length}`}
      />

      <div className="recycle-bins" aria-hidden="true">
        {BINS.map((bin) => (
          <div
            className={`recycle-bin bin-${bin.category} ${hoverBin === bin.category && draggingId ? "active" : ""}`}
            key={bin.category}
            style={{ left: `${bin.xMin}%`, width: `${bin.xMax - bin.xMin}%` } as CSSProperties}
          >
            <span className="bin-mouth" />
            <span className="bin-face">
              <strong>{bin.label}</strong>
              <small>{bin.hint}</small>
            </span>
          </div>
        ))}
      </div>

      {items.map((item, index) => {
        const isCollected = collectedSet.has(item.id);
        return (
          <button
            aria-label={`${item.label} 수거하기`}
            className={`trash-piece trash-${item.kind} ${draggingId === item.id ? "dragging" : ""} ${
              isCollected ? "collected" : ""
            } ${rejectedId === item.id ? "rejected" : ""}`}
            disabled={disabled || isCollected}
            key={item.id}
            onPointerDown={(event) => {
              if (disabled || isCollected) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              setDraggingId(item.id);
              move(event, item.id);
            }}
            onPointerMove={(event) => {
              if (draggingId !== item.id) return;
              move(event, item.id);
            }}
            onPointerUp={(event) => {
              if (draggingId !== item.id) return;
              const position = move(event, item.id);
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
              setDraggingId(null);
              setHoverBin(null);
              if (position) drop(item.id, position.x, position.y);
            }}
            onPointerCancel={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
              setDraggingId(null);
              setHoverBin(null);
            }}
            style={{ "--trash-index": String(index), left: `${item.x}%`, top: `${item.y}%` } as CSSProperties}
            type="button"
          >
            <span aria-hidden="true" />
            <small className="target-hint">{item.label}</small>
          </button>
        );
      })}
    </MissionStage>
  );
}
