import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Flag, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "User Profile",
};

// Mock user data (would be fetched based on ID)
const mockUser = {
  id: "u2",
  name: "Sarah Chen",
  avatar_url: null,
  bio: "International student from Shanghai. Love trying new foods and exploring the area!",
  location_city: "West Lafayette, IN",
  interests: ["Cooking", "Photography", "Hiking", "Movies"],
  looking_for: ["Food explorers", "Photography buddies", "Hiking partners"],
  is_edu_verified: true,
  member_since: "Fall 2024",
  stats: {
    events_attended: 24,
    events_hosted: 8,
  },
};

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // In production, fetch user data based on ID

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/events">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="font-semibold">Profile</h1>
          <Button variant="ghost" size="icon">
            <Flag className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Avatar className="mb-4 h-24 w-24">
            <AvatarImage src={mockUser.avatar_url || undefined} />
            <AvatarFallback className="text-3xl">
              {mockUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">{mockUser.name}</h1>
            {mockUser.is_edu_verified && (
              <BadgeCheck className="h-5 w-5 text-primary" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">{mockUser.location_city}</p>
          <p className="text-sm text-muted-foreground">
            Member since {mockUser.member_since}
          </p>
        </div>

        {/* Message Button */}
        <Button className="mb-6 w-full">
          <MessageCircle className="mr-2 h-4 w-4" />
          Send Message
        </Button>

        {/* Stats */}
        <Card className="mb-6 border-none shadow-md">
          <CardContent className="grid grid-cols-2 gap-4 p-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">
                {mockUser.stats.events_attended}
              </p>
              <p className="text-xs text-muted-foreground">Events Attended</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {mockUser.stats.events_hosted}
              </p>
              <p className="text-xs text-muted-foreground">Events Hosted</p>
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

            <h4 className="mb-2 text-sm font-medium text-foreground">
              Interests
            </h4>
            <div className="flex flex-wrap gap-2">
              {mockUser.interests.map((interest) => (
                <Badge key={interest} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
