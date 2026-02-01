import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Plus, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { INFO_CATEGORIES } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const categoryInfo = INFO_CATEGORIES.find((c) => c.value === category);
  return {
    title: categoryInfo?.label || "Info Hub",
  };
}

// Mock posts for a category
const mockPosts = [
  {
    id: "1",
    title: "Complete guide to off-campus housing",
    content: "Everything you need to know about finding apartments near campus...",
    author: { name: "Sarah K.", avatar_url: null },
    upvotes: 89,
    comments: 24,
    timeAgo: "3 days ago",
    tags: ["Guide", "Popular"],
  },
  {
    id: "2",
    title: "Best neighborhoods for grad students",
    content: "If you're looking for a quieter area with good access to campus...",
    author: { name: "Mike T.", avatar_url: null },
    upvotes: 45,
    comments: 12,
    timeAgo: "1 week ago",
    tags: ["Discussion"],
  },
  {
    id: "3",
    title: "Utilities breakdown: what to expect",
    content: "Here's my breakdown of average utility costs in the area...",
    author: { name: "Lisa W.", avatar_url: null },
    upvotes: 67,
    comments: 18,
    timeAgo: "2 weeks ago",
    tags: ["Tips"],
  },
];

export default async function InfoCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryInfo = INFO_CATEGORIES.find((c) => c.value === category);

  if (!categoryInfo) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Category not found</h1>
        <Link href="/info" className="mt-4 text-primary hover:underline">
          Back to Info Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/info">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="font-semibold">
            {categoryInfo.icon} {categoryInfo.label}
          </h1>
          <Button size="icon" variant="ghost">
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Category Description */}
        <p className="mb-6 text-center text-muted-foreground">
          {categoryInfo.description}
        </p>

        {/* Posts */}
        <div className="space-y-4">
          {mockPosts.map((post) => (
            <Card key={post.id} className="border-none shadow-md">
              <CardContent className="p-4">
                <div className="mb-2 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="mb-2 font-semibold text-foreground hover:text-primary">
                  <Link href={`/info/${category}/${post.id}`}>{post.title}</Link>
                </h3>
                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                  {post.content}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    by {post.author.name} · {post.timeAgo}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      {post.upvotes}
                    </span>
                    <span>{post.comments} comments</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Post CTA */}
        <div className="mt-8 text-center">
          <p className="mb-3 text-muted-foreground">
            Have something to share?
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>
      </div>
    </div>
  );
}
