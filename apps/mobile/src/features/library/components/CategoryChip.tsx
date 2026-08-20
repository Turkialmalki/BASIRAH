import { Pressable } from "react-native";
import { BasirahText } from "../../../components/BasirahText";
import { useBasirahTheme } from "../../../theme/ThemeProvider";

export function CategoryChip({
  label,
  accentColor,
  selected,
  onPress,
}: {
  label: string;
  accentColor: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { spacing, radius, colors } = useBasirahTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: radius.pill,
        backgroundColor: selected ? accentColor : colors.paperRaised,
        borderWidth: 1,
        borderColor: selected ? accentColor : colors.hairline,
      }}
    >
      <BasirahText variant="body" color={selected ? colors.paperRaised : colors.ink}>
        {label}
      </BasirahText>
    </Pressable>
  );
}
