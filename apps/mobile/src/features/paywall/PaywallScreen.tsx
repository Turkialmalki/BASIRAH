import { useState } from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BasirahText } from "../../components/BasirahText";
import { Screen } from "../../components/Screen";
import { useBasirahTheme } from "../../theme/ThemeProvider";
import { purchasesConfigured, getCurrentOffering, purchasePackage } from "../../lib/purchases";

const FEATURES = [
  "كل الدروس بلا حدود",
  "مراجعة غير محدودة بالتكرار المتباعد",
  "تحميل الدروس والتعلم بدون إنترنت",
  "حصة أكبر من بصيرة AI",
];

/**
 * Shown after a meaningful value moment (spec §29 — first chapter/lesson
 * completed), never at launch. Yearly is emphasized but not manipulated
 * into ("199 ريال/سنة — أقل من 17 ريال بالشهر" is a true, checkable
 * statement, not a fake urgency timer or pre-checked upsell).
 */
export function PaywallScreen() {
  const { colors, spacing, radius } = useBasirahTheme();
  const [selected, setSelected] = useState<"monthly" | "yearly">("yearly");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function subscribe() {
    setError(null);
    if (!purchasesConfigured) {
      setError("الاشتراك غير متاح في نسخة التطوير هذه بعد.");
      return;
    }
    setBusy(true);
    const offering = await getCurrentOffering();
    const pkg = offering?.availablePackages.find((p) =>
      selected === "yearly" ? p.identifier.includes("annual") || p.identifier.includes("yearly") : p.identifier.includes("month")
    );
    if (!pkg) {
      setBusy(false);
      setError("ما لقينا باقة مطابقة — تحقق من إعداد RevenueCat.");
      return;
    }
    const result = await purchasePackage(pkg);
    setBusy(false);
    if (!result.ok) setError(result.error ?? "صار خطأ غير متوقع.");
    else router.back();
  }

  return (
    <Screen>
      <View style={{ flex: 1, padding: spacing.lg, justifyContent: "space-between" }}>
        <View>
          <Pressable onPress={() => router.back()} hitSlop={12} style={{ alignSelf: "flex-end", marginBottom: spacing.lg }}>
            <Ionicons name="close" size={24} color={colors.inkFaint} />
          </Pressable>

          <BasirahText variant="displayLarge">لو أعجبتك أول بصيرة...</BasirahText>
          <BasirahText variant="bodyLarge" color={colors.inkSoft} style={{ marginTop: spacing.xs }}>
            قدامك آلاف غيرها.
          </BasirahText>

          <View style={{ marginTop: spacing.xxl, gap: spacing.sm }}>
            {FEATURES.map((f) => (
              <View key={f} style={{ flexDirection: "row", gap: spacing.sm, alignItems: "center" }}>
                <Ionicons name="checkmark-circle" size={18} color={colors.dune} />
                <BasirahText variant="body">{f}</BasirahText>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: "row", gap: spacing.sm, marginTop: spacing.xxl }}>
            <PlanCard
              label="سنوي"
              price="199 ريال / سنة"
              note="أقل من 17 ريال بالشهر"
              selected={selected === "yearly"}
              onPress={() => setSelected("yearly")}
            />
            <PlanCard
              label="شهري"
              price="29 ريال / شهر"
              selected={selected === "monthly"}
              onPress={() => setSelected("monthly")}
            />
          </View>

          {error && (
            <BasirahText variant="caption" color={colors.danger} style={{ marginTop: spacing.md }}>
              {error}
            </BasirahText>
          )}
        </View>

        <View style={{ gap: spacing.sm }}>
          <Pressable
            onPress={subscribe}
            disabled={busy}
            style={{ backgroundColor: colors.dune, borderRadius: radius.lg, paddingVertical: spacing.lg, alignItems: "center" }}
          >
            <BasirahText variant="heading3" color={colors.paperRaised}>
              {busy ? "..." : "اشترك الآن"}
            </BasirahText>
          </Pressable>
          <Pressable onPress={() => router.back()} style={{ alignItems: "center", paddingVertical: spacing.sm }}>
            <BasirahText variant="body" color={colors.inkFaint}>
              لاحقاً
            </BasirahText>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

function PlanCard({
  label,
  price,
  note,
  selected,
  onPress,
}: {
  label: string;
  price: string;
  note?: string;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors, spacing, radius } = useBasirahTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        borderRadius: radius.lg,
        borderWidth: 1.5,
        borderColor: selected ? colors.dune : colors.hairline,
        backgroundColor: selected ? colors.duneTint : colors.paperRaised,
        padding: spacing.md,
        gap: spacing.xxs,
      }}
    >
      <BasirahText variant="caption" color={colors.inkFaint}>
        {label}
      </BasirahText>
      <BasirahText variant="heading3">{price}</BasirahText>
      {note && (
        <BasirahText variant="micro" color={colors.dune}>
          {note}
        </BasirahText>
      )}
    </Pressable>
  );
}
