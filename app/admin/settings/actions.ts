"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getSiteSettings() {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .eq('id', 1)
            .maybeSingle()

        if (error) {
            console.error('Error fetching site settings:', error)
            return { success: false, data: null }
        }

        return { success: true, data: data || { id: 1, site_name: 'BlogCMS' } }
    } catch (error) {
        console.error('Unexpected error fetching site settings:', error)
        return { success: false, data: null }
    }
}

export async function updateSiteSettings(data: any) {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return { success: false, message: "Unauthorized" }
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const role = profile?.role?.toLowerCase()
        if (role !== 'admin' && role !== 'super admin') {
            return { success: false, message: "Forbidden: Admin access required" }
        }

        // Map camelCase from frontend to snake_case for DB
        // In our case, the form uses the snake_case for DB columns mostly 
        // to simplify things. Let's make sure we map them correctly.
        const dbData = {
            site_name: data.siteName,
            admin_email: data.adminEmail,
            site_description: data.siteDescription,
            meta_title: data.metaTitle,
            meta_description: data.metaDescription,
            keywords: data.keywords,
            facebook_url: data.facebook_url,
            twitter_url: data.twitter_url,
            instagram_url: data.instagram_url,
            linkedin_url: data.linkedin_url,
            youtube_url: data.youtube_url,
            github_url: data.github_url,
            maintenance_mode: data.maintenance_mode,
            updated_at: new Date().toISOString()
        }

        const { error } = await supabase
            .from('site_settings')
            .upsert({ id: 1, ...dbData })

        if (error) {
            console.error('Error updating site settings:', error)
            return { success: false, message: error.message }
        }

        revalidatePath('/', 'layout')

        return { success: true, message: "Settings updated successfully!" }
    } catch (error) {
        console.error('Unexpected error updating site settings:', error)
        return { success: false, message: "An unexpected error occurred" }
    }
}
