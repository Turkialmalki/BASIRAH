import { createContext, useContext } from "react";
import { colors, typography, spacing, radius, motion } from "@basirah/ui";
import type { ColorPalette } from "@basirah/ui";

/**
 * The scene engine renders inside whatever host app mounts it — it does
 * not own theme/color-scheme state. The host (apps/mobile's ThemeProvider)
 * passes its resolved theme into <LessonPlayer theme={...} />, which
 * provides it down to every scene component via this context. Falls back
 * to the light palette so scene components remain testable in isolation.
 */
export type SceneTheme = {
  colors: ColorPalette;
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  motion: typeof motion;
};

const defaultTheme: SceneTheme = { colors, typography, spacing, radius, motion };

export const SceneThemeContext = createContext<SceneTheme>(defaultTheme);

export function useSceneTheme(): SceneTheme {
  return useContext(SceneThemeContext);
}
