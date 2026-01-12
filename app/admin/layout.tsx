import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminLayoutClient } from "@/components/admin/AdminLayoutClient"
import { getSiteSettings } from "./settings/actions"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const { data: settings } = await getSiteSettings()

    return (
        <AdminLayoutClient user={user} profile={profile} settings={settings}>
            {children}
        </AdminLayoutClient>
    )
}
