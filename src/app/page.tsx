import Link from "next/link";
import { Calendar, Users, MapPin, Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const valueProps = [
  {
    icon: Calendar,
    title: "Join local events",
    description: "Find and join community events happening near you",
  },
  {
    icon: Users,
    title: "Find activity buddies",
    description: "Connect with people who share your interests",
  },
  {
    icon: MapPin,
    title: "Discover hidden gems",
    description: "Explore local spots recommended by the community",
  },
  {
    icon: Lightbulb,
    title: "Get insider knowledge",
    description: "Access tips and guides from locals and students",
  },
];

const sampleEvents = [
  { title: "Hotpot Night", attendees: 6, emoji: "🍲" },
  { title: "Pickup Basketball", time: "Tomorrow 5pm", emoji: "🏀" },
  { title: "Study Group: STAT 512", attendees: 4, emoji: "📚" },
  { title: "Coffee & Code", time: "Sat 10am", emoji: "☕" },
];

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          {/* Logo */}
          <h1 className="mb-2 text-4xl font-bold text-primary md:text-5xl">
            Matchi
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Your community, from day one
          </p>

          {/* Hero Headline */}
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            New to town? We&apos;ve got you.
          </h2>
          <p className="mb-10 text-lg text-muted-foreground">
            Join local events, find activity companions, and get insider tips
            about your new city or campus.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/signup">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Value Props */}
      <div className="bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((prop) => (
              <Card
                key={prop.title}
                className="border-none bg-background shadow-md transition-shadow hover:shadow-lg"
              >
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                    <prop.icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">
                    {prop.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {prop.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Sample Events Preview */}
      <div className="container mx-auto px-4 py-12">
        <h3 className="mb-6 text-center text-xl font-semibold text-foreground">
          See what&apos;s happening
        </h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {sampleEvents.map((event) => (
            <Card
              key={event.title}
              className="min-w-[200px] flex-shrink-0 border-none shadow-md"
            >
              <CardContent className="p-4">
                <div className="mb-2 text-3xl">{event.emoji}</div>
                <h4 className="font-medium text-foreground">{event.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {event.attendees
                    ? `${event.attendees} going`
                    : event.time}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-primary py-12 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h3 className="mb-4 text-2xl font-bold">
            Ready to find your community?
          </h3>
          <p className="mb-6 text-primary-foreground/80">
            Join thousands of newcomers connecting through Matchi
          </p>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
          >
            <Link href="/signup">Create Your Account</Link>
          </Button>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="border-t border-border bg-background py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Matchi. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link href="/login" className="hover:text-foreground">
              Sign In
            </Link>
            <Link href="/events" className="hover:text-foreground">
              Events
            </Link>
            <Link href="/info" className="hover:text-foreground">
              Info Hub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
