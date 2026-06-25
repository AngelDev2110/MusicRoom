import { createFileRoute } from "@tanstack/react-router";
import { getRoomBySlug } from "@/services/rooms";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/rooms/$slug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();

  const {
    data: room,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["room", slug],
    queryFn: () => getRoomBySlug(slug),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching room</div>;
  if (!room) return <div>Room not found</div>;

  return (
    <div>
      <h1>{room.slug}</h1>
    </div>
  );
}
