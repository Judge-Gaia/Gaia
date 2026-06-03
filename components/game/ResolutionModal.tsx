"use client";

import { useEffect } from "react";
import { ArrowRight, CheckCircle2, Globe2, HandHeart, Scale, Sparkles } from "lucide-react";
import type { SdgInfo } from "@/features/game/types";

type ResolutionNotice = {
  title: string;
  message: string;
  realWorldContext: string;
  lawOrPolicy: string;
  actionHint: string;
  sdgInfo?: SdgInfo;
};

export function ResolutionModal({
  notice,
  onConfirm
}: {
  notice: ResolutionNotice;
  onConfirm: () => void;
}) {
  // 스피드러너를 위한 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
        event.preventDefault();
        onConfirm();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onConfirm]);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="resolution-title">
      <div className="cyber-panel modal resolution-modal">
        {/* HUD 모서리 장식 */}
        <div className="hud-corner-marker top-left"></div>
        <div className="hud-corner-marker top-right"></div>
        <div className="hud-corner-marker bottom-left"></div>
        <div className="hud-corner-marker bottom-right"></div>

        {notice.sdgInfo && (
          <div className="resolution-modal-sdg">
            <span className={`sdg-badge sdg-badge-${notice.sdgInfo.number}`}>
              SDG {notice.sdgInfo.number} · {notice.sdgInfo.title}
            </span>
          </div>
        )}

        <div className="resolution-burst" aria-hidden="true" />
        <header className="resolution-head">
          <span className="resolution-badge" aria-hidden="true">
            <CheckCircle2 size={24} className="badge-glow-icon" />
          </span>
          <div className="resolution-head-text">
            <span className="resolution-kicker">생태 환경 복구 성공</span>
            <h2 id="resolution-title" className="mono-num">{notice.title}</h2>
          </div>
        </header>

        <p className="resolution-lead">
          <Sparkles size={16} aria-hidden="true" style={{ color: "var(--yellow)" }} />
          {notice.message}
        </p>

        <div className="resolution-cards">
          <section className="resolution-card border-cyan">
            <h3>
              <Globe2 size={14} aria-hidden="true" /> 현장 영향 및 사실
            </h3>
            <p>{notice.realWorldContext}</p>
          </section>
          
          <section className="resolution-card border-violet">
            <h3>
              <Scale size={14} aria-hidden="true" /> 환경 법·제도 및 정책
            </h3>
            <p>{notice.lawOrPolicy}</p>
          </section>
          
          <section className="resolution-card resolution-card-action border-green">
            <h3>
              <HandHeart size={14} aria-hidden="true" /> 우리가 할 수 있는 일
            </h3>
            <p>{notice.actionHint}</p>
          </section>
        </div>

        <div className="modal-actions">
          <button className="primary-button pulse-glow" onClick={onConfirm} type="button">
            다음 현장으로
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <div className="shortcut-hint">[Space] 또는 [Enter] 키를 눌러 스킵할 수 있습니다.</div>
        </div>
      </div>
    </div>
  );
}
