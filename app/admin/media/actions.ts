"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getMediaLibrary() {
    const supabase = await createClient()

    try {
        const folders = ['posts', 'categories', 'avatars']
        let allAssets: any[] = []

        for (const folder of folders) {
            const { data, error } = await supabase.storage
                .from('BlogCMS')
                .list(folder, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'created_at', order: 'desc' }
                })

            if (error) {
                console.error(`Error fetching folder ${folder}:`, error.message)
                continue
            }

            if (data) {
                const assets = data.map(file => {
                    const { data: { publicUrl } } = supabase.storage
                        .from('BlogCMS')
                        .getPublicUrl(`${folder}/${file.name}`)

                    return {
                        id: file.id,
                        name: file.name,
                        size: ((file.metadata?.size || 0) / 1024 / 1024).toFixed(2) + ' MB',
                        type: file.metadata?.mimetype || 'image/jpeg',
                        url: publicUrl,
                        created_at: file.created_at,
                        folder: folder
                    }
                })
                allAssets = [...allAssets, ...assets]
            }
        }

        // Sort combined assets by creation date
        allAssets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

        return { success: true, data: allAssets }
    } catch (error: any) {
        console.error('Error fetching media library:', error.message)
        return { success: false, message: error.message, data: [] }
    }
}

export async function deleteMedia(fileName: string, folder: string = 'posts') {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const { error } = await supabase.storage
            .from('BlogCMS')
            .remove([`${folder}/${fileName}`])

        if (error) throw error

        revalidatePath('/admin/media')
        return { success: true, message: "Media deleted successfully" }
    } catch (error: any) {
        console.error('Error deleting media:', error.message)
        return { success: false, message: error.message }
    }
}

export async function uploadMedia(formData: FormData, folder: string = 'posts') {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const file = formData.get('file') as File
        if (!file) throw new Error("No file provided")

        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${folder}/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('BlogCMS')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('BlogCMS')
            .getPublicUrl(filePath)

        revalidatePath('/admin/media')
        return { success: true, message: "Media uploaded successfully", url: publicUrl }
    } catch (error: any) {
        console.error('Error uploading media:', error.message)
        return { success: false, message: error.message }
    }
}
