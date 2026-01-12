import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getSiteSettings } from "./actions"
import { SettingsForm } from "@/components/admin/SettingsForm"

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: settings } = await getSiteSettings()

    // Map DB snake_case to frontend camelCase for the form
    const initialData = {
        siteName: settings?.site_name,
        adminEmail: settings?.admin_email,
        siteDescription: settings?.site_description,
        metaTitle: settings?.meta_title,
        metaDescription: settings?.meta_description,
        keywords: settings?.keywords,
        facebook_url: settings?.facebook_url,
        twitter_url: settings?.twitter_url,
        instagram_url: settings?.instagram_url,
        linkedin_url: settings?.linkedin_url,
        youtube_url: settings?.youtube_url,
        github_url: settings?.github_url,
        maintenance_mode: settings?.maintenance_mode,
    }

    return (
        <div className="space-y-6">
            <SettingsForm initialData={initialData} />
        </div>
    )
}
