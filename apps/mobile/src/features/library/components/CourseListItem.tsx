import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BasirahText } from "../../../components/BasirahText";
import { useBasirahTheme } from "../../../theme/ThemeProvider";

export function CourseListItem({
  slug,
  title,
  categoryLabel,
  minutes,
}: {
  slug: string;
  title: string;
  categoryLabel: string;
  minutes: number;
}) {
  const { colors, spacing, radius } = useBasirahTheme();
  return (
    <Pressable
      onPress={() => router.push(`/lesson/${slug}`)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.paperRaised,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.hairline,
      }}
    >
      <View style={{ flex: 1, gap: spacing.xxs }}>
        <BasirahText variant="heading3">{title}</BasirahText>
        <BasirahText variant="caption" color={colors.inkFaint}>
          {categoryLabel} · {minutes} دقائق
        </BasirahText>
      </View>
      <Ionicons name="chevron-back" size={18} color={colors.inkFaint} />
    </Pressable>
  );
}
