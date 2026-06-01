"use client";

import { ArrowRight, CheckCircle2, Globe2, HandHeart, Scale, Sparkles } from "lucide-react";

type ResolutionNotice = {
  title: string;
  message: string;
  realWorldContext: string;
  lawOrPolicy: string;
  actionHint: string;
};

export function ResolutionModal({
  notice,
  onConfirm
}: {
  notice: ResolutionNotice;
  onConfirm: () => void;
}) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="resolution-title">
      <div className="modal resolution-modal">
        <div className="resolution-burst" aria-hidden="true" />
        <header className="resolution-head">
          <span className="resolution-badge" aria-hidden="true">
            <CheckCircle2 size={30} />
          </span>
          <div>
            <span className="resolution-kicker">현장 복구 완료</span>
            <h2 id="resolution-title">{notice.title}</h2>
          </div>
        </header>

        <p className="resolution-lead">
          <Sparkles size={18} aria-hidden="true" />
          {notice.message}
        </p>

        <div className="resolution-cards">
          <section className="resolution-card">
            <h3>
              <Globe2 size={16} aria-hidden="true" /> 현장 영향
            </h3>
            <p>{notice.realWorldContext}</p>
          </section>
          <section className="resolution-card">
            <h3>
              <Scale size={16} aria-hidden="true" /> 법·제도
            </h3>
            <p>{notice.lawOrPolicy}</p>
          </section>
          <section className="resolution-card resolution-card-action">
            <h3>
              <HandHeart size={16} aria-hidden="true" /> 우리가 할 수 있는 일
            </h3>
            <p>{notice.actionHint}</p>
          </section>
        </div>

        <div className="modal-actions">
          <button className="primary-button" onClick={onConfirm}>
            다음 현장으로
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
