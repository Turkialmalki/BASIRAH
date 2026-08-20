import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { BasirahText } from "../../../components/BasirahText";
import { useBasirahTheme } from "../../../theme/ThemeProvider";
import type { HomeCourseCard } from "../data";

/** "اختيرت لك" — larger horizontal cards, visually distinct from the compact CategoryRow below. */
export function CuratedRow({ items }: { items: HomeCourseCard[] }) {
  const { colors, spacing, radius } = useBasirahTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      <BasirahText variant="heading3">اختيرت لك</BasirahText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md }}>
        {items.map((item) => (
          <Pressable
            key={item.slug}
            onPress={() => router.push(`/lesson/${item.slug}`)}
            style={{
              width: 180,
              backgroundColor: colors.paperRaised,
              borderRadius: radius.lg,
              borderWidth: 1,
              borderColor: colors.hairline,
              padding: spacing.md,
              gap: spacing.sm,
              minHeight: 140,
              justifyContent: "space-between",
            }}
          >
            <BasirahText variant="caption" color={colors.dune}>
              {item.categoryLabel}
            </BasirahText>
            <BasirahText variant="heading3">{item.title}</BasirahText>
            <BasirahText variant="caption" color={colors.inkFaint}>
              {item.minutes} دقائق
            </BasirahText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
