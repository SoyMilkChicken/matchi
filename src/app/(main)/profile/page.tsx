import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Settings, Calendar, CheckCircle, FileText, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/server";
import { EVENT_TYPES } from "@/lib/types";
import { SignOutButton } from "./sign-out-button";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const supabase = await createClient();

  // Get current user
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  // Fetch user profile
  let { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (!user) {
    // Create profile if it doesn't exist
    const { data: newUser } = await supabase
      .from("users")
      .insert({
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata.name || authUser.email?.split("@")[0] || "User",
        interests: [],
        looking_for: [],
        is_edu_verified: authUser.email?.endsWith(".edu") || false,
      })
      .select()
      .single();

    user = newUser;
  }

  // Fetch user's upcoming events (as attendee)
  const { data: attendingEvents } = await supabase
    .from("attendees")
    .select(`
      event:events (
        id,
        title,
        date,
        event_type
      )
    `)
    .eq("user_id", authUser.id)
    .eq("status", "confirmed");

  // Define event type for nested query result
  interface AttendeeWithEvent {
    event: {
      id: string;
      title: string;
      date: string;
      event_type: string;
    } | null;
  }

  // Cast and filter to upcoming events only
  const typedAttendingEvents = (attendingEvents || []) as unknown as AttendeeWithEvent[];
  const upcomingEvents = typedAttendingEvents
    .filter((a) => a.event && new Date(a.event.date) >= new Date())
    .map((a) => ({
      id: a.event!.id,
      title: a.event!.title,
      date: a.event!.date,
      event_type: a.event!.event_type,
      emoji: EVENT_TYPES.find((t) => t.value === a.event!.event_type)?.icon || "📅",
      formattedDate: new Date(a.event!.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    }));

  // Fetch user's hosted events
  const { data: hostedEvents } = await supabase
    .from("events")
    .select("*")
    .eq("host_id", authUser.id)
    .order("date", { ascending: false });

  const formattedHostedEvents = (hostedEvents || []).map((event) => ({
    ...event,
    emoji: EVENT_TYPES.find((t) => t.value === event.event_type)?.icon || "📅",
    formattedDate: new Date(event.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  }));

  // Calculate stats
  const stats = {
    events_attended: attendingEvents?.length || 0,
    events_hosted: hostedEvents?.length || 0,
    contributions: 0,
  };

  // Format member since date
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Recently";

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatar_url || undefined} />
            <AvatarFallback className="text-2xl">
              {user?.name?.charAt(0) || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">
                {user?.name || "User"}
              </h1>
              {user?.is_edu_verified && (
                <BadgeCheck className="h-5 w-5 text-primary" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {user?.location_city || "Location not set"}
            </p>
            <p className="text-sm text-muted-foreground">
              Member since {memberSince}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Stats */}
      <Card className="mb-6 border-none shadow-md">
        <CardContent className="grid grid-cols-3 gap-4 p-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">
              {stats.events_attended}
            </p>
            <p className="text-xs text-muted-foreground">Attended</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">
              {stats.events_hosted}
            </p>
            <p className="text-xs text-muted-foreground">Hosted</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">
              {stats.contributions}
            </p>
            <p className="text-xs text-muted-foreground">Contributions</p>
          </div>
        </CardContent>
      </Card>

      {/* Bio */}
      <Card className="mb-6 border-none shadow-md">
        <CardContent className="p-4">
          <h3 className="mb-2 font-semibold text-foreground">About</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            {user?.bio || "No bio yet. Tell others about yourself!"}
          </p>

          {user?.looking_for && user.looking_for.length > 0 && (
            <>
              <h4 className="mb-2 text-sm font-medium text-foreground">
                Looking for
              </h4>
              <div className="mb-4 flex flex-wrap gap-2">
                {user.looking_for.map((item: string) => (
                  <Badge key={item} variant="default">
                    {item}
                  </Badge>
                ))}
              </div>
            </>
          )}

          {user?.interests && user.interests.length > 0 && (
            <>
              <h4 className="mb-2 text-sm font-medium text-foreground">Interests</h4>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest: string) => (
                  <Badge key={interest} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            <Calendar className="mr-1 h-4 w-4" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="hosted">
            <CheckCircle className="mr-1 h-4 w-4" />
            Hosted
          </TabsTrigger>
          <TabsTrigger value="contributions">
            <FileText className="mr-1 h-4 w-4" />
            Posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-4">
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="border-none shadow-sm">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="text-3xl">{event.emoji}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.formattedDate}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/events/${event.id}`}>View</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
            {upcomingEvents.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">
                No upcoming events
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="hosted" className="mt-4">
          <div className="space-y-3">
            {formattedHostedEvents.map((event) => (
              <Card key={event.id} className="border-none shadow-sm">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="text-3xl">{event.emoji}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.formattedDate}</p>
                  </div>
                  <Badge variant="secondary">{event.status}</Badge>
                </CardContent>
              </Card>
            ))}
            {formattedHostedEvents.length === 0 && (
              <p className="py-8 text-center text-muted-foreground">
                No hosted events yet
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="contributions" className="mt-4">
          <p className="py-8 text-center text-muted-foreground">
            No contributions yet
          </p>
        </TabsContent>
      </Tabs>

      {/* Sign Out Button */}
      <div className="mt-8">
        <SignOutButton />
      </div>
    </div>
  );
}
