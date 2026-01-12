'use server'

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function getPostFormData() {
    const supabase = await createClient()

    try {
        // Fetch categories
        const { data: categories, error: catError } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true })

        if (catError) throw catError

        // Fetch authors (from profiles where role is admin/super admin/editor if we want to filter)
        // For now, let's just fetch all profiles that have an active session or common roles
        const { data: authors, error: authError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .order('full_name', { ascending: true })

        if (authError) throw authError

        // Fetch all existing tags for suggestions
        const { data: tags, error: tagError } = await supabase
            .from('tags')
            .select('*')
            .order('name', { ascending: true })

        if (tagError) throw tagError

        return {
            success: true,
            data: {
                categories: categories || [],
                authors: authors || [],
                tags: tags || []
            }
        }
    } catch (error: any) {
        console.error('Error fetching post form data:', error.message)
        return { success: false, message: error.message }
    }
}

export async function getMediaAssets() {
    const supabase = await createClient()

    try {
        // Fetch from posts folder
        const { data: postsData, error: postsError } = await supabase.storage
            .from('BlogCMS')
            .list('posts', {
                limit: 50,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' }
            })

        if (postsError) throw postsError

        // Fetch from categories folder
        const { data: categoriesData, error: categoriesError } = await supabase.storage
            .from('BlogCMS')
            .list('categories', {
                limit: 50,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' }
            })

        if (categoriesError) throw categoriesError

        // Fetch from avatars folder
        const { data: avatarsData, error: avatarsError } = await supabase.storage
            .from('BlogCMS')
            .list('avatars', {
                limit: 50,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' }
            })

        if (avatarsError) throw avatarsError

        const postAssets = (postsData || []).map(file => {
            const { data: { publicUrl } } = supabase.storage
                .from('BlogCMS')
                .getPublicUrl(`posts/${file.name}`)

            return {
                name: file.name,
                url: publicUrl,
                created_at: file.created_at,
                folder: 'posts'
            }
        })

        const categoryAssets = (categoriesData || []).map(file => {
            const { data: { publicUrl } } = supabase.storage
                .from('BlogCMS')
                .getPublicUrl(`categories/${file.name}`)

            return {
                name: file.name,
                url: publicUrl,
                created_at: file.created_at,
                folder: 'categories'
            }
        })

        const avatarAssets = (avatarsData || []).map(file => {
            const { data: { publicUrl } } = supabase.storage
                .from('BlogCMS')
                .getPublicUrl(`avatars/${file.name}`)

            return {
                name: file.name,
                url: publicUrl,
                created_at: file.created_at,
                folder: 'avatars'
            }
        })

        const combinedAssets = [...postAssets, ...categoryAssets, ...avatarAssets].sort((a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )

        return { success: true, data: combinedAssets }
    } catch (error: any) {
        console.error('Error fetching media assets:', error.message)
        return { success: false, message: error.message, data: [] }
    }
}

export async function getPosts(filters?: { status?: string, searchQuery?: string, showDeleted?: boolean, includeDeleted?: boolean }) {
    const supabase = await createClient()

    try {
        let query = supabase
            .from('posts')
            .select(`
                *,
                view_count,
                author:profiles!posts_author_id_fkey(id, full_name, avatar_url),
                categories:post_categories(category:categories(id, name)),
                tags:post_tags(tag:tags(id, name))
            `)
            .order('created_at', { ascending: false })

        if (filters?.showDeleted) {
            query = query.not('deleted_at', 'is', null)
        } else if (!filters?.includeDeleted) {
            query = query.is('deleted_at', null)
        }

        if (filters?.status && filters.status !== 'all' && filters.status !== 'trash') {
            query = query.eq('status', filters.status)
        }

        if (filters?.searchQuery) {
            query = query.ilike('title', `%${filters.searchQuery}%`)
        }

        const { data, error } = await query

        if (error) {
            console.error('SERVER ACTION ERROR:', error)
            throw error
        }
        console.log('SERVER ACTION FETCHED:', data?.length)

        // Transform tags for easier consumption
        const transformedData = data?.map(post => ({
            ...post,
            tags: post.tags?.map((t: any) => t.tag?.name).filter(Boolean) || [],
            categories: post.categories?.map((c: any) => ({
                ...c,
                category: c.category || { name: 'Uncategorized' }
            })) || []
        }))

        return { success: true, data: transformedData || [] }
    } catch (error: any) {
        console.error('Error fetching posts:', error.message)
        return { success: false, message: error.message, data: [] }
    }
}

export async function getPost(id: string) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`
            *,
            author: profiles!posts_author_id_fkey(id, full_name, avatar_url),
                categories: post_categories(category: categories(id, name)),
                    tags: post_tags(tag: tags(id, name))
                        `)
            .eq('id', id)
            .single()

        if (error) throw error

        return { success: true, data }
    } catch (error: any) {
        console.error('Error fetching post:', error.message)
        return { success: false, message: error.message }
    }
}

export async function getPostBySlug(slug: string) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                        *,
                        author: profiles!posts_author_id_fkey(id, full_name, avatar_url),
                            categories: post_categories(category: categories(id, name)),
                                tags: post_tags(tag: tags(id, name))
            `)
            .eq('slug', slug)
            .eq('status', 'published')
            .is('deleted_at', null)
            .single()

        if (error) throw error

        const transformedData = {
            ...data,
            tags: data.tags?.map((t: any) => t.tag.name) || []
        }

        return { success: true, data: transformedData }
    } catch (error: any) {
        console.error('Error fetching post by slug:', error.message)
        return { success: false, message: error.message }
    }
}

export async function createPost(formData: FormData) {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const title = formData.get('title') as string
        const slug = formData.get('slug') as string
        const content = formData.get('content') as string
        const excerpt = formData.get('excerpt') as string
        const status = (formData.get('status') as string)?.toLowerCase()
        const categoryIdsRaw = formData.get('categoryIds') as string
        const authorId = formData.get('authorId') as string
        const allowComments = formData.get('allowComments') === 'true'
        const tagsRaw = formData.get('tags') as string
        const featuredImage = formData.get('featuredImage') as File | string
        const galleryImage = formData.get('galleryImage') as File | string

        let featuredImageUrl = typeof featuredImage === 'string' ? featuredImage : null
        let galleryImageUrl = typeof galleryImage === 'string' ? galleryImage : null

        // 1. Handle Image Uploads
        if (featuredImage instanceof File && featuredImage.size > 0) {
            const fileExt = featuredImage.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt} `
            const filePath = `posts / ${fileName} `

            const { error: uploadError } = await supabase.storage
                .from('BlogCMS')
                .upload(filePath, featuredImage)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('BlogCMS')
                .getPublicUrl(filePath)

            featuredImageUrl = publicUrl
        }

        if (galleryImage instanceof File && galleryImage.size > 0) {
            const fileExt = galleryImage.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt} `
            const filePath = `posts / ${fileName} `

            const { error: uploadError } = await supabase.storage
                .from('BlogCMS')
                .upload(filePath, galleryImage)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('BlogCMS')
                .getPublicUrl(filePath)

            galleryImageUrl = publicUrl
        }

        // 2. Insert Post
        const { data: post, error: postError } = await supabase
            .from('posts')
            .insert({
                title,
                slug,
                content,
                excerpt,
                status,
                author_id: authorId || null,
                featured_image_url: featuredImageUrl,
                gallery_image_url: galleryImageUrl,
                allow_comments: allowComments,
                published_at: status === 'published' ? new Date().toISOString() : null
            })
            .select(`
                *,
                author:profiles!posts_author_id_fkey(id, full_name, avatar_url)
            `)
            .single()

        if (postError) throw postError

        // 3. Handle Categories (Multiple)
        if (categoryIdsRaw) {
            const categoryIds = JSON.parse(categoryIdsRaw) as string[]
            if (categoryIds.length > 0) {
                const categoryLinks = categoryIds.map(catId => ({
                    post_id: post.id,
                    category_id: catId
                }))
                await supabase.from('post_categories').insert(categoryLinks)
            }
        }

        // 4. Handle Tags
        if (tagsRaw) {
            const tagNames = tagsRaw.split(',').map(t => t.trim()).filter(Boolean)

            for (const name of tagNames) {
                const tagSlug = name.toLowerCase().replace(/ /g, '-')

                // Get or create tag
                const { data: tag, error: tagError } = await supabase
                    .from('tags')
                    .upsert({ name, slug: tagSlug }, { onConflict: 'name' })
                    .select()
                    .single()

                if (tagError) continue

                // Link to post
                await supabase
                    .from('post_tags')
                    .insert({ post_id: post.id, tag_id: tag.id })
            }
        }

        revalidatePath('/admin/posts')
        revalidatePath('/blog')
        revalidatePath('/')

        return { success: true, message: "Post created successfully", data: post }
    } catch (error: any) {
        console.error('Error creating post:', error.message)
        return { success: false, message: error.message }
    }
}

export async function updatePost(id: string, formData: FormData) {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        // Explicit Role Check (Security Code Level)
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const role = profile?.role?.toLowerCase()
        if (role !== 'admin' && role !== 'super admin' && role !== 'editor') {
            throw new Error("Unauthorized: Admin access required")
        }

        const title = formData.get('title') as string
        const slug = formData.get('slug') as string
        const content = formData.get('content') as string
        const excerpt = formData.get('excerpt') as string
        const status = (formData.get('status') as string)?.toLowerCase()
        const categoryIdsRaw = formData.get('categoryIds') as string
        const authorId = formData.get('authorId') as string
        const allowComments = formData.get('allowComments') === 'true'
        const tagsRaw = formData.get('tags') as string
        const date = formData.get('date') as string
        const featuredImage = formData.get('featuredImage') as File | string
        const galleryImage = formData.get('galleryImage') as File | string
        const currentImageUrl = formData.get('currentImageUrl') as string
        const currentGalleryUrl = formData.get('currentGalleryUrl') as string

        let featuredImageUrl = typeof featuredImage === 'string' ? featuredImage : currentImageUrl
        let galleryImageUrl = typeof galleryImage === 'string' ? galleryImage : currentGalleryUrl

        // 1. Handle Image Uploads (Images still go through standard client RLS for storage, usually fine)
        if (featuredImage instanceof File && featuredImage.size > 0) {
            const fileExt = featuredImage.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt} `
            const filePath = `posts / ${fileName} `

            const { error: uploadError } = await supabase.storage
                .from('BlogCMS')
                .upload(filePath, featuredImage)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('BlogCMS')
                .getPublicUrl(filePath)

            featuredImageUrl = publicUrl
        }

        if (galleryImage instanceof File && galleryImage.size > 0) {
            const fileExt = galleryImage.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt} `
            const filePath = `posts / ${fileName} `

            const { error: uploadError } = await supabase.storage
                .from('BlogCMS')
                .upload(filePath, galleryImage)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('BlogCMS')
                .getPublicUrl(filePath)

            galleryImageUrl = publicUrl
        }

        // 2. Update Post (USING ADMIN CLIENT to Bypass RLS)
        // Check if adminSupabase is available
        const db = adminSupabase || supabase
        console.log("updatePost: Using Admin Client?", !!adminSupabase)

        const { data: updatedData, error: postError, count } = await db
            .from('posts')
            .update({
                title,
                slug,
                content,
                excerpt,
                status,
                author_id: authorId || null,
                featured_image_url: featuredImageUrl,
                gallery_image_url: galleryImageUrl,
                allow_comments: allowComments,
                published_at: date ? new Date(date).toISOString() : null,
                updated_at: new Date().toISOString()
            }, { count: 'exact' })
            .eq('id', id)
            .select()

        console.log("updatePost: SQL Result Details", {
            targetId: id,
            affectedCount: count,
            returnedRows: updatedData?.length,
            error: postError
        })

        if (postError) {
            console.error("updatePost: Database Error", postError)
            throw postError
        }

        if (count === 0) {
            console.warn(`updatePost: No rows matched ID ${id}`)
            throw new Error(`The post with ID ${id} was not found or you don't have permission to update it.`)
        }

        // 3. Handle Categories (Sync Multi)
        if (categoryIdsRaw) {
            const categoryIds = JSON.parse(categoryIdsRaw) as string[]
            // Delete old links
            await db.from('post_categories').delete().eq('post_id', id)

            if (categoryIds.length > 0) {
                const categoryLinks = categoryIds.map(catId => ({
                    post_id: id,
                    category_id: catId
                }))
                await db.from('post_categories').insert(categoryLinks)
            }
        }

        // 4. Handle Tags (Sync)
        if (tagsRaw !== null) {
            // Delete old links
            await db.from('post_tags').delete().eq('post_id', id)

            const tagNames = tagsRaw.split(',').map(t => t.trim()).filter(Boolean)

            for (const name of tagNames) {
                const tagSlug = name.toLowerCase().replace(/ /g, '-')

                // Upsert tag
                const { data: tag } = await db
                    .from('tags')
                    .upsert({ name, slug: tagSlug }, { onConflict: 'name' })
                    .select()
                    .single()

                if (tag) {
                    await db
                        .from('post_tags')
                        .insert({ post_id: id, tag_id: tag.id })
                }
            }
        }

        revalidatePath('/admin/posts')
        revalidatePath(`/blog/${slug}`)
        revalidatePath('/blog')
        revalidatePath('/')

        return { success: true, message: "Post updated successfully" }
    } catch (error: any) {
        console.error('Error updating post:', error.message)
        return { success: false, message: error.message }
    }
}

export async function deletePost(id: string) {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const { error } = await supabase
            .from('posts')
            .update({
                deleted_at: new Date().toISOString(),
                status: 'draft' // Optional: set to draft when trashed
            })
            .eq('id', id)

        if (error) throw error

        revalidatePath('/admin/posts')
        revalidatePath('/blog')
        revalidatePath('/')

        return { success: true, message: "Post deleted successfully" }
    } catch (error: any) {
        console.error('Error deleting post:', error.message)
        return { success: false, message: error.message }
    }
}

export async function restorePost(id: string) {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        const { error } = await supabase
            .from('posts')
            .update({
                deleted_at: null,
                status: 'draft'
            })
            .eq('id', id)

        if (error) throw error

        revalidatePath('/admin/posts')
        return { success: true, message: "Post restored successfully" }
    } catch (error: any) {
        console.error('Error restoring post:', error.message)
        return { success: false, message: error.message }
    }
}

export async function deletePostPermanently(id: string) {
    const supabase = await createClient()

    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized")

        // 1. Get post to find image URL
        const { data: post } = await supabase
            .from('posts')
            .select('featured_image_url')
            .eq('id', id)
            .single()

        // 2. Delete image from storage if exists
        if (post?.featured_image_url) {
            const urlParts = post.featured_image_url.split('/')
            const fileName = urlParts[urlParts.length - 1]
            await supabase.storage
                .from('BlogCMS')
                .remove([`posts / ${fileName} `])
        }

        // 3. Delete post (cascading will handle post_tags if set up, otherwise we should delete them)
        await supabase.from('post_tags').delete().eq('post_id', id)

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id)

        if (error) throw error

        revalidatePath('/admin/posts')
        return { success: true, message: "Post deleted permanently" }
    } catch (error: any) {
        console.error('Error deleting post permanently:', error.message)
        return { success: false, message: error.message }
    }
}

export async function incrementPostViews(id: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase.rpc('increment_post_views', { post_id: id })

        if (error) throw error

        return { success: true }
    } catch (error: any) {
        console.error('Error incrementing post views:', error.message)
        return { success: false, message: error.message }
    }
}
