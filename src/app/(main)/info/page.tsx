import { Metadata } from "next";
import Link from "next/link";
import { Search, TrendingUp, Clock, ThumbsUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INFO_CATEGORIES } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Info Hub",
  description: "Insider knowledge for newcomers - housing, food, classes, and more",
};

export default async function InfoHubPage() {
  const supabase = await createClient();

  // Get all posts to count per category
  const { data: allPosts } = await supabase
    .from("info_posts")
    .select("category");

  // Calculate category counts
  const categoryCounts: Record<string, number> = {};
  INFO_CATEGORIES.forEach((cat) => {
    categoryCounts[cat.value] = allPosts?.filter((p) => p.category === cat.value).length || 0;
  });

  // Get recent posts with author info
  const { data: recentPosts } = await supabase
    .from("info_posts")
    .select(`
      *,
      author:users!author_id (id, name)
    `)
    .order("created_at", { ascending: false })
    .limit(4);

  // Format recent posts
  const formattedPosts = (recentPosts || []).map((post) => {
    const createdAt = new Date(post.created_at);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    let timeAgo: string;
    if (diffHours < 1) {
      timeAgo = "Just now";
    } else if (diffHours < 24) {
      timeAgo = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    } else {
      timeAgo = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    }

    return {
      ...post,
      author: post.author?.name || "Anonymous",
      timeAgo,
    };
  });

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Insider Knowledge
        </h1>
        <p className="text-muted-foreground">By locals, for newcomers</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search guides, tips, questions..."
          className="pl-10"
        />
      </div>

      {/* Category Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        {INFO_CATEGORIES.map((category) => (
          <Link key={category.value} href={`/info/${category.value}`}>
            <Card className="h-full border-none shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
              <CardContent className="p-4">
                <div className="mb-2 text-3xl">{category.icon}</div>
                <h3 className="mb-1 font-semibold text-foreground">
                  {category.label}
                </h3>
                <p className="mb-2 text-xs text-muted-foreground">
                  {category.description}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {categoryCounts[category.value]} posts
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Latest Contributions</h2>
          <div className="flex gap-2">
            <Badge variant="outline" className="cursor-pointer gap-1">
              <Clock className="h-3 w-3" />
              Recent
            </Badge>
            <Badge variant="outline" className="cursor-pointer gap-1">
              <TrendingUp className="h-3 w-3" />
              Trending
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          {formattedPosts.length > 0 ? (
            formattedPosts.map((post) => {
              const category = INFO_CATEGORIES.find((c) => c.value === post.category);
              return (
                <Card key={post.id} className="border-none shadow-sm">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span>{category?.icon}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category?.label}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-foreground hover:text-primary">
                        <Link href={`/info/${post.category}/${post.id}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        by {post.author} · {post.timeAgo}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm">{post.upvotes || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">No posts yet. Be the first to contribute!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
