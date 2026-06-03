"use client";

import { useState } from "react";
import Link from "next/link";
import { LobbyHeader } from "@/components/LobbyHeader";
import { SdgDetailModal, Target } from "@/components/SdgDetailModal";
import { AlertTriangle, Shield, Thermometer, Wind, Droplet, ArrowRight, Compass, Maximize2 } from "lucide-react";

export default function Sdg13Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const targets: Target[] = [
    {
      code: "13.1",
      title: "기후 재난 적응력 및 복원력 강화",
      description: "기후 관련 자연재해 및 기후 위기 피해에 대응하기 위한 글로벌 재난 극복 능력과 생태 회복 탄력성을 구축합니다."
    },
    {
      code: "13.2",
      title: "국가 정책에 기후 대응 제도 반영",
      description: "기후 변화 예방 정책과 감축 전략 조치를 모든 정부의 국가 정책, 예산 제도, 계획 수립 과정에 우선 반영합니다."
    },
    {
      code: "13.3",
      title: "기후 변화 교육 및 제도 개선",
      description: "기후 변화 예방 완화와 적응 교육 시스템을 강화하고, 조기 경보 체제에 대한 국민적 인식을 제고하며 역량을 개선합니다."
    }
  ];

  const globalContext = {
    overview: "파리기후협정에 따라 지구 온도 상승폭을 산업화 이전 대비 1.5°C 이내로 제한해야 인류 생존권이 안전하게 보장됩니다. 이를 위한 온실가스 잔여 방출 한계인 '탄소 예산(Carbon Budget)'은 점차 바닥나고 있으며, 기후 과학자들은 신속한 넷제로 정책만이 유일한 해결책이라고 경고하고 있습니다.",
    stats: [
      "현재 지구 평균 기온은 산업화 이전 대비 이미 1.15°C가량 상승하여 전 세계 가뭄 및 폭염 임계 수준을 넘어섰습니다.",
      "1.5°C 억제 마지노선을 지키려면 2030년까지 전 세계 온실가스 순 배출량을 2010년 대비 최소 45% 감축해야 합니다.",
      "이상 기후로 인한 사회경제적 기후 이주민 수가 2050년까지 최대 2억 명에 달할 수 있다는 관측이 나옵니다."
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
          className="sdg-hero-banner sdg-13-theme interactive-banner" 
          onClick={() => setIsModalOpen(true)}
          role="button"
          tabIndex={0}
          aria-label="상세 분석 보기 및 풀스크린 확대"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setIsModalOpen(true); }}
        >
          <div className="sdg-hero-img" style={{ backgroundImage: `url('/images/sdgs/sdg13.png')` }} />
          <div className="sdg-hero-overlay" />
          <div className="sdg-hero-text">
            <span className="sdg-badge">GOAL 13</span>
            <h1>기후변화 대응</h1>
            <p className="english-title">Climate Action</p>
            <p className="sdg-slogan">"기후변화와 그 영향을 방지하기 위한 긴급 조치"</p>
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
              <h3>기후위기 실시간 관제 데이터</h3>
            </div>
            <div className="terminal-body">
              <div className="metric-row">
                <div className="metric-label">
                  <Thermometer size={16} /> 지구 평균 기온 상승폭
                </div>
                <div className="metric-bar-container">
                  <div className="metric-bar-fill red" style={{ width: "76%" }} />
                </div>
                <div className="metric-value text-red">+1.15 °C</div>
              </div>
              <div className="metric-subtext">산업화 이전 대비 온도 편차 (마지노선 1.5°C 임박)</div>

              <div className="metric-row">
                <div className="metric-label">
                  <Wind size={16} /> 대기 중 CO₂ 농도
                </div>
                <div className="metric-bar-container">
                  <div className="metric-bar-fill orange" style={{ width: "84%" }} />
                </div>
                <div className="metric-value text-orange">420.8 ppm</div>
              </div>
              <div className="metric-subtext">안전 임계치(350ppm)를 훨씬 상회하는 기후 비상상태</div>

              <div className="metric-row">
                <div className="metric-label">
                  <AlertTriangle size={16} /> 글로벌 기후 재해 횟수
                </div>
                <div className="metric-bar-container">
                  <div className="metric-bar-fill yellow" style={{ width: "68%" }} />
                </div>
                <div className="metric-value text-yellow">410+ 회 / 년</div>
              </div>
              <div className="metric-subtext">폭염, 태풍, 가뭄 등 기후 파생형 대형 재난 발생 건수</div>
            </div>
          </div>

          {/* 2. 가이아 복구 작전 정보 */}
          <div className="cyber-panel sdg-card operation-card">
            <div className="sdg-card-header">
              <div className="header-dot cyan-dot" />
              <h3>GAIA 대응 작전 가이드</h3>
            </div>
            <div className="operation-body">
              <p className="op-intro">현재 가이아 시뮬레이터에서 기후변화 대응을 위한 2개의 핵심 미션을 지원하고 있습니다.</p>
              
              <div className="op-item">
                <div className="op-icon-box">
                  <Wind size={24} className="text-cyan" />
                </div>
                <div className="op-info">
                  <h4>도시 대기 오염 정화 (스모그 해소)</h4>
                  <p>스모그가 도시를 삼키기 전에 굴뚝에 <b>정화 필터</b>를 신속히 가동하고, <b>염력 바람</b> 스킬을 사용하여 정체된 매연을 대기 밖으로 배출하세요.</p>
                </div>
              </div>

              <div className="op-item">
                <div className="op-icon-box">
                  <Droplet size={24} className="text-cyan" />
                </div>
                <div className="op-info">
                  <h4>사막화 방지 및 가뭄 복구 (관개 수로 연결)</h4>
                  <p>수자원이 마르기 전 저수지에서 농지까지 이어지는 <b>수로를 활성화</b>하고, <b>물뿌리개</b> 스킬로 말라붙은 대지에 기후 수분을 공급하세요.</p>
                </div>
              </div>

              <a 
                href="https://sdgs.un.org/goals/goal13" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="primary-button op-btn"
              >
                <Compass size={18} />
                UN SDG 13 공식 문서 확인
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
                  <strong>대중교통 및 저탄소 이동수단 우선</strong>
                  <p>가까운 거리는 걷거나 자전거를 이용하고, 대중교통 이용을 습관화하여 수송 부문 탄소 배출량을 감축합니다.</p>
                </div>
              </div>
              <div className="protocol-item">
                <span className="proto-num">02</span>
                <div>
                  <strong>에너지 사용 효율화 및 전원 차단</strong>
                  <p>대기 전력을 차단하기 위해 멀티탭을 끄고, 여름/겨울철 적정 실내 온도를 유지하여 발전 에너지를 아낍니다.</p>
                </div>
              </div>
              <div className="protocol-item">
                <span className="proto-num">03</span>
                <div>
                  <strong>일회용품 감축 및 재활용 의무화</strong>
                  <p>제품 생산과 분해에 많은 이산화탄소가 수반됩니다. 다회용기를 생활화하여 플라스틱 연소를 방지합니다.</p>
                </div>
              </div>
              <div className="protocol-item">
                <span className="proto-num">04</span>
                <div>
                  <strong>녹색 기후 정책 지지 및 캠페인 참여</strong>
                  <p>정부와 기업이 탄소 중립을 이행할 수 있도록 환경 서명 및 다양한 기후 행동 활동에 목소리를 냅니다.</p>
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
        title="기후변화 대응"
        number={13}
        imageUrl="/images/sdgs/sdg13.png"
        slogan="기후변화와 그 영향을 방지하기 위한 긴급 조치"
        targets={targets}
        globalContext={globalContext}
      />
    </main>
  );
}
