import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseServiceKey) {
        console.error("CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing from environment variables.");
        console.log("AVAILABLE NEXT_PUBLIC KEYS:", Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_')));
        return null
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
