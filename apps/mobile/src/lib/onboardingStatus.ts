import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "basirah.onboarding_completed";

export async function getOnboardingCompleted(): Promise<boolean> {
  return (await AsyncStorage.getItem(KEY)) === "true";
}

export async function setOnboardingCompleted(): Promise<void> {
  await AsyncStorage.setItem(KEY, "true");
}
