import type { Scene } from "@basirah/content-schema";

/** The interaction "response" payload a scene reports up when it completes,
 * shaped to slot directly into `user_scene_progress.interaction_response`. */
export type SceneResponse =
  | { kind: "none" }
  | { kind: "choice"; optionId: string; correct?: boolean }
  | { kind: "boolean"; value: boolean; correct?: boolean }
  | { kind: "slider"; value: number }
  | { kind: "text"; value: string };

export interface SceneComponentProps<S extends Scene = Scene> {
  scene: S;
  /** Call once the scene's interaction is satisfied (or immediately, for passive scenes). */
  onAdvance: (response?: SceneResponse) => void;
  reducedMotion: boolean;
}
