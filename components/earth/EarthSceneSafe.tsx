"use client";

import { useProgress } from "@react-three/drei";
import { Component, type ReactNode, useCallback, useEffect, useState } from "react";
import { EarthFallback } from "@/components/earth/EarthFallback";
import { EarthScene } from "@/components/earth/EarthScene";
import type { ActiveEvent } from "@/features/game/types";

type EventSelectionHandler = (event: ActiveEvent, anchor: { x: number; y: number }) => void;

function canCreateWebGLContext() {
  const canvas = document.createElement("canvas");
  return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl"));
}

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

export function EarthSceneSafe({
  events,
  onSelectEvent
}: {
  events: ActiveEvent[];
  onSelectEvent?: EventSelectionHandler;
}) {
  const [sceneReady, setSceneReady] = useState(false);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const { active, progress } = useProgress();
  const handleReady = useCallback(() => setSceneReady(true), []);

  useEffect(() => {
    setSceneReady(false);
    setWebGlSupported(canCreateWebGLContext());
  }, []);

  if (!webGlSupported) {
    return <EarthFallback label="WebGL을 사용할 수 없어 대체 지구본 표시 중" progress={100} />;
  }

  return (
    <EarthSceneErrorBoundary fallback={<EarthFallback />}>
      <div className="earth-scene-shell">
        <EarthScene events={events} onReady={handleReady} onSelectEvent={onSelectEvent} />
        <div className={`earth-loading-overlay${sceneReady ? " earth-loading-overlay-hidden" : ""}`}>
          <EarthFallback label={active ? "지구 텍스처 로딩 중" : "지구본 준비 중"} progress={sceneReady ? 100 : progress} />
        </div>
      </div>
    </EarthSceneErrorBoundary>
  );
}
