import { useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { FlashcardScene as FlashcardSceneType } from "@basirah/content-schema";

export function FlashcardScene({ scene, onAdvance }: SceneComponentProps<FlashcardSceneType>) {
  const { spacing, colors, radius } = useSceneTheme();
  const { front, back } = scene.content;
  const flip = useSharedValue(0);
  const [flipped, setFlipped] = useState(false);

  function toggle() {
    const next = !flipped;
    setFlipped(next);
    flip.value = withTiming(next ? 1 : 0, { duration: 400 });
  }

  const frontStyle = useAnimatedStyle(() => ({
    opacity: flip.value < 0.5 ? 1 : 0,
    transform: [{ perspective: 800 }, { rotateY: `${flip.value * 180}deg` }],
  }));
  const backStyle = useAnimatedStyle(() => ({
    opacity: flip.value >= 0.5 ? 1 : 0,
    transform: [{ perspective: 800 }, { rotateY: `${flip.value * 180 - 180}deg` }],
  }));

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: spacing.xl }}>
      <Pressable onPress={toggle}>
        <View style={{ minHeight: 220 }}>
          <Animated.View
            style={[
              { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.paperRaised, borderRadius: radius.xl, borderWidth: 1.5, borderColor: colors.hairline, padding: spacing.xl, justifyContent: "center", minHeight: 220 },
              frontStyle,
            ]}
          >
            <SceneText variant="heading1" style={{ textAlign: "center" }}>
              {front.ar}
            </SceneText>
          </Animated.View>
          <Animated.View
            style={[
              { position: "absolute", inset: 0 as unknown as number, backgroundColor: colors.duneTint, borderRadius: radius.xl, borderWidth: 1.5, borderColor: colors.dune, padding: spacing.xl, justifyContent: "center", minHeight: 220 },
              backStyle,
            ]}
          >
            <SceneText variant="bodyLarge" style={{ textAlign: "center" }}>
              {back.ar}
            </SceneText>
          </Animated.View>
        </View>
      </Pressable>
      <SceneText variant="caption" color={colors.inkFaint} style={{ textAlign: "center" }}>
        اضغط على البطاقة لقلبها
      </SceneText>
      <Pressable
        onPress={() => onAdvance()}
        style={{ alignSelf: "center", paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: radius.lg, backgroundColor: colors.dune }}
      >
        <SceneText variant="body" color={colors.paperRaised}>
          التالي
        </SceneText>
      </Pressable>
    </View>
  );
}
