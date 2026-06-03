"use client";

import { useState } from "react";
import Link from "next/link";
import { LobbyHeader } from "@/components/LobbyHeader";
import { SdgDetailModal, Target } from "@/components/SdgDetailModal";
import { AlertTriangle, Droplet, Fish, Anchor, ArrowRight, Compass, Maximize2 } from "lucide-react";

export default function Sdg14Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const targets: Target[] = [
    {
      code: "14.1",
      title: "육상 배출원 해양 오염 감소",
      description: "2025년까지 플라스틱 폐기물, 영양 염류 등을 포함한 모든 육상 활동에서 비롯되는 해양 생태계 오염 물질을 예방 및 감축합니다."
    },
    {
      code: "14.2",
      title: "해양 및 연안 생태계 지속 보전",
      description: "해양 생태계의 파괴적 영향을 피하기 위해 연안 생태계를 회복하고 지속가능하게 관리하며, 훼손된 해역의 복원을 가속화합니다."
    },
    {
      code: "14.5",
      title: "연안 및 해양 보존구역 지정",
      description: "지속가능한 해양 자원의 확보를 위해 과학적 정보를 바탕으로 생물다양성이 풍부한 연안 및 해양 지역의 최소 10% 이상을 법적 보존구역으로 지정합니다."
    }
  ];

  const globalContext = {
    overview: "대양과 바다는 지구 온도 조절과 물 순환 시스템의 핵심 엔진이며, 온실가스로 인한 과잉 열량의 90% 이상을 흡수해 기후 위기의 방패막이 역할을 해주고 있습니다. 그러나 매년 유입되는 플라스틱 쓰레기와 대형 선박 기름 사고, 해양 산성화로 인해 해양 먹이사슬이 근본적으로 붕괴되고 있습니다.",
    stats: [
      "매년 약 800만 톤의 플라스틱 폐기물이 바다로 배출되며, 미세플라스틱 입자는 심해어부터 극지방 생물 체내까지 검출되고 있습니다.",
      "태평양 거대 쓰레기 지대(GPGP)의 규모는 약 160만 km²로 대한민국 영토 면적의 16배가 넘으며 소용돌이 조류를 타고 빠르게 확장 중입니다.",
      "플라스틱 컵은 자연 분해에 약 450년이 소요되며 폐어망, 낚싯줄 등은 수백 년간 해양 생물을 무단 포획(Ghost Fishing)하는 주원인입니다."
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
          className="sdg-hero-banner sdg-14-theme interactive-banner" 
          onClick={() => setIsModalOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="상세 분석 보기 및 풀스크린 확대"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsModalOpen(true); }}
        >
          <div className="sdg-hero-img" style={{ backgroundImage: `url('/images/sdgs/sdg14.png')` }} />
          <div className="sdg-hero-overlay" />
          <div className="sdg-hero-text">
            <span className="sdg-badge">GOAL 14</span>
            <h1>해양생태계 보전</h1>
            <p className="english-title">Life Below Water</p>
            <p className="sdg-slogan">"지속가능발전을 위한 대양, 바다, 해양자원의 보전과 지속가능한 사용"</p>
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
              <h3>해양위기 실시간 관제 데이터</h3>
            </div>
            <div className="terminal-body">
              <div className="metric-row">
                <div className="metric-label">
                  <Anchor size={16} /> 누적 해양 플라스틱 쓰레기
                </div>
                <div className="metric-bar-container">
                  <div className="metric-bar-fill red" style={{ width: "90%" }} />
                </div>
                <div className="metric-value text-red">1.5억 톤</div>
              </div>
              <div className="metric-subtext">매년 800만 톤 이상의 일회용 플라스틱이 바다로 추가 유입</div>

              <div className="metric-row">
                <div className="metric-label">
                  <Fish size={16} /> 산호초 백화 및 손상율
                </div>
                <div className="metric-bar-container">
                  <div className="metric-bar-fill orange" style={{ width: "70%" }} />
                </div>
                <div className="metric-value text-orange">50% 이상</div>
              </div>
              <div className="metric-subtext">수온 상승 및 이산화탄소 해양 흡수로 인한 백화 현상</div>

              <div className="metric-row">
                <div className="metric-label">
                  <AlertTriangle size={16} /> 해양 산성화 수준
                </div>
                <div className="metric-bar-container">
                  <div className="metric-bar-fill yellow" style={{ width: "60%" }} />
                </div>
                <div className="metric-value text-yellow">pH 8.1 (30%↑)</div>
              </div>
              <div className="metric-subtext">산업혁명 대비 약 30% 산성화되어 패각 생물 생태 위험성 증폭</div>
            </div>
          </div>

          {/* 2. 가이아 복구 작전 정보 */}
          <div className="cyber-panel sdg-card operation-card">
            <div className="sdg-card-header">
              <div className="header-dot cyan-dot" />
              <h3>GAIA 대응 작전 가이드</h3>
            </div>
            <div className="operation-body">
              <p className="op-intro">현재 가이아 시뮬레이터에서 해양 환경 정화를 위한 2개의 핵심 미션을 지원하고 있습니다.</p>
              
              <div className="op-item">
                <div className="op-icon-box">
                  <Anchor size={24} className="text-cyan" />
                </div>
                <div className="op-info">
                  <h4>해양 플라스틱 쓰레기 수거 및 분류</h4>
                  <p>바다에 무단 투기된 플라스틱, 캔, 유리병이 조류를 타고 넓게 흩어지기 전에 <b>분리수거 집게</b>와 <b>염력 바람</b>으로 수거함에 올바르게 분리배출하세요.</p>
                </div>
              </div>

              <div className="op-item">
                <div className="op-icon-box">
                  <Droplet size={24} className="text-cyan" />
                </div>
                <div className="op-info">
                  <h4>해양 기름 유출 방제 (오일펜스 설치)</h4>
                  <p>선박 사고 등으로 유출된 원유가 번지지 않도록 <b>오일펜스</b>로 영역을 격리한 후, <b>정화 흡착기</b>와 방제선으로 검은 기름띠를 깨끗하게 회수하세요.</p>
                </div>
              </div>

              <a 
                href="https://sdgs.un.org/goals/goal14" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="primary-button op-btn"
              >
                <Compass size={18} />
                UN SDG 14 공식 문서 확인
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
                  <strong>일회용 플라스틱 및 비닐 줄이기</strong>
                  <p>텀블러, 에코백, 실리콘 다회용 백 등을 적극적으로 활용하여 미세플라스틱의 발생을 차단합니다.</p>
                </div>
              </div>
              <div className="protocol-item">
                <span className="proto-num">02</span>
                <div>
                  <strong>친환경 세제 사용 및 수질오염 예방</strong>
                  <p>가정에서 사용되어 방출되는 샴푸, 합성세제 사용량을 줄이고 친환경 원료 제품을 선택합니다.</p>
                </div>
              </div>
              <div className="protocol-item">
                <span className="proto-num">03</span>
                <div>
                  <strong>해양 지속가능 인증 수산물 소비</strong>
                  <p>과도한 남획을 유도하는 무분별한 어획물을 소비하지 않고, 신뢰받는 해양 관리 연합(MSC) 마크 제품을 확인합니다.</p>
                </div>
              </div>
              <div className="protocol-item">
                <span className="proto-num">04</span>
                <div>
                  <strong>해변 쓰레기 줍기 (비치코밍) 실천</strong>
                  <p>바닷가 방문 시 쓰레기를 가져오고 버려진 쓰레기를 줍는 정화 활동에 자발적으로 참여합니다.</p>
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
        title="해양생태계 보전"
        number={14}
        imageUrl="/images/sdgs/sdg14.png"
        slogan="지속가능발전을 위한 대양, 바다, 해양자원의 보전과 지속가능한 사용"
        targets={targets}
        globalContext={globalContext}
      />
    </main>
  );
}
