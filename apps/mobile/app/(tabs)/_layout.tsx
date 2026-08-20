import { Tabs } from "expo-router";
import { useBasirahTheme } from "../../src/theme/ThemeProvider";
import { TabIcon } from "../../src/components/TabIcon";

/**
 * Declared in logical (reading) order — الرئيسية first. With RTL forced
 * (see src/lib/rtl.ts), the native tab bar mirrors this automatically so
 * it reads right-to-left on screen without reordering the source.
 */
export default function TabsLayout() {
  const { colors, typography } = useBasirahTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.dune,
        tabBarInactiveTintColor: colors.inkFaint,
        tabBarStyle: {
          backgroundColor: colors.paperRaised,
          borderTopColor: colors.hairline,
        },
        tabBarLabelStyle: {
          fontFamily: typography.micro.fontFamily,
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "الرئيسية", tabBarIcon: (p) => <TabIcon name="home" {...p} /> }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: "استكشف", tabBarIcon: (p) => <TabIcon name="explore" {...p} /> }}
      />
      <Tabs.Screen
        name="ai"
        options={{ title: "بصيرة AI", tabBarIcon: (p) => <TabIcon name="ai" {...p} /> }}
      />
      <Tabs.Screen
        name="saved"
        options={{ title: "المحفوظات", tabBarIcon: (p) => <TabIcon name="saved" {...p} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "حسابي", tabBarIcon: (p) => <TabIcon name="profile" {...p} /> }}
      />
    </Tabs>
  );
}
