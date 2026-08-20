import { ScrollView } from "react-native";
import { Redirect } from "expo-router";
import { Screen } from "../../src/components/Screen";
import { useBasirahTheme } from "../../src/theme/ThemeProvider";
import { useOnboardingGate } from "../../src/hooks/useOnboardingGate";
import { HomeHeader } from "../../src/features/home/components/HomeHeader";
import { DailyHeroCard } from "../../src/features/home/components/DailyHeroCard";
import { ContinueJourneyEmpty } from "../../src/features/home/components/ContinueJourneyEmpty";
import { CuratedRow } from "../../src/features/home/components/CuratedRow";
import { CompactSection } from "../../src/features/home/components/CompactSection";
import { DAILY_BASIRAH, CURATED_FOR_YOU, SECTIONS } from "../../src/features/home/data";

export default function HomeScreen() {
  const { spacing } = useBasirahTheme();
  const { checked, completed } = useOnboardingGate();

  if (!checked) return null;
  if (!completed) return <Redirect href="/onboarding" />;

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.xxl }}>
        <HomeHeader streakDays={0} />
        <DailyHeroCard course={DAILY_BASIRAH} />
        <ContinueJourneyEmpty />
        <CuratedRow items={CURATED_FOR_YOU} />
        {SECTIONS.map((section) => (
          <CompactSection key={section.title} title={section.title} items={section.items} />
        ))}
      </ScrollView>
    </Screen>
  );
}
