import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { BasirahText } from "../../../components/BasirahText";
import { useBasirahTheme } from "../../../theme/ThemeProvider";
import type { HomeCourseCard } from "../data";

/** The full-bleed "بصيرة اليوم" hero — the single most important card on Home. */
export function DailyHeroCard({ course }: { course: HomeCourseCard }) {
  const { colors, spacing, radius } = useBasirahTheme();
  return (
    <Pressable
      onPress={() => router.push(`/lesson/${course.slug}`)}
      style={{
        backgroundColor: colors.ink,
        borderRadius: radius.xl,
        padding: spacing.xl,
        gap: spacing.md,
        minHeight: 200,
        justifyContent: "space-between",
      }}
    >
      <BasirahText variant="micro" color={colors.duneTint}>
        بصيرة اليوم
      </BasirahText>
      <View style={{ gap: spacing.xs }}>
        <BasirahText variant="displayLarge" color="#FAF6EF">
          {course.title}
        </BasirahText>
        <BasirahText variant="body" color="#C9C1B3">
          {course.categoryLabel} · {course.minutes} دقائق
        </BasirahText>
      </View>
    </Pressable>
  );
}
