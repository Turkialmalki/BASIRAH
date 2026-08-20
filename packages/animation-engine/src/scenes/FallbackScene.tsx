import { View } from "react-native";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";

/**
 * Renders for any scene `type` that doesn't yet have a bespoke component
 * (decisionTree/dragInteraction/tapInteraction/processFlow/causeEffect/
 * map/network/calendar/lineChart/pieChart at time of writing — see
 * docs/scene-engine.md for current coverage). Still fully functional:
 * reads accessibility.label, advances on tap, never crashes the lesson
 * player.
 */
export function FallbackScene({ scene }: SceneComponentProps) {
  const { spacing, colors, radius } = useSceneTheme();
  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.md }}
      accessibilityLabel={scene.accessibility.label}
    >
      <View
        style={{
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.md,
          borderRadius: radius.pill,
          backgroundColor: colors.hairline,
        }}
      >
        <SceneText variant="micro" color={colors.inkFaint}>
          {scene.type}
        </SceneText>
      </View>
      <SceneText variant="bodyLarge" style={{ textAlign: "center" }}>
        {scene.accessibility.label}
      </SceneText>
      <SceneText variant="caption" color={colors.inkFaint} style={{ textAlign: "center" }}>
        هذا النوع من المشاهد يُبنى بصرياً في مرحلة لاحقة — اضغط للمتابعة.
      </SceneText>
    </View>
  );
}
