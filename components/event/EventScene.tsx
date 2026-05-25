import { eventById } from "@/features/game/game-data";

export function EventScene({ eventId }: { eventId: string }) {
  const event = eventById.get(eventId);

  if (!event) return null;

  return (
    <div className={`event-scene ${event.sceneClass}`} aria-label={event.title}>
      <div className="scene-sky" />
      <div className="scene-ground" />
      {event.sceneClass === "wildfire" && <div className="scene-object fire" />}
      {event.sceneClass === "ocean_trash" && <div className="scene-object trash" />}
      {event.sceneClass === "oil_spill" && <div className="scene-object oil" />}
      {event.sceneClass === "illegal_logging" && <div className="scene-object stumps" />}
      {event.sceneClass === "air_pollution" && <div className="scene-object smog" />}
      {event.sceneClass === "drought" && <div className="scene-object cracks" />}
    </div>
  );
}

