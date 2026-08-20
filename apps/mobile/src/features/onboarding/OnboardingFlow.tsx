import { useState } from "react";
import { router } from "expo-router";
import { setOnboardingCompleted } from "../../lib/onboardingStatus";
import { useOnboardingStore } from "../../store/onboardingStore";
import { OnboardingShell } from "./components/OnboardingShell";
import { Screen1Intro } from "./screens/Screen1Intro";
import { Screen2Hook } from "./screens/Screen2Hook";
import { Screen3Interests } from "./screens/Screen3Interests";
import { Screen4Goal } from "./screens/Screen4Goal";
import { Screen5DailyTarget } from "./screens/Screen5DailyTarget";
import { Screen6Ready } from "./screens/Screen6Ready";

const TOTAL_STEPS = 6;

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const { interests, goal } = useOnboardingStore();

  const canAdvance = step === 2 ? interests.length > 0 : step === 3 ? goal !== null : true;

  async function finish() {
    await setOnboardingCompleted();
    // No personalized lesson exists to open yet (Phase 4) — land on Home,
    // which now renders real value instead of a placeholder.
    router.replace("/(tabs)");
  }

  function next() {
    if (step === TOTAL_STEPS - 1) {
      finish();
      return;
    }
    setStep((s) => s + 1);
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  const ctaLabel =
    step === 0 ? "ابدأ" : step === TOTAL_STEPS - 1 ? "ابدأ أول درس" : "التالي";

  return (
    <OnboardingShell
      step={step}
      totalSteps={TOTAL_STEPS}
      ctaLabel={ctaLabel}
      onCta={next}
      ctaDisabled={!canAdvance}
      showBack={step > 0}
      onBack={back}
    >
      {step === 0 && <Screen1Intro />}
      {step === 1 && <Screen2Hook />}
      {step === 2 && <Screen3Interests />}
      {step === 3 && <Screen4Goal />}
      {step === 4 && <Screen5DailyTarget />}
      {step === 5 && <Screen6Ready />}
    </OnboardingShell>
  );
}
