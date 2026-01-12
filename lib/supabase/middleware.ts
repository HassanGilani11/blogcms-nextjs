import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake can make it very hard to debug
    // auth issues.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Check maintenance mode
    const { data: settings } = await supabase
        .from('site_settings')
        .select('maintenance_mode')
        .eq('id', 1)
        .single()

    const isMaintenanceMode = settings?.maintenance_mode || false
    const isMaintenancePage = request.nextUrl.pathname === '/maintenance'
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isAuthRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register'
    const isStaticAsset = request.nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|css|js)$/)

    if (isMaintenanceMode) {
        // Redirect to maintenance if it's not an admin, auth, static asset, or the maintenance page itself
        if (!isAdminRoute && !isAuthRoute && !isMaintenancePage && !isStaticAsset) {
            return NextResponse.redirect(new URL('/maintenance', request.url))
        }
    } else {
        // If maintenance mode is OFF but user is ON the maintenance page, redirect home
        if (isMaintenancePage) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // Protected /admin routes
    if (isAdminRoute) {
        if (!user) {
            return NextResponse.redirect(new URL('/login?message=authentication_required', request.url))
        }

        // Check profile role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const role = profile?.role?.toLowerCase()
        console.log("Middleware: Admin Route Access Logic", {
            userId: user.id,
            foundRole: role,
            profileData: profile
        })

        if (role !== 'admin' && role !== 'super admin') {
            console.log("Middleware: Access Denied. Redirecting to login.")
            return NextResponse.redirect(new URL('/login?error=admin_access_required', request.url))
        }
    }

    // Redirect logged in users away from auth pages ONLY if they are admins trying to go back to login
    // or if we just want a cleaner experience. 
    if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
        // If the user arrived here because they lacked admin rights, let them see the login page
        // even if they have an existing session (this allows them to sign in with a different account).
        if (request.nextUrl.searchParams.get('error') === 'admin_access_required') {
            return supabaseResponse
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const role = profile?.role?.toLowerCase()
        if (role === 'admin' || role === 'super admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
        // If they are a normal user, they don't need the login page, so send them home
        return NextResponse.redirect(new URL('/', request.url))
    }

    return supabaseResponse
}
