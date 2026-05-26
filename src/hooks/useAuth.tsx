import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getAdminStatus } from "@/lib/admin.functions";

interface Ctx {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}
const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function syncAuthState(nextSession: Session | null) {
      if (!mounted) return;

      setSession(nextSession);

      if (!nextSession?.user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const result = await getAdminStatus();
        if (!mounted) return;
        setIsAdmin(result.isAdmin);
      } catch (error) {
        console.error("[useAuth] admin verification failed:", error);
        if (!mounted) return;
        setIsAdmin(false);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      void syncAuthState(s);
    });

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      void syncAuthState(s);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => { await supabase.auth.signOut(); };

  const value = useMemo(
    () => ({ session, user: session?.user ?? null, isAdmin, loading, signOut }),
    [session, isAdmin, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
