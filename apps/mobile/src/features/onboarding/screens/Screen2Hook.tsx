import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import { BasirahText } from "../../../components/BasirahText";
import { useBasirahTheme } from "../../../theme/ThemeProvider";

/**
 * Visual: concentric rings pulsing outward from a core dot — a small
 * originally-Basirah visual metaphor for "one idea, expanding understanding"
 * rather than a literal illustration.
 */
export function Screen2Hook() {
  const { colors, spacing } = useBasirahTheme();
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);

  useEffect(() => {
    ring1.value = withRepeat(
      withSequence(withTiming(1, { duration: 1400 }), withTiming(0, { duration: 0 })),
      -1
    );
    ring2.value = withRepeat(
      withSequence(withTiming(0, { duration: 700 }), withTiming(1, { duration: 1400 }), withTiming(0, { duration: 0 })),
      -1
    );
  }, []);

  const ring1Style = useAnimatedStyle(() => ({
    opacity: 1 - ring1.value,
    transform: [{ scale: 1 + ring1.value * 1.6 }],
  }));
  const ring2Style = useAnimatedStyle(() => ({
    opacity: 1 - ring2.value,
    transform: [{ scale: 1 + ring2.value * 1.6 }],
  }));

  return (
    <View style={{ flex: 1, gap: spacing.xxl }}>
      <View style={{ height: 220, alignItems: "center", justifyContent: "center" }}>
        <Animated.View
          style={[
            { position: "absolute", width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: colors.dune },
            ring1Style,
          ]}
        />
        <Animated.View
          style={[
            { position: "absolute", width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: colors.dune },
            ring2Style,
          ]}
        />
        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: colors.dune }} />
      </View>
      <View style={{ gap: spacing.sm }}>
        <BasirahText variant="displayLarge">لو عندك 10 دقائق...</BasirahText>
        <BasirahText variant="bodyLarge" color={colors.inkSoft}>
          عندك وقت تتعلم شيئاً يغيّر طريقة تفكيرك.
        </BasirahText>
      </View>
    </View>
  );
}
