'use server'

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addComment(formData: {
    postId: string
    name: string
    email: string
    content: string
}) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from('comments')
            .insert({
                post_id: formData.postId,
                name: formData.name,
                email: formData.email,
                content: formData.content,
                status: 'pending' // Default status
            })

        if (error) throw error

        return { success: true, message: "Comment submitted successfully! It will appear once approved." }
    } catch (error: any) {
        console.error('Error adding comment:', error.message)
        return { success: false, message: error.message }
    }
}

export async function getComments(postId: string) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .eq('status', 'approved')
            .order('created_at', { ascending: true })

        if (error) throw error

        return { success: true, data: data || [] }
    } catch (error: any) {
        console.error('Error fetching comments:', error.message)
        return { success: false, message: error.message, data: [] }
    }
}

// Admin Actions
export async function updateCommentStatus(id: string, status: 'approved' | 'pending' | 'spam' | 'trash') {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const { error } = await supabase
            .from('comments')
            .update({ status })
            .eq('id', id)

        if (error) throw error

        revalidatePath('/admin/comments')
        return { success: true, message: `Comment ${status} successfully` }
    } catch (error: any) {
        console.error('Error updating comment status:', error.message)
        return { success: false, message: error.message }
    }
}

export async function deleteCommentPermanently(id: string) {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidatePath('/admin/comments')
        return { success: true, message: "Comment deleted permanently" }
    } catch (error: any) {
        console.error('Error deleting comment:', error.message)
        return { success: false, message: error.message }
    }
}

export async function getAllComments() {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const { data, error } = await supabase
            .from('comments')
            .select(`
                *,
                post:posts(id, title, slug)
            `)
            .order('created_at', { ascending: false })

        if (error) throw error

        return { success: true, data: data || [] }
    } catch (error: any) {
        console.error('Error fetching all comments:', error.message)
        return { success: false, message: error.message, data: [] }
    }
}
