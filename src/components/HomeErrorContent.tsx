import { CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";

export function HomeErrorContent() {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-base">
          Oops! You need to be logged in to create or join a room
        </CardTitle>
        <CardDescription>
          Reloading the page should log you in automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" onClick={() => window.location.reload()}>
          Reload
        </Button>
      </CardContent>
    </>
  );
}
