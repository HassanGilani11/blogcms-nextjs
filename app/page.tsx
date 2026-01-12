import { Hero } from "@/components/hero"
import { BlogGrid } from "@/components/blog-grid"
import { FeaturedPosts } from "@/components/featured-posts"
import { Newsletter } from "@/components/newsletter"
import { Categories } from "@/components/categories"
import { getPosts } from "./admin/posts/actions"
import { getCategories } from "./admin/categories/actions"

export default async function Home() {
    const [postsResult, categoriesResult] = await Promise.all([
        getPosts({ status: 'published' }),
        getCategories()
    ])

    const posts = postsResult.data || []
    const categories = categoriesResult.data || []

    return (
        <>
            <Hero />
            <Categories initialCategories={categories} />
            <FeaturedPosts posts={posts} />
            <BlogGrid posts={posts} />
            <Newsletter />
        </>
    )
}
