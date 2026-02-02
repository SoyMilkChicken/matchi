import { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Users,
  Share2,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/server";
import { EVENT_TYPES } from "@/lib/types";
import { JoinEventButton } from "./join-event-button";

export const metadata: Metadata = {
  title: "Event Details",
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch event with host and attendees
  const { data: event, error } = await supabase
    .from("events")
    .select(`
      *,
      host:users!host_id (id, name, avatar_url, created_at),
      attendees:attendees (
        user:users (id, name, avatar_url)
      )
    `)
    .eq("id", id)
    .single();

  if (error || !event) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Event not found</h1>
          <Link href="/events" className="mt-4 text-primary hover:underline">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  // Transform data
  const eventWithDetails = {
    ...event,
    attendees: event.attendees?.map((a: { user: { id: string; name: string; avatar_url: string | null } }) => a.user) || [],
    attendee_count: event.attendees?.length || 0,
    host: {
      ...event.host,
      member_since: event.host?.created_at
        ? new Date(event.host.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "Unknown",
    },
  };

  const eventDate = new Date(eventWithDetails.date);
  const spotsLeft = eventWithDetails.max_attendees - eventWithDetails.attendee_count;
  const eventType = EVENT_TYPES.find((t) => t.value === eventWithDetails.event_type);

  const formatDate = () => {
    return eventDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = () => {
    return eventDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header Image */}
      <div className="relative h-64 bg-gradient-to-br from-primary/30 to-accent">
        {eventWithDetails.image_url ? (
          <img
            src={eventWithDetails.image_url}
            alt={eventWithDetails.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-8xl">
            {eventType?.icon || "📅"}
          </div>
        )}
        {/* Back Button */}
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="absolute left-4 top-4 bg-background/80 hover:bg-background"
        >
          <Link href="/events">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        {/* Share Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 bg-background/80 hover:bg-background"
        >
          <Share2 className="h-5 w-5" />
        </Button>
        {/* Category Badge */}
        <Badge className="absolute bottom-4 left-4 bg-background/90 text-foreground">
          {eventType?.icon} {eventType?.label}
        </Badge>
      </div>

      <div className="container mx-auto px-4">
        {/* Title */}
        <h1 className="mt-6 text-2xl font-bold text-foreground">{eventWithDetails.title}</h1>

        {/* Host Section */}
        <Card className="mt-4 border-none shadow-md">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={eventWithDetails.host.avatar_url || undefined} />
                <AvatarFallback>{eventWithDetails.host.name?.charAt(0) || "?"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{eventWithDetails.host.name}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {eventWithDetails.host.member_since}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <MessageCircle className="mr-2 h-4 w-4" />
              Message
            </Button>
          </CardContent>
        </Card>

        {/* Event Details */}
        <Card className="mt-4 border-none shadow-md">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{formatDate()}</p>
                  <p className="text-sm text-muted-foreground">{formatTime()}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    {eventWithDetails.location_address}
                  </p>
                  <Button variant="link" className="h-auto p-0 text-sm">
                    Get Directions
                  </Button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    {eventWithDetails.attendee_count} / {eventWithDetails.max_attendees} attending
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {spotsLeft > 0 ? `${spotsLeft} spots left` : "Event is full"}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Description */}
            <div>
              <h3 className="mb-2 font-medium text-foreground">About</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {eventWithDetails.description || "No description provided."}
              </p>
            </div>

            {/* Tags */}
            {eventWithDetails.tags && eventWithDetails.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {eventWithDetails.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Who's Going */}
        <Card className="mt-4 border-none shadow-md">
          <CardContent className="p-4">
            <h3 className="mb-3 font-medium text-foreground">Who&apos;s Going</h3>
            {eventWithDetails.attendees.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {eventWithDetails.attendees.map((attendee: { id: string; name: string; avatar_url: string | null }) => (
                  <div key={attendee.id} className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={attendee.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {attendee.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="truncate text-sm text-foreground">
                      {attendee.name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No one has joined yet. Be the first!</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sticky Join Button */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-4 md:bottom-0">
        <div className="container mx-auto">
          <JoinEventButton eventId={id} spotsLeft={spotsLeft} />
        </div>
      </div>
    </div>
  );
}
