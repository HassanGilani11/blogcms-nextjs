"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function getCategories() {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('categories')
            .select(`
                *,
                post_categories!category_id(count)
            `)
            .order('name', { ascending: true })

        // Diagnostic log: check for service role key (only verify if it exists)
        const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
        console.log("DIAGNOSTIC: SUPABASE_SERVICE_ROLE_KEY present?", hasServiceKey);
        if (!hasServiceKey) {
            console.warn("WARNING: SUPABASE_SERVICE_ROLE_KEY is missing! Admin client will NOT work.");
        }

        if (error) throw error

        const transformedData = data?.map(cat => ({
            ...cat,
            count: cat.post_categories?.[0]?.count || 0
        }))

        return { success: true, data: transformedData || [] }
    } catch (error: any) {
        console.error('Error fetching categories:', error.message)
        return { success: false, message: error.message, data: [] }
    }
}

export async function getCategory(id: string) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error

        return { success: true, data }
    } catch (error: any) {
        console.error('Error fetching category:', error.message)
        return { success: false, message: error.message }
    }
}

export async function createCategory(formData: FormData) {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const name = formData.get('name') as string
        const slug = formData.get('slug') as string
        const description = formData.get('description') as string
        const iconFile = formData.get('icon') as File
        const iconUrlFromLibrary = formData.get('iconUrl') as string

        let iconUrl = iconUrlFromLibrary || null

        if (iconFile && iconFile.size > 0) {
            const fileExt = iconFile.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `categories/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('BlogCMS')
                .upload(filePath, iconFile)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('BlogCMS')
                .getPublicUrl(filePath)

            iconUrl = publicUrl
        }

        const { error } = await supabase
            .from('categories')
            .insert({
                name,
                slug: slug || name.toLowerCase().replace(/ /g, '-'),
                description,
                icon_url: iconUrl
            })
            .select()

        console.log("createCategory: Result", error)

        if (error) throw error

        revalidatePath('/admin/categories')
        return { success: true, message: "Category created successfully" }
    } catch (error: any) {
        console.error('Error creating category:', error.message)
        return { success: false, message: error.message }
    }
}

export async function updateCategory(id: string, formData: FormData) {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const name = formData.get('name') as string
        const slug = formData.get('slug') as string
        const description = formData.get('description') as string
        const iconFile = formData.get('icon') as File
        const iconUrlFromLibrary = formData.get('iconUrl') as string
        const currentIconUrl = formData.get('currentIconUrl') as string

        let iconUrl = iconUrlFromLibrary || currentIconUrl || null

        if (iconFile && iconFile.size > 0) {
            const fileExt = iconFile.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `categories/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('BlogCMS')
                .upload(filePath, iconFile)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('BlogCMS')
                .getPublicUrl(filePath)

            iconUrl = publicUrl
        }

        console.log("updateCategory: Attempting update for id", id, { name, slug })

        const db = adminSupabase || supabase
        console.log("updateCategory: Using Admin Client?", !!adminSupabase)

        const { data: updatedData, error: updateError, count } = await db
            .from('categories')
            .update({
                name,
                slug: slug || name.toLowerCase().replace(/ /g, '-'),
                description,
                icon_url: iconUrl,
                updated_at: new Date().toISOString()
            }, { count: 'exact' })
            .eq('id', id)
            .select()

        console.log("updateCategory: SQL Result Details", {
            targetId: id,
            affectedCount: count,
            returnedRows: updatedData?.length,
            error: updateError
        })

        if (updateError) throw updateError

        if (count === 0) {
            throw new Error(`No category updated. Verification failed for ID: ${id}`)
        }

        revalidatePath('/admin/categories')
        return { success: true, message: "Category updated successfully" }
    } catch (error: any) {
        console.error('Error updating category:', error.message)
        return { success: false, message: error.message }
    }
}

export async function deleteCategory(id: string) {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        // In a real app, you might want to prevent deleting categories that have posts
        // or reassign those posts to "Uncategorized"
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)

        console.log("deleteCategory: Result", error)

        if (error) throw error

        revalidatePath('/admin/categories')
        return { success: true, message: "Category deleted successfully" }
    } catch (error: any) {
        console.error('Error deleting category:', error.message)
        return { success: false, message: error.message }
    }
}
