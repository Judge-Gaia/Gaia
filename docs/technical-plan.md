# GAIA 기술 설계

## 목표

Next.js와 Supabase를 사용해 클라이언트 중심의 실시간 게임 경험과 서버 기반 랭킹 저장을 함께 구현합니다.

## 예상 디렉터리 구조

```txt
app/
  page.tsx
  game/
    page.tsx
  event/[eventId]/
    page.tsx
  result/
    page.tsx
  api/
    rankings/
      route.ts
components/
  earth/
  game/
  achievements/
  skills/
features/
  game/
    game-data.ts
    game-state.ts
    scoring.ts
    events.ts
lib/
  supabase/
    client.ts
    server.ts
    rankings.ts
docs/
```

## 상태 관리

초기 버전은 React 상태와 Context 또는 Zustand 중 하나를 사용합니다. 게임 중 빠른 상태 변화가 많으므로 다음 상태를 명확히 분리합니다.

- 플레이어 이름
- 게임 시작 시간
- 현재 이벤트 목록
- 해결된 이벤트 목록
- 실패한 이벤트 목록
- 획득 업적 목록
- 현재 화면 또는 선택된 이벤트
- 최종 점수

게임 상태는 라운드 진행 중 클라이언트에 두고, 게임 종료 시 Supabase에 최종 기록을 저장합니다.

## 이벤트 데이터 모델

이벤트 정의는 코드의 정적 데이터로 시작합니다.

```ts
type SkillId = "rain" | "wind" | "purify" | "grow";

type EventDefinition = {
  id: string;
  title: string;
  description: string;
  requiredSkillIds: SkillId[];
  education: {
    resolvedMessage: string;
    realWorldContext: string;
    lawOrPolicy?: string;
    newsContext?: string;
    sourceUrl?: string;
  };
};
```

실제 진행 중인 이벤트는 런타임 상태로 관리합니다.

```ts
type ActiveEvent = {
  instanceId: string;
  eventId: string;
  latitude: number;
  longitude: number;
  spawnedAt: number;
  status: "yellow" | "orange" | "red" | "black";
  resolvedAt?: number;
  failedAt?: number;
};
```

## 화면 흐름

1. `/`
   - 이름 입력
   - 시작 버튼
   - 시작 시 `/game`으로 이동

2. `/game`
   - 회전 지구 렌더링
   - 이벤트 포인트 표시
   - 업적 패널 표시
   - 이벤트 클릭 시 `/event/[eventId]?instanceId=...`로 이동

3. `/event/[eventId]`
   - 이벤트 상황 렌더링
   - 스킬 선택 UI 표시
   - 정답 스킬이면 결과 모달 표시
   - 확인 시 `/game`으로 복귀

4. `/result`
   - 최종 점수와 기록 표시
   - Supabase 랭킹 저장
   - 다시 시작 버튼

## 3D 지구 구현

초기 구현은 React Three Fiber 또는 Three.js를 사용합니다.

필수 조건:

- 지구가 자동 회전해야 합니다.
- 이벤트 포인트는 위도/경도를 기반으로 구 표면에 배치합니다.
- 포인트 색상은 위험도 상태와 동기화합니다.
- 모바일에서도 지구와 포인트를 클릭할 수 있어야 합니다.

## Supabase 사용 범위

초기 버전에서 Supabase는 랭킹 저장과 조회에 사용합니다.

- `rankings`: 최종 게임 기록 저장
- `achievement_records`: 플레이어가 해당 판에서 얻은 업적 저장

사용자 인증은 초기 버전에서 제외합니다. 플레이어 이름은 익명 닉네임으로 저장합니다.

## API 설계

`POST /api/rankings`

요청:

```json
{
  "playerName": "player",
  "score": 1200,
  "durationSeconds": 183,
  "resolvedCount": 8,
  "failedCount": 2,
  "achievements": ["first_rescue", "fire_guardian"]
}
```

응답:

```json
{
  "rankingId": "uuid",
  "rank": 12
}
```

`GET /api/rankings`

응답:

```json
{
  "items": [
    {
      "rank": 1,
      "playerName": "gaia",
      "score": 2100,
      "durationSeconds": 120,
      "createdAt": "2026-05-24T00:00:00.000Z"
    }
  ]
}
```

## 구현 순서

1. Next.js 프로젝트 초기화
2. UI 기본 레이아웃 작성
3. 정적 이벤트/스킬/업적 데이터 작성
4. 게임 상태 관리 구현
5. 지구 렌더링과 이벤트 포인트 구현
6. 이벤트 상세 화면과 스킬 판정 구현
7. 결과 모달과 업적 패널 구현
8. 점수 계산과 종료 화면 구현
9. Supabase 랭킹 테이블 및 API 구현
10. Playwright로 주요 흐름 검증

