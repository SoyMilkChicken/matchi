// ==========================================
// Matchi - TypeScript Type Definitions
// ==========================================

// Event Types
export type EventType =
  | "sports"
  | "food"
  | "study"
  | "arts"
  | "housing"
  | "social";

export type EventStatus = "active" | "cancelled" | "completed";

export type AttendeeStatus = "confirmed" | "waitlist" | "cancelled";

// Database Types
export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  location_city?: string;
  location_lat?: number;
  location_lng?: number;
  interests: string[];
  looking_for: string[];
  is_edu_verified: boolean;
  member_since: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  host_id: string;
  title: string;
  description?: string;
  event_type: EventType;
  date: string;
  location_address: string;
  location_lat?: number;
  location_lng?: number;
  location_place_id?: string;
  max_attendees: number;
  tags: string[];
  is_public: boolean;
  image_url?: string;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface Attendee {
  id: string;
  event_id: string;
  user_id: string;
  status: AttendeeStatus;
  joined_at: string;
}

export interface InfoPost {
  id: string;
  author_id: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  event_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface Venue {
  id: string;
  google_place_id?: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  category?: string;
  rating?: number;
  price_level?: number;
  image_url?: string;
  created_at: string;
}

// Extended types with relations
export interface EventWithHost extends Event {
  host: Pick<User, "id" | "name" | "avatar_url">;
}

export interface EventWithDetails extends EventWithHost {
  attendees: Pick<User, "id" | "name" | "avatar_url">[];
  attendee_count: number;
}

export interface InfoPostWithAuthor extends InfoPost {
  author: Pick<User, "id" | "name" | "avatar_url">;
}

// Form types
export interface CreateEventForm {
  title: string;
  description: string;
  event_type: EventType;
  date: string;
  time: string;
  location_address: string;
  location_lat?: number;
  location_lng?: number;
  location_place_id?: string;
  max_attendees: number;
  tags: string[];
  is_public: boolean;
  image?: File;
}

export interface CreateInfoPostForm {
  category: string;
  title: string;
  content: string;
  tags: string[];
}

export interface UpdateProfileForm {
  name: string;
  bio: string;
  location_city: string;
  interests: string[];
  looking_for: string[];
  avatar?: File;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Filter types
export interface EventFilters {
  category?: EventType;
  search?: string;
  city?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface InfoFilters {
  category?: string;
  search?: string;
  sortBy?: "recent" | "popular" | "trending";
}

// Constants
export const EVENT_TYPES: { value: EventType; label: string; icon: string }[] = [
  { value: "sports", label: "Sports & Fitness", icon: "🏀" },
  { value: "food", label: "Food & Dining", icon: "🍜" },
  { value: "study", label: "Study & Academic", icon: "📚" },
  { value: "arts", label: "Arts & Culture", icon: "🎨" },
  { value: "housing", label: "Housing Search", icon: "🏠" },
  { value: "social", label: "Life & Social", icon: "🎉" },
];

export const INFO_CATEGORIES = [
  { value: "housing", label: "Housing", icon: "🏠", description: "Find rooms, roommates, neighborhood guides" },
  { value: "classes", label: "Classes & Academics", icon: "📚", description: "Professor reviews, study groups, tips" },
  { value: "food", label: "Food & Dining", icon: "🍜", description: "Best spots, deals, delivery tips" },
  { value: "transport", label: "Getting Around", icon: "🚗", description: "Transit, parking, bike routes" },
  { value: "money", label: "Money & Jobs", icon: "💰", description: "Part-time jobs, budgeting, student discounts" },
  { value: "campus", label: "Campus Life", icon: "🎯", description: "Clubs, gyms, events, traditions" },
];

export const EVENT_TAGS = [
  "Beginner Friendly",
  "Free",
  "BYOB",
  "Women-only",
  "Outdoor",
  "Indoor",
  "Pet Friendly",
  "Kid Friendly",
  "18+",
  "21+",
];
