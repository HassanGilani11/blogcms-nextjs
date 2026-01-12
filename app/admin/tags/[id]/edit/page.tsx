"use client"

import { useRouter, useParams } from "next/navigation"
import { TagForm } from "@/components/admin/tags/tag-form"
import React, { useState, useEffect } from "react"
import { getTag, updateTag, deleteTag } from "../../actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function EditTagPage() {
    const router = useRouter()
    const params = useParams()
    const [tag, setTag] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            fetchTag(params.id as string)
        }
    }, [params.id])

    async function fetchTag(id: string) {
        setIsLoading(true)
        const result = await getTag(id)
        if (result.success) {
            setTag(result.data)
        } else {
            toast.error(result.message || "Failed to fetch tag")
            router.push("/admin/tags")
        }
        setIsLoading(false)
    }

    async function onSubmit(values: any) {
        const result = await updateTag(params.id as string, values)
        if (result.success) {
            toast.success(result.message)
            router.push("/admin/tags")
        } else {
            toast.error(result.message || "Failed to update tag")
        }
    }

    async function onDelete() {
        const result = await deleteTag(params.id as string)
        if (result.success) {
            toast.success(result.message)
            router.push("/admin/tags")
        } else {
            toast.error(result.message || "Failed to delete tag")
        }
    }

    return (
        <div className="space-y-2 max-w-1xl mx-auto">
            <div className="flex items-center justify-between py-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Edit Tag</h2>
                    <p className="text-muted-foreground">
                        Update tag details.
                    </p>
                </div>
            </div>
            {isLoading ? (
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : tag && (
                <TagForm
                    initialData={tag}
                    onSubmit={onSubmit}
                    onDelete={onDelete}
                />
            )}
        </div>
    )
}
