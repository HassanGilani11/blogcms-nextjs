"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getUsers() {
    const supabase = await createClient()

    // Fetch profiles
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
            *,
            posts:posts!posts_author_id_fkey(count)
        `)
        .order('created_at', { ascending: false })

    console.log("getUsers: Fetching profiles...")
    if (profilesError) {
        console.error('getUsers: Error fetching users:', profilesError)
        return { success: false, message: "Failed to fetch users" }
    }
    console.log(`getUsers: Successfully fetched ${profiles?.length} profiles`)

    // Transform data to include joined date and post count
    const users = profiles.map(profile => ({
        id: profile.id,
        name: profile.full_name || "Unnamed User",
        email: profile.email || "No Email", // Email might not be in profile depending on setup, usually in auth.users
        role: profile.role || "Subscriber",
        joinedDate: new Date(profile.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }),
        avatar: profile.avatar_url || "",
        postsCount: profile.posts?.[0]?.count || 0
    }))

    // Attempt to fetch emails from auth if possible (requires admin), or rely on what's in profile if copied. 
    // Usually profiles table should have an email column synced via trigger if we want to display it easily.
    // If not, we might need to fetch from auth.users using admin client, but let's see if profiles has email.
    // Checking `profiles` definition... it usually has `email`.

    return { success: true, data: users }
}

export async function getUser(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching user:', error)
        return { success: false, message: "Failed to fetch user" }
    }

    return { success: true, data }
}

export async function createUser(formData: FormData) {
    const adminSupabase = createAdminClient()

    if (!adminSupabase) {
        return { success: false, message: "Server configuration error: Missing Admin Key" }
    }

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as string

    // 1. Invite User via Email (Professional way)
    const { data: authData, error: authError } = await adminSupabase.auth.admin.inviteUserByEmail(
        email,
        {
            data: {
                full_name: name,
                role: role
            }
        }
    )

    if (authError) {
        console.error('createUser: Invitation error:', authError)
        return { success: false, message: authError.message }
    }

    if (!authData.user) {
        return { success: false, message: "Failed to create user" }
    }

    // 2. Update Profile with Role (Profile should be created by trigger, but we need to set role)
    // Wait for trigger or update directly. Trigger might result in a race condition or we can upsert.
    // Best practice: Update profile using admin client.

    const { error: profileError } = await adminSupabase
        .from('profiles')
        .update({ role: role, full_name: name, email: email }) // Ensure email is in profile
        .eq('id', authData.user.id)

    if (profileError) {
        // If trigger hasn't run yet, insert.
        const { error: insertError } = await adminSupabase
            .from('profiles')
            .upsert({
                id: authData.user.id,
                role: role,
                full_name: name,
                email: email,
                updated_at: new Date().toISOString()
            })

        if (insertError) {
            console.error('Error updating profile:', insertError)
            return { success: false, message: "User created but profile update failed" }
        }
    }

    revalidatePath('/admin/users')
    return { success: true, message: "User created successfully" }
}

export async function updateUser(userId: string, formData: FormData) {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    // Prefer admin client if available, otherwise fall back to standard client (which requires RLS policy)
    const db = adminSupabase || supabase

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const role = formData.get('role') as string
    const professional_bio = formData.get('professional_bio') as string

    // Update Profile
    const { error: profileError } = await db
        .from('profiles')
        .update({
            full_name: name,
            role: role,
            professional_bio: professional_bio,
            updated_at: new Date().toISOString()
        })
        .eq('id', userId)

    if (profileError) {
        return { success: false, message: profileError.message }
    }

    // Update Auth Email if changed (Requires Admin)
    // This is optional and complex because it triggers confirmation. Let's skip auth email update for now unless requested.
    // But we should update the email in profiles table if we are storing it there.

    const { error: emailUpdateError } = await supabase
        .from('profiles')
        .update({ email: email })
        .eq('id', userId)

    if (emailUpdateError) {
        console.error('Error updating profile email:', emailUpdateError)
    }

    revalidatePath('/admin/users')
    revalidatePath(`/admin/users/${userId}/edit`)
    return { success: true, message: "User updated successfully" }
}

export async function deleteUser(userId: string) {
    const adminSupabase = createAdminClient()

    if (!adminSupabase) {
        return { success: false, message: "Server configuration error: SUPABASE_SERVICE_ROLE_KEY is missing in your .env.local" }
    }

    // Delete from Auth (Users) - Cascades to profiles usually
    const { error } = await adminSupabase.auth.admin.deleteUser(userId)

    if (error) {
        return { success: false, message: error.message }
    }

    revalidatePath('/admin/users')
    return { success: true, message: "User deleted successfully" }
}
