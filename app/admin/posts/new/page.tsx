import { getPostFormData } from "../actions"
import { PostForm } from "@/components/admin/posts/post-form"

export default async function NewPostPage() {
    const { data, success } = await getPostFormData()

    const categories = success && data ? data.categories.map((c: any) => ({ label: c.name, value: c.id })) : []
    const authors = success && data ? data.authors.map((a: any) => ({ label: a.full_name, value: a.id })) : []

    return (
        <div className="space-y-2 max-w-1xl mx-auto">
            <div className="flex items-center justify-between py-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Create Post</h2>
                    <p className="text-muted-foreground">
                        Write and manage your new blog post.
                    </p>
                </div>
            </div>
            <PostForm
                categories={categories}
                authors={authors}
            />
        </div>
    )
}
