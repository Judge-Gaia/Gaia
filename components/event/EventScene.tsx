import Image from "next/image";
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
    "--cleanup-progress": String(suppressionProgress)
  } as CSSProperties;

  return (
    <div
      className={`event-scene ${event.sceneClass} ${activeSkill ? "responding" : ""}`}
      aria-label={event.title}
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

      {activeSkill === "rain" && <div className="scene-rain" />}
      <div className={`scene-status status-${status}`} />
    </div>
  );
}
