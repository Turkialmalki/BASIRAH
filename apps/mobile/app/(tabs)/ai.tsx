import { View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { BasirahText } from "../../src/components/BasirahText";
import { useBasirahTheme } from "../../src/theme/ThemeProvider";

export default function AiScreen() {
  const { spacing } = useBasirahTheme();
  return (
    <Screen>
      <View style={{ padding: spacing.lg, gap: spacing.sm }}>
        <BasirahText variant="heading1">وش ودك تفهم؟</BasirahText>
        <BasirahText variant="body">
          محرّك التوليد شغّال فعلياً (@basirah/ai) وموصول بقاعدة البيانات —
          جرّبه من لوحة الإدارة (AI Content Studio). كل درس مولّد يدخل
          كمسودة تحتاج مراجعة بشرية قبل النشر (سبب أنه غير مفعّل هنا مباشرة
          بعد — توليد فوري وآمن من داخل التطبيق للمستخدم يحتاج بنية إشراف
          إضافية، Phase 9/10).
        </BasirahText>
      </View>
    </Screen>
  );
}
