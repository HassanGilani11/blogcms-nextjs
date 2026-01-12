'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { getURL } from '@/lib/utils'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return redirect('/login?message=Could not authenticate user')
    }

    // Get user profile to determine redirect
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        console.log("Login: User found", user.id)
        console.log("Login: Profile result", profile, profileError)

        if (profile?.role === 'admin' || profile?.role === 'super admin') {
            console.log("Login: Redirecting to dashboard")
            redirect('/admin/dashboard')
        } else {
            console.log("Login: Role mismatch, redirecting home. Role:", profile?.role)
        }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    })

    if (error) {
        return redirect('/register?message=Could not create user')
    }

    // Profile is usually created via a Supabase trigger, 
    // but we can also do it manually here if the trigger isn't set up yet.
    if (data.user) {
        await supabase.from('profiles').insert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            role: 'user', // Default role
        })
    }

    revalidatePath('/', 'layout')
    redirect('/login?message=Check email to continue registration')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const fullName = formData.get('fullName') as string
    const bio = formData.get('bio') as string

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: fullName,
            professional_bio: bio,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (error) {
        throw new Error(error.message)
    }

    revalidatePath('/admin', 'layout')
    return { success: true }
}

export async function uploadAvatar(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const file = formData.get('file') as File
    if (!file) {
        throw new Error('No file provided')
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Math.random()}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage
        .from('BlogCMS')
        .upload(filePath, file)

    if (uploadError) {
        throw new Error(uploadError.message)
    }

    const { data: { publicUrl } } = supabase.storage
        .from('BlogCMS')
        .getPublicUrl(filePath)

    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            avatar_url: publicUrl,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (updateError) {
        throw new Error(updateError.message)
    }

    revalidatePath('/admin', 'layout')
    return { success: true, url: publicUrl }
}

export async function setAvatarUrl(url: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            avatar_url: url,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

    if (updateError) {
        throw new Error(updateError.message)
    }

    revalidatePath('/admin', 'layout')
    return { success: true }
}

export async function updatePassword(formData: FormData) {
    const supabase = await createClient()

    const currentPassword = formData.get('currentPassword') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // 1. Get current user email
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !user.email) {
        return { success: false, message: 'User not found' }
    }

    // 2. Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
    })

    if (signInError) {
        return { success: false, message: 'Invalid current password' }
    }

    // 3. Validate new password
    if (!password || password.length < 8) {
        return { success: false, message: 'New password must be at least 8 characters long' }
    }

    if (password !== confirmPassword) {
        return { success: false, message: 'New passwords do not match' }
    }

    // 4. Update password
    const { error: updateError } = await supabase.auth.updateUser({
        password: password
    })

    if (updateError) {
        return { success: false, message: updateError.message }
    }

    return { success: true }
}

export async function resetPassword(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const siteUrl = getURL()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}auth/callback?next=/update-password`,
    })

    if (error) {
        return { success: false, message: error.message }
    }

    return { success: true, message: "Check your email for the reset link." }
}

export async function updatePasswordConfirm(formData: FormData) {
    const supabase = await createClient()

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!password || password.length < 8) {
        return { success: false, message: 'New password must be at least 8 characters long' }
    }

    if (password !== confirmPassword) {
        return { success: false, message: 'New passwords do not match' }
    }

    const { error } = await supabase.auth.updateUser({
        password: password
    })

    if (error) {
        return { success: false, message: error.message }
    }

    return { success: true }
}
