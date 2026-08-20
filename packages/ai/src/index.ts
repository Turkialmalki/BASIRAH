/**
 * Basirah AI lesson-generation pipeline (Phase 8).
 *
 * Pipeline stages (see docs/architecture.md §23 AI Content Studio):
 *   classifyTopic -> retrieveSources -> buildFactualOutline
 *   -> generateArabicExplanation -> generateScenePlan
 *   -> validateAgainstSceneSchema -> moderate -> DRAFT course row
 *
 * Every stage is a pure async function so it can be unit-tested and
 * orchestrated independently (queue worker on the admin side). Scaffolded
 * in Phase 1; implemented in Phase 8.
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
