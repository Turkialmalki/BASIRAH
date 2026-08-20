import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import { BasirahText } from "../../../components/BasirahText";
import { useBasirahTheme } from "../../../theme/ThemeProvider";
import type { HomeCourseCard } from "../data";

/** Compact horizontal list — deliberately smaller/denser than CuratedRow so repeated
 *  category sections don't read as the same card shape over and over. */
export function CompactSection({ title, items }: { title: string; items: HomeCourseCard[] }) {
  const { colors, spacing, radius } = useBasirahTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      <BasirahText variant="heading3">{title}</BasirahText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
        {items.map((item) => (
          <Pressable
            key={item.slug + title}
            onPress={() => router.push(`/lesson/${item.slug}`)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: spacing.sm,
              backgroundColor: colors.paper,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.hairline,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
            }}
          >
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.palm }} />
            <BasirahText variant="body">{item.title}</BasirahText>
            <BasirahText variant="micro" color={colors.inkFaint}>
              {item.minutes} د
            </BasirahText>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
