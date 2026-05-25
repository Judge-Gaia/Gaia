"use client";

import { Droplets, Sparkles, Sprout, Wind } from "lucide-react";
import { skills } from "@/features/game/game-data";
import type { SkillId } from "@/features/game/types";

const icons = {
  rain: Droplets,
  wind: Wind,
  purify: Sparkles,
  grow: Sprout
};

export function SkillDeck({
  disabled,
  onUse
}: {
  disabled?: boolean;
  onUse: (skillId: SkillId) => void;
}) {
  return (
    <div className="skill-bar" aria-label="스킬">
      {skills.map((skill) => {
        const Icon = icons[skill.id];
        return (
          <button
            className="skill-button"
            disabled={disabled}
            key={skill.id}
            onClick={() => onUse(skill.id)}
            title={skill.description}
          >
            <Icon size={28} aria-hidden="true" />
            <strong>{skill.name}</strong>
          </button>
        );
      })}
    </div>
  );
}

