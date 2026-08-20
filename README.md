# بصيرة — Basirah

Arabic-first visual-learning platform for Saudi Arabia. **المعرفة تُرى.**

An original product (design system, illustration style, animation
language, information architecture) inspired at a category level by visual
microlearning apps — not a clone of any of them. See the full product
brief that drove this build in the conversation/PR that created this repo.

## Status

Built in 10 phases (see `docs/architecture.md` §7). **Phases 1-2 are done**:

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

Everything above renders/typechecks but content is placeholder — **no real
courses, no lesson player, no auth, no admin CMS yet**. Onboarding answers
and Home/Library content are local mock data (clearly commented in
`src/features/*/data.ts`), not live Supabase queries. Those are Phases
3–10, not yet built. Do not read this repo as feature-complete.

App icon/splash assets in `apps/mobile/assets/` are flat dune-gold
placeholders (generated, not designed) so Expo config resolves — the real
illustration system (spec §40) is produced alongside Phase 4 content.

Not yet built: scene renderer implementation (Phase 3), the 3 showcase
courses (Phase 4), quiz/streak/saved-insights logic (Phase 5), admin CMS
(Phase 6), subscriptions (Phase 7), AI lesson generator (Phase 8),
analytics/testing/perf/accessibility (Phase 9), production hardening
(Phase 10).

## Requirements

- Node ≥ 20, pnpm (via `corepack enable`)
- Supabase CLI (`brew install supabase/tap/supabase`) for local DB
- Expo Go app or an iOS/Android simulator, for `apps/mobile`

## Getting started

```bash
corepack enable
pnpm install                       # not yet run in this environment — see note below

# local database
supabase start
supabase db reset                  # applies supabase/migrations + supabase/seed

# mobile app
cp apps/mobile/.env.example apps/mobile/.env
pnpm --filter @basirah/mobile start
```

> **Note:** `pnpm install` has not been run against this scaffold yet —
> dependency versions in each `package.json` are pinned to current stable
> majors but haven't been resolved/locked in this environment. Run
> `pnpm install` before `pnpm dev`/`pnpm typecheck`.

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
