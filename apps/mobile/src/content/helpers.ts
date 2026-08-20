import { SceneSchema, type Chapter, type Scene } from "@basirah/content-schema";

/** Validates a scene object against `SceneSchema` at module load — a malformed scene fails fast, not at render time. */
export function scene(input: unknown): Scene {
  return SceneSchema.parse(input);
}

/**
 * The shape a local demo course registers with, until Phase 5 replaces
 * this with a real `courses` table query returning `@basirah/content-schema`'s
 * `Course` type directly. `sources` mirrors `Course.sources` for factual
 * courses that cite public information (spec §15/§25) — surfaced under
 * "المصادر" once that UI exists.
 */
export interface CourseContent {
  slug: string;
  title: string;
  chapters: Chapter[];
  sources?: { title: string; url?: string }[];
}
