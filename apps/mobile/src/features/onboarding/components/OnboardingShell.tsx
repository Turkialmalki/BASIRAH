import { Pressable, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { BasirahText } from "../../../components/BasirahText";
import { useBasirahTheme } from "../../../theme/ThemeProvider";
import { ProgressDots } from "./ProgressDots";

export function OnboardingShell({
  step,
  totalSteps,
  ctaLabel,
  onCta,
  ctaDisabled,
  showBack,
  onBack,
  children,
}: {
  step: number;
  totalSteps: number;
  ctaLabel: string;
  onCta: () => void;
  ctaDisabled?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  const { colors, spacing, radius } = useBasirahTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.paper }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.sm,
          gap: spacing.md,
        }}
      >
        <View style={{ width: 40 }}>
          {showBack && (
            <Pressable onPress={onBack} hitSlop={12}>
              <BasirahText variant="heading3">‹</BasirahText>
            </Pressable>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <ProgressDots total={totalSteps} current={step} />
        </View>
        <View style={{ width: 40 }} />
      </View>

      <Animated.View
        key={step}
        entering={FadeIn.duration(320)}
        style={{ flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl }}
      >
        {children}
      </Animated.View>

      <View style={{ padding: spacing.lg }}>
        <Pressable
          onPress={onCta}
          disabled={ctaDisabled}
          style={{
            backgroundColor: ctaDisabled ? colors.hairline : colors.dune,
            borderRadius: radius.lg,
            paddingVertical: spacing.lg,
            alignItems: "center",
          }}
        >
          <BasirahText variant="heading3" color={ctaDisabled ? colors.inkFaint : colors.paperRaised}>
            {ctaLabel}
          </BasirahText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
