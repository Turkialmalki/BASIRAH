import { z } from "zod";
import { AccessibilitySpec, LocalizedText, SceneBase, VisualAsset } from "./base";

/**
 * One Zod object per scene `type`. Each extends SceneBase with a
 * type-specific `content` payload. Combined into `SceneSchema` at the
 * bottom as a discriminated union, with `Scene` as its inferred TS type
 * (a discriminated union keyed on `type`, per spec section 11).
 */

const scene = <Type extends string, Content extends z.ZodTypeAny>(
  type: Type,
  content: Content
) =>
  SceneBase.extend({
    type: z.literal(type),
    content,
  });

// -- Narrative --------------------------------------------------------------

export const TextRevealScene = scene(
  "textReveal",
  z.object({
    lines: z.array(LocalizedText).min(1),
    /** visual weight, maps to typography tokens (see design-system.md) */
    style: z.enum(["displayLarge", "heading1", "heading2", "bodyLarge", "quote"]).default("heading2"),
  })
);

export const VisualMetaphorScene = scene(
  "visualMetaphor",
  z.object({
    caption: LocalizedText,
    asset: VisualAsset,
    /** e.g. "huge-jump-to-stairs" — identifies which Skia/Rive metaphor composition to mount */
    metaphorKey: z.string(),
  })
);

export const CharacterScene = scene(
  "character",
  z.object({
    characterKey: z.string(),
    dialogue: LocalizedText,
    emotion: z.enum(["neutral", "happy", "thinking", "surprised", "encouraging"]).default("neutral"),
  })
);

export const QuoteScene = scene(
  "quote",
  z.object({
    quote: LocalizedText,
    attribution: LocalizedText.optional(),
  })
);

export const SummaryScene = scene(
  "summary",
  z.object({
    heading: LocalizedText,
    bullets: z.array(LocalizedText).min(1).max(5),
  })
);

export const CompletionScene = scene(
  "completion",
  z.object({
    heading: LocalizedText,
    subheading: LocalizedText.optional(),
    statsShown: z.array(z.enum(["streak", "minutes", "xp", "accuracy"])).default([]),
  })
);

// -- Data & diagrams ----------------------------------------------------------

export const ComparisonScene = scene(
  "comparison",
  z.object({
    left: z.object({ label: LocalizedText, asset: VisualAsset.optional() }),
    right: z.object({ label: LocalizedText, asset: VisualAsset.optional() }),
    caption: LocalizedText.optional(),
  })
);

export const TimelineScene = scene(
  "timeline",
  z.object({
    title: LocalizedText.optional(),
    events: z
      .array(
        z.object({
          date: z.string(),
          label: LocalizedText,
          asset: VisualAsset.optional(),
        })
      )
      .min(2),
  })
);

export const NumberCounterScene = scene(
  "numberCounter",
  z.object({
    from: z.number(),
    to: z.number(),
    /** e.g. "%", "SAR", "" */
    suffix: z.string().default(""),
    caption: LocalizedText.optional(),
  })
);

export const BarChartScene = scene(
  "barChart",
  z.object({
    title: LocalizedText.optional(),
    bars: z.array(z.object({ label: LocalizedText, value: z.number() })).min(1),
  })
);

export const LineChartScene = scene(
  "lineChart",
  z.object({
    title: LocalizedText.optional(),
    series: z.array(z.object({ x: z.number(), y: z.number() })).min(2),
  })
);

export const PieChartScene = scene(
  "pieChart",
  z.object({
    title: LocalizedText.optional(),
    slices: z.array(z.object({ label: LocalizedText, value: z.number().positive() })).min(2),
  })
);

export const ProcessFlowScene = scene(
  "processFlow",
  z.object({
    steps: z.array(z.object({ label: LocalizedText, asset: VisualAsset.optional() })).min(2),
  })
);

export const CauseEffectScene = scene(
  "causeEffect",
  z.object({
    cause: z.object({ label: LocalizedText, asset: VisualAsset.optional() }),
    effect: z.object({ label: LocalizedText, asset: VisualAsset.optional() }),
  })
);

export const BeforeAfterScene = scene(
  "beforeAfter",
  z.object({
    before: z.object({ label: LocalizedText, asset: VisualAsset }),
    after: z.object({ label: LocalizedText, asset: VisualAsset }),
  })
);

export const MapScene = scene(
  "map",
  z.object({
    title: LocalizedText.optional(),
    markers: z.array(z.object({ lat: z.number(), lng: z.number(), label: LocalizedText })),
  })
);

export const SaudiMapScene = scene(
  "saudiMap",
  z.object({
    title: LocalizedText.optional(),
    /** region codes, e.g. "riyadh", "makkah", "eastern" */
    highlightedRegions: z.array(z.string()).default([]),
    markers: z
      .array(z.object({ region: z.string(), label: LocalizedText, value: z.string().optional() }))
      .default([]),
  })
);

export const StackScene = scene(
  "stack",
  z.object({
    title: LocalizedText.optional(),
    items: z.array(z.object({ label: LocalizedText, asset: VisualAsset.optional() })).min(2),
  })
);

export const NetworkScene = scene(
  "network",
  z.object({
    nodes: z.array(z.object({ id: z.string(), label: LocalizedText })).min(2),
    edges: z.array(z.object({ from: z.string(), to: z.string() })),
  })
);

export const CalendarScene = scene(
  "calendar",
  z.object({
    title: LocalizedText.optional(),
    highlightedDays: z.array(z.number().int().min(1).max(365)),
    totalDays: z.number().int().positive().default(365),
  })
);

export const MoneyScene = scene(
  "money",
  z.object({
    /** minor units (halalas) to keep math exact; render via SAR formatter */
    amountHalalas: z.number().int(),
    caption: LocalizedText.optional(),
    basket: z.array(z.object({ label: LocalizedText, asset: VisualAsset.optional() })).default([]),
    /** how many basket items disappear at full erosion, for the "purchasing power shrinks" animation */
    itemsLostAtFullErosion: z.number().int().nonnegative().optional(),
    /**
     * Ties this scene's displayed value to an earlier `slider` scene's live
     * answer instead of the static `amountHalalas` above — lets an
     * "inflation simulator" money scene react to prior salary/rate/years
     * sliders the user just set. Renderer looks these ids up in the
     * LessonPlayer's response map (see @basirah/animation-engine
     * `SceneResponsesContext`); falls back to `amountHalalas` if any id is
     * missing or its scene hasn't been answered yet.
     */
    computedFrom: z
      .object({
        salarySceneId: z.string().uuid(),
        inflationRateSceneId: z.string().uuid(),
        yearsSceneId: z.string().uuid(),
      })
      .optional(),
  })
);

export const CompoundGrowthScene = scene(
  "compoundGrowth",
  z.object({
    principal: z.number().positive(),
    ratePercent: z.number(),
    periods: z.number().int().positive(),
    caption: LocalizedText.optional(),
  })
);

export const DecisionTreeScene = scene(
  "decisionTree",
  z.object({
    prompt: LocalizedText,
    branches: z
      .array(
        z.object({
          label: LocalizedText,
          leadsTo: z.string(),
          outcome: LocalizedText.optional(),
        })
      )
      .min(2),
  })
);

// -- Interactive --------------------------------------------------------------

export const SliderScene = scene(
  "slider",
  z.object({
    prompt: LocalizedText,
    min: z.number(),
    max: z.number(),
    step: z.number().positive().default(1),
    defaultValue: z.number(),
    unit: z.string().default(""),
    /** identifies which visual/live computation reacts to this slider */
    boundVisualKey: z.string().optional(),
  })
);

export const DragInteractionScene = scene(
  "dragInteraction",
  z.object({
    prompt: LocalizedText,
    items: z.array(z.object({ id: z.string(), label: LocalizedText })).min(2),
    targets: z.array(z.object({ id: z.string(), label: LocalizedText })).min(1),
    correctMapping: z.record(z.string(), z.string()),
  })
);

export const TapInteractionScene = scene(
  "tapInteraction",
  z.object({
    prompt: LocalizedText,
    asset: VisualAsset,
    hotspots: z.array(
      z.object({ id: z.string(), x: z.number(), y: z.number(), label: LocalizedText })
    ),
  })
);

export const MultipleChoiceScene = scene(
  "multipleChoice",
  z.object({
    question: LocalizedText,
    options: z.array(z.object({ id: z.string(), label: LocalizedText })).min(2).max(6),
    correctOptionId: z.string(),
    correctFeedback: LocalizedText,
    incorrectFeedback: LocalizedText,
  })
);

export const TrueFalseScene = scene(
  "trueFalse",
  z.object({
    statement: LocalizedText,
    correctAnswer: z.boolean(),
    correctFeedback: LocalizedText,
    incorrectFeedback: LocalizedText,
  })
);

export const ReflectionScene = scene(
  "reflection",
  z.object({
    prompt: LocalizedText,
    placeholder: LocalizedText.optional(),
    maxLength: z.number().int().positive().default(280),
    allowReminder: z.boolean().default(false),
  })
);

export const FlashcardScene = scene(
  "flashcard",
  z.object({
    front: LocalizedText,
    back: LocalizedText,
  })
);

/** Discriminated union of every scene type, keyed on `type`. */
export const SceneSchema = z.discriminatedUnion("type", [
  TextRevealScene,
  VisualMetaphorScene,
  ComparisonScene,
  TimelineScene,
  NumberCounterScene,
  BarChartScene,
  LineChartScene,
  PieChartScene,
  ProcessFlowScene,
  CauseEffectScene,
  BeforeAfterScene,
  MapScene,
  SaudiMapScene,
  CharacterScene,
  QuoteScene,
  StackScene,
  NetworkScene,
  CalendarScene,
  MoneyScene,
  CompoundGrowthScene,
  DecisionTreeScene,
  SliderScene,
  DragInteractionScene,
  TapInteractionScene,
  MultipleChoiceScene,
  TrueFalseScene,
  ReflectionScene,
  SummaryScene,
  FlashcardScene,
  CompletionScene,
]);

export type Scene = z.infer<typeof SceneSchema>;
export type SceneType = Scene["type"];

// re-export for consumers that only need the accessibility contract
export type { AccessibilitySpec };

/**
 * Per-type inferred TS types, narrowed out of the `Scene` union rather than
 * `z.infer`'d separately — guarantees these can never drift from what
 * `SceneSchema` actually accepts. Each name shadows its same-named schema
 * const above; that's valid TS (types and values are separate namespaces)
 * and lets scene components import `{ TextRevealScene }` as a type the
 * same way they'd import any other type.
 */
export type TextRevealScene = Extract<Scene, { type: "textReveal" }>;
export type VisualMetaphorScene = Extract<Scene, { type: "visualMetaphor" }>;
export type ComparisonScene = Extract<Scene, { type: "comparison" }>;
export type TimelineScene = Extract<Scene, { type: "timeline" }>;
export type NumberCounterScene = Extract<Scene, { type: "numberCounter" }>;
export type BarChartScene = Extract<Scene, { type: "barChart" }>;
export type LineChartScene = Extract<Scene, { type: "lineChart" }>;
export type PieChartScene = Extract<Scene, { type: "pieChart" }>;
export type ProcessFlowScene = Extract<Scene, { type: "processFlow" }>;
export type CauseEffectScene = Extract<Scene, { type: "causeEffect" }>;
export type BeforeAfterScene = Extract<Scene, { type: "beforeAfter" }>;
export type MapScene = Extract<Scene, { type: "map" }>;
export type SaudiMapScene = Extract<Scene, { type: "saudiMap" }>;
export type CharacterScene = Extract<Scene, { type: "character" }>;
export type QuoteScene = Extract<Scene, { type: "quote" }>;
export type StackScene = Extract<Scene, { type: "stack" }>;
export type NetworkScene = Extract<Scene, { type: "network" }>;
export type CalendarScene = Extract<Scene, { type: "calendar" }>;
export type MoneyScene = Extract<Scene, { type: "money" }>;
export type CompoundGrowthScene = Extract<Scene, { type: "compoundGrowth" }>;
export type DecisionTreeScene = Extract<Scene, { type: "decisionTree" }>;
export type SliderScene = Extract<Scene, { type: "slider" }>;
export type DragInteractionScene = Extract<Scene, { type: "dragInteraction" }>;
export type TapInteractionScene = Extract<Scene, { type: "tapInteraction" }>;
export type MultipleChoiceScene = Extract<Scene, { type: "multipleChoice" }>;
export type TrueFalseScene = Extract<Scene, { type: "trueFalse" }>;
export type ReflectionScene = Extract<Scene, { type: "reflection" }>;
export type SummaryScene = Extract<Scene, { type: "summary" }>;
export type FlashcardScene = Extract<Scene, { type: "flashcard" }>;
export type CompletionScene = Extract<Scene, { type: "completion" }>;
