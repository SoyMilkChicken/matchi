import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EventWithDetails, EVENT_TYPES } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: EventWithDetails;
  className?: string;
}

export function EventCard({ event, className }: EventCardProps) {
  const eventType = EVENT_TYPES.find((t) => t.value === event.event_type);
  const eventDate = new Date(event.date);
  const isToday = eventDate.toDateString() === new Date().toDateString();
  const isTomorrow =
    eventDate.toDateString() ===
    new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();

  const formatDate = () => {
    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";
    return eventDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
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
    <Card
      className={cn(
        "overflow-hidden border-none shadow-md transition-shadow hover:shadow-lg",
        className
      )}
    >
      <Link href={`/events/${event.id}`}>
        {/* Event Image or Placeholder */}
        <div className="relative h-40 bg-gradient-to-br from-primary/20 to-accent">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl">
              {eventType?.icon || "📅"}
            </div>
          )}
          {/* Category Badge */}
          <Badge className="absolute right-3 top-3 bg-background/90 text-foreground">
            {eventType?.icon} {eventType?.label}
          </Badge>
        </div>
      </Link>

      <CardContent className="p-4">
        {/* Title */}
        <Link href={`/events/${event.id}`}>
          <h3 className="mb-2 font-semibold text-foreground hover:text-primary">
            {event.title}
          </h3>
        </Link>

        {/* Host */}
        <div className="mb-3 flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={event.host.avatar_url || undefined} />
            <AvatarFallback className="text-xs">
              {event.host.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            Hosted by {event.host.name}
          </span>
        </div>

        {/* Event Details */}
        <div className="mb-3 space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate()} at {formatTime()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{event.location_address}</span>
          </div>
        </div>

        {/* Attendees & Join Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Attendee Avatars */}
            <div className="flex -space-x-2">
              {event.attendees.slice(0, 3).map((attendee) => (
                <Avatar key={attendee.id} className="h-7 w-7 border-2 border-card">
                  <AvatarImage src={attendee.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {attendee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              <Users className="mr-1 inline h-4 w-4" />
              {event.attendee_count} / {event.max_attendees}
            </span>
          </div>

          <Button size="sm">Join Event</Button>
        </div>
      </CardContent>
    </Card>
  );
}
