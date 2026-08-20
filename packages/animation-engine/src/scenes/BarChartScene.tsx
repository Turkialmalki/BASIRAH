import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { BarChartScene as BarChartSceneType } from "@basirah/content-schema";

const BAR_MAX_HEIGHT = 160;

export function BarChartScene({ scene, reducedMotion }: SceneComponentProps<BarChartSceneType>) {
  const { spacing, colors, radius } = useSceneTheme();
  const { title, bars } = scene.content;
  const maxValue = Math.max(...bars.map((b) => b.value), 1);

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: spacing.xl }}>
      {title && <SceneText variant="heading2">{title.ar}</SceneText>}
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: spacing.md, height: BAR_MAX_HEIGHT }}>
        {bars.map((bar, i) => {
          const height = Math.max(6, (bar.value / maxValue) * BAR_MAX_HEIGHT);
          return (
            <View key={i} style={{ flex: 1, alignItems: "center", gap: spacing.xs }}>
              <Animated.View
                entering={reducedMotion ? undefined : FadeInUp.delay(i * 90).duration(420).springify()}
                style={{
                  width: "100%",
                  height,
                  borderRadius: radius.sm,
                  backgroundColor: colors.dune,
                }}
              />
              <SceneText variant="micro" color={colors.inkFaint} numberOfLines={1}>
                {bar.label.ar}
              </SceneText>
            </View>
          );
        })}
      </View>
    </View>
  );
}
