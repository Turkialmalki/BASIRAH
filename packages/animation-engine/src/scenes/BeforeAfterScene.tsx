import { View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { BeforeAfterScene as BeforeAfterSceneType } from "@basirah/content-schema";

export function BeforeAfterScene({ scene, reducedMotion }: SceneComponentProps<BeforeAfterSceneType>) {
  const { spacing, colors, radius } = useSceneTheme();
  const { before, after } = scene.content;

  const Block = ({ eyebrow, label, tint }: { eyebrow: string; label: string; tint: string }) => (
    <View style={{ flex: 1, backgroundColor: tint, borderRadius: radius.lg, padding: spacing.lg, minHeight: 150, justifyContent: "flex-end", gap: spacing.xs }}>
      <SceneText variant="micro" color={colors.inkFaint}>
        {eyebrow}
      </SceneText>
      <SceneText variant="heading3">{label}</SceneText>
    </View>
  );

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Animated.View
        entering={reducedMotion ? undefined : FadeIn.duration(450)}
        style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}
      >
        <Block eyebrow="قبل" label={before.label.ar} tint={colors.hairline} />
        <Ionicons name="arrow-back" size={20} color={colors.inkFaint} />
        <Block eyebrow="بعد" label={after.label.ar} tint={colors.duneTint} />
      </Animated.View>
    </View>
  );
}
