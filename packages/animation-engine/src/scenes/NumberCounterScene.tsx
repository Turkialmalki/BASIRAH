import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { NumberCounterScene as NumberCounterSceneType } from "@basirah/content-schema";

const DURATION_MS = 1200;
// ease-out cubic — fast start, gentle settle, matches motion.easing.decelerate intent
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export function NumberCounterScene({ scene, reducedMotion }: SceneComponentProps<NumberCounterSceneType>) {
  const { spacing, colors } = useSceneTheme();
  const { from, to, suffix, caption } = scene.content;
  const [value, setValue] = useState(reducedMotion ? to : from);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setValue(to);
      return;
    }
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(1, elapsed / DURATION_MS);
      setValue(from + (to - from) * ease(t));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [from, to, reducedMotion]);

  const isInt = Number.isInteger(from) && Number.isInteger(to);
  const display = isInt ? Math.round(value).toLocaleString("ar-SA") : value.toFixed(1);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md }}>
      <SceneText variant="numberDisplay" color={colors.dune}>
        {display}
        {suffix}
      </SceneText>
      {caption && (
        <SceneText variant="bodyLarge" color={colors.inkSoft} style={{ textAlign: "center" }}>
          {caption.ar}
        </SceneText>
      )}
    </View>
  );
}
