import { useEffect } from "react";
import { View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { BasirahText } from "../../../components/BasirahText";
import { useBasirahTheme } from "../../../theme/ThemeProvider";
import { useOnboardingStore } from "../../../store/onboardingStore";
import { INTEREST_OPTIONS } from "../data";

/**
 * Personalized knowledge-graph reveal (spec §8 screen 06). A lightweight
 * stagger-in of the user's chosen topics stands in for the full zoomable
 * knowledge graph (spec §17), which is built once real progress data
 * exists (Phase 5).
 */
export function Screen6Ready() {
  const { colors, spacing, radius } = useBasirahTheme();
  const { interests } = useOnboardingStore();
  const chosen = INTEREST_OPTIONS.filter((o) => interests.includes(o.slug));
  const nodes = chosen.length > 0 ? chosen : INTEREST_OPTIONS.slice(0, 3);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.xxl }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: spacing.sm }}>
        {nodes.map((n, i) => (
          <Animated.View
            key={n.slug}
            entering={FadeInUp.delay(i * 140).duration(420).springify()}
            style={{
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              borderRadius: radius.pill,
              backgroundColor: colors.palmTint,
            }}
          >
            <BasirahText variant="caption" color={colors.palmDeep}>
              {n.label}
            </BasirahText>
          </Animated.View>
        ))}
      </View>
      <Animated.View entering={FadeInUp.delay(nodes.length * 140 + 200).duration(500)}>
        <BasirahText variant="displayLarge" style={{ textAlign: "center" }}>
          جهزنا رحلتك.
        </BasirahText>
      </Animated.View>
    </View>
  );
}
