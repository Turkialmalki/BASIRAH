import { SceneSchema, type Chapter, type Scene } from "@basirah/content-schema";
import type { PipelineStage } from "./index";

export interface Outline {
  category: string;
  title: string;
  learningObjectives: string[];
  chapterTitles: string[];
}

export interface ModerationResult {
  flagged: boolean;
  reasons: string[];
}

export interface SourceRef {
  title: string;
  url?: string;
}

/**
 * The pipeline is written against this interface, not any specific model
 * provider — `packages/ai/src/generators/placeholder.ts` implements it
 * with deterministic templates (no live API calls, per this build's
 * scope decision); a real `ClaudeLessonGenerator` implementing the same
 * interface is a drop-in swap, no orchestration changes needed.
 */
export interface LessonGenerator {
  classifyTopic(prompt: string): Promise<{ category: string; confidence: number }>;
  retrieveSources(prompt: string, category: string): Promise<SourceRef[]>;
  buildFactualOutline(prompt: string, category: string): Promise<Outline>;
  generateArabicExplanation(outline: Outline, chapterTitle: string, chapterIndex: number): Promise<string[]>;
  generateQuiz(outline: Outline): Promise<{
    question: string;
    options: string[];
    correctIndex: number;
  }>;
  moderate(text: string): Promise<ModerationResult>;
}

export interface PipelineResult {
  ok: boolean;
  stageReached: PipelineStage | "done";
  error?: string;
  outline?: Outline;
  sources?: SourceRef[];
  chapters?: Chapter[];
}

/**
 * Deterministic scene ids so a re-run of the same prompt is reproducible
 * (helps debugging/testing), not random each time. Every segment must be
 * plain hex — a UUID has no room for anything else (an earlier version
 * of this embedded the literal string "ai00" in a hex segment, which
 * `SceneSchema`'s `z.string().uuid()` correctly rejected the moment this
 * was run against a real request instead of just unit-tested in isolation).
 */
function hash32(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash;
}

/** 32 hex characters, deterministic from (seed, index) — enough to fill every segment of a UUID. */
function hex32(seed: string, index: number): string {
  let out = "";
  for (let i = 0; i < 4; i++) {
    out += hash32(`${seed}:${index}:${i}`).toString(16).padStart(8, "0");
  }
  return out;
}

function stableId(seed: string, index: number): string {
  const h = hex32(seed, index);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

/**
 * Runs every stage in order (spec §22), stopping and reporting exactly
 * where it stopped if any stage fails or moderation flags the content —
 * a generation NEVER auto-publishes (the resulting `Chapter[]` is meant
 * for a `courses` row created with `status: 'draft'`, same as
 * `scripts/seedCourses.ts`; the admin's "Review & Publish" page is the
 * mandatory human gate, spec §24).
 */
export async function runLessonGenerationPipeline(prompt: string, generator: LessonGenerator): Promise<PipelineResult> {
  const trimmed = prompt.trim();
  if (!trimmed) return { ok: false, stageReached: "classifyTopic", error: "empty prompt" };

  const promptModeration = await generator.moderate(trimmed);
  if (promptModeration.flagged) {
    return { ok: false, stageReached: "moderate", error: `flagged: ${promptModeration.reasons.join(", ")}` };
  }

  const { category } = await generator.classifyTopic(trimmed);
  const sources = await generator.retrieveSources(trimmed, category);
  const outline = await generator.buildFactualOutline(trimmed, category);

  const chapters: Chapter[] = [];
  for (let i = 0; i < outline.chapterTitles.length; i++) {
    const chapterTitle = outline.chapterTitles[i]!;
    const lines = await generator.generateArabicExplanation(outline, chapterTitle, i);

    const joined = lines.join(" ");
    const moderation = await generator.moderate(joined);
    if (moderation.flagged) {
      return { ok: false, stageReached: "moderate", error: `chapter "${chapterTitle}" flagged: ${moderation.reasons.join(", ")}` };
    }

    const scenes: Scene[] = [
      SceneSchema.parse({
        id: stableId(trimmed + chapterTitle, i * 10 + 1),
        type: "textReveal",
        duration: Math.max(4, lines.length * 3),
        content: { lines: lines.map((ar) => ({ ar })), style: "heading1" },
        accessibility: { label: chapterTitle },
      }),
    ];

    // Last chapter gets a quiz + completion, matching the shape of the hand-authored showcase courses.
    if (i === outline.chapterTitles.length - 1) {
      const quiz = await generator.generateQuiz(outline);
      scenes.push(
        SceneSchema.parse({
          id: stableId(trimmed, i * 10 + 2),
          type: "multipleChoice",
          duration: 8,
          content: {
            question: { ar: quiz.question },
            options: quiz.options.map((ar, idx) => ({ id: String.fromCharCode(97 + idx), label: { ar } })),
            correctOptionId: String.fromCharCode(97 + quiz.correctIndex),
            correctFeedback: { ar: "بالضبط 👏" },
            incorrectFeedback: { ar: "قريب — راجع الفكرة الرئيسية مرة ثانية." },
          },
          interaction: { kind: "choice", required: true },
          accessibility: { label: quiz.question },
        }),
        SceneSchema.parse({
          id: stableId(trimmed, i * 10 + 3),
          type: "completion",
          duration: 4,
          content: { heading: { ar: "تم 👌" }, subheading: { ar: outline.title }, statsShown: ["minutes"] },
          accessibility: { label: `تهانينا، أكملت درس ${outline.title}` },
        })
      );
    }

    chapters.push({ id: stableId(trimmed, i), order: i, title: { ar: chapterTitle }, scenes });
  }

  return { ok: true, stageReached: "done", outline, sources, chapters };
}
