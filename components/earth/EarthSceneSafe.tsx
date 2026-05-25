"use client";

import { Component, type ReactNode } from "react";
import { EarthScene } from "@/components/earth/EarthScene";
import type { ActiveEvent } from "@/features/game/types";

class EarthSceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("EarthScene crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function EarthFallback() {
  return (
    <div className="earth-canvas earth-fallback" role="img" aria-label="우주 배경">
      <div className="earth-fallback-glow" />
    </div>
  );
}

export function EarthSceneSafe({ events }: { events: ActiveEvent[] }) {
  return (
    <EarthSceneErrorBoundary fallback={<EarthFallback />}>
      <EarthScene events={events} />
    </EarthSceneErrorBoundary>
  );
}

