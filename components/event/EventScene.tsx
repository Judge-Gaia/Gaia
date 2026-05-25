import type { CSSProperties } from "react";
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

export function EventScene({
  eventId,
  status,
  activeSkill,
  suppressionProgress = 0
}: {
  eventId: string;
  status: DangerStatus;
  activeSkill?: SkillId | null;
  suppressionProgress?: number;
}) {
  const event = eventById.get(eventId);

  if (!event) return null;
  const sceneStyle = {
    "--fire-intensity": String(Math.max(0.08, 1 - suppressionProgress)),
    "--cleanup-progress": String(suppressionProgress)
  } as CSSProperties;

  return (
    <div className={`event-scene ${event.sceneClass}`} aria-label={event.title} style={sceneStyle}>
      <div className="scene-sky" />
      <div className="scene-atmosphere" />
      <div className="scene-weather" />
      <div className="scene-ground" />
      <div className="scene-depth" />
      <div className="scene-vignette" />
      <div className="scene-scanlines" />

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

      {event.sceneClass === "wildfire" && (
        <>
          <div className="scene-object mountain-range" />
          <div className="scene-object mountain-range mountain-range-far" />
          <div
            className={`scene-object fire ${activeSkill === "rain" ? "suppressed" : ""}`}
          />
          {activeSkill === "rain" && <div className="scene-rain" />}
        </>
      )}
      {event.sceneClass === "ocean_trash" && (
        <div className={`scene-object trash ${activeSkill === "wind" ? "clearing" : ""}`} />
      )}
      {event.sceneClass === "oil_spill" && (
        <div className={`scene-object oil ${activeSkill === "purify" ? "clearing" : ""}`} />
      )}
      {event.sceneClass === "illegal_logging" && (
        <>
          <div className="scene-object stumps" />
          <div className={`scene-object regrowth ${activeSkill === "grow" ? "active" : ""}`} />
        </>
      )}
      {event.sceneClass === "air_pollution" && (
        <div className={`scene-object smog ${activeSkill === "wind" ? "clearing" : ""}`} />
      )}
      {event.sceneClass === "drought" && (
        <>
          <div className={`scene-object cracks ${activeSkill === "rain" ? "wetting" : ""}`} />
          {activeSkill === "rain" && <div className="scene-rain" />}
        </>
      )}
      <div className={`scene-status status-${status}`} />
    </div>
  );
}
