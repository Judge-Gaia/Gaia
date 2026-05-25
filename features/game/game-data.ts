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
    name: "비",
    description: "물을 내려 산불과 가뭄을 진정시킵니다."
  },
  {
    id: "wind",
    name: "바람",
    description: "흐름을 만들어 쓰레기와 오염 공기를 밀어냅니다."
  },
  {
    id: "purify",
    name: "정화",
    description: "독성 물질과 기름 오염을 분해합니다."
  },
  {
    id: "grow",
    name: "성장",
    description: "훼손된 숲과 식생을 회복시킵니다."
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
    requiredSkillIds: ["rain"],
    education: {
      resolvedMessage: "비를 내려 산불 확산을 막았습니다.",
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
    requiredSkillIds: ["wind"],
    education: {
      resolvedMessage: "바람으로 쓰레기를 해안 수거 지점까지 이동시켰습니다.",
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
    requiredSkillIds: ["purify"],
    education: {
      resolvedMessage: "정화 스킬로 기름막을 분해했습니다.",
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
    requiredSkillIds: ["grow"],
    education: {
      resolvedMessage: "성장 스킬로 훼손된 숲의 회복을 시작했습니다.",
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
    requiredSkillIds: ["wind"],
    education: {
      resolvedMessage: "바람길을 만들어 오염 공기의 정체를 해소했습니다.",
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
    requiredSkillIds: ["rain"],
    education: {
      resolvedMessage: "비를 내려 마른 토양을 적셨습니다.",
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

