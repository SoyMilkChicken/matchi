import { Metadata } from "next";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/events/event-card";
import { EVENT_TYPES } from "@/lib/types";

export const metadata: Metadata = {
  title: "Events",
  description: "Discover and join local events in your community",
};

// Mock data for development
const mockEvents = [
  {
    id: "1",
    title: "Hotpot Night at Sichuan House",
    description: "Join us for a delicious hotpot dinner! We'll be trying the spicy Sichuan style.",
    event_type: "food" as const,
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    location_address: "Sichuan House, 123 Main St",
    max_attendees: 12,
    tags: ["Beginner Friendly", "Indoor"],
    is_public: true,
    image_url: null,
    status: "active" as const,
    host: { id: "h1", name: "Sarah Chen", avatar_url: null },
    attendee_count: 8,
    attendees: [
      { id: "a1", name: "John", avatar_url: null },
      { id: "a2", name: "Emily", avatar_url: null },
      { id: "a3", name: "Mike", avatar_url: null },
    ],
  },
  {
    id: "2",
    title: "Pickup Basketball @ Co-Rec",
    description: "Casual pickup game, all skill levels welcome. Bring water!",
    event_type: "sports" as const,
    date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    location_address: "Co-Rec Center, Court 3",
    max_attendees: 10,
    tags: ["Beginner Friendly", "Indoor"],
    is_public: true,
    image_url: null,
    status: "active" as const,
    host: { id: "h2", name: "Marcus Johnson", avatar_url: null },
    attendee_count: 6,
    attendees: [
      { id: "a4", name: "Alex", avatar_url: null },
      { id: "a5", name: "Chris", avatar_url: null },
    ],
  },
  {
    id: "3",
    title: "Study Group: STAT 512",
    description: "Weekly study session for Stats 512. We'll go over homework and prep for exams.",
    event_type: "study" as const,
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    location_address: "WALC 1055",
    max_attendees: 8,
    tags: ["Free"],
    is_public: true,
    image_url: null,
    status: "active" as const,
    host: { id: "h3", name: "Wei Zhang", avatar_url: null },
    attendee_count: 4,
    attendees: [{ id: "a6", name: "Lisa", avatar_url: null }],
  },
];

export default function EventsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search events, activities..."
            className="pl-10 pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Badge
          variant="default"
          className="cursor-pointer whitespace-nowrap px-4 py-2"
        >
          All
        </Badge>
        {EVENT_TYPES.map((type) => (
          <Badge
            key={type.value}
            variant="outline"
            className="cursor-pointer whitespace-nowrap px-4 py-2 hover:bg-accent"
          >
            {type.icon} {type.label}
          </Badge>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {mockEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Empty State (for when there are no events) */}
      {mockEvents.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">No events found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or create your own event!
          </p>
        </div>
      )}
    </div>
  );
}
