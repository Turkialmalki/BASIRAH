import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { QuoteScene as QuoteSceneType } from "@basirah/content-schema";

export function QuoteScene({ scene, reducedMotion }: SceneComponentProps<QuoteSceneType>) {
  const { spacing, colors } = useSceneTheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", gap: spacing.lg }}>
      <Animated.View entering={reducedMotion ? undefined : FadeIn.duration(500)}>
        <SceneText variant="quote" style={{ borderRightWidth: 3, borderRightColor: colors.dune, paddingRight: spacing.md }}>
          {scene.content.quote.ar}
        </SceneText>
        {scene.content.attribution && (
          <SceneText variant="caption" color={colors.inkFaint} style={{ marginTop: spacing.sm }}>
            {scene.content.attribution.ar}
          </SceneText>
        )}
      </Animated.View>
    </View>
  );
}
