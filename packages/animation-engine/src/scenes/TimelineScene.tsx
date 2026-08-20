import { View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { TimelineScene as TimelineSceneType } from "@basirah/content-schema";

export function TimelineScene({ scene, reducedMotion }: SceneComponentProps<TimelineSceneType>) {
  const { spacing, colors } = useSceneTheme();
  const { title, events } = scene.content;

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: spacing.lg }}>
      {title && <SceneText variant="heading2">{title.ar}</SceneText>}
      <View>
        {events.map((event, i) => (
          <Animated.View
            key={i}
            entering={reducedMotion ? undefined : FadeInRight.delay(i * 160).duration(400)}
            style={{ flexDirection: "row", gap: spacing.md }}
          >
            <View style={{ alignItems: "center", width: 16 }}>
              <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.dune }} />
              {i < events.length - 1 && (
                <View style={{ width: 2, flex: 1, backgroundColor: colors.hairline, marginTop: 4 }} />
              )}
            </View>
            <View style={{ flex: 1, paddingBottom: spacing.lg }}>
              <SceneText variant="caption" color={colors.dune}>
                {event.date}
              </SceneText>
              <SceneText variant="body">{event.label.ar}</SceneText>
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
