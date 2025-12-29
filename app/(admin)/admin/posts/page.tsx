import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your blog posts.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">New Post</Link>
        </Button>
      </div>

      {/* TODO: Add posts table/list */}
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Posts list will appear here.
        </p>
      </div>
    </div>
  );
}

