"use client";

import { useEffect } from "react";
import { X, Shield, Globe2, BookOpen, AlertCircle } from "lucide-react";

export interface Target {
  code: string;
  title: string;
  description: string;
}

export interface SdgDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  number: number;
  imageUrl: string;
  slogan: string;
  targets: Target[];
  globalContext: {
    overview: string;
    stats: string[];
  };
}

export function SdgDetailModal({
  isOpen,
  onClose,
  title,
  number,
  imageUrl,
  slogan,
  targets,
  globalContext
}: SdgDetailModalProps) {
  // ESC 키 클릭 시 모달 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // 모달이 열리면 바디 스크롤을 막아 뒷배경 스크롤 방지
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="sdg-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="sdg-modal-container cyber-panel" 
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 이벤트 전파 차단
      >
        {/* 네온 모서리 데코레이터 */}
        <div className="hud-corner-marker top-left"></div>
        <div className="hud-corner-marker top-right"></div>
        <div className="hud-corner-marker bottom-left"></div>
        <div className="hud-corner-marker bottom-right"></div>

        {/* 닫기 버튼 */}
        <button 
          className="sdg-modal-close-btn" 
          onClick={onClose} 
          aria-label="상세보기 창 닫기"
        >
          <X size={20} />
        </button>

        <div className="sdg-modal-content-grid">
          {/* 좌측: 고해상도 이미지 영역 */}
          <div className="sdg-modal-image-panel">
            <div 
              className="sdg-modal-img" 
              style={{ backgroundImage: `url(${imageUrl})` }} 
              aria-label={`${title} 관련 고화질 그래픽 일러스트`}
            />
            <div className="sdg-modal-image-overlay" />
            <div className="sdg-modal-image-title-card">
              <span className="sdg-modal-badge">GOAL {number}</span>
              <h2>{title}</h2>
              <p className="sdg-modal-slogan">{slogan}</p>
            </div>
          </div>

          {/* 우측: 상세 데이터 대시보드 */}
          <div className="sdg-modal-data-panel">
            <div className="data-panel-inner">
              
              {/* SDG 핵심 정보 헤더 */}
              <div className="data-panel-title">
                <Globe2 size={18} className="text-cyan animate-pulse" />
                <h3>UN SDG 글로벌 프레임워크</h3>
              </div>

              {/* 1. 세부 목표 (UN Targets) */}
              <div className="data-section">
                <h4 className="section-subtitle">
                  <Shield size={14} /> 주요 세부 타겟 (UN Targets)
                </h4>
                <div className="targets-list">
                  {targets.map((target) => (
                    <div className="target-card" key={target.code}>
                      <span className="target-code">Target {target.code}</span>
                      <div className="target-info">
                        <h5>{target.title}</h5>
                        <p>{target.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. 글로벌 심층 분석 및 실태 */}
              <div className="data-section">
                <h4 className="section-subtitle">
                  <BookOpen size={14} /> 실태 심층 분석 (Global Analysis)
                </h4>
                <div className="context-card">
                  <p className="context-overview">{globalContext.overview}</p>
                  <div className="context-stats-grid">
                    {globalContext.stats.map((stat, idx) => (
                      <div className="context-stat-item" key={idx}>
                        <AlertCircle size={14} className="text-orange" />
                        <span>{stat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
