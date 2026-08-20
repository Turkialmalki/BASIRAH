-- Row-Level Security policies.
-- Pattern: content tables are publicly readable when published, writable
-- only by the service role (admin CMS uses the service key server-side,
-- never exposed to clients). User-owned tables are readable/writable only
-- by their owning `auth.uid()`.

-- ---- Content tables: public read of published content ---------------------

alter table categories enable row level security;
create policy categories_read on categories for select using (true);

alter table courses enable row level security;
create policy courses_read_published on courses for select using (status = 'published');

alter table chapters enable row level security;
create policy chapters_read on chapters for select using (
  exists (select 1 from courses c where c.id = chapters.course_id and c.status = 'published')
);

alter table scenes enable row level security;
create policy scenes_read on scenes for select using (
  exists (
    select 1 from chapters ch join courses c on c.id = ch.course_id
    where ch.id = scenes.chapter_id and c.status = 'published'
  )
);

alter table scene_assets enable row level security;
create policy scene_assets_read on scene_assets for select using (
  exists (
    select 1 from scenes s join chapters ch on ch.id = s.chapter_id join courses c on c.id = ch.course_id
    where s.id = scene_assets.scene_id and c.status = 'published'
  )
);

alter table quiz_questions enable row level security;
create policy quiz_questions_read on quiz_questions for select using (
  exists (
    select 1 from scenes s join chapters ch on ch.id = s.chapter_id join courses c on c.id = ch.course_id
    where s.id = quiz_questions.scene_id and c.status = 'published'
  )
);

alter table quiz_answers enable row level security;
create policy quiz_answers_read on quiz_answers for select using (
  exists (
    select 1 from quiz_questions q
    join scenes s on s.id = q.scene_id
    join chapters ch on ch.id = s.chapter_id
    join courses c on c.id = ch.course_id
    where q.id = quiz_answers.question_id and c.status = 'published'
  )
);

alter table flashcards enable row level security;
create policy flashcards_read on flashcards for select using (true);

alter table knowledge_nodes enable row level security;
create policy knowledge_nodes_read on knowledge_nodes for select using (true);

alter table knowledge_edges enable row level security;
create policy knowledge_edges_read on knowledge_edges for select using (true);

-- Editorial/back-office tables (authors, publishers, content_sources,
-- content_rights) have no public policy at all — service role (admin CMS)
-- only, per spec §25/26 ("never expose service role key client-side" means
-- these simply aren't reachable from the mobile anon key).
alter table authors enable row level security;
alter table publishers enable row level security;
alter table content_sources enable row level security;
alter table content_rights enable row level security;

-- ---- User-owned tables: strictly self-access -------------------------------

alter table profiles enable row level security;
create policy profiles_self on profiles for all using (auth.uid() = id) with check (auth.uid() = id);

alter table preferences enable row level security;
create policy preferences_self on preferences for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table user_course_progress enable row level security;
create policy user_course_progress_self on user_course_progress for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table user_scene_progress enable row level security;
create policy user_scene_progress_self on user_scene_progress for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table user_answers enable row level security;
create policy user_answers_self on user_answers for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table saved_insights enable row level security;
create policy saved_insights_self on saved_insights for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table review_schedule enable row level security;
create policy review_schedule_self on review_schedule for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table streaks enable row level security;
create policy streaks_self on streaks for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table daily_goals enable row level security;
create policy daily_goals_self on daily_goals for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table user_knowledge enable row level security;
create policy user_knowledge_self on user_knowledge for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table ai_generations enable row level security;
create policy ai_generations_self on ai_generations for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table subscriptions enable row level security;
create policy subscriptions_self_read on subscriptions for select using (auth.uid() = user_id);
-- writes to subscriptions happen via RevenueCat webhook → service role only.

alter table notifications enable row level security;
create policy notifications_self on notifications for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table analytics_events enable row level security;
create policy analytics_events_self_insert on analytics_events for insert with check (auth.uid() = user_id);
-- no select policy: analytics reads happen via service role (admin/PostHog), not client-side.
