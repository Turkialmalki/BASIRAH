import { View } from "react-native";
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { VisualMetaphorScene as VisualMetaphorSceneType } from "@basirah/content-schema";

/**
 * Placeholder abstract composition — a breathing shape stands in for the
 * real illustration/Skia scene the `metaphorKey` will resolve to once the
 * illustration system (spec §40) exists. Every lesson-specific metaphor
 * (huge-jump-to-stairs, wallet-losing-items, ...) gets its own bespoke
 * Skia composition in Phase 4, keyed off the same `metaphorKey`.
 */
export function VisualMetaphorScene({ scene, reducedMotion }: SceneComponentProps<VisualMetaphorSceneType>) {
  const { spacing, colors, radius } = useSceneTheme();
  const breathe = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) return;
    breathe.value = withRepeat(withSequence(withTiming(1, { duration: 1200 }), withTiming(0, { duration: 1200 })), -1);
  }, [reducedMotion]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + breathe.value * 0.06 }],
  }));

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: spacing.xl }}>
      <View style={{ height: 240, alignItems: "center", justifyContent: "center" }}>
        <Animated.View
          style={[
            {
              width: 160,
              height: 160,
              borderRadius: radius.xl,
              backgroundColor: colors.palmTint,
              alignItems: "center",
              justifyContent: "center",
            },
            style,
          ]}
        >
          <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.palm }} />
        </Animated.View>
      </View>
      <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(300).duration(450)}>
        <SceneText variant="heading2" style={{ textAlign: "center" }}>
          {scene.content.caption.ar}
        </SceneText>
      </Animated.View>
    </View>
  );
}
