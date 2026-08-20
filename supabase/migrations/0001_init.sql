-- Basirah (بصيرة) — initial schema
-- Conventions: uuid PKs via gen_random_uuid(), snake_case, RLS on every
-- user-facing table, timestamps as timestamptz, soft deletes only where noted.

create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm"; -- Arabic-aware fuzzy search

-- ---------------------------------------------------------------------------
-- Identity & preferences
-- ---------------------------------------------------------------------------

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  email text,
  avatar_url text,
  locale text not null default 'ar',
  is_guest boolean not null default false,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table preferences (
  user_id uuid primary key references profiles (id) on delete cascade,
  interests text[] not null default '{}', -- category slugs from onboarding screen 03
  learning_goal text, -- one of the screen 04 goal keys
  daily_target_minutes int not null default 10,
  reduced_motion boolean not null default false,
  notifications_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Taxonomy & content sources
-- ---------------------------------------------------------------------------

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_ar text not null,
  title_en text,
  color_token text, -- maps to @basirah/ui category.* token
  parent_id uuid references categories (id) on delete set null,
  created_at timestamptz not null default now()
);

create table authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio_ar text,
  created_at timestamptz not null default now()
);

create table publishers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table content_sources (
  id uuid primary key default gen_random_uuid(),
  source_type text not null check (source_type in ('book', 'article', 'url', 'original', 'public_data')),
  title text not null,
  url text,
  author_id uuid references authors (id) on delete set null,
  publisher_id uuid references publishers (id) on delete set null,
  raw_reference text, -- freeform citation text
  created_at timestamptz not null default now()
);

create table content_rights (
  id uuid primary key default gen_random_uuid(),
  content_source_id uuid references content_sources (id) on delete cascade,
  rights_status text not null check (
    rights_status in ('original', 'licensed', 'public_domain', 'fair_use_commentary', 'pending_review')
  ),
  license text,
  permission text,
  expiry timestamptz,
  territory text not null default 'global',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Learning content — course / chapter / scene
-- ---------------------------------------------------------------------------

create table courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_ar text not null,
  title_en text,
  subtitle_ar text,
  category_id uuid references categories (id) on delete set null,
  cover_asset_url text,
  estimated_minutes int not null,
  status text not null default 'draft' check (status in ('draft', 'in_review', 'published', 'archived')),
  content_rights_id uuid references content_rights (id) on delete set null,
  is_ai_generated boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table chapters (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  "order" int not null,
  title_ar text not null,
  title_en text,
  created_at timestamptz not null default now(),
  unique (course_id, "order")
);

-- Scene content is stored as validated JSON (see @basirah/content-schema
-- `SceneSchema`); the admin CMS and mobile client both validate on
-- read/write so this column is the single source of truth for scene shape.
create table scenes (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references chapters (id) on delete cascade,
  "order" int not null,
  type text not null, -- SceneType from @basirah/content-schema
  duration_seconds int not null,
  payload jsonb not null, -- full Scene object (content/animation/interaction/accessibility/analytics)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (chapter_id, "order")
);
create index scenes_chapter_id_idx on scenes (chapter_id);
create index scenes_payload_gin_idx on scenes using gin (payload);

create table scene_assets (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references scenes (id) on delete cascade,
  kind text not null check (kind in ('illustration', 'photo', 'icon', 'rive', 'lottie', 'skiaScene', 'audio')),
  storage_path text not null, -- Supabase Storage object path
  alt_text_ar text,
  created_at timestamptz not null default now()
);
create index scene_assets_scene_id_idx on scene_assets (scene_id);

-- ---------------------------------------------------------------------------
-- Progress
-- ---------------------------------------------------------------------------

create table user_course_progress (
  user_id uuid not null references profiles (id) on delete cascade,
  course_id uuid not null references courses (id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'completed')),
  last_chapter_id uuid references chapters (id) on delete set null,
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

create table user_scene_progress (
  user_id uuid not null references profiles (id) on delete cascade,
  scene_id uuid not null references scenes (id) on delete cascade,
  completed_at timestamptz,
  interaction_response jsonb, -- e.g. slider value, chosen option id, reflection text
  updated_at timestamptz not null default now(),
  primary key (user_id, scene_id)
);
create index user_scene_progress_user_id_idx on user_scene_progress (user_id);

-- ---------------------------------------------------------------------------
-- Quizzes
-- ---------------------------------------------------------------------------

create table quiz_questions (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid not null references scenes (id) on delete cascade,
  question_ar text not null,
  question_type text not null check (
    question_type in ('multiple_choice', 'true_false', 'drag_order', 'matching', 'visual_id', 'slider', 'scenario')
  ),
  created_at timestamptz not null default now()
);

create table quiz_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references quiz_questions (id) on delete cascade,
  answer_ar text not null,
  is_correct boolean not null default false,
  feedback_ar text,
  "order" int not null default 0
);
create index quiz_answers_question_id_idx on quiz_answers (question_id);

create table user_answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  question_id uuid not null references quiz_questions (id) on delete cascade,
  answer_id uuid references quiz_answers (id) on delete set null,
  is_correct boolean not null,
  answered_at timestamptz not null default now()
);
create index user_answers_user_id_idx on user_answers (user_id);

-- ---------------------------------------------------------------------------
-- Saved insights, flashcards, spaced repetition
-- ---------------------------------------------------------------------------

create table saved_insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  scene_id uuid references scenes (id) on delete set null,
  course_id uuid references courses (id) on delete set null,
  kind text not null check (kind in ('quote', 'visual', 'lesson')),
  snapshot jsonb not null, -- denormalized content at save-time, survives source edits
  created_at timestamptz not null default now()
);
create index saved_insights_user_id_idx on saved_insights (user_id);

create table flashcards (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid references scenes (id) on delete cascade,
  front_ar text not null,
  back_ar text not null,
  created_at timestamptz not null default now()
);

-- SM-2-inspired spaced repetition state, one row per user per flashcard.
create table review_schedule (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  flashcard_id uuid not null references flashcards (id) on delete cascade,
  ease_factor numeric not null default 2.5,
  interval_days int not null default 0,
  repetitions int not null default 0,
  due_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  last_confidence text check (last_confidence in ('forgot', 'almost', 'remembered', 'easy')),
  unique (user_id, flashcard_id)
);
create index review_schedule_due_idx on review_schedule (user_id, due_at);

-- ---------------------------------------------------------------------------
-- Streaks & goals
-- ---------------------------------------------------------------------------

create table streaks (
  user_id uuid primary key references profiles (id) on delete cascade,
  current_streak_days int not null default 0,
  longest_streak_days int not null default 0,
  last_active_date date,
  total_minutes_learned numeric not null default 0,
  total_lessons_completed int not null default 0,
  updated_at timestamptz not null default now()
);

create table daily_goals (
  user_id uuid not null references profiles (id) on delete cascade,
  goal_date date not null,
  target_minutes int not null,
  minutes_completed numeric not null default 0,
  achieved boolean not null default false,
  primary key (user_id, goal_date)
);

-- ---------------------------------------------------------------------------
-- Knowledge graph
-- ---------------------------------------------------------------------------

create table knowledge_nodes (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories (id) on delete set null,
  slug text unique not null,
  title_ar text not null,
  parent_node_id uuid references knowledge_nodes (id) on delete set null,
  created_at timestamptz not null default now()
);

create table knowledge_edges (
  id uuid primary key default gen_random_uuid(),
  from_node_id uuid not null references knowledge_nodes (id) on delete cascade,
  to_node_id uuid not null references knowledge_nodes (id) on delete cascade,
  relation text not null default 'related' -- 'prerequisite' | 'related' | 'expands'
);

create table user_knowledge (
  user_id uuid not null references profiles (id) on delete cascade,
  node_id uuid not null references knowledge_nodes (id) on delete cascade,
  mastery_percent numeric not null default 0 check (mastery_percent between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, node_id)
);

-- ---------------------------------------------------------------------------
-- AI generation, subscriptions, notifications, analytics
-- ---------------------------------------------------------------------------

create table ai_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete set null,
  prompt text not null,
  status text not null default 'pending' check (
    status in ('pending', 'classifying', 'outlining', 'generating', 'validating', 'moderation', 'ready', 'failed')
  ),
  resulting_course_id uuid references courses (id) on delete set null,
  sources jsonb not null default '[]',
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index ai_generations_user_id_idx on ai_generations (user_id);

create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  provider text not null default 'revenuecat',
  plan text not null check (plan in ('free', 'plus_monthly', 'plus_yearly')),
  status text not null check (status in ('active', 'trialing', 'cancelled', 'expired', 'past_due')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index subscriptions_user_id_idx on subscriptions (user_id);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  title_ar text not null,
  body_ar text not null,
  kind text not null default 'daily_lesson',
  scheduled_for timestamptz,
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_id_idx on notifications (user_id);

-- Analytics events are also sent to PostHog; this table is a durable,
-- queryable copy for product analytics joins against course/category data.
create table analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete set null,
  event_name text not null,
  properties jsonb not null default '{}',
  occurred_at timestamptz not null default now()
);
create index analytics_events_event_name_idx on analytics_events (event_name);
create index analytics_events_user_id_idx on analytics_events (user_id);
