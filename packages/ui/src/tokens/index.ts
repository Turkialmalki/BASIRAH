export * from "./colors";
export * from "./colors.dark";
export * from "./typography";
export * from "./layout";

import { colors } from "./colors";
import { colorsDark } from "./colors.dark";

export const theme = {
  light: { colors },
  dark: { colors: colorsDark },
} as const;

export type ThemeName = keyof typeof theme;
