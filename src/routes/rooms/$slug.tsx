import { createFileRoute } from "@tanstack/react-router";
import { getRoomBySlug, getMyMembership } from "@/services/rooms";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { requestToJoin } from "@/services/rooms";

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

  const joinMutation = useMutation({
    mutationFn: () => requestToJoin(room!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membership", room?.id] });
    },
  });

  if (isRoomLoading) return <div>Fetching room...</div>;

  if (isRoomError) return <div>Error fetching room</div>;

  if (!room) return <div>Room not found</div>;

  const isHost = user?.id === room.created_by;

  if (isHost) return <div>Host view: {room.slug}</div>;

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
