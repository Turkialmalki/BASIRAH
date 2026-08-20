import { useMemo } from "react";
import { View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { SceneText } from "../components/SceneText";
import { useSceneTheme } from "../theme";
import { useSceneResponses, getSliderResponse } from "../responses";
import type { SceneComponentProps } from "../types";
import type { MoneyScene as MoneySceneType } from "@basirah/content-schema";

const sar = new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR", maximumFractionDigits: 0 });

export function MoneyScene({ scene, reducedMotion }: SceneComponentProps<MoneySceneType>) {
  const { spacing, colors, radius } = useSceneTheme();
  const { caption, basket, computedFrom, itemsLostAtFullErosion } = scene.content;
  const responses = useSceneResponses();

  const { amountRiyals, erosion } = useMemo(() => {
    if (computedFrom) {
      const salary = getSliderResponse(responses, computedFrom.salarySceneId);
      const rate = getSliderResponse(responses, computedFrom.inflationRateSceneId);
      const years = getSliderResponse(responses, computedFrom.yearsSceneId);
      if (salary !== undefined && rate !== undefined && years !== undefined) {
        const real = salary / Math.pow(1 + rate / 100, years);
        return { amountRiyals: real, erosion: 1 - real / salary };
      }
    }
    return { amountRiyals: scene.content.amountHalalas / 100, erosion: 0 };
  }, [computedFrom, responses, scene.content.amountHalalas]);

  const itemsToShow = itemsLostAtFullErosion
    ? Math.max(0, basket.length - Math.round(erosion * itemsLostAtFullErosion))
    : basket.length;

  return (
    <View style={{ flex: 1, justifyContent: "center", gap: spacing.xl }}>
      <View
        style={{
          backgroundColor: colors.ink,
          borderRadius: radius.xl,
          padding: spacing.xl,
          alignItems: "center",
          gap: spacing.xs,
        }}
      >
        <SceneText variant="micro" color={colors.duneTint}>
          القيمة الفعلية
        </SceneText>
        <SceneText variant="numberDisplay" color="#FAF6EF">
          {sar.format(amountRiyals)}
        </SceneText>
      </View>

      {basket.length > 0 && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, justifyContent: "center" }}>
          {basket.map((item, i) => {
            const stillPresent = i < itemsToShow;
            if (!stillPresent && reducedMotion) return null;
            return (
              <Animated.View
                key={i}
                exiting={reducedMotion ? undefined : FadeOut}
                style={{ opacity: stillPresent ? 1 : 0.25 }}
              >
                <View
                  style={{
                    paddingVertical: spacing.xs,
                    paddingHorizontal: spacing.sm,
                    borderRadius: radius.pill,
                    backgroundColor: stillPresent ? colors.duneTint : colors.hairline,
                    borderWidth: 1,
                    borderColor: stillPresent ? colors.dune : "transparent",
                  }}
                >
                  <SceneText variant="caption" color={stillPresent ? colors.duneDeep : colors.inkFaint}>
                    {item.label.ar}
                  </SceneText>
                </View>
              </Animated.View>
            );
          })}
        </View>
      )}

      {caption && (
        <SceneText variant="bodyLarge" color={colors.inkSoft} style={{ textAlign: "center" }}>
          {caption.ar}
        </SceneText>
      )}
    </View>
  );
}
