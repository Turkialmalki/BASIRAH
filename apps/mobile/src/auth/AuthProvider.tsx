import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { configurePurchases } from "../lib/purchases";

interface AuthState {
  /** true once the initial session check (and anonymous sign-in, if needed) has resolved */
  ready: boolean;
  session: Session | null;
  user: User | null;
  isGuest: boolean;
  /** upgrades a guest session to a real account (spec §27/§29 — prompted after a value moment, not at launch) */
  upgradeWithEmail: (email: string) => Promise<{ error: string | null }>;
  verifyOtp: (email: string, token: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) {
      // No backend configured — the app still works, just fully offline (local content, no persisted progress).
      setReady(true);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      if (data.session) {
        setSession(data.session);
        setReady(true);
        return;
      }
      // No session at all yet — spec §27: guest mode, real auth.uid() with no email/password.
      const { data: anon, error } = await supabase!.auth.signInAnonymously();
      if (mounted) {
        if (!error) setSession(anon.session);
        setReady(true);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (mounted) setSession(next);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const user = session?.user ?? null;
  const isGuest = !user?.email;

  useEffect(() => {
    if (user?.id) configurePurchases(user.id);
  }, [user?.id]);

  async function upgradeWithEmail(email: string) {
    if (!supabase) return { error: "لا يوجد اتصال بالخادم." };
    const { error } = await supabase.auth.updateUser({ email });
    return { error: error?.message ?? null };
  }

  async function verifyOtp(email: string, token: string) {
    if (!supabase) return { error: "لا يوجد اتصال بالخادم." };
    const { error } = await supabase.auth.verifyOtp({ email, token, type: "email_change" });
    return { error: error?.message ?? null };
  }

  async function signOut() {
    await supabase?.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ ready, session, user, isGuest, upgradeWithEmail, verifyOtp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
