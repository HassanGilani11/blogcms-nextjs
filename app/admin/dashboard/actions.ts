'use server'

import { createClient } from "@/lib/supabase/server"

export async function getDashboardStats() {
    const supabase = await createClient()

    try {
        // 1. Total Posts
        const { count: totalPosts, error: totalError } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .is('deleted_at', null)

        if (totalError) throw totalError

        // 2. Published Posts
        const { count: publishedPosts, error: pubError } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'published')
            .is('deleted_at', null)

        if (pubError) throw pubError

        // 3. Draft Posts
        const { count: draftPosts, error: draftError } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'draft')
            .is('deleted_at', null)

        if (draftError) throw draftError

        // 4. Total Views
        const { data: viewsData } = await supabase
            .from('posts')
            .select('view_count')
            .is('deleted_at', null)

        const totalViews = viewsData?.reduce((acc, curr) => acc + (curr.view_count || 0), 0) || 0

        // 5. Recent Posts
        const { data: recentPosts, error: recentError } = await supabase
            .from('posts')
            .select('id, title, status, created_at, view_count')
            .is('deleted_at', null)
            .order('created_at', { ascending: false })
            .limit(5)

        if (recentError) throw recentError

        return {
            success: true,
            data: {
                totalPosts: totalPosts || 0,
                publishedPosts: publishedPosts || 0,
                draftPosts: draftPosts || 0,
                totalViews: totalViews,
                recentPosts: recentPosts || []
            }
        }
    } catch (error: any) {
        console.error('Error fetching dashboard stats:', error.message)
        return { success: false, message: error.message }
    }
}

export async function getAnalyticsData() {
    const supabase = await createClient()

    try {
        // 1. Category Distribution
        const { data: categories, error: catError } = await supabase
            .from('categories')
            .select(`
                name,
                post_categories!category_id(count)
            `)

        if (catError) throw catError

        const totalPosts = categories?.reduce((acc, cat) => acc + (cat.post_categories?.[0]?.count || 0), 0) || 1
        const categoriesShare = categories?.map(cat => ({
            name: cat.name,
            share: Math.round(((cat.post_categories?.[0]?.count || 0) / totalPosts) * 100),
            count: cat.post_categories?.[0]?.count || 0
        })).sort((a, b) => b.share - a.share) || []

        // 2. Interaction Stats
        const { count: totalComments, error: commError } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })

        if (commError) throw commError

        // 3. Top Performing Content
        const { data: topContent, error: topError } = await supabase
            .from('posts')
            .select('title, view_count, category:categories(name)')
            .eq('status', 'published')
            .is('deleted_at', null)
            .order('view_count', { ascending: false })
            .limit(4)

        if (topError) throw topError

        return {
            success: true,
            data: {
                categoriesShare,
                totalComments: totalComments || 0,
                topContent: topContent || []
            }
        }
    } catch (error: any) {
        console.error('Error fetching analytics data:', error.message)
        return { success: false, message: error.message }
    }
}
