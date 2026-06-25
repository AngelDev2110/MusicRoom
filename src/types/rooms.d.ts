import type { Database } from "@/types/database";

type RoomInsert = Omit<
  Database["public"]["Tables"]["rooms"]["Insert"],
  "id" | "created_by" | "created_at"
>;
