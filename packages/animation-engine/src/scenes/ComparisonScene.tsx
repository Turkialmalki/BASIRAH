import { View } from "react-native";
import Animated, { FadeInLeft, FadeInRight } from "react-native-reanimated";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { ComparisonScene as ComparisonSceneType } from "@basirah/content-schema";

export function ComparisonScene({ scene, reducedMotion }: SceneComponentProps<ComparisonSceneType>) {
  const { spacing, colors, radius } = useSceneTheme();
  const { left, right, caption } = scene.content;

  const Side = ({ label, tint }: { label: string; tint: string }) => (
    <View
      style={{
        flex: 1,
        backgroundColor: tint,
        borderRadius: radius.lg,
        padding: spacing.lg,
        minHeight: 160,
        justifyContent: "flex-end",
      }}
    >
      <SceneText variant="heading3">{label}</SceneText>
    </View>
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: spacing.xl }}>
      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <Animated.View entering={reducedMotion ? undefined : FadeInRight.duration(420)} style={{ flex: 1 }}>
          <Side label={left.label.ar} tint={colors.duneTint} />
        </Animated.View>
        <Animated.View entering={reducedMotion ? undefined : FadeInLeft.duration(420)} style={{ flex: 1 }}>
          <Side label={right.label.ar} tint={colors.palmTint} />
        </Animated.View>
      </View>
      {caption && (
        <SceneText variant="body" color={colors.inkSoft} style={{ textAlign: "center" }}>
          {caption.ar}
        </SceneText>
      )}
    </View>
  );
}
