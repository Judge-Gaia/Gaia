"use client";

import { type CSSProperties, type PointerEvent, useMemo, useState } from "react";
import type { DangerStatus } from "@/features/game/types";

type TrashItem = {
  id: string;
  label: string;
  kind: "bottle" | "bag" | "can" | "cup" | "net";
  x: number;
  y: number;
};

const initialTrash: TrashItem[] = [
  { id: "bottle-1", label: "플라스틱 병", kind: "bottle", x: 22, y: 56 },
  { id: "bag-1", label: "비닐봉지", kind: "bag", x: 38, y: 68 },
  { id: "can-1", label: "찌그러진 캔", kind: "can", x: 54, y: 58 },
  { id: "cup-1", label: "일회용 컵", kind: "cup", x: 31, y: 78 },
  { id: "net-1", label: "폐그물", kind: "net", x: 66, y: 70 }
];

const binArea = {
  xMin: 78,
  xMax: 97,
  yMin: 51,
  yMax: 91
};

function clampPercent(value: number) {
  return Math.min(96, Math.max(4, value));
}

function isInsideBin(x: number, y: number) {
  return x >= binArea.xMin && x <= binArea.xMax && y >= binArea.yMin && y <= binArea.yMax;
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
  const [items, setItems] = useState(initialTrash);
  const [collectedIds, setCollectedIds] = useState<string[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const collectedSet = useMemo(() => new Set(collectedIds), [collectedIds]);
  const progress = collectedIds.length / initialTrash.length;

  const updatePosition = (pointerEvent: PointerEvent<HTMLButtonElement>, trashId: string) => {
    const stage = pointerEvent.currentTarget.closest<HTMLElement>(".ocean-mission-stage");
    if (!stage) return null;

    const bounds = stage.getBoundingClientRect();
    const x = clampPercent(((pointerEvent.clientX - bounds.left) / bounds.width) * 100);
    const y = clampPercent(((pointerEvent.clientY - bounds.top) / bounds.height) * 100);
    setItems((currentItems) =>
      currentItems.map((item) => (item.id === trashId ? { ...item, x, y } : item))
    );

    return { x, y };
  };

  const collectIfDroppedInBin = (trashId: string, x: number, y: number) => {
    if (!isInsideBin(x, y) || collectedSet.has(trashId)) return;

    const nextCollectedIds = [...collectedIds, trashId];
    setCollectedIds(nextCollectedIds);
    if (nextCollectedIds.length === initialTrash.length) {
      window.setTimeout(onComplete, 360);
    }
  };

  return (
    <div
      aria-label="해양 쓰레기 수거 미션"
      className={`event-scene ocean-mission-stage ${disabled ? "mission-disabled" : ""}`}
      style={{ "--mission-progress": String(progress) } as CSSProperties}
    >
      <div className="ocean-sky" />
      <div className="ocean-water">
        <span className="wave wave-a" />
        <span className="wave wave-b" />
        <span className="wave wave-c" />
      </div>
      <div className="beach-sand">
        <span className="sand-grain grain-a" />
        <span className="sand-grain grain-b" />
        <span className="sand-grain grain-c" />
      </div>
      <div aria-hidden="true" className="trash-bin">
        <span className="bin-lid" />
        <span className="bin-body">BIN</span>
      </div>
      <div className="mission-progress-card" role="status">
        <strong>해양 쓰레기 처리</strong>
        <span>쓰레기를 끌어서 오른쪽 쓰레기통에 넣으세요.</span>
        <b>{collectedIds.length}/{initialTrash.length}</b>
      </div>
      {items.map((item) => {
        const isCollected = collectedSet.has(item.id);
        return (
          <button
            aria-label={`${item.label} 수거하기`}
            className={`trash-piece trash-${item.kind} ${draggingId === item.id ? "dragging" : ""} ${isCollected ? "collected" : ""}`}
            data-trash-id={item.id}
            disabled={disabled || isCollected}
            key={item.id}
            onPointerCancel={(pointerEvent) => {
              if (pointerEvent.currentTarget.hasPointerCapture(pointerEvent.pointerId)) {
                pointerEvent.currentTarget.releasePointerCapture(pointerEvent.pointerId);
              }
              setDraggingId(null);
            }}
            onPointerDown={(pointerEvent) => {
              if (disabled || isCollected) return;
              pointerEvent.currentTarget.setPointerCapture(pointerEvent.pointerId);
              setDraggingId(item.id);
              updatePosition(pointerEvent, item.id);
            }}
            onPointerMove={(pointerEvent) => {
              if (draggingId !== item.id || disabled || isCollected) return;
              updatePosition(pointerEvent, item.id);
            }}
            onPointerUp={(pointerEvent) => {
              if (draggingId !== item.id) return;
              const position = updatePosition(pointerEvent, item.id);
              if (pointerEvent.currentTarget.hasPointerCapture(pointerEvent.pointerId)) {
                pointerEvent.currentTarget.releasePointerCapture(pointerEvent.pointerId);
              }
              setDraggingId(null);
              if (position) {
                collectIfDroppedInBin(item.id, position.x, position.y);
              }
            }}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            type="button"
          >
            <span aria-hidden="true" />
          </button>
        );
      })}
      {progress === 1 && <div className="mission-clear-stamp">수거 완료</div>}
      <div className={`scene-status status-${status}`} />
    </div>
  );
}
