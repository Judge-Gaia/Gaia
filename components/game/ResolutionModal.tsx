"use client";

import { CheckCircle2 } from "lucide-react";

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
      <div className="modal">
        <h2 id="resolution-title">
          <CheckCircle2 size={26} aria-hidden="true" /> {notice.title} 해결
        </h2>
        <p>
          <strong>{notice.message}</strong>
        </p>
        <p>{notice.realWorldContext}</p>
        <p>{notice.lawOrPolicy}</p>
        <p>{notice.actionHint}</p>
        <div className="modal-actions">
          <button className="primary-button" onClick={onConfirm}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

