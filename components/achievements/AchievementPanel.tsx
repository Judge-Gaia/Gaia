import { Award } from "lucide-react";
import type { Achievement } from "@/features/game/types";

export function AchievementPanel({ achievements }: { achievements: Achievement[] }) {
  return (
    <aside className="cyber-panel side-panel achievements-panel-widget" aria-label="업적">
      {/* HUD 모서리 데코레이션 */}
      <div className="hud-corner-marker top-left"></div>
      <div className="hud-corner-marker top-right"></div>
      <div className="hud-corner-marker bottom-left"></div>
      <div className="hud-corner-marker bottom-right"></div>

      <h2 className="panel-title">
        <Award size={16} aria-hidden="true" />
        획득한 업적
      </h2>
      {achievements.length === 0 ? (
        <p className="empty-text">획득한 업적이 없습니다. 환경 파괴 현장을 해결하여 임무 배지를 획득하세요.</p>
      ) : (
        <ul className="achievement-list scroll-container">
          {achievements.map((achievement) => (
            <li className="achievement-item animate-slide-up" key={achievement.id}>
              <strong>{achievement.title}</strong>
              <span className="muted">{achievement.description}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
