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

export const metadata: Metadata = {
  title: "Event Details",
};

// Mock data for development
const mockEvent = {
  id: "1",
  title: "Hotpot Night at Sichuan House",
  description:
    "Join us for a delicious hotpot dinner! We'll be trying the spicy Sichuan style. All spice levels welcome - they have mild options too. Great way to meet new people and enjoy some amazing food together. We'll split the bill evenly.",
  event_type: "food" as const,
  date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  location_address: "Sichuan House, 123 Main St, West Lafayette, IN",
  location_lat: 40.4237,
  location_lng: -86.9212,
  max_attendees: 12,
  tags: ["Beginner Friendly", "Indoor"],
  is_public: true,
  image_url: null,
  status: "active" as const,
  host: {
    id: "h1",
    name: "Sarah Chen",
    avatar_url: null,
    member_since: "Fall 2024",
  },
  attendee_count: 8,
  attendees: [
    { id: "a1", name: "John Park", avatar_url: null },
    { id: "a2", name: "Emily Wang", avatar_url: null },
    { id: "a3", name: "Mike Johnson", avatar_url: null },
    { id: "a4", name: "Lisa Zhang", avatar_url: null },
    { id: "a5", name: "David Kim", avatar_url: null },
    { id: "a6", name: "Anna Lee", avatar_url: null },
    { id: "a7", name: "Tom Wilson", avatar_url: null },
    { id: "a8", name: "Grace Liu", avatar_url: null },
  ],
};

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const event = mockEvent;
  const eventDate = new Date(event.date);
  const spotsLeft = event.max_attendees - event.attendee_count;

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
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-8xl">
            🍲
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
          🍜 Food & Dining
        </Badge>
      </div>

      <div className="container mx-auto px-4">
        {/* Title */}
        <h1 className="mt-6 text-2xl font-bold text-foreground">{event.title}</h1>

        {/* Host Section */}
        <Card className="mt-4 border-none shadow-md">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={event.host.avatar_url || undefined} />
                <AvatarFallback>{event.host.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{event.host.name}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {event.host.member_since}
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
                    {event.location_address}
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
                    {event.attendee_count} / {event.max_attendees} attending
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
                {event.description}
              </p>
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Who's Going */}
        <Card className="mt-4 border-none shadow-md">
          <CardContent className="p-4">
            <h3 className="mb-3 font-medium text-foreground">Who&apos;s Going</h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {event.attendees.map((attendee) => (
                <div key={attendee.id} className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={attendee.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {attendee.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm text-foreground">
                    {attendee.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sticky Join Button */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-card p-4 md:bottom-0">
        <div className="container mx-auto">
          <Button className="w-full" size="lg">
            Join Event
          </Button>
        </div>
      </div>
    </div>
  );
}
