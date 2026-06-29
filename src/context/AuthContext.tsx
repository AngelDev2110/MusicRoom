import { useEffect, createContext, useState, useContext } from "react";
import { supabase } from "../utils/supabase";
import type { User } from "@supabase/supabase-js";
import { getSession, signInAnonymously } from "@/services/auth";

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function _signInAnonymously() {
    const { data } = await signInAnonymously();
    return data?.user || null;
  }

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const {
        data: { session },
      } = await getSession();

      if (cancelled) return;

      if (session) {
        setUser(session.user);
      } else {
        const user = await _signInAnonymously();
        if (cancelled) return;
        setUser(user);
      }

      setLoading(false);
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
