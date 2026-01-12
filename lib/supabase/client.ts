import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

    if (!url || !key) {
        console.warn('Supabase credentials missing. Returning limited client for build-time safety.')
        // We return an empty client that will throw actual errors only when called, 
        // preventing immediate crash during static generation of other pages.
        return createBrowserClient(
            url || 'https://placeholder.supabase.co',
            key || 'placeholder-key'
        )
    }

    return createBrowserClient(url, key)
}
