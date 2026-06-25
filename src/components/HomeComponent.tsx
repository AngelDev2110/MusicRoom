/* eslint-disable @typescript-eslint/no-unused-vars */
import { createRoomSlug } from "@/utils/rooms";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { createRoom } from "@/services/rooms";

export function HomeComponent() {
  const { user, loading } = useAuth() || {};
  const navigate = useNavigate();

  async function handleCreateRoom() {
    try {
      if (!user) {
        alert("You must be signed in to create a room.");
        return;
      }
      const slug = createRoomSlug();

      await createRoom({ slug });

      navigate({ to: "/rooms/$slug", params: { slug } });
    } catch (_) {
      console.error("Error creating room");
    }
  }

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <>
          <p>Welcome, {user.id}!</p>
          <button onClick={handleCreateRoom}>Create Room</button>
        </>
      ) : (
        <p>Please sign in to create a room.</p>
      )}
    </div>
  );
}
