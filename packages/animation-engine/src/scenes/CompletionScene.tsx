import { View } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { CompletionScene as CompletionSceneType } from "@basirah/content-schema";

const STAT_LABEL: Record<string, string> = {
  streak: "أيام متتالية",
  minutes: "دقيقة تعلّم",
  xp: "نقطة",
  accuracy: "دقة الإجابات",
};

export function CompletionScene({ scene, reducedMotion }: SceneComponentProps<CompletionSceneType>) {
  const { spacing, colors, radius } = useSceneTheme();
  const { heading, subheading, statsShown } = scene.content;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.xl }}>
      <Animated.View entering={reducedMotion ? undefined : ZoomIn.duration(420).springify()}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: radius.pill,
            backgroundColor: colors.successTint,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="checkmark" size={40} color={colors.success} />
        </View>
      </Animated.View>
      <Animated.View entering={reducedMotion ? undefined : FadeIn.delay(200).duration(400)} style={{ gap: spacing.xs }}>
        <SceneText variant="displayLarge" style={{ textAlign: "center" }}>
          {heading.ar}
        </SceneText>
        {subheading && (
          <SceneText variant="body" color={colors.inkSoft} style={{ textAlign: "center" }}>
            {subheading.ar}
          </SceneText>
        )}
      </Animated.View>
      {statsShown.length > 0 && (
        <View style={{ flexDirection: "row", gap: spacing.lg }}>
          {statsShown.map((stat) => (
            <View key={stat} style={{ alignItems: "center" }}>
              <SceneText variant="heading2" color={colors.dune}>
                —
              </SceneText>
              <SceneText variant="micro" color={colors.inkFaint}>
                {STAT_LABEL[stat]}
              </SceneText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
