"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { toggleLike, getLikeStatus } from "@/actions/like-actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
    postId: string
}

export function WishlistButton({ postId }: WishlistButtonProps) {
    const [liked, setLiked] = useState(false)
    const [count, setCount] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchStatus = async () => {
            const result = await getLikeStatus(postId)
            if (result.success) {
                setLiked(result.hasLiked)
                setCount(result.count)
            }
        }
        fetchStatus()
    }, [postId])

    const handleToggle = async () => {
        if (loading) return
        setLoading(true)

        // Optimistic update
        const prevLiked = liked
        const prevCount = count
        setLiked(!liked)
        setCount(liked ? count - 1 : count + 1)

        const result = await toggleLike(postId)

        if (!result.success) {
            // Revert on error
            setLiked(prevLiked)
            setCount(prevCount)
            toast.error(result.message || "Failed to update wishlist")
        }

        setLoading(false)
    }

    return (
        <div className="flex flex-col items-center gap-1 group">
            <Button
                variant="outline"
                size="icon"
                className={cn(
                    "rounded-full h-12 w-12 border transition-all duration-300 shadow-sm hover:shadow-md",
                    liked
                        ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100 hover:text-red-600 hover:border-red-300"
                        : "bg-background hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
                onClick={handleToggle}
                disabled={loading}
                title={liked ? "Remove from Wishlist" : "Add to Wishlist"}
            >
                <Heart className={cn("h-6 w-6 transition-all duration-300", liked && "fill-current scale-110")} />
            </Button>
            <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                {count}
            </span>
        </div>
    )
}
