import { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { Screen } from "../../src/components/Screen";
import { BasirahText } from "../../src/components/BasirahText";
import { useBasirahTheme } from "../../src/theme/ThemeProvider";
import { CategoryChip } from "../../src/features/library/components/CategoryChip";
import { CourseListItem } from "../../src/features/library/components/CourseListItem";
import { CATEGORIES, LIBRARY_COURSES } from "../../src/features/library/data";
import type { ColorPalette } from "@basirah/ui";

export default function ExploreScreen() {
  const { spacing, colors } = useBasirahTheme();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      activeCategory ? LIBRARY_COURSES.filter((c) => c.categorySlug === activeCategory) : LIBRARY_COURSES,
    [activeCategory]
  );

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.xl }}>
        <BasirahText variant="displayLarge">استكشف</BasirahText>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
          <CategoryChip
            label="الكل"
            accentColor={colors.dune}
            selected={activeCategory === null}
            onPress={() => setActiveCategory(null)}
          />
          {CATEGORIES.map((cat) => (
            <CategoryChip
              key={cat.slug}
              label={cat.label}
              accentColor={colors[cat.colorToken as keyof ColorPalette]}
              selected={activeCategory === cat.slug}
              onPress={() => setActiveCategory(cat.slug)}
            />
          ))}
        </ScrollView>

        <View style={{ gap: spacing.sm }}>
          {filtered.length === 0 ? (
            <BasirahText variant="body" color={colors.inkFaint}>
              ما لقينا شيء بهذا التصنيف بعد.{"\n"}جرّب تصنيف ثاني.
            </BasirahText>
          ) : (
            filtered.map((course) => {
              const category = CATEGORIES.find((c) => c.slug === course.categorySlug);
              return (
                <CourseListItem
                  key={course.slug}
                  slug={course.slug}
                  title={course.title}
                  categoryLabel={category?.label ?? ""}
                  minutes={course.minutes}
                />
              );
            })
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}
