import { Metadata } from "next";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EventCard } from "@/components/events/event-card";
import { EVENT_TYPES } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Events",
  description: "Discover and join local events in your community",
};

export default async function EventsPage() {
  const supabase = await createClient();

  // Fetch real events from Supabase
  const { data: events } = await supabase
    .from("events")
    .select(`
      *,
      host:users!host_id (id, name, avatar_url),
      attendees:attendees (
        user:users (id, name, avatar_url)
      )
    `)
    .eq("status", "active")
    .gte("date", new Date().toISOString())
    .order("date", { ascending: true });

  // Transform data to match EventWithDetails type
  const eventsWithDetails = (events || []).map((event) => ({
    ...event,
    attendees: event.attendees?.map((a: { user: { id: string; name: string; avatar_url: string | null } }) => a.user) || [],
    attendee_count: event.attendees?.length || 0,
  }));

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
        {eventsWithDetails.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Empty State */}
      {eventsWithDetails.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">No events found</p>
          <p className="text-sm text-muted-foreground">
            Be the first to create an event in your community!
          </p>
        </div>
      )}
    </div>
  );
}
