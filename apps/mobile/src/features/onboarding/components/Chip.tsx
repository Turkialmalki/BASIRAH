import { Pressable } from "react-native";
import * as Haptics from "expo-haptics";
import { BasirahText } from "../../../components/BasirahText";
import { useBasirahTheme } from "../../../theme/ThemeProvider";

export function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors, spacing, radius } = useBasirahTheme();
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        onPress();
      }}
      style={{
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.pill,
        borderWidth: 1.5,
        borderColor: selected ? colors.dune : colors.hairline,
        backgroundColor: selected ? colors.duneTint : colors.paperRaised,
      }}
    >
      <BasirahText variant="body" color={selected ? colors.duneDeep : colors.ink}>
        {label}
      </BasirahText>
    </Pressable>
  );
}
