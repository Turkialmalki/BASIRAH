import { ScrollView, View } from "react-native";
import { BasirahText } from "../../../components/BasirahText";
import { useBasirahTheme } from "../../../theme/ThemeProvider";
import { useOnboardingStore } from "../../../store/onboardingStore";
import { GOAL_OPTIONS } from "../data";
import { OptionRow } from "../components/OptionRow";

export function Screen4Goal() {
  const { spacing } = useBasirahTheme();
  const { goal, setGoal } = useOnboardingStore();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <BasirahText variant="displayLarge">ليش ودك تتعلم؟</BasirahText>
      <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
        {GOAL_OPTIONS.map((opt) => (
          <OptionRow
            key={opt.slug}
            label={opt.label}
            selected={goal === opt.slug}
            onPress={() => setGoal(opt.slug)}
          />
        ))}
      </View>
    </ScrollView>
  );
}
