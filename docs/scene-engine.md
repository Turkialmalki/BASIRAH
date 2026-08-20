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

## Implementation status (Phase 3)

`packages/animation-engine` implements `LessonPlayer` (chapter/scene
progression, segmented progress bar, back/exit, `AccessibilityInfo`-driven
reduced motion) and `SceneRenderer` (the type dispatch switch). 15 of the
30 scene types have a bespoke component today — the narrative and
interactive types needed to prove the tap/swipe/drag/choice progression
model end to end, plus the data-visualization types the Phase 4 showcase
courses need first:

`textReveal`, `visualMetaphor`, `quote`, `numberCounter`, `comparison`,
`beforeAfter`, `timeline`, `character`, `summary`, `completion`,
`multipleChoice`, `trueFalse`, `slider`, `reflection`, `flashcard`.

The remaining 15 (`barChart`, `lineChart`, `pieChart`, `processFlow`,
`causeEffect`, `map`, `saudiMap`, `stack`, `network`, `calendar`, `money`,
`compoundGrowth`, `decisionTree`, `dragInteraction`, `tapInteraction`) fall
through to `FallbackScene` — it reads `accessibility.label`, never crashes
the player, and is visually built out alongside the Phase 4 lessons that
actually need each one (e.g. `money`/`compoundGrowth` for "وش يعني
التضخم؟"). `apps/mobile/app/lesson/[courseId].tsx` currently plays one
hardcoded smoke-test chapter (`src/content/demoLesson.ts`) regardless of
`courseId` — real per-course loading is Phase 5.
