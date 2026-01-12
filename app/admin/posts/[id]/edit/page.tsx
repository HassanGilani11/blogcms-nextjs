import { getPost, getPostFormData } from "../../actions"
import { PostForm } from "@/components/admin/posts/post-form"
import { notFound } from "next/navigation"

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const [postResult, formDataResult] = await Promise.all([
        getPost(id),
        getPostFormData()
    ])

    if (!postResult.success || !postResult.data) {
        notFound()
    }

    // Transform tags for the form (array of {tag: {id, name}} -> comma string)
    const postData = postResult.data
    const tagsString = postData.tags?.map((t: any) => t.tag.name).join(", ") || ""
    const categoriesArray = postData.categories?.map((c: any) => c.category?.id) || []

    const initialData = {
        ...postData,
        status: postData.status?.toLowerCase(),
        tags: tagsString,
        categories: categoriesArray
    }

    const categories = formDataResult.success && formDataResult.data
        ? formDataResult.data.categories.map((c: any) => ({ label: c.name, value: c.id }))
        : []

    const authors = formDataResult.success && formDataResult.data
        ? formDataResult.data.authors.map((a: any) => ({ label: a.full_name, value: a.id }))
        : []

    return (
        <div className="space-y-2 max-w-1xl mx-auto">
            <div className="flex items-center justify-between py-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Edit Post</h2>
                    <p className="text-muted-foreground">
                        Make changes to your existing blog post.
                    </p>
                </div>
            </div>
            <PostForm
                initialData={initialData}
                categories={categories}
                authors={authors}
            />
        </div>
    )
}
