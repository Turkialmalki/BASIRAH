import type { Scene } from "@basirah/content-schema";
import type { SceneComponentProps, SceneResponse } from "./types";
import { TextRevealScene } from "./scenes/TextRevealScene";
import { VisualMetaphorScene } from "./scenes/VisualMetaphorScene";
import { QuoteScene } from "./scenes/QuoteScene";
import { NumberCounterScene } from "./scenes/NumberCounterScene";
import { ComparisonScene } from "./scenes/ComparisonScene";
import { BeforeAfterScene } from "./scenes/BeforeAfterScene";
import { TimelineScene } from "./scenes/TimelineScene";
import { CharacterScene } from "./scenes/CharacterScene";
import { SummaryScene } from "./scenes/SummaryScene";
import { CompletionScene } from "./scenes/CompletionScene";
import { MultipleChoiceScene } from "./scenes/MultipleChoiceScene";
import { TrueFalseScene } from "./scenes/TrueFalseScene";
import { SliderScene } from "./scenes/SliderScene";
import { ReflectionScene } from "./scenes/ReflectionScene";
import { FlashcardScene } from "./scenes/FlashcardScene";
import { MoneyScene } from "./scenes/MoneyScene";
import { CompoundGrowthScene } from "./scenes/CompoundGrowthScene";
import { SaudiMapScene } from "./scenes/SaudiMapScene";
import { BarChartScene } from "./scenes/BarChartScene";
import { StackScene } from "./scenes/StackScene";
import { FallbackScene } from "./scenes/FallbackScene";

/**
 * Dispatches a `Scene` to its type-specific component. This switch is the
 * thing that breaks (intentionally — see docs/scene-engine.md) if a new
 * scene type is added to the schema without a matching `case` here; the
 * `default` arm is what actually still handles every unimplemented type
 * today via `FallbackScene`, so the app never crashes on an unfinished
 * type — it degrades to a plain, accessible tap-to-continue screen.
 */
export function SceneRenderer(props: SceneComponentProps<Scene>) {
  const { scene } = props;
  switch (scene.type) {
    case "textReveal":
      return <TextRevealScene {...props} scene={scene} />;
    case "visualMetaphor":
      return <VisualMetaphorScene {...props} scene={scene} />;
    case "quote":
      return <QuoteScene {...props} scene={scene} />;
    case "numberCounter":
      return <NumberCounterScene {...props} scene={scene} />;
    case "comparison":
      return <ComparisonScene {...props} scene={scene} />;
    case "beforeAfter":
      return <BeforeAfterScene {...props} scene={scene} />;
    case "timeline":
      return <TimelineScene {...props} scene={scene} />;
    case "character":
      return <CharacterScene {...props} scene={scene} />;
    case "summary":
      return <SummaryScene {...props} scene={scene} />;
    case "completion":
      return <CompletionScene {...props} scene={scene} />;
    case "multipleChoice":
      return <MultipleChoiceScene {...props} scene={scene} />;
    case "trueFalse":
      return <TrueFalseScene {...props} scene={scene} />;
    case "slider":
      return <SliderScene {...props} scene={scene} />;
    case "reflection":
      return <ReflectionScene {...props} scene={scene} />;
    case "flashcard":
      return <FlashcardScene {...props} scene={scene} />;
    case "money":
      return <MoneyScene {...props} scene={scene} />;
    case "compoundGrowth":
      return <CompoundGrowthScene {...props} scene={scene} />;
    case "saudiMap":
      return <SaudiMapScene {...props} scene={scene} />;
    case "barChart":
      return <BarChartScene {...props} scene={scene} />;
    case "stack":
      return <StackScene {...props} scene={scene} />;
    default:
      return <FallbackScene {...props} scene={scene} />;
  }
}

/** Scene types that manage their own advance timing (feedback delays, gestures,
 * text input) — the player must NOT attach a global tap-to-advance for these. */
const SELF_ADVANCING_TYPES = new Set<Scene["type"]>([
  "multipleChoice",
  "trueFalse",
  "slider",
  "reflection",
  "flashcard",
]);

export function isSelfAdvancing(scene: Scene): boolean {
  return SELF_ADVANCING_TYPES.has(scene.type) || scene.interaction?.kind === "choice" || scene.interaction?.kind === "textInput";
}

export type { SceneComponentProps, SceneResponse };
