# Basirah — Architecture Plan

## 1. Monorepo shape

```
apps/mobile        Expo + Expo Router + TypeScript (React Native) — the product
apps/admin         Next.js + Tailwind + Supabase — the content CMS
packages/ui                design tokens (colors/typography/spacing/motion) — no components yet
packages/content-schema    Zod + TS discriminated union for Course/Chapter/Scene — the contract
                            between CMS, mobile renderer, and the AI pipeline
packages/animation-engine  Reanimated/Skia/Rive/Lottie primitives that interpret AnimationSpec
packages/database          Supabase client factory + generated row types
packages/config             validated public env contract (zod)
packages/analytics          typed PostHog event names + client interface
packages/ai                  AI lesson-generation pipeline stage contracts
supabase/                  migrations + seed SQL, config.toml (local dev)
```

Package manager: pnpm workspaces, orchestrated by Turborepo (`turbo.json`).
Every package publishes plain TypeScript from `src/` — no build step inside
the monorepo boundary; only `apps/*` compile for their runtime (Expo
bundler / Next.js).

## 2. Why `content-schema` is the center of gravity

The single riskiest thing in a product like this is drift between "what the
CMS lets an editor create," "what the mobile renderer knows how to draw,"
and "what the AI pipeline is allowed to generate." All three are pinned to
one Zod schema (`packages/content-schema`). A `Scene` is invalid the same
way in all three places, and TypeScript's discriminated union means the
renderer's `switch (scene.type)` is exhaustively checked at compile time —
adding a new scene type breaks the build everywhere it isn't yet handled,
instead of failing silently at runtime.

## 3. RTL as an architecture decision, not a style flag

`I18nManager.forceRTL(true)` is called once, before any navigator mounts
(`src/lib/rtl.ts`, imported at the top of `app/_layout.tsx`). This means:

- Flexbox `row` directions, the tab bar, `Stack` header layout, and gesture
  directions (swipe-to-go-back) are mirrored by React Native natively —
  we do not hand-flip individual screens.
- Text components default to `writingDirection: "rtl"` / `textAlign:
  "right"` at the primitive level (`BasirahText`), so every screen inherits
  correct alignment instead of opting in per-screen.
- Scene animations that have inherent directionality (timelines, process
  flows, slide transitions) read their direction from the RTL flag rather
  than hardcoding left-to-right, per the animation-engine spec.

## 4. Data flow (mobile)

```
Supabase (Postgres + RLS)
  → @basirah/database client
  → TanStack Query hooks (cache, offline-aware)
  → Zustand stores for ephemeral/session UI state (onboarding answers,
    in-flight scene interaction state)
  → Scene Engine renders `Scene[]` from a `Chapter`
  → user interaction (@basirah/content-schema `InteractionSpec`) writes
    back to `user_scene_progress` / `user_answers` / `saved_insights`
```

## 5. AI lesson generation, at the architecture level

`packages/ai` defines the pipeline as a sequence of pure, independently
testable stages (`classifyTopic → retrieveSources → buildFactualOutline →
generateArabicExplanation → generateScenePlan → validateSceneSchema →
moderate`). The output of `generateScenePlan` MUST parse against
`SceneSchema` before it is allowed to become a `courses` row — an AI
generation that fails schema validation never reaches a user, and never
auto-publishes (`courses.status` starts at `draft`; admin review is a hard
gate, see `docs/copyright-and-rights.md`, Phase 8).

## 6. Environments

- Mobile reads only `EXPO_PUBLIC_*` vars (validated by `@basirah/config`).
  The Supabase **anon** key is the only credential ever shipped to the app;
  RLS is the actual authorization boundary (see `docs/database.md`).
- Admin holds the Supabase **service role** key server-side only (Next.js
  server actions / route handlers), never in a client component.

## 7. Phased delivery

This repository is being built in the 10 phases defined in the master build
command. Phase 1 (this commit) delivers: monorepo skeleton, design tokens,
Supabase schema + RLS, the `content-schema` contract, and a navigable
(placeholder-content) Expo Router shell with the correct RTL tab structure.
Each subsequent phase is a separate, reviewable pass — see the root
`README.md` "Status" section for what's implemented vs. planned.
