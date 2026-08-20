import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "basirah.paywall_shown_once";

export async function getPaywallShownOnce(): Promise<boolean> {
  return (await AsyncStorage.getItem(KEY)) === "true";
}

export async function setPaywallShownOnce(): Promise<void> {
  await AsyncStorage.setItem(KEY, "true");
}
