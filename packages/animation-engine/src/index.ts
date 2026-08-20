/**
 * Animation engine — Reanimated/Skia/Rive/Lottie primitives that interpret
 * an `AnimationSpec` (see @basirah/content-schema) and drive a scene's
 * motion. Scaffolded in Phase 1; implemented in Phase 3 (scene engine).
 *
 * Planned exports:
 *   - <SceneRenderer scene={scene} /> — dispatches on scene.type
 *   - useAnimationSpec(spec: AnimationSpec) — resolves a worklet-driven
 *     shared value timeline from a declarative spec
 *   - <SkiaChart /> primitives for barChart/lineChart/pieChart/compoundGrowth
 *   - <RiveCharacter /> for the `character` scene type
 */
export const ANIMATION_ENGINE_VERSION = "0.1.0-scaffold";
