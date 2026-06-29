import { useAuth } from "@/context/AuthContext";
import { HomeSkeleton } from "./HomeSkeleton";
import { HomeErrorContent } from "./HomeErrorContent";
import { HomeFormContent } from "./HomeFormContent";
import { Card } from "./ui/card";

export function HomeView() {
  const { user, loading } = useAuth() || {};

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-radial from-background to-primary/30 p-4">
      <header className="flex flex-col items-center gap-2 mb-8">
        <h1 className="text-5xl font-extrabold tracking-tight">Noob Draw ✏️</h1>
        <p className="text-muted-foreground text-center text-base">
          Guess the drawing and have fun with your friends
        </p>
      </header>

      <Card className="w-full max-w-sm">
        {loading ? (
          <HomeSkeleton />
        ) : user ? (
          <HomeFormContent user={user} />
        ) : (
          <HomeErrorContent />
        )}
      </Card>
    </main>
  );
}
