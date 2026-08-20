import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { TextRevealScene as TextRevealSceneType } from "@basirah/content-schema";

export function TextRevealScene({ scene, reducedMotion }: SceneComponentProps<TextRevealSceneType>) {
  const { spacing } = useSceneTheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", gap: spacing.md }}>
      {scene.content.lines.map((line, i) =>
        reducedMotion ? (
          <SceneText key={i} variant={scene.content.style}>
            {line.ar}
          </SceneText>
        ) : (
          <Animated.View key={i} entering={FadeInUp.delay(i * 220).duration(450).springify()}>
            <SceneText variant={scene.content.style}>{line.ar}</SceneText>
          </Animated.View>
        )
      )}
    </View>
  );
}
