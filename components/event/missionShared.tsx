"use client";

import { type CSSProperties, type HTMLAttributes, type ReactNode, type Ref } from "react";
import type { DangerStatus } from "@/features/game/types";

/** Clamp a value into the [min, max] range. */
export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

/** Convert a pointer position into stage-relative percentages (0–100). */
export function pointerToPercent(
  clientX: number,
  clientY: number,
  element: HTMLElement,
  pad = 0
) {
  const bounds = element.getBoundingClientRect();
  const x = ((clientX - bounds.left) / bounds.width) * 100;
  const y = ((clientY - bounds.top) / bounds.height) * 100;
  return { x: clamp(x, pad, 100 - pad), y: clamp(y, pad, 100 - pad) };
}

export function distance(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

export type GaugeTone = "water" | "energy" | "wind" | "warn";

/**
 * Shared mission heads-up display. A floating glass card that every mission
 * renders so the operations framing stays consistent across events.
 */
export function MissionHud({
  phase,
  title,
  instruction,
  progress,
  countLabel,
  badgeLabel,
  gauge
}: {
  phase: string;
  title: string;
  instruction: string;
  progress: number;
  countLabel: string;
  badgeLabel?: string;
  gauge?: { label: string; value: number; tone?: GaugeTone };
}) {
  return (
    <div
      className="mission-hud"
      role="status"
      style={{ "--mission-progress": String(clamp(progress, 0, 1)) } as CSSProperties}
    >
      <div className="mission-hud-main">
        <span className="mission-hud-phase">{phase}</span>
        <strong className="mission-hud-title">{title}</strong>
        <span className="mission-hud-instruction">{instruction}</span>
        {gauge && (
          <div className={`mission-gauge tone-${gauge.tone ?? "water"}`}>
            <span className="mission-gauge-label">
              {gauge.label}
              <b>{Math.round(clamp(gauge.value, 0, 1) * 100)}%</b>
            </span>
            <i style={{ "--gauge-fill": String(clamp(gauge.value, 0, 1)) } as CSSProperties} />
          </div>
        )}
      </div>
      <div className="mission-hud-side">
        <b className="mission-hud-count">{countLabel}</b>
        {badgeLabel && <small className="mission-hud-badge">{badgeLabel}</small>}
        <div className="mission-hud-track" aria-hidden="true">
          <i />
        </div>
      </div>
    </div>
  );
}

/** The celebratory stamp shown once a mission is solved. */
export function MissionClear({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return (
    <div className="mission-clear" role="alert">
      <span className="mission-clear-ring" aria-hidden="true" />
      <span className="mission-clear-text">{text}</span>
    </div>
  );
}

/**
 * Stage wrapper that all missions share. Renders the themed backdrop class,
 * the danger overlay, mission children, and the clear stamp.
 */
export function MissionStage({
  ariaLabel,
  className,
  status,
  disabled,
  style,
  cleared,
  clearText,
  children,
  stageRef,
  ...rest
}: {
  ariaLabel: string;
  className: string;
  status: DangerStatus;
  disabled: boolean;
  style?: CSSProperties;
  cleared: boolean;
  clearText: string;
  children: ReactNode;
  stageRef?: Ref<HTMLDivElement>;
} & Omit<HTMLAttributes<HTMLDivElement>, "className" | "style" | "aria-label">) {
  return (
    <div
      aria-label={ariaLabel}
      className={`event-scene mission-stage ${className} ${disabled ? "mission-disabled" : ""} ${
        cleared ? "mission-cleared" : ""
      }`}
      ref={stageRef}
      style={style}
      {...rest}
    >
      {children}
      <MissionClear show={cleared} text={clearText} />
      <div className={`scene-status status-${status}`} />
    </div>
  );
}
