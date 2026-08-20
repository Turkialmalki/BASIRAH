import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { CharacterScene as CharacterSceneType } from "@basirah/content-schema";

const EMOTION_EMOJI: Record<string, string> = {
  neutral: "🙂",
  happy: "😄",
  thinking: "🤔",
  surprised: "😮",
  encouraging: "👏",
};

/**
 * Placeholder avatar (emoji-in-a-circle) standing in for the Rive
 * character system (spec §12) — `characterKey` will select a real
 * state-machine-driven character once the illustration/Rive pipeline
 * exists.
 */
export function CharacterScene({ scene, reducedMotion }: SceneComponentProps<CharacterSceneType>) {
  const { spacing, colors, radius } = useSceneTheme();
  const { dialogue, emotion } = scene.content;

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: spacing.lg }}>
      <Animated.View entering={reducedMotion ? undefined : FadeInUp.duration(420).springify()}>
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: radius.pill,
            backgroundColor: colors.duneTint,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: spacing.md,
          }}
        >
          <SceneText style={{ fontSize: 32 }}>{EMOTION_EMOJI[emotion] ?? "🙂"}</SceneText>
        </View>
        <View
          style={{
            backgroundColor: colors.paperRaised,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.hairline,
            padding: spacing.lg,
          }}
        >
          <SceneText variant="bodyLarge">{dialogue.ar}</SceneText>
        </View>
      </Animated.View>
    </View>
  );
}
