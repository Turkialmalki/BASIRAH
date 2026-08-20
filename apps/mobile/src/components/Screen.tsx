import { SafeAreaView } from "react-native-safe-area-context";
import type { ViewProps } from "react-native";
import { useBasirahTheme } from "../theme/ThemeProvider";

export function Screen({ style, ...rest }: ViewProps) {
  const { colors } = useBasirahTheme();
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: colors.paper }, style]}
      {...rest}
    />
  );
}
