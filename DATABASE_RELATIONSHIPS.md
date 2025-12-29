# Database Relationships & ER Diagram

## Entity Relationship Diagram

```
┌─────────────────┐
│    profiles     │
│─────────────────│
│ id (PK)         │◄────┐
│ email           │     │
│ full_name       │     │
│ avatar_url      │     │
│ role            │     │
│ created_at      │     │
│ updated_at      │     │
└─────────────────┘     │
                        │
                        │ author_id (FK)
                        │
┌─────────────────┐     │     ┌─────────────────┐
│    categories   │     │     │     posts       │
│─────────────────│     │     │─────────────────│
│ id (PK)         │◄────┼─────│ id (PK)         │
│ name            │     │     │ title           │
│ slug (UNIQUE)   │     │     │ slug (UNIQUE)   │
│ description     │     │     │ content         │
│ image_url       │     │     │ excerpt         │
│ created_at      │     │     │ featured_image  │
│ updated_at      │     │     │ meta_title      │
└─────────────────┘     │     │ meta_description│
                        │     │ meta_keywords   │
                        │     │ status          │
                        │     │ author_id (FK)  │
                        │     │ category_id(FK) │
                        │     │ published_at    │
                        │     │ reading_time    │
                        │     │ view_count      │
                        │     │ created_at      │
                        │     │ updated_at      │
                        │     └─────────────────┘
                        │              │
                        │              │ post_id (FK)
                        │              │
                        │     ┌─────────────────┐
                        │     │   post_tags     │
                        │     │─────────────────│
                        │     │ post_id (FK)    │
                        │     │ tag_id (FK)     │
                        │     │ PRIMARY KEY     │
                        │     └─────────────────┘
                        │              │
                        │              │ tag_id (FK)
                        │              │
                        │     ┌─────────────────┐
                        │     │      tags       │
                        │     │─────────────────│
                        │     │ id (PK)         │
                        │     │ name (UNIQUE)   │
                        │     │ slug (UNIQUE)   │
                        │     │ created_at      │
                        │     └─────────────────┘
                        │
                        │ uploaded_by (FK)
                        │
                ┌─────────────────┐
                │     media       │
                │─────────────────│
                │ id (PK)         │
                │ filename        │
                │ original_name   │
                │ file_path       │
                │ file_size       │
                │ mime_type       │
                │ width           │
                │ height          │
                │ uploaded_by(FK) │
                │ created_at      │
                └─────────────────┘
```

## Relationship Details

### 1. profiles → posts (One-to-Many)
- **Relationship**: One profile can have many posts
- **Foreign Key**: `posts.author_id` → `profiles.id`
- **Cascade**: ON DELETE CASCADE (if profile deleted, posts deleted)
- **Purpose**: Track post authorship

### 2. categories → posts (One-to-Many)
- **Relationship**: One category can have many posts
- **Foreign Key**: `posts.category_id` → `categories.id`
- **Cascade**: ON DELETE SET NULL (if category deleted, posts remain but category_id becomes NULL)
- **Purpose**: Organize posts by category

### 3. posts ↔ tags (Many-to-Many)
- **Relationship**: Posts can have many tags, tags can be on many posts
- **Junction Table**: `post_tags`
- **Foreign Keys**: 
  - `post_tags.post_id` → `posts.id`
  - `post_tags.tag_id` → `tags.id`
- **Cascade**: ON DELETE CASCADE (if post/tag deleted, junction records deleted)
- **Purpose**: Flexible tagging system

### 4. profiles → media (One-to-Many)
- **Relationship**: One profile can upload many media files
- **Foreign Key**: `media.uploaded_by` → `profiles.id`
- **Cascade**: ON DELETE SET NULL (if profile deleted, media remains but uploaded_by becomes NULL)
- **Purpose**: Track media uploads

## Table Relationships Summary

| Parent Table | Child Table | Relationship Type | Foreign Key | Cascade Rule |
|--------------|-------------|-------------------|-------------|--------------|
| profiles | posts | One-to-Many | author_id | CASCADE |
| categories | posts | One-to-Many | category_id | SET NULL |
| posts | post_tags | One-to-Many | post_id | CASCADE |
| tags | post_tags | One-to-Many | tag_id | CASCADE |
| profiles | media | One-to-Many | uploaded_by | SET NULL |

## Indexes for Performance

### Primary Indexes
- All tables have `id` as PRIMARY KEY (automatic index)

### Foreign Key Indexes
- `idx_posts_author_id` on `posts(author_id)`
- `idx_posts_category_id` on `posts(category_id)`
- `idx_post_tags_post_id` on `post_tags(post_id)`
- `idx_post_tags_tag_id` on `post_tags(tag_id)`
- `idx_media_uploaded_by` on `media(uploaded_by)`

### Query Optimization Indexes
- `idx_posts_slug` on `posts(slug)` - For slug lookups
- `idx_posts_status` on `posts(status)` - For filtering by status
- `idx_posts_published_at` on `posts(published_at DESC)` - For chronological listing
- `idx_posts_status_published_at` on `posts(status, published_at DESC)` - Composite index for published posts
- `idx_categories_slug` on `categories(slug)` - For category lookups
- `idx_tags_slug` on `tags(slug)` - For tag lookups
- `idx_tags_name` on `tags(name)` - For tag name searches

## Common Queries & Relationships

### Get Post with Author and Category
```sql
SELECT 
  p.*,
  pr.full_name as author_name,
  pr.avatar_url as author_avatar,
  c.name as category_name,
  c.slug as category_slug
FROM posts p
JOIN profiles pr ON p.author_id = pr.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.slug = 'my-post-slug';
```

### Get Post with Tags
```sql
SELECT 
  p.*,
  array_agg(t.name) as tags
FROM posts p
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.id = 'post-uuid'
GROUP BY p.id;
```

### Get Posts by Category
```sql
SELECT p.*
FROM posts p
JOIN categories c ON p.category_id = c.id
WHERE c.slug = 'technology'
AND p.status = 'published'
ORDER BY p.published_at DESC;
```

### Get Posts by Tag
```sql
SELECT p.*
FROM posts p
JOIN post_tags pt ON p.id = pt.post_id
JOIN tags t ON pt.tag_id = t.id
WHERE t.slug = 'nextjs'
AND p.status = 'published'
ORDER BY p.published_at DESC;
```

### Get Category with Post Count
```sql
SELECT 
  c.*,
  COUNT(p.id) as post_count
FROM categories c
LEFT JOIN posts p ON c.id = p.category_id AND p.status = 'published'
GROUP BY c.id;
```

### Get Tag with Post Count
```sql
SELECT 
  t.*,
  COUNT(pt.post_id) as post_count
FROM tags t
LEFT JOIN post_tags pt ON t.id = pt.tag_id
LEFT JOIN posts p ON pt.post_id = p.id AND p.status = 'published'
GROUP BY t.id;
```

## Data Integrity Rules

### Constraints
1. **Unique Constraints**:
   - `posts.slug` must be unique
   - `categories.slug` must be unique
   - `tags.name` must be unique
   - `tags.slug` must be unique

2. **Check Constraints**:
   - `profiles.role` must be 'user' or 'admin'
   - `posts.status` must be 'draft', 'published', or 'archived'

3. **Not Null Constraints**:
   - `posts.title` cannot be null
   - `posts.slug` cannot be null
   - `posts.content` cannot be null
   - `posts.author_id` cannot be null
   - `categories.name` cannot be null
   - `categories.slug` cannot be null
   - `tags.name` cannot be null
   - `tags.slug` cannot be null

### Triggers
1. **Auto-update timestamps**: `updated_at` automatically updated on row update
2. **Auto-set published_at**: When post status changes to 'published', `published_at` is set
3. **Auto-calculate reading_time**: Reading time calculated when post is published
4. **Auto-create profile**: Profile automatically created when user signs up

## Row Level Security (RLS) Policies

### profiles
- **SELECT**: Everyone can view profiles
- **UPDATE**: Users can update own profile
- **INSERT**: Users can insert own profile (via trigger)

### categories
- **SELECT**: Everyone can view categories
- **INSERT/UPDATE/DELETE**: Only admins

### tags
- **SELECT**: Everyone can view tags
- **INSERT/UPDATE/DELETE**: Only admins

### posts
- **SELECT**: 
  - Everyone can view published posts
  - Authors can view their own posts
  - Admins can view all posts
- **INSERT/UPDATE/DELETE**: Only admins

### post_tags
- **SELECT**: 
  - Everyone can view tags for published posts
  - Admins can view all
- **INSERT/UPDATE/DELETE**: Only admins

### media
- **SELECT**: Everyone can view media
- **INSERT**: Only admins
- **DELETE**: Only admins

## Normalization

The database follows **3rd Normal Form (3NF)**:
- No redundant data
- Each piece of data stored once
- Foreign keys used for relationships
- Junction table for many-to-many relationships

## Denormalization Considerations

For performance, consider:
- **View Count**: Stored in posts table (could be separate table for analytics)
- **Reading Time**: Calculated and stored (could be computed on-the-fly)
- **Post Count**: Computed via COUNT() queries (could be cached in categories/tags tables)

These are acceptable denormalizations for read performance.

