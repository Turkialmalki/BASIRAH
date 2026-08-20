import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import { BasirahText } from "../../../components/BasirahText";
import { useBasirahTheme } from "../../../theme/ThemeProvider";

export function Screen1Intro() {
  const { colors, spacing } = useBasirahTheme();
  const logoScale = useSharedValue(0.6);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 12, stiffness: 120 });
    logoOpacity.value = withTiming(1, { duration: 500 });
    textOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));
  const textStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.xl }}>
      <Animated.View
        style={[
          {
            width: 96,
            height: 96,
            borderRadius: 28,
            backgroundColor: colors.dune,
            alignItems: "center",
            justifyContent: "center",
          },
          logoStyle,
        ]}
      >
        <BasirahText variant="displayLarge" color={colors.paperRaised}>
          ب
        </BasirahText>
      </Animated.View>
      <Animated.View style={textStyle}>
        <BasirahText variant="displayXL">المعرفة تُرى.</BasirahText>
      </Animated.View>
    </View>
  );
}
