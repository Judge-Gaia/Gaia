"use client";

import { useState } from "react";
import Link from "next/link";
import { LobbyHeader } from "@/components/LobbyHeader";
import { SdgDetailModal, Target } from "@/components/SdgDetailModal";
import { AlertTriangle, Flame, Trees, Flower, ArrowRight, Compass, Maximize2 } from "lucide-react";

export default function Sdg15Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const targets: Target[] = [
    {
      code: "15.1",
      title: "육상 및 담수 생태계 보전 복원",
      description: "국제협약에 따라 산림, 습지, 산악 및 건조 지대 등 담수를 포함한 모든 육상 생태계와 그 자원의 보전, 복원 및 지속가능한 이용을 법적으로 보장합니다."
    },
    {
      code: "15.2",
      title: "산림 훼손 방지 및 지속가능한 조림",
      description: "지속가능한 방식으로 산림을 관리하며, 무분별한 불법 벌목 및 파괴를 중단하고, 훼손지 조림(나무 심기) 사업을 대폭 활성화합니다."
    },
    {
      code: "15.5",
      title: "서식지 보호 및 멸종위기 방지",
      description: "생물다양성의 손실을 방지하기 위해 자연적 야생 서식지의 훼손을 최소화하고, 긴급 조치를 수립하여 멸종위기종의 절멸을 예방합니다."
    }
  ];

  const globalContext = {
    overview: "산림은 지구 육상 생물종의 80% 이상을 품고 있는 다양성의 보고이자 생태계의 허파입니다. 인류의 경제개발 요구에 의한 불법 벌목과 지구 기온 상승에 기인한 대형 폭염성 산불은 숲을 순식간에 탄소 흡수원에서 배출원으로 변모시키고 있습니다.",
    stats: [
      "매년 소실되는 숲의 면적은 축구장 36개 규모에 달하며, 산림 상실은 대기 정화 기능 저하와 토양 유실을 초래합니다.",
      "IUCN 적색 목록에 등록된 4만 종 이상의 생물들이 기후 서식지 붕괴로 인해 멸종 문턱에 처해 있습니다.",
      "인류의 자원 소비율은 지구가 자생적으로 정화하고 재생할 수 있는 능력을 1.7배 초과(생태 발자국 과부하)하여 소비하고 있습니다."
    ]
  };

  return (
    <main className="shell lobby-shell sdg-page-shell">
      <div className="noise" />
      <div className="space-backdrop" aria-hidden="true">
        <div className="sdg-grid-overlay" />
      </div>

      <LobbyHeader />

      <section className="sdg-content-container">
        {/* 상단 히어로 배너 (클릭 가능) */}
        <div 
          className="sdg-hero-banner sdg-15-theme interactive-banner" 
          onClick={() => setIsModalOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="상세 분석 보기 및 풀스크린 확대"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsModalOpen(true); }}
        >
          <div className="sdg-hero-img" style={{ backgroundImage: `url('/images/sdgs/sdg15.png')` }} />
          <div className="sdg-hero-overlay" />
          <div className="sdg-hero-text">
            <span className="sdg-badge">GOAL 15</span>
            <h1>육상생태계 보전</h1>
            <p className="english-title">Life on Land</p>
            <p className="sdg-slogan">"육상 생태계의 보호, 복원 및 지속가능한 이용, 산림 관리, 사막화 방지, 토양 황폐화 중단 및 생물 다양성 손실 방지"</p>
          </div>
          <div className="banner-interact-hint">
            <Maximize2 size={16} />
            <span>상세 데이터 및 풀스크린 뷰</span>
          </div>
        </div>

        <div className="sdg-grid-layout">
          {/* 1. 위기 상황 모니터링 터미널 */}
          <div className="cyber-panel sdg-card terminal-card">
            <div className="sdg-card-header">
              <div className="header-dot red-dot animate-pulse" />
              <h3>육상위기 실시간 관제 데이터</h3>
            </div>
            <div className="terminal-body">
              <div className="metric-row">
                <div className="metric-label">
                  <Trees size={16} /> 연간 산림 소실 면적
                </div>
                <div className="metric-bar-container">
                  <div className="metric-bar-fill red" style={{ width: "82%" }} />
                </div>
                <div className="metric-value text-red">1,000만 ha / 년</div>
              </div>
              <div className="metric-subtext">매분 축구장 36개 크기의 원시림이 농지개간 및 벌목으로 훼손</div>

              <div className="metric-row">
                <div className="metric-label">
                  <AlertTriangle size={16} /> 멸종 위기 동식물 수
                </div>
                <div className="metric-bar-container">
                  <div className="metric-bar-fill orange" style={{ width: "78%" }} />
                </div>
                <div className="metric-value text-orange">40,000+ 종</div>
              </div>
              <div className="metric-subtext">세계 자연 보전 연맹(IUCN) 지정, 서식지 상실로 인한 멸종 기로</div>

              <div className="metric-row">
                <div className="metric-label">
                  <Flower size={16} /> 글로벌 사막화 비율
                </div>
                <div className="metric-bar-container">
                  <div className="metric-bar-fill yellow" style={{ width: "66%" }} />
                </div>
                <div className="metric-value text-yellow">전체 토지의 33%</div>
              </div>
              <div className="metric-subtext">지나친 목축과 경작, 기후 건조화로 땅의 회복력 및 수분 완전 상실</div>
            </div>
          </div>

          {/* 2. 가이아 복구 작전 정보 */}
          <div className="cyber-panel sdg-card operation-card">
            <div className="sdg-card-header">
              <div className="header-dot cyan-dot" />
              <h3>GAIA 대응 작전 가이드</h3>
            </div>
            <div className="operation-body">
              <p className="op-intro">현재 가이아 시뮬레이터에서 육상 환경 보전을 위한 2개의 핵심 미션을 지원하고 있습니다.</p>
              
              <div className="op-item">
                <div className="op-icon-box">
                  <Flame size={24} className="text-cyan" />
                </div>
                <div className="op-info">
                  <h4>기후 폭염성 대형 산불 진압</h4>
                  <p>건조한 대기와 풍속으로 빠르게 확산하는 불길에 <b>물뿌리개</b> 스킬을 사용하여 물을 연속 분사하고, 불씨를 조기 진압하여 야생 서식지를 구출하세요.</p>
                </div>
              </div>

              <div className="op-item">
                <div className="op-icon-box">
                  <Trees size={24} className="text-cyan" />
                </div>
                <div className="op-info">
                  <h4>무분별한 불법 벌목지 복원 (식수 조림)</h4>
                  <p>벌거숭이가 되어 파괴된 산림의 토양 훼손을 막기 위해 비어있는 묘판에 <b>생장 씨앗</b> 스킬을 뿌려 어린 묘목들을 신속히 심고 생육을 유도하세요.</p>
                </div>
              </div>

              <a 
                href="https://sdgs.un.org/goals/goal15" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="primary-button op-btn"
              >
                <Compass size={18} />
                UN SDG 15 공식 문서 확인
                <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* 3. 실천 수칙 터미널 */}
          <div className="cyber-panel sdg-card protocol-card">
            <div className="sdg-card-header">
              <div className="header-dot green-dot" />
              <h3>실천 행동 프로토콜</h3>
            </div>
            <div className="protocol-body">
              <div className="protocol-item">
                <span className="proto-num">01</span>
                <div>
                  <strong>종이 타월 대신 손수건 사용, 이중 종이 인쇄 지양</strong>
                  <p>나무에서 추출하는 펄프 소비를 감축하기 위해 종이 사용을 지양하고 디지털 문서를 적극 이용합니다.</p>
                </div>
              </div>
              <div className="protocol-item">
                <span className="proto-num">02</span>
                <div>
                  <strong>산림 보호 구역에서의 불씨 관리 및 화재 예방</strong>
                  <p>입산 시 인화물질 휴대를 일절 차단하며, 지정되지 않은 장소에서의 취사 행위를 엄금하여 산불을 예방합니다.</p>
                </div>
              </div>
              <div className="protocol-item">
                <span className="proto-num">03</span>
                <div>
                  <strong>야생 생물 및 식물의 무분별한 채취 금지</strong>
                  <p>동물 밀렵이나 식물의 불법 채취는 복합적인 먹이사슬을 무너뜨리므로, 불법 밀거래를 신고하고 근절에 동참합니다.</p>
                </div>
              </div>
              <div className="protocol-item">
                <span className="proto-num">04</span>
                <div>
                  <strong>FSC 산림인증 친환경 목재/제지 상품 구매</strong>
                  <p>지속가능하게 가꾸어진 삼림에서 생산된 제품임을 인증하는 FSC(Forest Stewardship Council) 마크를 확인합니다.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 풀스크린 상세 오버레이 모달 */}
      <SdgDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="육상생태계 보전"
        number={15}
        imageUrl="/images/sdgs/sdg15.png"
        slogan="육상 생태계의 보호, 복원 및 지속가능한 이용, 산림 관리, 사막화 방지, 토양 황폐화 중단 및 생물 다양성 손실 방지"
        targets={targets}
        globalContext={globalContext}
      />
    </main>
  );
}
