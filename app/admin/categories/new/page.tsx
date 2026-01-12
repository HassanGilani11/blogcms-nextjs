"use client"

import { useRouter } from "next/navigation"
import { CategoryForm } from "@/components/admin/categories/category-form"
import { createCategory } from "../actions"
import { toast } from "sonner"
import { useState } from "react"

export default function NewCategoryPage() {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)

    async function onSubmit(values: any) {
        setSubmitting(true)
        const result = await createCategory(values)
        if (result.success) {
            toast.success(result.message)
            router.push("/admin/categories")
        } else {
            toast.error(result.message || "Failed to create category")
        }
        setSubmitting(false)
    }

    return (
        <div className="space-y-2 max-w-1xl mx-auto">
            <div className="flex items-center justify-between py-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Create Category</h2>
                    <p className="text-muted-foreground">
                        Add a new category to your blog.
                    </p>
                </div>
            </div>
            <CategoryForm onSubmit={onSubmit} />
        </div>
    )
}
