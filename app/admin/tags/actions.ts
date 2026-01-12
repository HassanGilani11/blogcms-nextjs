"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function getTags() {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('tags')
            .select(`
                *,
                post_tags:post_tags(count)
            `)
            .order('name', { ascending: true })

        if (error) throw error

        const transformedData = data?.map(tag => ({
            ...tag,
            count: tag.post_tags?.[0]?.count || 0
        }))

        return { success: true, data: transformedData || [] }
    } catch (error: any) {
        console.error('Error fetching tags:', error.message)
        return { success: false, message: error.message, data: [] }
    }
}

export async function getTag(id: string) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('tags')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error

        return { success: true, data }
    } catch (error: any) {
        console.error('Error fetching tag:', error.message)
        return { success: false, message: error.message }
    }
}

export async function createTag(formData: any) {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const { error } = await supabase
            .from('tags')
            .insert({
                name: formData.name,
                slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-')
            })

            .select()

        console.log("createTag: Result", error)

        if (error) throw error

        revalidatePath('/admin/tags')
        return { success: true, message: "Tag created successfully" }
    } catch (error: any) {
        console.error('Error creating tag:', error.message)
        return { success: false, message: error.message }
    }
}

export async function updateTag(id: string, values: any) {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const db = adminSupabase || supabase
        console.log("updateTag: Using Admin Client?", !!adminSupabase)

        const { data: updatedData, error: updateError, count } = await db
            .from('tags')
            .update({
                name: values.name,
                slug: values.slug,
                updated_at: new Date().toISOString()
            }, { count: 'exact' })
            .eq('id', id)
            .select()

        console.log("updateTag: SQL Result Details", {
            targetId: id,
            affectedCount: count,
            returnedRows: updatedData?.length,
            error: updateError
        })

        if (updateError) throw updateError

        if (count === 0) {
            throw new Error(`No tag updated. Verification failed for ID: ${id}`)
        }

        revalidatePath('/admin/tags')
        return { success: true, message: "Tag updated successfully" }
    } catch (error: any) {
        console.error('Error updating tag:', error.message)
        return { success: false, message: error.message }
    }
}

export async function deleteTag(id: string) {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const { error } = await supabase
            .from('tags')
            .delete()
            .eq('id', id)

        console.log("deleteTag: Result", error)

        if (error) throw error

        revalidatePath('/admin/tags')
        return { success: true, message: "Tag deleted successfully" }
    } catch (error: any) {
        console.error('Error deleting tag:', error.message)
        return { success: false, message: error.message }
    }
}
