import { useMemo } from "react";
import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Canvas, Path, Skia, LinearGradient, vec } from "@shopify/react-native-skia";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { CompoundGrowthScene as CompoundGrowthSceneType } from "@basirah/content-schema";

const CANVAS_W = 300;
const CANVAS_H = 180;
const SAMPLE_POINTS = 60;

/** Real Skia-drawn curve — the concrete "1% better every day" compounding visual from spec §13 Chapter 2. */
export function CompoundGrowthScene({ scene, reducedMotion }: SceneComponentProps<CompoundGrowthSceneType>) {
  const { spacing, colors } = useSceneTheme();
  const { principal, ratePercent, periods, caption } = scene.content;

  const { path, endValue } = useMemo(() => {
    const values: number[] = [];
    for (let i = 0; i <= SAMPLE_POINTS; i++) {
      const t = (i / SAMPLE_POINTS) * periods;
      values.push(principal * Math.pow(1 + ratePercent / 100, t));
    }
    const maxV = Math.max(...values);
    const minV = Math.min(...values);
    const range = maxV - minV || 1;

    const p = Skia.Path.Make();
    values.forEach((v, i) => {
      const x = (i / SAMPLE_POINTS) * CANVAS_W;
      const y = CANVAS_H - ((v - minV) / range) * (CANVAS_H - 12) - 6;
      if (i === 0) p.moveTo(x, y);
      else p.lineTo(x, y);
    });
    return { path: p, endValue: values[values.length - 1] ?? principal };
  }, [principal, ratePercent, periods]);

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: spacing.xl }}>
      <Animated.View entering={reducedMotion ? undefined : FadeIn.duration(600)}>
        <Canvas style={{ width: CANVAS_W, height: CANVAS_H, alignSelf: "center" }}>
          <Path path={path} style="stroke" strokeWidth={4} strokeCap="round" strokeJoin="round">
            <LinearGradient start={vec(0, 0)} end={vec(CANVAS_W, 0)} colors={[colors.palm, colors.dune]} />
          </Path>
        </Canvas>
      </Animated.View>
      <View style={{ alignItems: "center", gap: spacing.xs }}>
        <SceneText variant="numberDisplay" color={colors.dune}>
          ×{(endValue / principal).toFixed(1)}
        </SceneText>
        {caption && (
          <SceneText variant="bodyLarge" color={colors.inkSoft} style={{ textAlign: "center" }}>
            {caption.ar}
          </SceneText>
        )}
      </View>
    </View>
  );
}
