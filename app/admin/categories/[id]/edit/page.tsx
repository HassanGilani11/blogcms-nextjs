"use client"

import { useRouter, useParams } from "next/navigation"
import { CategoryForm } from "@/components/admin/categories/category-form"
import React, { useState, useEffect } from "react"
import { getCategory, updateCategory, deleteCategory } from "../../actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function EditCategoryPage() {
    const router = useRouter()
    const params = useParams()
    const [category, setCategory] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            fetchCategory(params.id as string)
        }
    }, [params.id])

    async function fetchCategory(id: string) {
        setIsLoading(true)
        const result = await getCategory(id)
        if (result.success) {
            setCategory(result.data)
        } else {
            toast.error(result.message || "Failed to fetch category")
            router.push("/admin/categories")
        }
        setIsLoading(false)
    }

    async function onSubmit(values: any) {
        const result = await updateCategory(params.id as string, values)
        if (result.success) {
            toast.success(result.message)
            router.push("/admin/categories")
        } else {
            toast.error(result.message || "Failed to update category")
        }
    }

    async function onDelete() {
        const result = await deleteCategory(params.id as string)
        if (result.success) {
            toast.success(result.message)
            router.push("/admin/categories")
        } else {
            toast.error(result.message || "Failed to delete category")
        }
    }

    return (
        <div className="space-y-2 max-w-1xl mx-auto">
            <div className="flex items-center justify-between py-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Edit Category</h2>
                    <p className="text-muted-foreground">
                        Update category details.
                    </p>
                </div>
            </div>
            {isLoading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : category && (
                <CategoryForm
                    initialData={category}
                    onSubmit={onSubmit}
                    onDelete={onDelete}
                />
            )}
        </div>
    )
}
