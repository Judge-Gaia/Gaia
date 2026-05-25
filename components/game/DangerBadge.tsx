import type { DangerStatus } from "@/features/game/types";

const labels: Record<DangerStatus, string> = {
  yellow: "노랑",
  orange: "주황",
  red: "빨강",
  black: "검정"
};

const colors: Record<DangerStatus, string> = {
  yellow: "var(--yellow)",
  orange: "var(--orange)",
  red: "var(--red)",
  black: "var(--black)"
};

export function DangerBadge({ status }: { status: DangerStatus }) {
  return (
    <div className="danger">
      <span className="danger-dot" style={{ background: colors[status] }} aria-hidden="true" />
      <strong>위험도 {labels[status]}</strong>
    </div>
  );
}

