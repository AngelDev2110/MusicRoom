import type { User } from "@supabase/supabase-js";
import { CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Field, FieldLabel, FieldDescription } from "./ui/field";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changeDisplayName } from "@/services/auth";
import { createRoomSlug } from "@/utils/rooms";
import { createRoomWithHost } from "@/services/rooms";
import { useNavigate } from "@tanstack/react-router";

export function HomeFormContent(props: { user: User | null }) {
  const { user } = props;

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [joinSlug, setJoinSlug] = useState("");

  const nameMutation = useMutation({
    mutationFn: (displayName: string) => changeDisplayName(displayName),
  });

  const createRoomMutation = useMutation({
    mutationFn: async () => {
      const slug = createRoomSlug();
      await createRoomWithHost(slug);
      return slug;
    },
    onSuccess: (slug) => {
      navigate({ to: "/rooms/$slug", params: { slug } });
    },
    onError: () => {
      console.error("Error creating room");
    },
  });

  function handleJoinRoom() {
    const trimmedSlug = joinSlug.trim().split("/").at(-1) ?? joinSlug.trim();
    if (!trimmedSlug) return;
    navigate({ to: "/rooms/$slug", params: { slug: trimmedSlug } });
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-base">
          {user?.user_metadata?.display_name ? (
            <p>
              Welcome,{" "}
              <span className="font-bold text-primary">
                {user.user_metadata.display_name}
              </span>
              !
            </p>
          ) : (
            "What should we call you?!"
          )}
        </CardTitle>
        <CardDescription>
          {user?.user_metadata?.display_name ? (
            "You can change your nickname or create/join a room below."
          ) : (
            <p>
              <span className="text-primary">Set your nickname</span> before
              creating or joining a room. Your name will be visible to other
              players
            </p>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <Field>
          <FieldLabel htmlFor="name">Display Name</FieldLabel>
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <Input
                id="name"
                placeholder="Top 1° Noobie"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FieldDescription className="text-xs text-muted-foreground">
                {name.trim().length < 3
                  ? "Name must be at least 3 characters"
                  : "Looks good!"}
              </FieldDescription>
            </div>
            <Button
              variant="secondary"
              onClick={() => nameMutation.mutate(name.trim())}
              disabled={name.trim().length < 3 || nameMutation.isPending}
            >
              {nameMutation.isPending ? "Saving..." : "Update"}
            </Button>
          </div>
        </Field>

        <Button
          onClick={() => createRoomMutation.mutate()}
          disabled={
            createRoomMutation.isPending || !user?.user_metadata?.display_name
          }
          className="w-full"
        >
          {createRoomMutation.isPending ? "Creating room..." : "Create room"}
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or join one</span>
          <Separator className="flex-1" />
        </div>

        <div className="flex gap-2">
          <Field>
            <FieldLabel htmlFor="join-room">Room Code</FieldLabel>
            <div className="flex gap-2">
              <Input
                id="join-room"
                maxLength={8}
                placeholder="e.g. 1a2b3c4d"
                value={joinSlug}
                onChange={(e) => setJoinSlug(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
              />
              <Button
                variant="secondary"
                onClick={handleJoinRoom}
                disabled={
                  joinSlug.trim().length < 8 ||
                  !user?.user_metadata?.display_name
                }
              >
                Join
              </Button>
            </div>
          </Field>
        </div>
      </CardContent>
    </>
  );
}
