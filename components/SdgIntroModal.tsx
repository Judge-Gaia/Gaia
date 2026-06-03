"use client";

import { useState, useEffect } from "react";
import { Info, ArrowRight, CheckSquare, Square, ExternalLink } from "lucide-react";

interface SdgIntroModalProps {
  isOpen: boolean;
  onClose: (hideToday: boolean) => void;
}

export function SdgIntroModal({ isOpen, onClose }: SdgIntroModalProps) {
  const [hideToday, setHideToday] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="sdg-intro-backdrop" role="dialog" aria-modal="true">
      <div className="sdg-intro-container cyber-panel">
        {/* 네온 모서리 */}
        <div className="hud-corner-marker top-left"></div>
        <div className="hud-corner-marker top-right"></div>
        <div className="hud-corner-marker bottom-left"></div>
        <div className="hud-corner-marker bottom-right"></div>

        <div className="sdg-intro-header">
          <Info className="text-cyan animate-pulse" size={20} />
          <h2>[SYSTEM BRIEFING] 생태 정화 전술 프로토콜</h2>
        </div>

        <div className="sdg-intro-body">
          <p className="intro-lead">
            지속가능발전목표(SDGs, Sustainable Development Goals)는 인류의 번영과 지구 환경의 회복을 위해 UN이 수립한 17개의 전 지구적 공동 목표입니다.
          </p>

          <div className="intro-explanation-card">
            <h4>GAIA 프로젝트와 SDGs의 연결</h4>
            <p>
              본 GAIA 관제소 시뮬레이터는 17개의 지속가능발전목표 중 환경 위기와 밀접하게 결합된 3개의 핵심 행동 강령을 다루고 있습니다:
            </p>
            <ul className="intro-sdg-list">
              <li>
                <span className="sdg-num-badge theme-13">13</span>
                <div>
                  <strong>기후변화 대응 (Climate Action)</strong>
                  <p>도시의 대기 오염 정화 및 사막화 방지 수로 활성화 미션</p>
                </div>
              </li>
              <li>
                <span className="sdg-num-badge theme-14">14</span>
                <div>
                  <strong>해양생태계 보전 (Life Below Water)</strong>
                  <p>해양 쓰레기 수거 분류 및 선박 사고 기름 유출 차단 미션</p>
                </div>
              </li>
              <li>
                <span className="sdg-num-badge theme-15">15</span>
                <div>
                  <strong>육상생태계 보전 (Life on Land)</strong>
                  <p>기후 대형 산불 조기 진압 및 훼손된 벌목 구역 숲 복원 미션</p>
                </div>
              </li>
            </ul>
          </div>

          <p className="intro-warning-text">
            ⚠️ 자연 재난은 검정(BLACK) 단계에 이르면 복구가 불가능합니다. 대원 여러분은 신속하게 관제 시뮬레이션에 참입하여 3대 생태계 보호 목표를 완수해야 합니다.
          </p>
        </div>

        <div className="sdg-intro-footer">
          {/* 오늘 하루 보지 않기 토글 */}
          <button 
            type="button" 
            className="hide-today-toggle" 
            onClick={() => setHideToday(!hideToday)}
            aria-label="오늘 하루 동안 보지 않기 설정 토글"
          >
            {hideToday ? (
              <CheckSquare size={18} className="text-cyan" />
            ) : (
              <Square size={18} className="text-muted" />
            )}
            <span>오늘 하루 동안 이 메시지 보지 않기</span>
          </button>

          <div className="footer-actions">
            <a 
              href="https://sdgs.un.org/goals" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="secondary-button intro-link-btn"
            >
              UN SDG 공식 안내 사이트
              <ExternalLink size={14} />
            </a>
            
            <button 
              type="button" 
              className="primary-button intro-confirm-btn" 
              onClick={() => onClose(hideToday)}
            >
              관제소 입장 (임무 개시)
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
