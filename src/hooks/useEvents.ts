"use client";

import useSWR from "swr";
import { createClient } from "@/lib/supabase/client";
import type { EventWithDetails, EventFilters } from "@/lib/types";

const supabase = createClient();

// Fetcher function for SWR
async function fetchEvents(
  filters: EventFilters = {}
): Promise<EventWithDetails[]> {
  let query = supabase
    .from("events")
    .select(
      `
      *,
      host:users!host_id (id, name, avatar_url),
      attendees:attendees (
        user:users (id, name, avatar_url)
      )
    `
    )
    .eq("status", "active")
    .gte("date", new Date().toISOString())
    .order("date", { ascending: true });

  if (filters.category) {
    query = query.eq("event_type", filters.category);
  }

  if (filters.city) {
    query = query.ilike("location_address", `%${filters.city}%`);
  }

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  // Transform the data to match our types
  return (data || []).map((event) => ({
    ...event,
    host: event.host,
    attendees: event.attendees?.map((a: { user: unknown }) => a.user) || [],
    attendee_count: event.attendees?.length || 0,
  }));
}

export function useEvents(filters: EventFilters = {}) {
  const { data, error, isLoading, mutate } = useSWR(
    ["events", filters],
    () => fetchEvents(filters),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000, // 30 seconds
    }
  );

  return {
    events: data || [],
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

export function useEvent(eventId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    eventId ? ["event", eventId] : null,
    async () => {
      const { data, error } = await supabase
        .from("events")
        .select(
          `
          *,
          host:users!host_id (id, name, avatar_url, member_since),
          attendees:attendees (
            user:users (id, name, avatar_url)
          )
        `
        )
        .eq("id", eventId)
        .single();

      if (error) throw error;

      return {
        ...data,
        host: data.host,
        attendees: data.attendees?.map((a: { user: unknown }) => a.user) || [],
        attendee_count: data.attendees?.length || 0,
      } as EventWithDetails;
    },
    {
      revalidateOnFocus: false,
    }
  );

  return {
    event: data,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

export async function joinEvent(eventId: string, userId: string) {
  const { error } = await supabase.from("attendees").insert({
    event_id: eventId,
    user_id: userId,
    status: "confirmed",
  });

  if (error) throw error;
  return true;
}

export async function leaveEvent(eventId: string, userId: string) {
  const { error } = await supabase
    .from("attendees")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId);

  if (error) throw error;
  return true;
}

export async function createEvent(
  eventData: Omit<EventWithDetails, "id" | "created_at" | "updated_at" | "host" | "attendees" | "attendee_count">
) {
  const { data, error } = await supabase
    .from("events")
    .insert(eventData)
    .select()
    .single();

  if (error) throw error;
  return data;
}
