"use client";

import type { ComponentType } from "react";
import type { DangerStatus } from "@/features/game/types";
import { AirMission } from "./AirMission";
import { DroughtMission } from "./DroughtMission";
import { LoggingMission } from "./LoggingMission";
import { OceanTrashMission } from "./OceanTrashMission";
import { OilSpillMission } from "./OilSpillMission";
import { WildfireMission } from "./WildfireMission";

type MissionProps = {
  disabled?: boolean;
  status: DangerStatus;
  onComplete: () => void;
};

const missions: Record<string, ComponentType<MissionProps>> = {
  wildfire: WildfireMission,
  ocean_trash: OceanTrashMission,
  oil_spill: OilSpillMission,
  illegal_logging: LoggingMission,
  air_pollution: AirMission,
  drought: DroughtMission
};

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
  const Mission = missions[eventId] ?? WildfireMission;
  return <Mission disabled={disabled} status={status} onComplete={onComplete} />;
}
