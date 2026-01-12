import { Suspense } from "react"
import { getPosts } from "../admin/posts/actions"
import { getCategories } from "../admin/categories/actions"
import { BlogContent } from "@/components/blog-content"

export default async function BlogPage() {
    const [postsResult, categoriesResult] = await Promise.all([
        getPosts({ status: 'published' }),
        getCategories()
    ])

    const posts = postsResult.data || []
    const categories = categoriesResult.data || []

    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        }>
            <BlogContent initialPosts={posts} allCategories={categories} />
        </Suspense>
    )
}
