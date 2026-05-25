import { Award } from "lucide-react";
import type { Achievement } from "@/features/game/types";

export function AchievementPanel({ achievements }: { achievements: Achievement[] }) {
  return (
    <aside className="side-panel" aria-label="업적">
      <h2 className="panel-title">
        <Award size={18} aria-hidden="true" />
        업적
      </h2>
      {achievements.length === 0 ? (
        <p className="empty-text">아직 기록된 업적이 없습니다. 이벤트를 해결하면 이곳에 쌓입니다.</p>
      ) : (
        <ul className="achievement-list">
          {achievements.map((achievement) => (
            <li className="achievement-item" key={achievement.id}>
              <strong>{achievement.title}</strong>
              <span className="muted">{achievement.description}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

