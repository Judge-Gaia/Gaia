import { Leaf } from "lucide-react";

export function TopBar({ right }: { right?: React.ReactNode }) {
  return (
    <header className="topbar">
      <div className="brand" aria-label="GAIA">
        <div className="brand-mark">
          <Leaf size={22} aria-hidden="true" />
        </div>
        <div>
          <div className="brand-title">GAIA</div>
          <div className="brand-subtitle">planet rescue protocol</div>
        </div>
      </div>
      {right}
    </header>
  );
}

