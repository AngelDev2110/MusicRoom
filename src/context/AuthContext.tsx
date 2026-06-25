import { useEffect, createContext, useState } from "react";
import { supabase } from "../utils/supabase";
import type { User } from "@supabase/supabase-js";

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function getSupabaseSession() {
    return supabase.auth.getSession();
  }

  async function signInAnonymously() {
    const { data } = await supabase.auth.signInAnonymously();
    return data?.user || null;
  }

  useEffect(() => {
    getSupabaseSession().then(({ data: { session } }) => {
      if (session) setUser(session.user);
      else
        signInAnonymously().then((user) => {
          setUser(user);
        });
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
