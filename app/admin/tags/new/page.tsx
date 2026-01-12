"use client"

import { useRouter } from "next/navigation"
import { TagForm } from "@/components/admin/tags/tag-form"
import { createTag } from "../actions"
import { toast } from "sonner"
import { useState } from "react"

export default function NewTagPage() {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)

    async function onSubmit(values: any) {
        setSubmitting(true)
        const result = await createTag(values)
        if (result.success) {
            toast.success(result.message)
            router.push("/admin/tags")
        } else {
            toast.error(result.message || "Failed to create tag")
        }
        setSubmitting(false)
    }

    return (
        <div className="space-y-2 max-w-1xl mx-auto">
            <div className="flex items-center justify-between py-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Create Tag</h2>
                    <p className="text-muted-foreground">
                        Add a new tag to organize your content.
                    </p>
                </div>
            </div>
            <TagForm onSubmit={onSubmit} />
        </div>
    )
}
