"use client"

import { useEffect, useRef } from "react"
import { incrementPostViews } from "@/app/admin/posts/actions"

interface ViewCounterProps {
    postId: string
}

export function ViewCounter({ postId }: ViewCounterProps) {
    const hasIncremented = useRef(false)

    useEffect(() => {
        if (!hasIncremented.current) {
            incrementPostViews(postId)
            hasIncremented.current = true
        }
    }, [postId])

    return null
}
