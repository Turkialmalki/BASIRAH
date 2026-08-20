import { z } from "zod";

/**
 * Shared building blocks used across every scene type.
 * See docs/scene-engine.md for the full specification.
 */

/** Motion primitives supported by the animation engine (Reanimated/Skia/Rive/Lottie). */
export const AnimationKind = z.enum([
  "fade",
  "slide",
  "scale",
  "spring",
  "drawPath",
  "count",
  "morph",
  "rotate",
  "parallax",
  "stagger",
  "maskReveal",
  "timelineProgression",
  "physics",
  "none",
]);
export type AnimationKind = z.infer<typeof AnimationKind>;

export const AnimationSpec = z.object({
  kind: AnimationKind,
  /** ms */
  duration: z.number().int().positive().default(600),
  /** ms, delay before this animation begins relative to scene entry */
  delay: z.number().int().nonnegative().default(0),
  easing: z
    .enum(["linear", "easeIn", "easeOut", "easeInOut", "spring", "bounce"])
    .default("easeOut"),
  /** which runtime should drive this animation */
  engine: z.enum(["reanimated", "skia", "rive", "lottie"]).default("reanimated"),
  /** optional stagger interval (ms) applied to child elements */
  staggerInterval: z.number().int().nonnegative().optional(),
  /** Rive/Lottie asset reference, when engine requires an asset */
  assetRef: z.string().optional(),
  /** name of a Rive state machine input this animation drives, if any */
  riveStateMachineInput: z.string().optional(),
});
export type AnimationSpec = z.infer<typeof AnimationSpec>;

export const InteractionKind = z.enum([
  "tap",
  "swipe",
  "drag",
  "choice",
  "slider",
  "textInput",
  "longPress",
  "none",
]);
export type InteractionKind = z.infer<typeof InteractionKind>;

export const InteractionSpec = z.object({
  kind: InteractionKind,
  /** whether the scene auto-advances or waits for this interaction */
  required: z.boolean().default(true),
  /** haptic feedback style on completion */
  haptic: z.enum(["light", "medium", "heavy", "success", "warning", "none"]).default("light"),
  /** sound effect asset key, if any */
  sfx: z.string().optional(),
});
export type InteractionSpec = z.infer<typeof InteractionSpec>;

export const AccessibilitySpec = z.object({
  /** VoiceOver / screen-reader label, required — animation cannot be the only carrier of meaning */
  label: z.string().min(1),
  hint: z.string().optional(),
  /** static fallback description shown/read when reduced-motion is enabled */
  reducedMotionDescription: z.string().optional(),
  /** minimum touch target in dp, per platform guidance (defaults to 44) */
  minTouchTarget: z.number().int().positive().default(44),
});
export type AccessibilitySpec = z.infer<typeof AccessibilitySpec>;

export const AnalyticsMetadata = z.object({
  /** PostHog event name fired when this scene is viewed */
  viewedEvent: z.string().default("scene_viewed"),
  /** PostHog event name fired when the required interaction completes */
  completedEvent: z.string().default("interaction_completed"),
  /** free-form, non-sensitive properties merged into both events */
  properties: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).default({}),
});
export type AnalyticsMetadata = z.infer<typeof AnalyticsMetadata>;

/** Arabic-first localized string. `ar` is required; `en` is optional (future secondary language). */
export const LocalizedText = z.object({
  ar: z.string().min(1),
  en: z.string().optional(),
});
export type LocalizedText = z.infer<typeof LocalizedText>;

export const VisualAsset = z.object({
  kind: z.enum(["illustration", "photo", "icon", "rive", "lottie", "skiaScene"]),
  ref: z.string(),
  /** aspect ratio width/height, for layout reservation before the asset loads */
  aspectRatio: z.number().positive().optional(),
  altText: z.string(),
});
export type VisualAsset = z.infer<typeof VisualAsset>;

/**
 * Fields shared by every scene, regardless of type.
 * A scene is a step within a Chapter; a Chapter is a step within a Course.
 */
export const SceneBase = z.object({
  id: z.string().uuid(),
  /** estimated seconds to complete this scene, used for progress + duration estimates */
  duration: z.number().int().positive(),
  animation: AnimationSpec.optional(),
  interaction: InteractionSpec.optional(),
  accessibility: AccessibilitySpec,
  analytics: AnalyticsMetadata.default({
    viewedEvent: "scene_viewed",
    completedEvent: "interaction_completed",
    properties: {},
  }),
});
export type SceneBase = z.infer<typeof SceneBase>;
