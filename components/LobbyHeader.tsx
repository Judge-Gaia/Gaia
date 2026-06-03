"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";

export function LobbyHeader() {
  const pathname = usePathname();

  const menuItems = [
    { label: "관제 본부", path: "/" },
    { label: "SDG 13 기후행동", path: "/sdgs/13" },
    { label: "SDG 14 해양생태계", path: "/sdgs/14" },
    { label: "SDG 15 육상생태계", path: "/sdgs/15" },
  ];

  return (
    <header className="lobby-topbar">
      <Link href="/" className="brand" aria-label="GAIA 관제 본부 홈으로 이동" style={{ textDecoration: "none" }}>
        <div className="brand-mark pulsing-brand">
          <Activity size={20} />
        </div>
        <div>
          <div className="brand-title">GAIA</div>
          <div className="brand-subtitle">생태 위협 통합 관제 본부</div>
        </div>
      </Link>

      <nav className="lobby-nav" aria-label="메인 네비게이션">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`lobby-nav-item ${isActive ? "active" : ""}`}
            >
              <span className="nav-glitch-text" data-text={item.label}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="lobby-stats">
        <span className="lobby-stat-pill secondary">
          시스템 상태: <b>정상 (SECURE)</b>
        </span>
      </div>
    </header>
  );
}
