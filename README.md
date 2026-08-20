# بصيرة — Basirah

Arabic-first visual-learning platform for Saudi Arabia. **المعرفة تُرى.**

An original product (design system, illustration style, animation
language, information architecture) inspired at a category level by visual
microlearning apps — not a clone of any of them. See the full product
brief that drove this build in the conversation/PR that created this repo.

## Status

Built in 10 phases (see `docs/architecture.md` §7). **Phases 1-6 are done**:

- ✅ pnpm/Turborepo monorepo (`apps/mobile`, `apps/admin`, 7 `packages/*`)
- ✅ Design tokens (`packages/ui`) — color (light+dark), typography,
  spacing/radius/shadow/motion/breakpoints/touch-target/z-index/opacity
- ✅ Content schema (`packages/content-schema`) — Zod + TS discriminated
  union for all 30 scene types, `Course`/`Chapter`, content-rights schema
- ✅ Supabase schema — 28 tables + RLS (`supabase/migrations/`), category
  seed (`supabase/seed/`)
- ✅ Expo Router navigation shell — RTL forced at boot, 5-tab Arabic bottom
  nav (الرئيسية / استكشف / بصيرة AI / المحفوظات / حسابي), onboarding +
  lesson-player route stubs
- ✅ Docs: `docs/architecture.md`, `docs/database.md`,
  `docs/scene-engine.md`, `docs/design-system.md`
- ✅ Full 6-screen onboarding journey (spec §8) — RTL paging shell, progress
  dots, interest multi-select, goal + daily-target single-select,
  personalized knowledge-graph reveal, local completion flag gating Home
- ✅ Editorial Home screen — greeting/streak header, بصيرة اليوم hero,
  أكمل رحلتك empty state, اختيرت لك horizontal row, 5 differentiated
  compact category sections
- ✅ Library/استكشف screen — category filter chips + course list, wired to
  the same seeded category set as the database
- ✅ Scene engine (`@basirah/animation-engine`) — `LessonPlayer` +
  `SceneRenderer`, 20/30 scene types implemented (see
  `docs/scene-engine.md` "Implementation status"), tap/choice/slider/text
  interaction model, cross-scene computed values, reduced-motion support
- ✅ The 3 full showcase courses from spec §13-15 — قوة العادات الصغيرة
  (all 6 chapters), وش يعني التضخم؟ (with a live inflation simulator),
  كيف تعمل رؤية السعودية 2030؟ (informational, cited source) — wired
  into `app/lesson/[courseId].tsx` via a slug-keyed registry, every scene
  validated against `SceneSchema` and confirmed by actually *running* the
  content modules in Node, not just type-checking them
- ✅ Real Supabase wiring, verified against a running local instance
  (not just written): guest mode via anonymous sign-in + email-OTP
  account upgrade (spec §27/§29), `user_scene_progress`/
  `user_course_progress`/`streaks`/`saved_insights` writes from the
  lesson player, Library reading published courses live from Postgres.
  Two real bugs were caught and fixed this way — missing table `GRANT`s
  (`0003_grants.sql`) and a missing `profiles`-row trigger for new users
  (`0004_handle_new_user.sql`) — neither would have surfaced from
  `tsc` alone.
- ✅ `apps/mobile/scripts/` — `seedCourses.ts` publishes the 3 showcase
  courses into Postgres; `verifyContentQueries.ts` / `verifyProgressWrites.ts`
  are the scripts that did Phase 5's verification.
- ✅ **This app is now live on a real hosted Supabase project**
  (`https://khxdrfadvudanqhqnjcg.supabase.co`) — all 4 migrations, the
  category seed, and the 3 showcase courses are applied there, not just
  locally. `apps/mobile/.env` and `apps/admin/.env.local` point at it
  (both gitignored — never committed).
- ✅ Admin CMS (`apps/admin`) — course list/create, status workflow
  (draft→in_review→published), and the 3-pane scene editor (list /
  `PhonePreview` / JSON inspector validated against `SceneSchema`) from
  spec §23. Driven end-to-end with a real headless browser against the
  live hosted project (`apps/admin/scripts/e2eSmoke.mjs`) — login, open a
  course, edit a scene, save, confirm the write landed in Postgres. That
  test caught a real bug (`scenes.id`/`payload.id` divergence — see
  `docs/scene-engine.md`) nothing else would have found.

Everything above renders/typechecks/bundles/runs, and now actually
persists to a real production Supabase project — but there's still no
non-anonymous OAuth (Apple/Google), no per-editor CMS accounts (a single
shared access code — see `apps/admin/README.md`), no AI generator, and
Home's curated sections (بصيرة اليوم, اختيرت لك, ...) are still
locally-curated picks rather than a recommendation query. Those are
Phases 7–10, not yet built. Do not read this repo as feature-complete.

App icon/splash assets in `apps/mobile/assets/` are flat dune-gold
placeholders (generated, not designed) so Expo config resolves — the real
illustration system (spec §40) is produced alongside Phase 4 content.

Not yet built: subscriptions (Phase 7), AI lesson generator (Phase 8),
analytics/testing/perf/accessibility (Phase 9), production hardening
(Phase 10).

## Requirements

- Node ≥ 20, pnpm (via `corepack enable`)
- Docker (for the local Supabase stack) + the Supabase CLI. If `brew
  install supabase/tap/supabase` fails on your machine (it needs Xcode
  Command Line Tools on macOS — `xcode-select --install`), grab the
  binary directly from the [CLI releases page](https://github.com/supabase/cli/releases)
  instead; that's how this environment installed it.
- Expo Go app or an iOS/Android simulator, for `apps/mobile`

## Getting started

```bash
corepack enable
pnpm install

# local database — non-default ports (55321+), see supabase/config.toml,
# so this can run alongside another local Supabase project without conflict
supabase start
supabase db reset                  # applies supabase/migrations + supabase/seed

# publish the 3 showcase courses (stands in for the admin CMS's publish flow)
cd apps/mobile
SUPABASE_URL=http://127.0.0.1:55321 SUPABASE_SERVICE_ROLE_KEY=<from `supabase start`> \
  npx tsx scripts/seedCourses.ts

# mobile app — point at the same local instance
cp .env.example .env    # fill in EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:55321 and the anon key from `supabase start`
pnpm start

# admin CMS
cd ../admin
cp .env.example .env.local   # SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY from `supabase start`, plus your own ADMIN_ACCESS_CODE
pnpm dev
```

That's the local-dev path. **A real hosted Supabase project is also
live** and is what `apps/mobile/.env` / `apps/admin/.env.local` currently
point to in this environment (both gitignored, not committed) — same
migrations, same seed, same 3 courses, applied there too. Either backend
works identically; nothing in the app code is local-instance-specific.

`pnpm install` has been run in this environment and every package
typechecks (`pnpm turbo run typecheck`) and bundles (`expo export`) clean
— see each phase's commit message for what was specifically verified.

## Monorepo map

See `docs/architecture.md` §1.

## Environment variables

`apps/mobile/.env.example` — public (client-safe) vars only, validated by
`@basirah/config`. The admin app additionally needs a Supabase **service
role** key, kept server-side only (never `EXPO_PUBLIC_*`/`NEXT_PUBLIC_*`).

## License / content rights

Original code and original educational content only. Book/article
adaptations carry `content_rights` metadata (`rights_status`,
`source_type`, `license`, ...) — see `docs/database.md` and spec §25. No
copyrighted passages are reproduced.
