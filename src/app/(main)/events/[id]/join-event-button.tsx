"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface JoinEventButtonProps {
  eventId: string;
  spotsLeft: number;
}

export function JoinEventButton({ eventId, spotsLeft }: JoinEventButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Please log in to join events");
        router.push("/login");
        return;
      }

      // Check if already attending
      const { data: existingAttendee } = await supabase
        .from("attendees")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .single();

      if (existingAttendee) {
        toast.info("You're already attending this event!");
        return;
      }

      // Join the event
      const { error } = await supabase
        .from("attendees")
        .insert({
          event_id: eventId,
          user_id: user.id,
          status: spotsLeft > 0 ? "confirmed" : "waitlist",
        });

      if (error) throw error;

      toast.success(spotsLeft > 0 ? "You've joined the event!" : "You've been added to the waitlist!");
      router.refresh();
    } catch (error) {
      console.error("Join event error:", error);
      toast.error("Failed to join event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="w-full"
      size="lg"
      onClick={handleJoin}
      disabled={isLoading}
    >
      {isLoading ? "Joining..." : spotsLeft > 0 ? "Join Event" : "Join Waitlist"}
    </Button>
  );
}
