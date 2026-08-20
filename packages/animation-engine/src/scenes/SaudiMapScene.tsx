import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import type { SceneComponentProps } from "../types";
import type { SaudiMapScene as SaudiMapSceneType } from "@basirah/content-schema";

const REGION_LABELS: Record<string, string> = {
  riyadh: "الرياض",
  makkah: "مكة المكرمة",
  eastern: "المنطقة الشرقية",
  madinah: "المدينة المنورة",
  asir: "عسير",
  qassim: "القصيم",
  tabuk: "تبوك",
};

/**
 * Abstract regional-highlight layout standing in for a real Saudi map
 * SVG/GeoJSON asset (spec §40 illustration system, not yet produced) —
 * still communicates "these regions matter here" via labeled markers.
 */
export function SaudiMapScene({ scene, reducedMotion }: SceneComponentProps<SaudiMapSceneType>) {
  const { spacing, colors, radius } = useSceneTheme();
  const { title, highlightedRegions, markers } = scene.content;

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: spacing.xl }}>
      {title && <SceneText variant="heading2">{title.ar}</SceneText>}

      <View
        style={{
          borderRadius: radius.xl,
          backgroundColor: colors.palmTint,
          padding: spacing.xl,
          minHeight: 200,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "center" }}>
          {highlightedRegions.map((region, i) => (
            <Animated.View
              key={region}
              entering={reducedMotion ? undefined : FadeInUp.delay(i * 130).duration(380).springify()}
            >
              <View
                style={{
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                  borderRadius: radius.pill,
                  backgroundColor: colors.palm,
                }}
              >
                <SceneText variant="body" color={colors.paperRaised}>
                  {REGION_LABELS[region] ?? region}
                </SceneText>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>

      {markers.length > 0 && (
        <View style={{ gap: spacing.xs }}>
          {markers.map((marker, i) => (
            <View key={i} style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <SceneText variant="body">{marker.label.ar}</SceneText>
              {marker.value && (
                <SceneText variant="body" color={colors.dune}>
                  {marker.value}
                </SceneText>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
