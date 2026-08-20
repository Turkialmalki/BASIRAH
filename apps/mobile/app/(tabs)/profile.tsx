import { View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { BasirahText } from "../../src/components/BasirahText";
import { useBasirahTheme } from "../../src/theme/ThemeProvider";

export default function ProfileScreen() {
  const { spacing } = useBasirahTheme();
  return (
    <Screen>
      <View style={{ padding: spacing.lg, gap: spacing.sm }}>
        <BasirahText variant="heading1">حسابي</BasirahText>
        <BasirahText variant="body">
          تسجيل الدخول (Apple / Google / OTP)، الاشتراك، الإعدادات — Phase 7.
        </BasirahText>
      </View>
    </Screen>
  );
}
