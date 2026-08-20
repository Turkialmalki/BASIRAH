import { createContext, useContext } from "react";
import type { SceneResponse } from "./types";

/**
 * Read-only map of every scene response collected so far this lesson,
 * keyed by scene id — provided by `LessonPlayer`, updated as each scene
 * completes. Lets a later scene (e.g. a `money` scene showing computed
 * purchasing power) read an earlier interactive scene's answer (e.g. the
 * salary/inflation-rate/years sliders) without the engine needing a
 * general "formula" mini-language — each scene component decides how to
 * interpret prior responses relevant to it, via `content.computedFrom`
 * or similar per-type fields.
 */
export const SceneResponsesContext = createContext<Record<string, SceneResponse>>({});

export function useSceneResponses(): Record<string, SceneResponse> {
  return useContext(SceneResponsesContext);
}

/** Convenience getter for the common case of reading back a `slider` scene's numeric answer. */
export function getSliderResponse(
  responses: Record<string, SceneResponse>,
  sceneId: string | undefined
): number | undefined {
  if (!sceneId) return undefined;
  const r = responses[sceneId];
  return r?.kind === "slider" ? r.value : undefined;
}
