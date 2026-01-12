'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function toggleLike(postId: string) {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, message: "You must be logged in to like posts" }
        }

        // Check if already liked
        const { data: existingLike, error: checkError } = await supabase
            .from('post_likes')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', user.id)
            .single()

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is 'not found'
            throw checkError
        }

        if (existingLike) {
            // Unlike
            const { error: deleteError } = await supabase
                .from('post_likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', user.id)

            if (deleteError) throw deleteError

            revalidatePath(`/blog`)
            return { success: true, liked: false }
        } else {
            // Like
            const { error: insertError } = await supabase
                .from('post_likes')
                .insert({
                    post_id: postId,
                    user_id: user.id
                })

            if (insertError) throw insertError

            revalidatePath(`/blog`)
            return { success: true, liked: true }
        }
    } catch (error: any) {
        console.error('Error toggling like:', error.message)
        return { success: false, message: error.message }
    }
}

export async function getLikeStatus(postId: string) {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()

        // Get count
        const { count, error: countError } = await supabase
            .from('post_likes')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', postId)

        if (countError) throw countError

        let hasLiked = false
        if (user) {
            const { data, error } = await supabase
                .from('post_likes')
                .select('*')
                .eq('post_id', postId)
                .eq('user_id', user.id)
                .single()

            if (data) hasLiked = true
        }

        return { success: true, count: count || 0, hasLiked }

    } catch (error: any) {
        console.error('Error getting like status:', error.message)
        return { success: false, count: 0, hasLiked: false }
    }
}
