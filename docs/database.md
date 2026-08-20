# Basirah — Database Design

Postgres via Supabase. All primary keys are `uuid` (`gen_random_uuid()`).
Every user-facing table has Row-Level Security enabled; see
`supabase/migrations/0002_rls.sql` for the exact policies. Two migrations:

- `0001_init.sql` — schema (28 tables, grouped below)
- `0002_rls.sql` — RLS policies

## Table groups

**Identity** — `profiles`, `preferences`
Row per authenticated (or guest) user; `preferences.interests` stores the
onboarding screen-03 category multi-select as a `text[]` of category slugs.

**Taxonomy & sourcing** — `categories`, `authors`, `publishers`,
`content_sources`, `content_rights`
`content_rights` is deliberately its own table (not columns on `courses`)
so a single source can be cited by multiple courses and rights metadata can
be audited independently of content edits (spec §25 copyright safety).

**Content** — `courses`, `chapters`, `scenes`, `scene_assets`
`scenes.payload` is `jsonb` holding a full validated `Scene` object from
`@basirah/content-schema` (content/animation/interaction/accessibility/
analytics in one document) — the relational columns (`type`,
`duration_seconds`, `order`) are denormalized out of the payload purely for
indexing/query performance, not as a second source of truth. A GIN index
on `payload` supports admin search across scene content.

**Progress** — `user_course_progress`, `user_scene_progress`
Composite PKs (`user_id, course_id` / `user_id, scene_id`) — a progress
row is an upsert target, not an append-only log.

**Quizzes** — `quiz_questions`, `quiz_answers`, `user_answers`
Answers are user-scoped and append-only (kept for analytics/spaced
repetition signal, unlike progress rows).

**Saved content & spaced repetition** — `saved_insights`, `flashcards`,
`review_schedule`
`saved_insights.snapshot` denormalizes the saved content at save-time so a
later edit to the source scene doesn't retroactively change what the user
saved. `review_schedule` implements an SM-2-inspired algorithm: mutable
`ease_factor` / `interval_days` / `repetitions` recomputed on each review
using the confidence buttons (نسيتها/تقريباً/أتذكرها/سهلة →
`last_confidence`).

**Streaks & goals** — `streaks`, `daily_goals`

**Knowledge graph** — `knowledge_nodes`, `knowledge_edges`, `user_knowledge`
`knowledge_nodes` is a self-referencing tree (`parent_node_id`) for
category → subcategory drilldown (المال → الاستثمار → الأسهم); `edges`
carries a `relation` (`prerequisite`/`related`/`expands`) for graph
rendering; `user_knowledge.mastery_percent` is the per-user, per-node
progress the knowledge-graph screen visualizes.

**AI, commerce, ops** — `ai_generations`, `subscriptions`, `notifications`,
`analytics_events`
`ai_generations.status` mirrors the pipeline stages in `@basirah/ai`
(`pending → classifying → outlining → generating → validating →
moderation → ready | failed`), so the "نحوّل الفكرة إلى بصيرة..." loading
sequence in the app can poll/subscribe to real state rather than faking a
timer. `subscriptions` is written only by a RevenueCat webhook running as
the service role — no client-side policy allows writes.

## RLS policy pattern

Two shapes, applied consistently:

1. **Content tables** (`courses`, `chapters`, `scenes`, ...): public
   `select` gated on `status = 'published'` (walking the
   scene→chapter→course join where needed). Back-office tables
   (`authors`, `content_sources`, `content_rights`, ...) have RLS enabled
   with **no** policy at all — unreachable via the anon key by
   construction, editable only through the admin's service-role
   connection.
2. **User-owned tables**: `using (auth.uid() = user_id) with check
   (auth.uid() = user_id)` — a user can only ever read/write their own
   rows. `analytics_events` is insert-only client-side (no select policy);
   reads happen server-side for product analytics.

## Local development

```
supabase start        # local Postgres + Studio on :54323
supabase db reset      # applies migrations/ then seed/
pnpm --filter @basirah/database gen:types
```
