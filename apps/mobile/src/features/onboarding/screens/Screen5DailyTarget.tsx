import { View } from "react-native";
import { BasirahText } from "../../../components/BasirahText";
import { useBasirahTheme } from "../../../theme/ThemeProvider";
import { useOnboardingStore } from "../../../store/onboardingStore";
import { DAILY_TARGET_OPTIONS } from "../data";
import { OptionRow } from "../components/OptionRow";

export function Screen5DailyTarget() {
  const { spacing } = useBasirahTheme();
  const { dailyTargetMinutes, setDailyTarget } = useOnboardingStore();

  return (
    <View>
      <BasirahText variant="displayLarge">كم دقيقة تقدر تعطينا يومياً؟</BasirahText>
      <View style={{ gap: spacing.sm, marginTop: spacing.xl }}>
        {DAILY_TARGET_OPTIONS.map((opt) => (
          <OptionRow
            key={opt.minutes}
            label={opt.label}
            selected={dailyTargetMinutes === opt.minutes}
            onPress={() => setDailyTarget(opt.minutes)}
          />
        ))}
      </View>
    </View>
  );
}
