# Basirah — Scene Engine Specification

The scene engine is the reusable visual-storytelling renderer described in
spec §10-11. It is JSON-driven: a `Course` contains ordered `Chapter`s,
each containing ordered `Scene`s, and the mobile app's job at lesson-play
time is to render `Scene[]` one at a time, advancing on the interaction the
scene declares.

Schemas live in `packages/content-schema` (Zod, source of truth) — this doc
explains the *shape and intent*, not the implementation.

## Course → Chapter → Scene

```ts
Course {
  id, slug, title: LocalizedText, category, coverAsset?, estimatedMinutes,
  chapters: Chapter[],           // >= 1
  contentRights: ContentRights,  // rights_status/source_type/license/... (spec §25)
  sources: { title, url? }[],    // internal citations, optionally shown under "المصادر"
  status: draft | in_review | published | archived,
}

Chapter { id, order, title: LocalizedText, scenes: Scene[] }  // >= 1
```

## Scene — the shared envelope

Every scene, regardless of `type`, carries the same envelope (`SceneBase`
in `packages/content-schema/src/base.ts`):

| field          | purpose                                                                 |
|----------------|--------------------------------------------------------------------------|
| `id`           | uuid                                                                     |
| `type`         | discriminant — one of 30 scene types (below)                            |
| `duration`     | estimated seconds; feeds the lesson duration estimate + progress bar    |
| `content`      | type-specific payload (the only field that varies per `type`)           |
| `animation?`   | `AnimationSpec` — which motion primitive + engine drives this scene      |
| `interaction?` | `InteractionSpec` — how the user advances (tap/swipe/drag/choice/none)  |
| `accessibility`| `AccessibilitySpec` — required VoiceOver label + reduced-motion fallback |
| `analytics`    | PostHog event names + non-sensitive properties for this scene           |

`accessibility.label` is **required, not optional** — per spec §33,
animation can never be the only carrier of essential meaning, so every
scene must have a screen-reader-legible description regardless of how
visual its `content` is.

## The 30 scene types

Grouped by role (exact Zod shapes in `packages/content-schema/src/scenes.ts`):

- **Narrative**: `textReveal`, `visualMetaphor`, `character`, `quote`,
  `summary`, `completion`
- **Data & diagrams**: `comparison`, `timeline`, `numberCounter`,
  `barChart`, `lineChart`, `pieChart`, `processFlow`, `causeEffect`,
  `beforeAfter`, `map`, `saudiMap`, `stack`, `network`, `calendar`,
  `money`, `compoundGrowth`, `decisionTree`
- **Interactive**: `slider`, `dragInteraction`, `tapInteraction`,
  `multipleChoice`, `trueFalse`, `reflection`, `flashcard`

Adding a 31st type means: add its Zod object in `scenes.ts`, add it to the
`SceneSchema` discriminated union, and the TypeScript compiler will flag
every `switch (scene.type)` in the renderer (`@basirah/animation-engine`,
built in Phase 3) that doesn't yet handle it — that compile error is the
intended safety net, not a bug to silence.

## Animation ↔ engine mapping

`AnimationSpec.engine` picks which runtime draws the scene:

- **reanimated** — screen/text/card transitions, progress, gesture
  response (the default for narrative + interactive scene types)
- **skia** — `barChart`/`lineChart`/`pieChart`/`compoundGrowth` and any
  custom path/particle drawing
- **rive** — `character` scenes and other state-machine-driven interactive
  animation (`riveStateMachineInput` names which input the interaction
  drives)
- **lottie** — prebuilt editorial animations referenced by `assetRef`

`AnimationSpec.kind` (fade/slide/scale/spring/drawPath/count/morph/
rotate/parallax/stagger/maskReveal/timelineProgression/physics/none) is
engine-agnostic vocabulary — motion should always be explaining the scene's
idea (spec §12: "animation is educational, not decorative"), so a scene
author picks a `kind` that matches what the content is trying to show
(e.g. `count` for `numberCounter`, `drawPath` for `lineChart`,
`timelineProgression` for `timeline`), not for visual flourish.

## Progression model

A scene is "complete" when its `interaction` resolves (or immediately, if
`interaction` is absent/`required: false`). Completion:

1. fires `analytics.completedEvent`
2. upserts `user_scene_progress` (`completed_at`, and
   `interaction_response` for scenes that capture user input — slider
   value, chosen option id, drag mapping, reflection text)
3. advances to the next scene in the chapter, or the next chapter, or the
   `completion` scene that closes the course

Reduced-motion users get `accessibility.reducedMotionDescription` rendered
as static text in place of the animation; the interaction and progression
model are unchanged.

## Implementation status (Phase 4)

`packages/animation-engine` implements `LessonPlayer` (chapter/scene
progression, segmented progress bar, back/exit, `AccessibilityInfo`-driven
reduced motion, cross-scene response tracking — see "Cross-scene
computed values" below) and `SceneRenderer` (the type dispatch switch).
20 of the 30 scene types have a bespoke component:

`textReveal`, `visualMetaphor`, `quote`, `numberCounter`, `comparison`,
`beforeAfter`, `timeline`, `character`, `summary`, `completion`,
`multipleChoice`, `trueFalse`, `slider`, `reflection`, `flashcard`,
`money`, `compoundGrowth` (real Skia-drawn curve), `saudiMap`, `barChart`,
`stack`.

The remaining 10 (`lineChart`, `pieChart`, `processFlow`, `causeEffect`,
`map`, `network`, `calendar`, `decisionTree`, `dragInteraction`,
`tapInteraction`) fall through to `FallbackScene` — it reads
`accessibility.label`, never crashes the player. None of the 3 showcase
courses (below) need them; they're built alongside whichever future
lesson needs each one first.

`apps/mobile/app/lesson/[courseId].tsx` looks `courseId` up in
`src/content/registry.ts` (the 3 showcase courses) and falls back to the
Phase 3 smoke-test chapter for any unrecognized id. Real per-course
loading from Supabase, and progress persistence, are Phase 5.

## Cross-scene computed values

Some interactive content needs a later scene to react to an earlier one's
answer — e.g. an inflation simulator where a `money` scene shows
purchasing power computed from three prior `slider` answers (salary,
rate, years). `LessonPlayer` keeps a `responses: Record<sceneId,
SceneResponse>` map, updated as each scene completes, and provides it via
`SceneResponsesContext`. A scene component that wants a prior answer reads
the context itself (see `MoneyScene`'s `content.computedFrom`, which
names the three slider scene ids it depends on) — there is deliberately no
general "formula" mini-language in the schema; each scene type defines its
own typed way of referencing prior scenes if it needs to.

## The 3 showcase courses (Phase 4)

`apps/mobile/src/content/courses/`:

- `powerOfSmallHabits.ts` — **قوة العادات الصغيرة** (spec §13). All 6
  chapters: the jump-to-stairs metaphor, the 1%-compounding curve, an
  environment-design beforeAfter, the 2→30 minute friction slider, a
  2-question quiz, and a reflection scene with the reminder toggle that
  saves the user's committed habit.
- `whatIsInflation.ts` — **وش يعني التضخم؟** (spec §14). The
  wallet-losing-items sequence via two static `money` scenes, an MSA
  definition, an illustrative price-index `barChart`, then the
  salary/rate/years slider simulator feeding a live-computed `money`
  scene via the cross-scene mechanism above.
- `vision2030.ts` — **كيف تعمل رؤية السعودية 2030؟** (spec §15).
  Informational only (no persuasive framing): launch year and the three
  official pillars, a `saudiMap` of publicly known flagship projects, and
  one `barChart` explicitly labeled as illustrative rather than official
  statistics — the course carries a `sources` citation
  (vision2030.gov.sa) rather than asserting unverified figures as fact.

Every scene object in all 3 files is validated against `SceneSchema` at
module load (via the shared `scene()` helper in `src/content/helpers.ts`)
— confirmed by actually executing the modules in Node (`npx tsx`), not
just type-checking them.

**A real bug this caught:** `scenes.id` (the Postgres primary key) and
`payload.id` (the same id, embedded in the JSON) must always match — the
admin CMS's scene editor and the mobile renderer both key off
`payload.id`. `seedCourses.ts` originally let Postgres default the row's
`id` to a fresh `gen_random_uuid()` on insert, silently diverging from
the authored `scene.id` already baked into the payload. This surfaced
only when a Playwright-driven end-to-end test (see `docs/architecture.md`
"CMS verification") tried to save an edited scene and hit "Scene id in
JSON doesn't match the scene being edited" — `tsc`, `expo export`, and
even direct `SceneSchema.parse` checks never exercise the seed script's
insert path, so none of them could have caught it. Fixed by passing
`id: scene.id` explicitly in the insert.
