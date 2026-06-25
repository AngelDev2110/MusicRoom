import { supabase } from "@/utils/supabase";
import type { RoomInsert } from "@/types/rooms";

export async function createRoom(payload: RoomInsert) {
  const { data, error } = await supabase
    .from("rooms")
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function getRoomBySlug(slug: string) {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw new Error(error.message);

  return data;
}
