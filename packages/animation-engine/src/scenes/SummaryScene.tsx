import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { SummaryScene as SummarySceneType } from "@basirah/content-schema";

export function SummaryScene({ scene, reducedMotion }: SceneComponentProps<SummarySceneType>) {
  const { spacing, colors } = useSceneTheme();
  const { heading, bullets } = scene.content;

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: spacing.xl }}>
      <SceneText variant="heading1">{heading.ar}</SceneText>
      <View style={{ gap: spacing.md }}>
        {bullets.map((bullet, i) => (
          <Animated.View
            key={i}
            entering={reducedMotion ? undefined : FadeInUp.delay(i * 150).duration(380)}
            style={{ flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" }}
          >
            <Ionicons name="checkmark-circle" size={20} color={colors.dune} style={{ marginTop: 2 }} />
            <SceneText variant="bodyLarge" style={{ flex: 1 }}>
              {bullet.ar}
            </SceneText>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
