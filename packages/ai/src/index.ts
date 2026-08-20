/**
 * Basirah AI lesson-generation pipeline.
 *
 * Pipeline stages (spec §22-24 — "User Prompt -> classify topic ->
 * retrieve trustworthy sources -> create factual outline -> generate
 * Arabic explanation -> generate scene plan -> validate JSON schema ->
 * moderation -> render visual lesson"):
 *   classifyTopic -> retrieveSources -> buildFactualOutline
 *   -> generateArabicExplanation -> generateScenePlan
 *   -> validateSceneSchema -> moderate -> DRAFT course row
 *
 * `runLessonGenerationPipeline` (pipeline.ts) orchestrates all of this
 * against a `LessonGenerator` implementation — `PlaceholderLessonGenerator`
 * (generators/placeholder.ts) is the one wired up today (deterministic
 * templates, no live model calls — this build's explicit scope decision
 * for Phase 8). A real model-backed generator implementing the same
 * interface is a drop-in swap.
 */
export type PipelineStage =
  | "classifyTopic"
  | "retrieveSources"
  | "buildFactualOutline"
  | "generateArabicExplanation"
  | "generateScenePlan"
  | "validateSceneSchema"
  | "moderate";

export const PIPELINE_STAGES: readonly PipelineStage[] = [
  "classifyTopic",
  "retrieveSources",
  "buildFactualOutline",
  "generateArabicExplanation",
  "generateScenePlan",
  "validateSceneSchema",
  "moderate",
];

export { runLessonGenerationPipeline } from "./pipeline";
export type { LessonGenerator, Outline, ModerationResult, SourceRef, PipelineResult } from "./pipeline";
export { PlaceholderLessonGenerator } from "./generators/placeholder";
