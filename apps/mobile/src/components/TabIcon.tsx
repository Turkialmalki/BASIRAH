import { Ionicons } from "@expo/vector-icons";

const ICONS = {
  home: "home-outline",
  explore: "compass-outline",
  ai: "sparkles-outline",
  saved: "bookmark-outline",
  profile: "person-outline",
} as const;

export function TabIcon({
  name,
  color,
  size = 24,
}: {
  name: keyof typeof ICONS;
  color: string;
  size?: number;
}) {
  return <Ionicons name={ICONS[name]} color={color} size={size} />;
}
