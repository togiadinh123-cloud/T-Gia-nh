# Database Schema Proposal

This is a Supabase/Postgres proposal for moving Định English from mock data to persisted data later. Mock mode should remain active until the app is ready to migrate route by route.

Current incremental auth/progress integration still uses mock lesson ids such as `introduce-yourself`. This proposal uses stable text slugs for content ids so progress can be saved before fully migrating lesson content.

## Tables

- `profiles`: public app profile for each Supabase Auth user.
- `units`: ordered course units.
- `lessons`: lessons inside units.
- `questions`: question payloads for multiple-choice, fill-in-the-blank, sentence-order, and listening exercises.
- `user_progress`: per-user progress by unit and lesson.
- `lesson_attempts`: one row per completed or failed lesson session.
- `mistakes`: incorrect answers captured during attempts.
- `streaks`: per-user daily streak state.

## SQL Proposal

```sql
create extension if not exists pgcrypto;

create type public.question_type as enum (
  'multiple_choice',
  'fill_blank',
  'sentence_order',
  'listening'
);

create type public.lesson_status as enum (
  'not_started',
  'in_progress',
  'completed'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  level text not null default 'A1',
  total_xp integer not null default 0 check (total_xp >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.units (
  id text primary key,
  title text not null,
  description text,
  sort_order integer not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (sort_order)
);

create table public.lessons (
  id text primary key,
  unit_id text not null references public.units(id) on delete cascade,
  title text not null,
  description text,
  xp_reward integer not null default 10 check (xp_reward >= 0),
  sort_order integer not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (unit_id, sort_order)
);

create table public.questions (
  id text primary key,
  lesson_id text not null references public.lessons(id) on delete cascade,
  type public.question_type not null,
  prompt text not null,
  explanation text not null,
  data jsonb not null,
  sort_order integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lesson_id, sort_order)
);

create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  unit_id text references public.units(id) on delete cascade,
  lesson_id text references public.lessons(id) on delete cascade,
  status public.lesson_status not null default 'not_started',
  best_accuracy integer not null default 0 check (best_accuracy between 0 and 100),
  total_xp_earned integer not null default 0 check (total_xp_earned >= 0),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  check (unit_id is not null or lesson_id is not null)
);

create table public.lesson_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  xp_earned integer not null default 0 check (xp_earned >= 0),
  accuracy integer not null default 0 check (accuracy between 0 and 100),
  mistakes_count integer not null default 0 check (mistakes_count >= 0),
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.mistakes (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.lesson_attempts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  user_answer text not null,
  correct_answer text not null,
  explanation text not null,
  created_at timestamptz not null default now()
);

create table public.streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  last_activity_date date,
  updated_at timestamptz not null default now()
);

create index units_published_sort_idx
  on public.units (is_published, sort_order);

create index lessons_unit_sort_idx
  on public.lessons (unit_id, sort_order);

create index lessons_published_idx
  on public.lessons (is_published)
  where is_published = true;

create index questions_lesson_sort_idx
  on public.questions (lesson_id, sort_order);

create index user_progress_user_idx
  on public.user_progress (user_id);

create index user_progress_lesson_idx
  on public.user_progress (lesson_id);

create unique index user_progress_user_unit_unique_idx
  on public.user_progress (user_id, unit_id)
  where unit_id is not null;

create unique index user_progress_user_lesson_unique_idx
  on public.user_progress (user_id, lesson_id)
  where lesson_id is not null;

create index lesson_attempts_user_lesson_created_idx
  on public.lesson_attempts (user_id, lesson_id, created_at desc);

create index mistakes_user_created_idx
  on public.mistakes (user_id, created_at desc);
```

## RLS Proposal

```sql
alter table public.profiles enable row level security;
alter table public.units enable row level security;
alter table public.lessons enable row level security;
alter table public.questions enable row level security;
alter table public.user_progress enable row level security;
alter table public.lesson_attempts enable row level security;
alter table public.mistakes enable row level security;
alter table public.streaks enable row level security;

create policy "profiles are readable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles are editable by owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles can be inserted by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "published units are readable"
  on public.units for select
  using (is_published = true);

create policy "published lessons are readable"
  on public.lessons for select
  using (is_published = true);

create policy "questions for published lessons are readable"
  on public.questions for select
  using (
    exists (
      select 1
      from public.lessons
      where lessons.id = questions.lesson_id
        and lessons.is_published = true
    )
  );

create policy "users read own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "users write own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "users update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "users read own attempts"
  on public.lesson_attempts for select
  using (auth.uid() = user_id);

create policy "users create own attempts"
  on public.lesson_attempts for insert
  with check (auth.uid() = user_id);

create policy "users read own mistakes"
  on public.mistakes for select
  using (auth.uid() = user_id);

create policy "users create own mistakes"
  on public.mistakes for insert
  with check (auth.uid() = user_id);

create policy "users read own streak"
  on public.streaks for select
  using (auth.uid() = user_id);

create policy "users create own streak"
  on public.streaks for insert
  with check (auth.uid() = user_id);

create policy "users update own streak"
  on public.streaks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

## Question Data Shapes

Store the exercise-specific payload in `questions.data`.

```json
{
  "type": "multiple_choice",
  "options": [
    { "id": "a", "label": "My name is Dinh." }
  ],
  "correctOptionId": "a"
}
```

```json
{
  "type": "fill_blank",
  "sentenceParts": {
    "before": "My name",
    "after": "Dinh."
  },
  "correctAnswer": "is"
}
```

```json
{
  "type": "sentence_order",
  "shuffledWords": [
    { "id": "w1", "label": "Hanoi." }
  ],
  "correctSentence": "I live in Hanoi."
}
```

```json
{
  "type": "listening",
  "audioText": "My name is Lan.",
  "answerMode": "text",
  "correctAnswer": "My name is Lan."
}
```

```json
{
  "type": "listening",
  "audioText": "I have breakfast.",
  "answerMode": "multiple_choice",
  "options": [
    { "id": "a", "label": "Tôi ăn sáng." }
  ],
  "correctOptionId": "a"
}
```

## Notes

- Keep content tables (`units`, `lessons`, `questions`) read-only to normal users.
- Add admin-only insert/update/delete policies later when an admin role exists.
- Generate production TypeScript database types from Supabase once the schema is applied.
- Keep mock data active until each feature has a data-loading path and tests.
