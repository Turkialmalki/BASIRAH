import { Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { BasirahText } from "../../../components/BasirahText";
import { useBasirahTheme } from "../../../theme/ThemeProvider";

export function OptionRow({
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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.lg,
        borderWidth: 1.5,
        borderColor: selected ? colors.dune : colors.hairline,
        backgroundColor: selected ? colors.duneTint : colors.paperRaised,
      }}
    >
      <BasirahText variant="bodyLarge">{label}</BasirahText>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: selected ? colors.dune : colors.hairline,
          backgroundColor: selected ? colors.dune : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && <Ionicons name="checkmark" size={16} color={colors.paperRaised} />}
      </View>
    </Pressable>
  );
}
