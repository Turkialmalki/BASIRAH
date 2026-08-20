import { ScrollView, View } from "react-native";
import { BasirahText } from "../../../components/BasirahText";
import { useBasirahTheme } from "../../../theme/ThemeProvider";
import { useOnboardingStore } from "../../../store/onboardingStore";
import { INTEREST_OPTIONS } from "../data";
import { Chip } from "../components/Chip";

export function Screen3Interests() {
  const { spacing, colors } = useBasirahTheme();
  const { interests, toggleInterest } = useOnboardingStore();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <BasirahText variant="displayLarge">وش ودك تفهم أكثر؟</BasirahText>
      <BasirahText variant="body" color={colors.inkSoft} style={{ marginTop: spacing.xs }}>
        اختر أكثر من موضوع.
      </BasirahText>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: spacing.sm,
          marginTop: spacing.xl,
        }}
      >
        {INTEREST_OPTIONS.map((opt) => (
          <Chip
            key={opt.slug}
            label={opt.label}
            selected={interests.includes(opt.slug)}
            onPress={() => toggleInterest(opt.slug)}
          />
        ))}
      </View>
    </ScrollView>
  );
}
