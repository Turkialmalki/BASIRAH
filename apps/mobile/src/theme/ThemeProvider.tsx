import React, { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { theme, typography, spacing, radius, motion, type ThemeName } from "@basirah/ui";

type BasirahTheme = {
  name: ThemeName;
  colors: (typeof theme)["light"]["colors"];
  typography: typeof typography;
  spacing: typeof spacing;
  radius: typeof radius;
  motion: typeof motion;
};

const ThemeContext = createContext<BasirahTheme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const value = useMemo<BasirahTheme>(() => {
    const name: ThemeName = scheme === "dark" ? "dark" : "light";
    return { name, colors: theme[name].colors, typography, spacing, radius, motion };
  }, [scheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useBasirahTheme(): BasirahTheme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useBasirahTheme must be used within <ThemeProvider>");
  return ctx;
}
