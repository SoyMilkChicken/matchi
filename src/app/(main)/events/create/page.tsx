"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EVENT_TYPES, EVENT_TAGS } from "@/lib/types";
import { toast } from "sonner";

const createEventSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(80),
  description: z.string().max(500).optional(),
  event_type: z.enum(["sports", "food", "study", "arts", "housing", "social"]),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  location_address: z.string().min(3, "Location is required"),
  max_attendees: z.number().min(2).max(50),
  is_public: z.boolean(),
});

type CreateEventForm = z.infer<typeof createEventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateEventForm>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      max_attendees: 12,
      is_public: true,
    },
  });

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const onSubmit = async (data: CreateEventForm) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement actual event creation with Supabase
      console.log("Creating event:", { ...data, tags: selectedTags });
      toast.success("Event created successfully!");
      router.push("/events");
    } catch (error) {
      toast.error("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/events">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="font-semibold">Create Event</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Event Type */}
          <div className="space-y-2">
            <Label htmlFor="event_type">Event Type *</Label>
            <Select onValueChange={(value) => setValue("event_type", value as CreateEventForm["event_type"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.event_type && (
              <p className="text-sm text-destructive">{errors.event_type.message}</p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Pickup Basketball"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Tell people what to expect..."
              rows={4}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                {...register("date")}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input id="time" type="time" {...register("time")} />
              {errors.time && (
                <p className="text-sm text-destructive">{errors.time.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location_address">Location *</Label>
            <Input
              id="location_address"
              placeholder="Enter address or venue name"
              {...register("location_address")}
            />
            {errors.location_address && (
              <p className="text-sm text-destructive">
                {errors.location_address.message}
              </p>
            )}
          </div>

          {/* Max Attendees */}
          <div className="space-y-2">
            <Label htmlFor="max_attendees">Max Attendees</Label>
            <Input
              id="max_attendees"
              type="number"
              min={2}
              max={50}
              {...register("max_attendees", { valueAsNumber: true })}
            />
            {errors.max_attendees && (
              <p className="text-sm text-destructive">
                {errors.max_attendees.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {EVENT_TAGS.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Image Upload Placeholder */}
          <div className="space-y-2">
            <Label>Event Image (optional)</Label>
            <Card className="cursor-pointer border-dashed hover:border-primary">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload an image
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Post Event"}
          </Button>
        </div>
      </form>
    </div>
  );
}
