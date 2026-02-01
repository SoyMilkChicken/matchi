"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, Search, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/events", label: "Events" },
  { href: "/info", label: "Info Hub" },
  { href: "/profile", label: "Profile" },
];

interface HeaderProps {
  showSearch?: boolean;
  showLocation?: boolean;
  location?: string;
}

export function Header({
  showSearch = false,
  showLocation = true,
  location = "West Lafayette, IN",
}: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/events" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Matchi</span>
        </Link>

        {/* Location indicator (mobile) */}
        {showLocation && (
          <button className="flex items-center gap-1 text-sm text-muted-foreground md:hidden">
            <MapPin className="h-4 w-4" />
            <span className="max-w-[120px] truncate">{location}</span>
          </button>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname.startsWith(link.href)
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Desktop location */}
          {showLocation && (
            <button className="hidden items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground transition-colors hover:bg-secondary/80 md:flex">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </button>
          )}

          {/* Create event button (desktop) */}
          <Button asChild className="hidden md:inline-flex">
            <Link href="/events/create">Create Event</Link>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Bell className="h-5 w-5" />
          </Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-left text-primary">
                  Matchi
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary",
                      pathname.startsWith(link.href)
                        ? "text-primary"
                        : "text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-2" />
                <Button asChild className="w-full">
                  <Link href="/events/create">Create Event</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Search bar (optional) */}
      {showSearch && (
        <div className="border-t border-border px-4 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events, activities..."
              className="pl-10"
            />
          </div>
        </div>
      )}
    </header>
  );
}
