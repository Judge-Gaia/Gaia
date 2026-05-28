"use client";

export function EarthFallback({
  label = "지구본 로딩 중",
  progress
}: {
  label?: string;
  progress?: number;
}) {
  const displayProgress = typeof progress === "number" ? Math.min(100, Math.max(0, Math.round(progress))) : null;

  return (
    <div className="earth-canvas earth-fallback" role="img" aria-label="우주 배경">
      <div className="earth-loading-status" role="status" aria-live="polite">
        <span>{label}</span>
        {displayProgress !== null && (
          <>
            <strong>{displayProgress}%</strong>
            <div className="earth-loading-track" aria-hidden="true">
              <div className="earth-loading-fill" style={{ width: `${displayProgress}%` }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
