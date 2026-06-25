import { createFileRoute } from "@tanstack/react-router";
import {
  getRoomBySlug,
  getMyMembership,
  requestToJoin,
  getPendingMembers,
  approveMember,
} from "@/services/rooms";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { supabase } from "@/utils/supabase";

export const Route = createFileRoute("/rooms/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const { user } = useAuth() || {};
  const queryClient = useQueryClient();

  const {
    data: room,
    isLoading: isRoomLoading,
    isError: isRoomError,
  } = useQuery({
    queryKey: ["room", slug],
    queryFn: () => getRoomBySlug(slug),
    staleTime: 1000 * 60 * 5,
  });

  const { data: membership, isLoading: isMembershipLoading } = useQuery({
    queryKey: ["membership", room?.id],
    queryFn: () => getMyMembership(room!.id),
    enabled: !!room,
  });

  const isHost = user?.id === room?.created_by;

  const { data: pending } = useQuery({
    queryKey: ["pending", room?.id],
    queryFn: () => getPendingMembers(room!.id),
    enabled: !!room && isHost,
  });

  const joinMutation = useMutation({
    mutationFn: () => requestToJoin(room!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership", room?.id] });
    },
  });

  const approveMutation = useMutation({
    mutationFn: (userId: string) => approveMember(room!.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pending", room?.id] });
    },
  });

  useEffect(() => {
    if (!room || !isHost) return;
    const channel = supabase
      .channel(`room-members-${room.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "room_members",
          filter: `room_id=eq.${room.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["pending", room.id] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isHost, queryClient, room]);

  useEffect(() => {
    if (!room || !user || isHost) return;
    const channel = supabase
      .channel(`my-membership-${room.id}-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "room_members",
          filter: `room_id=eq.${room.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["membership", room.id] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room, user, isHost, queryClient]);

  if (isRoomLoading) return <div>Fetching room...</div>;
  if (isRoomError) return <div>Error fetching room</div>;
  if (!room) return <div>Room not found</div>;

  if (isHost) {
    return (
      <div>
        <h1>Host view: {room.slug}</h1>
        <h2>Pending requests</h2>
        {pending?.length === 0 && <div>No pending requests</div>}
        {pending?.map((p) => (
          <div key={p.user_id}>
            <span>{p.user_id}</span>
            <button
              onClick={() => approveMutation.mutate(p.user_id)}
              disabled={approveMutation.isPending}
            >
              Approve
            </button>
          </div>
        ))}
      </div>
    );
  }

  if (isMembershipLoading) return <div>Loading membership...</div>;
  if (membership?.approved) return <div>Inside the room: {room.slug}</div>;
  if (membership) return <div>Waiting for approval...</div>;

  return (
    <div>
      <button
        onClick={() => joinMutation.mutate()}
        disabled={joinMutation.isPending}
      >
        {joinMutation.isPending ? "Solicitando..." : "Solicitar unirse"}
      </button>
    </div>
  );
}
