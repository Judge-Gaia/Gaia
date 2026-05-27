"use client";

import Image from "next/image";
import { type CSSProperties, type PointerEvent, useEffect, useRef, useState } from "react";
import { ShowerHead, Sparkles, Sprout, WandSparkles } from "lucide-react";
import { eventById } from "@/features/game/game-data";
import type { DangerStatus, SkillId } from "@/features/game/types";

const sceneLabels: Record<string, string> = {
  wildfire: "열화상 스캔",
  ocean_trash: "해양 드론 뷰",
  oil_spill: "오염 분포 추적",
  illegal_logging: "산림 감시 위성",
  air_pollution: "대기 질 스캔",
  drought: "토양 수분 스캔"
};

const toolIcons = {
  rain: ShowerHead,
  wind: WandSparkles,
  purify: Sparkles,
  grow: Sprout
};

type CursorPosition = {
  x: number;
  y: number;
  visible: boolean;
  firing: boolean;
};

export function EventScene({
  eventId,
  status,
  activeSkill,
  interactionDisabled = false,
  suppressionProgress = 0,
  onOperate
}: {
  eventId: string;
  status: DangerStatus;
  activeSkill?: SkillId | null;
  interactionDisabled?: boolean;
  suppressionProgress?: number;
  onOperate?: (strength: number) => void;
}) {
  const event = eventById.get(eventId);
  const isFiringRef = useRef(false);
  const lastOperationRef = useRef(0);
  const operationIntervalRef = useRef<number | null>(null);
  const [cursor, setCursor] = useState<CursorPosition>({
    x: 50,
    y: 58,
    visible: false,
    firing: false
  });

  useEffect(() => () => {
    if (operationIntervalRef.current) {
      window.clearInterval(operationIntervalRef.current);
    }
  }, []);

  if (!event) return null;

  const ToolIcon = activeSkill ? toolIcons[activeSkill] : null;
  const isOperating = cursor.firing && !interactionDisabled;
  const sceneStyle = {
    "--cleanup-progress": String(suppressionProgress),
    "--pointer-x": `${cursor.x}%`,
    "--pointer-y": `${cursor.y}%`
  } as CSSProperties;

  const moveTool = (pointerEvent: PointerEvent<HTMLDivElement>, firing: boolean) => {
    const bounds = pointerEvent.currentTarget.getBoundingClientRect();
    const x = ((pointerEvent.clientX - bounds.left) / bounds.width) * 100;
    const y = ((pointerEvent.clientY - bounds.top) / bounds.height) * 100;
    setCursor({
      x: Math.min(98, Math.max(2, x)),
      y: Math.min(98, Math.max(2, y)),
      visible: Boolean(activeSkill),
      firing
    });
  };

  const operate = (strength: number) => {
    if (!activeSkill || interactionDisabled) return;
    const now = performance.now();
    if (now - lastOperationRef.current < 34) return;
    lastOperationRef.current = now;
    onOperate?.(strength);
  };

  const handlePointerDown = (pointerEvent: PointerEvent<HTMLDivElement>) => {
    if (!activeSkill || interactionDisabled) return;
    pointerEvent.currentTarget.setPointerCapture(pointerEvent.pointerId);
    isFiringRef.current = true;
    moveTool(pointerEvent, true);
    operate(0.042);
    if (operationIntervalRef.current) {
      window.clearInterval(operationIntervalRef.current);
    }
    operationIntervalRef.current = window.setInterval(() => {
      onOperate?.(0.018);
    }, 48);
  };

  const handlePointerMove = (pointerEvent: PointerEvent<HTMLDivElement>) => {
    const firing = isFiringRef.current;
    moveTool(pointerEvent, firing);
    if (firing) {
      operate(0.026);
    }
  };

  const stopOperating = (pointerEvent: PointerEvent<HTMLDivElement>) => {
    if (isFiringRef.current && pointerEvent.currentTarget.hasPointerCapture(pointerEvent.pointerId)) {
      pointerEvent.currentTarget.releasePointerCapture(pointerEvent.pointerId);
    }
    isFiringRef.current = false;
    if (operationIntervalRef.current) {
      window.clearInterval(operationIntervalRef.current);
      operationIntervalRef.current = null;
    }
    moveTool(pointerEvent, false);
  };

  return (
    <div
      className={`event-scene ${event.sceneClass} ${activeSkill ? "interactive-scene responding" : ""}`}
      aria-label={event.title}
      onPointerCancel={stopOperating}
      onPointerDown={handlePointerDown}
      onPointerLeave={() => {
        if (!isFiringRef.current) {
          setCursor((current) => ({ ...current, visible: false }));
        }
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={stopOperating}
      style={sceneStyle}
    >
      <Image
        alt=""
        className="scene-photo"
        fill
        priority
        sizes="(max-width: 920px) 100vw, calc(100vw - 352px)"
        src={event.sceneImage}
      />
      <Image
        alt=""
        className="scene-photo scene-photo-resolved"
        fill
        priority
        sizes="(max-width: 920px) 100vw, calc(100vw - 352px)"
        src={event.resolvedSceneImage}
      />
      <div className="scene-atmosphere" />
      <div className="scene-weather" />
      <div className="scene-depth" />
      <div className="scene-vignette" />
      <div className="scene-scanlines" />
      {activeSkill && <div className={`scene-response response-${activeSkill}`} />}

      <div className="scene-hud scene-hud-top">
        <span>SAT-LINK</span>
        <span>{sceneLabels[event.sceneClass] ?? "현장 스캔"}</span>
        <span>LIVE</span>
      </div>

      <div className="scene-hud scene-hud-bottom">
        <span>VIS 72%</span>
        <span>WIND 14km/h</span>
        <span>TEMP 31C</span>
      </div>

      {ToolIcon && cursor.visible && (
        <div className={`mission-tool tool-${activeSkill} ${isOperating ? "firing" : ""}`} aria-hidden="true">
          <ToolIcon size={32} />
          <div className="tool-action" />
        </div>
      )}
      {activeSkill === "rain" && isOperating && <div className="scene-rain localized-rain" />}
      <div className={`scene-status status-${status}`} />
    </div>
  );
}
