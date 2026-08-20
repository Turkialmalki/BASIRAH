import { I18nManager } from "react-native";

/**
 * Basirah is Arabic-first: RTL is enabled at the architecture level, not
 * bolted on. This runs once at app boot (imported from the root layout,
 * before any navigator mounts) so React Native lays out every screen
 * right-to-left from the first frame.
 *
 * `allowRTL` + `forceRTL` must both be set; a JS-only I18nManager.forceRTL
 * call takes effect only after a reload, which Expo's dev/prod boot
 * sequence already accounts for — see docs/architecture.md §RTL.
 */
export function ensureRTL() {
  if (!I18nManager.isRTL) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }
}
