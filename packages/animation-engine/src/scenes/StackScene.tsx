import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { StackScene as StackSceneType } from "@basirah/content-schema";

export function StackScene({ scene, reducedMotion }: SceneComponentProps<StackSceneType>) {
  const { spacing, colors, radius } = useSceneTheme();
  const { title, items } = scene.content;

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: spacing.lg }}>
      {title && <SceneText variant="heading2">{title.ar}</SceneText>}
      <View style={{ gap: spacing.sm }}>
        {items.map((item, i) => (
          <Animated.View
            key={i}
            entering={reducedMotion ? undefined : FadeInUp.delay(i * 110).duration(380).springify()}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.md,
              backgroundColor: colors.paperRaised,
              borderWidth: 1,
              borderColor: colors.hairline,
              borderRadius: radius.lg,
              padding: spacing.md,
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: colors.duneTint,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SceneText variant="caption" color={colors.duneDeep}>
                {i + 1}
              </SceneText>
            </View>
            <SceneText variant="body" style={{ flex: 1 }}>
              {item.label.ar}
            </SceneText>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
