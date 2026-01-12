import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getPosts } from "./actions"
import { PostsTable } from "./posts-table"

export default async function PostsPage() {
    const { data: posts } = await getPosts({ includeDeleted: true })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Posts</h2>
                    <p className="text-muted-foreground">
                        Manage your blog posts here.
                    </p>
                </div>
                <Link href="/admin/posts/new">
                    <Button className="gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Create Post
                    </Button>
                </Link>
            </div>

            <PostsTable initialPosts={posts || []} />
        </div >
    )
}
