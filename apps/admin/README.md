# @basirah/admin

Content CMS (Next.js + Tailwind + Supabase). Built in Phase 6.

## What's here

- **Auth**: a single shared `ADMIN_ACCESS_CODE` cookie gate
  (`middleware.ts` + `app/login/`) — deliberately MVP-scoped; every
  mutation runs server-side through the Supabase **service role** key
  (`src/lib/supabaseServer.ts`, never exposed to the browser), so this
  cookie is what stands between "anyone with the URL" and "can edit
  content" until real per-editor accounts exist (Phase 9/10).
- **`/dashboard`** — live counts (courses, published, total scenes) —
  real Postgres queries, not mock numbers.
- **`/courses`** — list + create (draft) courses.
- **`/courses/[courseId]`** — metadata, draft→in_review→published→archived
  status controls, chapter list + add/delete.
- **`/courses/[courseId]/chapters/[chapterId]`** — the scene editor:
  left pane (scene list, add/reorder), center pane (`PhonePreview` — a
  simplified web approximation of the real React Native scene, not
  pixel-accurate to Reanimated/Skia output), right pane (raw scene JSON,
  validated against `@basirah/content-schema`'s `SceneSchema` before
  every save).
- **`/review`** — courses in `in_review`/`published`, one-click publish
  (human review is mandatory before anything goes live — spec §24).
- **`/assets`, `/ai-generator`, `/analytics`, `/users`, `/subscriptions`**
  — route stubs matching the spec's route map, each labeled with which
  future phase builds it out (Phases 7-10).

## Scene JSON editing, not per-type forms

The inspector edits a scene's **full JSON** (id/type/content/animation/
interaction/accessibility/analytics) rather than 30 bespoke React forms
per scene type — validated with the same `SceneSchema` the mobile app
and content files use, so a malformed edit is rejected with the exact
Zod error path before it ever reaches Postgres. `+ Add scene` seeds a
valid starting template per type (`src/lib/sceneDefaults.ts`).

## Verification

This wasn't just built and typechecked — it was driven end-to-end with a
real headless browser against the actual hosted Supabase project
(`scripts/e2eSmoke.mjs`): log in, open a course, open a chapter, edit a
scene, save, confirm the write landed in Postgres. That test caught a
real bug (`scenes.id` vs `payload.id` divergence in the seed script — see
`docs/scene-engine.md`) that no static check could have found.

## Setup

```bash
cp .env.example .env.local   # SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_ACCESS_CODE
pnpm dev
```
