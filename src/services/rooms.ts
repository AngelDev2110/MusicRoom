import { supabase } from "@/utils/supabase";
import { getSession } from "./auth";

export async function createRoomWithHost(slug: string) {
  const { data, error } = await supabase.rpc("create_room_with_host", {
    room_slug: slug,
  });

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

export const getMyMembership = async (roomId: string) => {
  const {
    data: { session },
    error: userError,
  } = await getSession();

  if (userError) throw new Error(userError.message);

  const userId = session?.user.id;

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const { data, error } = await supabase
    .from("room_members")
    .select("room_id, user_id, approved")
    .eq("room_id", roomId)
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return data;
};

// services/rooms.ts
export const requestToJoin = async (roomId: string) => {
  const {
    data: { session },
  } = await getSession();
  const userId = session?.user.id;
  if (!userId) throw new Error("User is not authenticated");

  const { data, error } = await supabase
    .from("room_members")
    .insert({ room_id: roomId, user_id: userId, approved: false })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};
