import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    let cookieStore: Awaited<ReturnType<typeof cookies>> | undefined
    try {
        cookieStore = await cookies()
    } catch {
        // Fallback for static generation where cookies() is not available
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

    if (!url || !key) {
        if (process.env.NODE_ENV === 'production') {
            console.error('CRITICAL: Supabase keys missing in Production Build environment!')
        }
        return createServerClient(
            url || 'https://placeholder.supabase.co',
            key || 'placeholder-key',
            { cookies: { getAll: () => [], setAll: () => { } } }
        )
    }

    return createServerClient(
        url,
        key,
        {
            cookies: {
                getAll() {
                    return cookieStore?.getAll() ?? []
                },
                setAll(cookiesToSet) {
                    if (!cookieStore) return
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}
