# API Reference Guide

## Overview

This document outlines the API structure for the Blog CMS. The application uses:
- **Server Components**: Direct Supabase queries in Next.js Server Components
- **API Routes**: For client-side mutations and file uploads
- **Supabase Client**: Direct database access with RLS policies

## API Routes Structure

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://yourdomain.com/api`

---

## Public API Routes

### GET `/api/posts`
Get published blog posts.

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Posts per page (default: 12)
- `category` (string): Filter by category slug
- `tag` (string): Filter by tag slug
- `search` (string): Search query
- `sort` (string): Sort order (`newest`, `oldest`, `popular`)

**Response**:
```json
{
  "posts": [
    {
      "id": "uuid",
      "title": "Post Title",
      "slug": "post-slug",
      "excerpt": "Post excerpt...",
      "featured_image_url": "https://...",
      "author": {
        "id": "uuid",
        "full_name": "Author Name",
        "avatar_url": "https://..."
      },
      "category": {
        "id": "uuid",
        "name": "Category",
        "slug": "category-slug"
      },
      "tags": ["tag1", "tag2"],
      "published_at": "2024-01-01T00:00:00Z",
      "reading_time": 5,
      "view_count": 100
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50,
    "totalPages": 5
  }
}
```

---

### GET `/api/posts/[slug]`
Get a single published post by slug.

**Response**:
```json
{
  "id": "uuid",
  "title": "Post Title",
  "slug": "post-slug",
  "content": "Full markdown content...",
  "excerpt": "Post excerpt...",
  "featured_image_url": "https://...",
  "meta_title": "SEO Title",
  "meta_description": "SEO Description",
  "meta_keywords": ["keyword1", "keyword2"],
  "status": "published",
  "author": {
    "id": "uuid",
    "full_name": "Author Name",
    "avatar_url": "https://..."
  },
  "category": {
    "id": "uuid",
    "name": "Category",
    "slug": "category-slug"
  },
  "tags": [
    {
      "id": "uuid",
      "name": "Tag Name",
      "slug": "tag-slug"
    }
  ],
  "published_at": "2024-01-01T00:00:00Z",
  "reading_time": 5,
  "view_count": 100,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

### GET `/api/categories`
Get all categories.

**Response**:
```json
[
  {
    "id": "uuid",
    "name": "Category Name",
    "slug": "category-slug",
    "description": "Category description",
    "image_url": "https://...",
    "post_count": 10
  }
]
```

---

### GET `/api/categories/[slug]`
Get a single category with posts.

**Query Parameters**:
- `page` (number): Page number
- `limit` (number): Posts per page

**Response**:
```json
{
  "category": {
    "id": "uuid",
    "name": "Category Name",
    "slug": "category-slug",
    "description": "Category description"
  },
  "posts": [...],
  "pagination": {...}
}
```

---

### GET `/api/tags`
Get all tags.

**Response**:
```json
[
  {
    "id": "uuid",
    "name": "Tag Name",
    "slug": "tag-slug",
    "post_count": 5
  }
]
```

---

### GET `/api/tags/[slug]`
Get a single tag with posts.

**Query Parameters**:
- `page` (number): Page number
- `limit` (number): Posts per page

**Response**:
```json
{
  "tag": {
    "id": "uuid",
    "name": "Tag Name",
    "slug": "tag-slug"
  },
  "posts": [...],
  "pagination": {...}
}
```

---

### GET `/api/search`
Search published posts.

**Query Parameters**:
- `q` (string, required): Search query
- `page` (number): Page number
- `limit` (number): Results per page

**Response**:
```json
{
  "results": [...],
  "query": "search term",
  "pagination": {...}
}
```

---

## Admin API Routes

All admin routes require authentication and admin role.

### POST `/api/admin/posts`
Create a new blog post.

**Headers**:
```
Authorization: Bearer <token>
```

**Body**:
```json
{
  "title": "Post Title",
  "slug": "post-slug",
  "content": "Markdown content...",
  "excerpt": "Post excerpt",
  "featured_image_url": "https://...",
  "meta_title": "SEO Title",
  "meta_description": "SEO Description",
  "meta_keywords": ["keyword1"],
  "status": "draft",
  "category_id": "uuid",
  "tag_ids": ["uuid1", "uuid2"],
  "published_at": "2024-01-01T00:00:00Z"
}
```

**Response**:
```json
{
  "id": "uuid",
  "title": "Post Title",
  "slug": "post-slug",
  ...
}
```

---

### PUT `/api/admin/posts/[id]`
Update an existing blog post.

**Headers**:
```
Authorization: Bearer <token>
```

**Body**: Same as POST `/api/admin/posts`

**Response**: Updated post object

---

### DELETE `/api/admin/posts/[id]`
Delete a blog post.

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

### GET `/api/admin/posts`
Get all posts (including drafts) for admin.

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
- `status` (string): Filter by status (`draft`, `published`, `archived`)
- `category_id` (string): Filter by category
- `author_id` (string): Filter by author
- `page` (number): Page number
- `limit` (number): Posts per page

**Response**: Same structure as public posts API

---

### POST `/api/admin/categories`
Create a new category.

**Headers**:
```
Authorization: Bearer <token>
```

**Body**:
```json
{
  "name": "Category Name",
  "slug": "category-slug",
  "description": "Category description",
  "image_url": "https://..."
}
```

---

### PUT `/api/admin/categories/[id]`
Update a category.

**Headers**:
```
Authorization: Bearer <token>
```

**Body**: Same as POST

---

### DELETE `/api/admin/categories/[id]`
Delete a category.

**Headers**:
```
Authorization: Bearer <token>
```

**Response**:
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

### POST `/api/admin/tags`
Create a new tag.

**Headers**:
```
Authorization: Bearer <token>
```

**Body**:
```json
{
  "name": "Tag Name",
  "slug": "tag-slug"
}
```

---

### PUT `/api/admin/tags/[id]`
Update a tag.

**Headers**:
```
Authorization: Bearer <token>
```

---

### DELETE `/api/admin/tags/[id]`
Delete a tag.

**Headers**:
```
Authorization: Bearer <token>
```

---

### POST `/api/admin/upload`
Upload a media file.

**Headers**:
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body**: FormData with `file` field

**Response**:
```json
{
  "id": "uuid",
  "filename": "image.jpg",
  "file_path": "https://...",
  "file_size": 102400,
  "width": 1920,
  "height": 1080
}
```

---

### DELETE `/api/admin/media/[id]`
Delete a media file.

**Headers**:
```
Authorization: Bearer <token>
```

---

## Server Component Queries

These are used directly in Next.js Server Components, not API routes.

### Get Published Posts
```typescript
const supabase = createClient()
const { data: posts } = await supabase
  .from('posts')
  .select(`
    *,
    author:profiles(id, full_name, avatar_url),
    category:categories(id, name, slug),
    tags:post_tags(tag:tags(id, name, slug))
  `)
  .eq('status', 'published')
  .order('published_at', { ascending: false })
  .range((page - 1) * limit, page * limit - 1)
```

### Get Post by Slug
```typescript
const { data: post } = await supabase
  .from('posts')
  .select(`
    *,
    author:profiles(*),
    category:categories(*),
    tags:post_tags(tag:tags(*))
  `)
  .eq('slug', slug)
  .eq('status', 'published')
  .single()
```

### Get Categories
```typescript
const { data: categories } = await supabase
  .from('categories')
  .select('*, post_count:posts(count)')
  .order('name')
```

## Error Responses

All API routes return errors in this format:

```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

### Common Error Codes
- `UNAUTHORIZED`: Not authenticated
- `FORBIDDEN`: Not authorized (not admin)
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input
- `INTERNAL_ERROR`: Server error

## Authentication

### Admin Routes
All admin routes require:
1. Valid Supabase session (JWT token)
2. User role must be 'admin'

### Token Format
```
Authorization: Bearer <supabase_jwt_token>
```

### Getting Token
```typescript
const supabase = createClient()
const { data: { session } } = await supabase.auth.getSession()
const token = session?.access_token
```

## Rate Limiting (Future)

Consider implementing rate limiting:
- Public routes: 100 requests/minute per IP
- Admin routes: 1000 requests/minute per user

## Caching Strategy

### Public Routes
- Cache published posts for 1 hour (ISR)
- Cache categories/tags for 24 hours
- Revalidate on post publish/update

### Admin Routes
- No caching (always fresh data)

## Webhooks (Future)

Consider Supabase webhooks for:
- Post published → Regenerate sitemap
- Post updated → Invalidate cache
- Media uploaded → Process images

