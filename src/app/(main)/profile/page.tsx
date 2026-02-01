import { Metadata } from "next";
import Link from "next/link";
import { Settings, Calendar, CheckCircle, FileText, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Profile",
};

// Mock user data
const mockUser = {
  id: "u1",
  name: "John Park",
  email: "jpark@purdue.edu",
  avatar_url: null,
  bio: "CS grad student at Purdue. Love basketball, good food, and meeting new people!",
  location_city: "West Lafayette, IN",
  interests: ["Basketball", "Cooking", "Board Games", "Hiking"],
  looking_for: ["Gym buddies", "Study partners", "Food explorers"],
  is_edu_verified: true,
  member_since: "Fall 2024",
  stats: {
    events_attended: 12,
    events_hosted: 3,
    contributions: 18,
  },
};

// Mock events
const upcomingEvents = [
  {
    id: "1",
    title: "Hotpot Night",
    date: "Feb 5, 7:00 PM",
    emoji: "🍲",
  },
  {
    id: "2",
    title: "Basketball @ Co-Rec",
    date: "Feb 8, 5:00 PM",
    emoji: "🏀",
  },
];

const hostedEvents = [
  {
    id: "3",
    title: "Board Game Night",
    date: "Jan 28, 6:00 PM",
    status: "completed",
    emoji: "🎲",
  },
];

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={mockUser.avatar_url || undefined} />
            <AvatarFallback className="text-2xl">
              {mockUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground">
                {mockUser.name}
              </h1>
              {mockUser.is_edu_verified && (
                <BadgeCheck className="h-5 w-5 text-primary" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {mockUser.location_city}
            </p>
            <p className="text-sm text-muted-foreground">
              Member since {mockUser.member_since}
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
              {mockUser.stats.events_attended}
            </p>
            <p className="text-xs text-muted-foreground">Attended</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">
              {mockUser.stats.events_hosted}
            </p>
            <p className="text-xs text-muted-foreground">Hosted</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">
              {mockUser.stats.contributions}
            </p>
            <p className="text-xs text-muted-foreground">Contributions</p>
          </div>
        </CardContent>
      </Card>

      {/* Bio */}
      <Card className="mb-6 border-none shadow-md">
        <CardContent className="p-4">
          <h3 className="mb-2 font-semibold text-foreground">About</h3>
          <p className="mb-4 text-sm text-muted-foreground">{mockUser.bio}</p>

          <h4 className="mb-2 text-sm font-medium text-foreground">
            Looking for
          </h4>
          <div className="mb-4 flex flex-wrap gap-2">
            {mockUser.looking_for.map((item) => (
              <Badge key={item} variant="default">
                {item}
              </Badge>
            ))}
          </div>

          <h4 className="mb-2 text-sm font-medium text-foreground">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {mockUser.interests.map((interest) => (
              <Badge key={interest} variant="secondary">
                {interest}
              </Badge>
            ))}
          </div>
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
                    <p className="text-sm text-muted-foreground">{event.date}</p>
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
            {hostedEvents.map((event) => (
              <Card key={event.id} className="border-none shadow-sm">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="text-3xl">{event.emoji}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <Badge variant="secondary">{event.status}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contributions" className="mt-4">
          <p className="py-8 text-center text-muted-foreground">
            No contributions yet
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
