import type { EventDefinition, SkillDefinition } from "./types";

export const TARGET_EVENT_COUNT = 10;
export const MAX_ACTIVE_EVENTS = 4;
export const STATUS_TIMINGS = {
  yellow: 0,
  orange: 16_000,
  red: 30_000,
  black: 45_000
};

export const skills: SkillDefinition[] = [
  {
    id: "rain",
    name: "물뿌리개",
    description: "현장을 누른 채 움직여 물을 분사합니다."
  },
  {
    id: "wind",
    name: "염력 바람",
    description: "현장을 드래그해 오염물과 정체된 공기를 밀어냅니다."
  },
  {
    id: "purify",
    name: "정화 흡착기",
    description: "오염 구간을 훑어 독성 물질과 기름을 흡수합니다."
  },
  {
    id: "grow",
    name: "생장 씨앗",
    description: "황폐한 구역에 복원 에너지를 직접 심습니다."
  }
];

export const eventDefinitions: EventDefinition[] = [
  {
    id: "wildfire",
    title: "확산 중인 산불",
    shortTitle: "산불",
    description: "건조한 숲에서 산불이 번지고 있습니다. 불길이 검정 단계에 닿기 전에 진압해야 합니다.",
    sceneClass: "wildfire",
    sceneImage: "/events/wildfire.jpg",
    resolvedSceneImage: "/events/wildfire-resolved.jpg",
    interaction: {
      toolLabel: "물뿌리개 장착",
      instruction: "불길을 누른 채 쓸어 물을 분사하고, 물탱크가 비면 잠시 손을 떼어 재충전하세요.",
      progressLabel: "진압 수분량"
    },
    requiredSkillIds: ["rain"],
    education: {
      resolvedMessage: "소방 호스로 불길과 잔불을 모두 진압했습니다.",
      realWorldContext:
        "산불은 토양, 숲, 야생동물 서식지를 동시에 파괴합니다. 기후 변화와 건조한 날씨가 겹치면 더 빠르게 커질 수 있습니다.",
      lawOrPolicy:
        "한국은 산림보호법을 통해 산불 예방, 진화, 산림 보호 의무를 다룹니다.",
      actionHint: "야외 불씨 관리, 입산 통제 준수, 쓰레기 소각 금지가 산불 예방의 핵심입니다."
    }
  },
  {
    id: "ocean_trash",
    title: "바다로 밀려든 쓰레기",
    shortTitle: "해양 쓰레기",
    description: "플라스틱과 폐기물이 해류를 따라 퍼지고 있습니다. 해양 생물이 다치기 전에 수거 지점으로 밀어내야 합니다.",
    sceneClass: "ocean_trash",
    sceneImage: "/events/ocean-trash.jpg",
    resolvedSceneImage: "/events/ocean-trash-resolved.jpg",
    interaction: {
      toolLabel: "분리수거 집게",
      instruction: "쓰레기를 끌어 플라스틱, 캔·유리, 기타 수거함에 정확히 분리배출하세요.",
      progressLabel: "분리수거 완료량"
    },
    requiredSkillIds: ["wind"],
    education: {
      resolvedMessage: "해안 쓰레기를 종류별로 수거해 재활용 흐름으로 보냈습니다.",
      realWorldContext:
        "해양 플라스틱은 미세플라스틱으로 쪼개져 먹이사슬에 들어가고, 생물의 이동과 섭식을 방해합니다.",
      lawOrPolicy:
        "해양폐기물 및 해양오염퇴적물 관리법은 해양폐기물 발생 예방과 수거, 처리 체계를 규정합니다.",
      actionHint: "일회용품 사용을 줄이고, 하천과 해안 주변 쓰레기가 바다로 흘러가지 않게 막아야 합니다."
    }
  },
  {
    id: "oil_spill",
    title: "검게 번지는 기름 유출",
    shortTitle: "기름 유출",
    description: "기름막이 바다 표면을 덮고 있습니다. 오염이 해안으로 번지기 전에 정화해야 합니다.",
    sceneClass: "oil_spill",
    sceneImage: "/events/oil-spill.jpg",
    resolvedSceneImage: "/events/oil-spill-resolved.jpg",
    interaction: {
      toolLabel: "오일펜스·방제선",
      instruction: "기름띠 둘레에 오일펜스를 설치한 뒤, 갇힌 기름띠를 눌러 회수하세요.",
      progressLabel: "차단·회수 처리량"
    },
    requiredSkillIds: ["purify"],
    education: {
      resolvedMessage: "오일펜스로 확산을 막고 방제선으로 기름띠를 회수했습니다.",
      realWorldContext:
        "기름 유출은 물새의 깃털, 어류의 산란장, 해안 생태계를 장기간 손상시킬 수 있습니다.",
      lawOrPolicy:
        "해양환경관리법은 해양오염 방지와 방제 조치를 다룹니다.",
      actionHint: "선박 안전 관리와 사고 초기 방제가 피해 규모를 크게 줄입니다."
    }
  },
  {
    id: "illegal_logging",
    title: "불법 벌목 지역",
    shortTitle: "불법 벌목",
    description: "숲이 빠르게 사라지고 있습니다. 남은 생태축이 끊기기 전에 식생을 회복해야 합니다.",
    sceneClass: "illegal_logging",
    sceneImage: "/events/illegal-logging.jpg",
    resolvedSceneImage: "/events/illegal-logging-resolved.jpg",
    interaction: {
      toolLabel: "묘목 묘판",
      instruction: "묘목을 빈 식재 구덩이에 끌어 심고, 어린 나무를 눌러 물을 주세요.",
      progressLabel: "식재·생육 완료율"
    },
    requiredSkillIds: ["grow"],
    education: {
      resolvedMessage: "빈 구덩이에 묘목을 심고 물을 주어 숲 복원을 시작했습니다.",
      realWorldContext:
        "무분별한 벌목은 탄소 흡수원을 줄이고, 동식물 서식지를 조각내며, 토양 유실을 키웁니다.",
      lawOrPolicy:
        "산림자원의 조성 및 관리에 관한 법률은 산림의 지속 가능한 조성과 관리를 다룹니다.",
      actionHint: "인증 목재 사용, 산림 훼손 신고, 복원 사업 참여가 숲 보호에 도움이 됩니다."
    }
  },
  {
    id: "air_pollution",
    title: "도시를 뒤덮은 대기 오염",
    shortTitle: "대기 오염",
    description: "스모그가 도시를 덮고 있습니다. 오염 공기가 정체되기 전에 흐름을 만들어야 합니다.",
    sceneClass: "air_pollution",
    sceneImage: "/events/air-pollution.jpg",
    resolvedSceneImage: "/events/air-pollution-resolved.jpg",
    interaction: {
      toolLabel: "굴뚝 필터·바람길",
      instruction: "굴뚝마다 정화 필터를 설치한 뒤, 도시 상공의 스모그를 눌러 쓸어내세요.",
      progressLabel: "오염원 차단·대기 회복"
    },
    requiredSkillIds: ["wind"],
    education: {
      resolvedMessage: "배출원에 필터를 설치하고 남은 스모그를 걷어냈습니다.",
      realWorldContext:
        "대기 오염은 호흡기 건강뿐 아니라 식물 성장, 산성화, 도시 열환경에도 영향을 줍니다.",
      lawOrPolicy:
        "대기환경보전법은 대기오염물질 배출 관리와 생활환경 보호를 다룹니다.",
      actionHint: "대중교통 이용, 에너지 절약, 배출 사업장 관리가 대기 오염을 줄입니다."
    }
  },
  {
    id: "drought",
    title: "갈라진 가뭄 지대",
    shortTitle: "가뭄",
    description: "땅이 말라 식물이 버티지 못하고 있습니다. 물 순환을 회복해야 합니다.",
    sceneClass: "drought",
    sceneImage: "/events/drought.jpg",
    resolvedSceneImage: "/events/drought-resolved.jpg",
    interaction: {
      toolLabel: "관개 수문",
      instruction: "저수지에서 가까운 수문부터 차례로 열어 마른 농지까지 물길을 이어주세요.",
      progressLabel: "관개 수로 연결률"
    },
    requiredSkillIds: ["rain"],
    education: {
      resolvedMessage: "저수지 수문을 차례로 열어 마른 농지까지 물길을 복구했습니다.",
      realWorldContext:
        "가뭄은 식량 생산, 산불 위험, 생태계 물 공급을 동시에 위협합니다.",
      lawOrPolicy:
        "물관리기본법은 물의 공공성과 지속 가능한 물 관리를 기본 원칙으로 삼습니다.",
      actionHint: "물 절약, 빗물 활용, 지역 물 관리 정책 참여가 가뭄 대응력을 높입니다."
    }
  }
];

export const eventById = new Map(eventDefinitions.map((event) => [event.id, event]));
export const skillById = new Map(skills.map((skill) => [skill.id, skill]));

export const eventLocations = [
  { latitude: 37.4, longitude: 127.6 },
  { latitude: -3.4, longitude: -62.2 },
  { latitude: 34.1, longitude: -118.2 },
  { latitude: -24.8, longitude: 133.8 },
  { latitude: 1.2, longitude: 103.8 },
  { latitude: 51.5, longitude: -0.1 },
  { latitude: 30.0, longitude: 31.2 },
  { latitude: -33.9, longitude: 18.4 },
  { latitude: 35.7, longitude: 139.7 },
  { latitude: 19.4, longitude: -99.1 }
];

/** Fisher-Yates 셔플 — 원본 배열을 변경하지 않고 새 배열을 반환합니다. */
export function shuffle<T>(array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 셔플된 이벤트 ID 시퀀스를 생성합니다.
 * 6종 이벤트를 반복 셔플해 length 길이의 배열을 만들므로
 * 같은 이벤트가 연속으로 등장하지 않으며 매 게임 순서가 달라집니다.
 */
export function buildEventSequence(length = 200): string[] {
  const ids = eventDefinitions.map((e) => e.id);
  const out: string[] = [];
  while (out.length < length) {
    out.push(...shuffle(ids));
  }
  return out.slice(0, length);
}

/**
 * 셔플된 위치 시퀀스를 생성합니다.
 * 10개 위치를 반복 셔플해 length 길이의 배열을 만들므로
 * 같은 위치에 이벤트가 연속으로 나타나지 않습니다.
 */
export function buildLocationSequence(length = 200): Array<{ latitude: number; longitude: number }> {
  const out: Array<{ latitude: number; longitude: number }> = [];
  while (out.length < length) {
    out.push(...shuffle(eventLocations));
  }
  return out.slice(0, length);
}
