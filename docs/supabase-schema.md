# GAIA Supabase 스키마 초안

## 환경 변수

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY`는 서버 전용으로만 사용합니다. 클라이언트 번들에 노출하지 않습니다.

## rankings

게임 종료 후 최종 기록을 저장합니다.

```sql
create table public.rankings (
  id uuid primary key default gen_random_uuid(),
  player_name text not null check (char_length(player_name) between 1 and 24),
  score integer not null check (score >= 0),
  duration_seconds integer not null check (duration_seconds >= 0),
  resolved_count integer not null check (resolved_count >= 0),
  failed_count integer not null check (failed_count >= 0),
  created_at timestamptz not null default now()
);

create index rankings_score_idx
  on public.rankings (score desc, duration_seconds asc, created_at asc);
```

## achievement_records

랭킹 기록에 연결된 업적 목록을 저장합니다.

```sql
create table public.achievement_records (
  id uuid primary key default gen_random_uuid(),
  ranking_id uuid not null references public.rankings(id) on delete cascade,
  achievement_id text not null,
  created_at timestamptz not null default now(),
  unique (ranking_id, achievement_id)
);

create index achievement_records_ranking_id_idx
  on public.achievement_records (ranking_id);
```

## Row Level Security

초기 버전에서는 익명 플레이어가 랭킹을 읽을 수 있어야 합니다. 쓰기는 Next.js API Route를 통해 서버에서 처리하는 방식을 권장합니다.

```sql
alter table public.rankings enable row level security;
alter table public.achievement_records enable row level security;

create policy "rankings are readable"
  on public.rankings
  for select
  using (true);

create policy "achievement records are readable"
  on public.achievement_records
  for select
  using (true);
```

쓰기 정책은 만들지 않고, 서버 API에서 service role key로 insert합니다. 이렇게 하면 클라이언트가 임의 점수를 직접 쓰는 것을 막을 수 있습니다.

## 랭킹 산정 쿼리

특정 기록의 순위는 점수 내림차순, 완료 시간 오름차순, 생성 시간 오름차순 기준으로 계산합니다.

```sql
select count(*) + 1 as rank
from public.rankings
where
  score > :score
  or (score = :score and duration_seconds < :duration_seconds)
  or (
    score = :score
    and duration_seconds = :duration_seconds
    and created_at < :created_at
  );
```

## 향후 확장

- 로그인 기반 유저 프로필
- 시즌별 랭킹
- 난이도별 랭킹
- 이벤트별 해결 통계
- 실제 환경 뉴스 소스 테이블화

