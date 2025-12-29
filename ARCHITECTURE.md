# Blog CMS - Architecture Documentation

## Table of Contents
1. [Feature List](#feature-list)
2. [Database Schema](#database-schema)
3. [High-Level Architecture](#high-level-architecture)
4. [Technology Stack](#technology-stack)
5. [File Structure](#file-structure)

---

## Feature List

### Public Features
- ✅ **Blog Listing Page**
  - Paginated list of published blog posts
  - Filter by category/tag
  - Search functionality
  - Sort by date (newest/oldest)
  - Featured posts section

- ✅ **Blog Post Page**
  - Slug-based routing (`/blog/[slug]`)
  - Full post content with markdown support
  - Author information
  - Publication date
  - Reading time estimation
  - Related posts suggestions
  - Social sharing buttons
  - Comments section (optional)

- ✅ **Category/Tag Pages**
  - Dynamic category pages (`/category/[slug]`)
  - Tag archive pages (`/tag/[slug]`)
  - Post count per category/tag

- ✅ **SEO Optimization**
  - Dynamic meta tags per post
  - Open Graph tags
  - Twitter Card tags
  - Structured data (JSON-LD)
  - Sitemap generation
  - robots.txt

- ✅ **Homepage**
  - Latest blog posts preview
  - Featured categories
  - Hero section

### Admin Dashboard Features
- ✅ **Authentication**
  - Email/password login via Supabase Auth
  - Role-based access control (admin only)
  - Protected admin routes
  - Session management

- ✅ **Dashboard Overview**
  - Total posts count
  - Published vs Draft posts
  - Recent activity
  - Quick stats (views, comments)

- ✅ **Post Management**
  - Create new blog post
  - Edit existing posts
  - Delete posts
  - Duplicate posts
  - Bulk actions (publish/unpublish/delete)
  - Rich text editor (markdown support)
  - Image upload and management
  - Draft auto-save

- ✅ **Post Editor**
  - Title and slug generation
  - SEO meta fields (title, description, keywords)
  - Featured image upload
  - Category selection
  - Tag management
  - Publish/unpublish toggle
  - Scheduled publishing (optional)
  - Preview mode

- ✅ **Category Management**
  - Create/edit/delete categories
  - Category description and slug
  - Category image/icon

- ✅ **Tag Management**
  - Create/edit/delete tags
  - Tag autocomplete
  - Tag usage statistics

- ✅ **Media Library**
  - Upload images/files
  - Image optimization
  - File management
  - Delete unused media

- ✅ **User Management** (Future)
  - View admin users
  - Add/remove admins (super admin only)

- ✅ **Settings** (Future)
  - Site configuration
  - SEO defaults
  - Social media links

---

## Database Schema

### Supabase Tables

#### 1. `profiles` (extends Supabase auth.users)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### 2. `categories`
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Only admins can insert categories"
  ON categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update categories"
  ON categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete categories"
  ON categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

#### 3. `tags`
```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage tags"
  ON tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

#### 4. `posts`
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  
  -- SEO Fields
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- Relationships
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  -- Metadata
  published_at TIMESTAMPTZ,
  reading_time INTEGER, -- in minutes
  view_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_status_published_at ON posts(status, published_at DESC) WHERE status = 'published';

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Published posts are viewable by everyone"
  ON posts FOR SELECT
  USING (status = 'published');

CREATE POLICY "Authors can view their own posts"
  ON posts FOR SELECT
  USING (auth.uid() = author_id);

CREATE POLICY "Only admins can view all posts"
  ON posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can insert posts"
  ON posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    AND author_id = auth.uid()
  );

CREATE POLICY "Only admins can update posts"
  ON posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete posts"
  ON posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

#### 5. `post_tags` (Junction Table)
```sql
CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Indexes
CREATE INDEX idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX idx_post_tags_tag_id ON post_tags(tag_id);

-- Enable RLS
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Post tags are viewable by everyone"
  ON post_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_tags.post_id
      AND posts.status = 'published'
    )
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Only admins can manage post tags"
  ON post_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

#### 6. `media` (Optional - for media library)
```sql
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Media is viewable by everyone"
  ON media FOR SELECT
  USING (true);

CREATE POLICY "Only admins can upload media"
  ON media FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    AND uploaded_by = auth.uid()
  );

CREATE POLICY "Only admins can delete media"
  ON media FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
```

### Database Relationships

```
profiles (1) ────< (many) posts
categories (1) ────< (many) posts
posts (many) ────< (many) tags [via post_tags]
profiles (1) ────< (many) media
```

### Functions & Triggers

#### Auto-update `updated_at` timestamp
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### Calculate reading time
```sql
CREATE OR REPLACE FUNCTION calculate_reading_time(content TEXT)
RETURNS INTEGER AS $$
BEGIN
  -- Average reading speed: 200 words per minute
  RETURN GREATEST(1, CEIL(length(content) / 1000.0));
END;
$$ LANGUAGE plpgsql;
```

---

## High-Level Architecture

### Application Structure

```
blogcms/
├── app/                          # Next.js 14 App Router
│   ├── (public)/                # Public routes group
│   │   ├── page.tsx             # Homepage
│   │   ├── blog/
│   │   │   ├── page.tsx         # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # Individual post
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # Category page
│   │   └── tag/
│   │       └── [slug]/
│   │           └── page.tsx     # Tag page
│   │
│   ├── (admin)/                 # Admin routes group
│   │   ├── admin/
│   │   │   ├── layout.tsx       # Admin layout with sidebar
│   │   │   ├── page.tsx         # Dashboard overview
│   │   │   ├── posts/
│   │   │   │   ├── page.tsx     # Posts list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx # New post
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # Edit post
│   │   │   ├── categories/
│   │   │   │   └── page.tsx     # Categories management
│   │   │   ├── tags/
│   │   │   │   └── page.tsx     # Tags management
│   │   │   └── media/
│   │   │       └── page.tsx     # Media library
│   │   │
│   │   └── login/
│   │       └── page.tsx         # Admin login
│   │
│   ├── api/                     # API routes
│   │   ├── posts/
│   │   │   └── route.ts         # Posts API
│   │   ├── categories/
│   │   │   └── route.ts         # Categories API
│   │   └── upload/
│   │       └── route.ts         # File upload API
│   │
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── sitemap.ts               # Dynamic sitemap
│
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── blog/
│   │   ├── PostCard.tsx
│   │   ├── PostContent.tsx
│   │   ├── RelatedPosts.tsx
│   │   └── SearchBar.tsx
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── PostEditor.tsx
│   │   ├── PostList.tsx
│   │   └── MediaUpload.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── Navigation.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Supabase client (browser)
│   │   ├── server.ts            # Supabase client (server)
│   │   └── middleware.ts        # Supabase middleware
│   ├── utils/
│   │   ├── slug.ts              # Slug generation
│   │   ├── markdown.ts          # Markdown parsing
│   │   └── seo.ts               # SEO helpers
│   └── queries/
│       ├── posts.ts             # Post queries
│       ├── categories.ts        # Category queries
│       └── tags.ts              # Tag queries
│
├── hooks/
│   ├── useAuth.ts               # Auth hook
│   ├── usePosts.ts              # Posts hook
│   └── useMedia.ts              # Media hook
│
├── types/
│   └── database.ts              # TypeScript types from Supabase
│
├── middleware.ts                # Next.js middleware (auth)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### Architecture Layers

#### 1. **Presentation Layer** (app/)
- Next.js 14 App Router pages
- Server Components (default)
- Client Components (interactive UI)
- Route groups for organization

#### 2. **Component Layer** (components/)
- Reusable UI components
- shadcn/ui integration
- Blog-specific components
- Admin dashboard components

#### 3. **Business Logic Layer** (lib/)
- Supabase client configuration
- Database queries (using Supabase client)
- Utility functions
- SEO helpers

#### 4. **Data Layer** (Supabase)
- PostgreSQL database
- Row Level Security (RLS) policies
- Real-time subscriptions (optional)
- Storage for media files

#### 5. **Authentication Layer**
- Supabase Auth
- JWT tokens
- Session management
- Role-based access control

### Data Flow

#### Public Blog Pages
```
User Request → Next.js Server Component → Supabase Query (RLS) → Render Page
```

#### Admin Dashboard
```
User Request → Middleware (Auth Check) → Admin Layout → Supabase Query (Admin RLS) → Render Dashboard
```

#### Post Creation/Edit
```
Admin Action → Client Component → API Route → Supabase Insert/Update → Redirect
```

### Security Architecture

1. **Row Level Security (RLS)**
   - All tables have RLS enabled
   - Policies enforce role-based access
   - Public can only read published posts
   - Admins can CRUD all resources

2. **Middleware Protection**
   - Admin routes protected by Next.js middleware
   - Verifies Supabase session
   - Checks user role before allowing access

3. **API Route Protection**
   - Server-side validation
   - Role verification
   - Input sanitization

### SEO Architecture

1. **Metadata API** (Next.js 14)
   - Dynamic metadata per route
   - Open Graph tags
   - Twitter Cards

2. **Structured Data**
   - JSON-LD for blog posts
   - Schema.org Article schema

3. **Sitemap**
   - Dynamic sitemap generation
   - Includes all published posts

4. **robots.txt**
   - Static robots.txt file

---

## Technology Stack

### Core
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **React 18** - UI library

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication
  - Row Level Security
  - Storage (for media files)
  - Real-time capabilities

### Styling
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Lucide React** - Icons

### Additional Libraries
- **@supabase/supabase-js** - Supabase client
- **@supabase/ssr** - Supabase SSR helpers
- **react-markdown** - Markdown rendering
- **remark-gfm** - GitHub Flavored Markdown
- **rehype-highlight** - Code syntax highlighting
- **zod** - Schema validation
- **date-fns** - Date formatting

---

## File Structure

### Key Files Explained

#### `app/layout.tsx`
- Root layout with metadata
- Providers (Supabase, Theme)
- Global navigation

#### `app/(public)/blog/[slug]/page.tsx`
- Server component
- Fetches post by slug
- Generates metadata for SEO
- Renders post content

#### `app/(admin)/admin/layout.tsx`
- Admin layout wrapper
- Sidebar navigation
- Auth check
- Admin-only access

#### `lib/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

#### `lib/supabase/server.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

#### `middleware.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const supabase = createServerClient(...)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
```

---

## Implementation Phases

### Phase 1: Foundation
1. Initialize Next.js 14 project
2. Set up Supabase project
3. Create database schema
4. Configure authentication
5. Set up Tailwind CSS and shadcn/ui

### Phase 2: Public Blog
1. Homepage
2. Blog listing page
3. Individual post page
4. Category/Tag pages
5. SEO implementation

### Phase 3: Admin Dashboard
1. Admin authentication
2. Dashboard overview
3. Post management (CRUD)
4. Category/Tag management
5. Media library

### Phase 4: Polish
1. Rich text editor
2. Image optimization
3. Search functionality
4. Performance optimization
5. Error handling

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (server-side only)
```

---

## Next Steps

1. Review and approve this architecture
2. Set up Supabase project
3. Run database migrations
4. Initialize Next.js project
5. Begin Phase 1 implementation

