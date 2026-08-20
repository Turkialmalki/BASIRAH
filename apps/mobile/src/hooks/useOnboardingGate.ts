import { useEffect, useState } from "react";
import { getOnboardingCompleted } from "../lib/onboardingStatus";

/**
 * Reads the local onboarding flag once at boot. `checked` stays false for a
 * single frame while AsyncStorage resolves — callers should render nothing
 * (not a flash of home content) until `checked` is true.
 */
export function useOnboardingGate() {
  const [checked, setChecked] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let mounted = true;
    getOnboardingCompleted().then((value) => {
      if (!mounted) return;
      setCompleted(value);
      setChecked(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { checked, completed };
}
