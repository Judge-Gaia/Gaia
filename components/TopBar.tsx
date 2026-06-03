import { Leaf } from "lucide-react";

export function TopBar({ right }: { right?: React.ReactNode }) {
  return (
    <header className="topbar">
      <div className="brand" aria-label="GAIA">
        <div className="brand-mark pulsing-brand">
          <Leaf size={20} aria-hidden="true" />
        </div>
        <div>
          <div className="brand-title">GAIA</div>
          <div className="brand-subtitle">글로벌 생태 복구 프로토콜</div>
        </div>
      </div>
      {right}
    </header>
  );
}

