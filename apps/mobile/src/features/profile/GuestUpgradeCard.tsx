import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { BasirahText } from "../../components/BasirahText";
import { useBasirahTheme } from "../../theme/ThemeProvider";
import { useAuth } from "../../auth/AuthProvider";

/**
 * Email-OTP account upgrade (spec §27/§29): a guest can use the whole app
 * first; this card is how they later turn that guest session into a real
 * account without losing anything, since it's the same `auth.uid()`
 * throughout (`supabase.auth.updateUser({ email })` + OTP verification,
 * not a new sign-up).
 */
export function GuestUpgradeCard() {
  const { spacing, colors, radius } = useBasirahTheme();
  const { upgradeWithEmail, verifyOtp } = useAuth();
  const [step, setStep] = useState<"email" | "otp" | "done">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function sendCode() {
    setBusy(true);
    setError(null);
    const { error } = await upgradeWithEmail(email.trim());
    setBusy(false);
    if (error) setError(error);
    else setStep("otp");
  }

  async function confirmCode() {
    setBusy(true);
    setError(null);
    const { error } = await verifyOtp(email.trim(), otp.trim());
    setBusy(false);
    if (error) setError(error);
    else setStep("done");
  }

  if (step === "done") {
    return (
      <View style={{ backgroundColor: colors.successTint, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.xs }}>
        <BasirahText variant="heading3" color={colors.success}>
          تم 👌
        </BasirahText>
        <BasirahText variant="body" color={colors.inkSoft}>
          حسابك محفوظ الآن — تقدر تدخل من أي جهاز.
        </BasirahText>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: colors.paperRaised, borderWidth: 1, borderColor: colors.hairline, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md }}>
      <View style={{ gap: spacing.xxs }}>
        <BasirahText variant="heading3">احفظ تقدمك</BasirahText>
        <BasirahText variant="caption" color={colors.inkFaint}>
          أنت الآن ضيف. أضف بريدك عشان ما يضيع تقدمك.
        </BasirahText>
      </View>

      {step === "email" ? (
        <>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="بريدك الإلكتروني"
            placeholderTextColor={colors.inkFaint}
            keyboardType="email-address"
            autoCapitalize="none"
            textAlign="right"
            style={{ borderWidth: 1, borderColor: colors.hairline, borderRadius: radius.md, padding: spacing.md, color: colors.ink, writingDirection: "rtl" }}
          />
          <Pressable
            onPress={sendCode}
            disabled={busy || email.trim().length === 0}
            style={{ backgroundColor: colors.dune, borderRadius: radius.md, padding: spacing.md, alignItems: "center", opacity: busy ? 0.6 : 1 }}
          >
            <BasirahText variant="body" color={colors.paperRaised}>
              {busy ? "..." : "أرسل رمز التحقق"}
            </BasirahText>
          </Pressable>
        </>
      ) : (
        <>
          <TextInput
            value={otp}
            onChangeText={setOtp}
            placeholder="رمز التحقق"
            placeholderTextColor={colors.inkFaint}
            keyboardType="number-pad"
            textAlign="right"
            style={{ borderWidth: 1, borderColor: colors.hairline, borderRadius: radius.md, padding: spacing.md, color: colors.ink, writingDirection: "rtl" }}
          />
          <Pressable
            onPress={confirmCode}
            disabled={busy || otp.trim().length === 0}
            style={{ backgroundColor: colors.dune, borderRadius: radius.md, padding: spacing.md, alignItems: "center", opacity: busy ? 0.6 : 1 }}
          >
            <BasirahText variant="body" color={colors.paperRaised}>
              {busy ? "..." : "تأكيد"}
            </BasirahText>
          </Pressable>
        </>
      )}

      {error && (
        <BasirahText variant="caption" color={colors.danger}>
          {error}
        </BasirahText>
      )}
    </View>
  );
}
