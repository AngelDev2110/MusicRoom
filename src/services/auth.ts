import { supabase } from "@/utils/supabase";

export const signInAnonymously = () => supabase.auth.signInAnonymously();

export const getSession = () => supabase.auth.getSession();

export const changeDisplayName = (displayName: string) =>
  supabase.auth.updateUser({ data: { display_name: displayName } });
