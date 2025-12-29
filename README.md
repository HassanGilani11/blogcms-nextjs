# Blog CMS - Architecture Documentation

A complete Blog Content Management System built with Next.js 14, Supabase, Tailwind CSS, and shadcn/ui.

## 📚 Documentation Files

This repository contains comprehensive architecture documentation:

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system architecture, technology stack, and implementation guide
2. **[FEATURES.md](./FEATURES.md)** - Detailed feature list for public and admin features
3. **[DATABASE_SCHEMA.sql](./DATABASE_SCHEMA.sql)** - Complete SQL schema with tables, relationships, and policies

## 🗄️ Database Schema Overview

### Tables

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `profiles` | User profiles (extends auth.users) | id, email, full_name, role |
| `categories` | Blog categories | id, name, slug, description |
| `tags` | Blog tags | id, name, slug |
| `posts` | Blog posts | id, title, slug, content, status, author_id, category_id |
| `post_tags` | Many-to-many relationship | post_id, tag_id |
| `media` | Media library files | id, filename, file_path, uploaded_by |

### Relationships

```
profiles (1) ────< (many) posts
categories (1) ────< (many) posts
posts (many) ────< (many) tags [via post_tags]
profiles (1) ────< (many) media
```

### Key Features

- **Row Level Security (RLS)**: All tables protected with policies
- **Role-based Access**: Admin-only access for content management
- **Public Access**: Published posts viewable by everyone
- **Auto-timestamps**: Created_at and updated_at automatically managed
- **Reading Time**: Auto-calculated based on content length

## 🏗️ Architecture Highlights

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: Tailwind CSS, shadcn/ui
- **Deployment**: Vercel (recommended)

### Key Architectural Decisions

1. **Server Components First**: Leverage Next.js 14 Server Components for better performance
2. **Supabase RLS**: Security at the database level, not just application level
3. **Slug-based Routing**: SEO-friendly URLs (`/blog/[slug]`)
4. **Role-based Access**: Single admin role (extensible to multiple roles)
5. **Markdown Support**: Rich content editing with markdown

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ 
- Supabase account
- npm or yarn

### Setup Steps

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and anon key

2. **Run Database Migrations**
   - Open Supabase SQL Editor
   - Copy contents of `DATABASE_SCHEMA.sql`
   - Execute in SQL Editor

3. **Initialize Next.js Project**
   ```bash
   npx create-next-app@latest blogcms --typescript --tailwind --app
   cd blogcms
   ```

4. **Install Dependencies**
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   npm install react-markdown remark-gfm rehype-highlight
   npm install zod date-fns
   npx shadcn-ui@latest init
   ```

5. **Configure Environment Variables**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

6. **Set Up First Admin User**
   - Sign up via Supabase Auth
   - Update profile role to 'admin' in database:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
   ```

## 📋 Feature Checklist

### Public Features ✅
- [x] Homepage with latest posts
- [x] Blog listing page with pagination
- [x] Individual post pages (slug-based)
- [x] Category pages
- [x] Tag pages
- [x] Search functionality
- [x] SEO optimization (meta tags, sitemap, structured data)

### Admin Features ✅
- [x] Authentication (email/password)
- [x] Dashboard overview
- [x] Post management (CRUD)
- [x] Rich text editor with markdown
- [x] Category management
- [x] Tag management
- [x] Media library
- [x] SEO fields per post

## 🔐 Security Model

### Authentication Flow
1. User logs in via Supabase Auth
2. JWT token stored in HTTP-only cookie
3. Middleware validates token on admin routes
4. Database RLS policies enforce access control

### Access Control
- **Public**: Can view published posts only
- **Admin**: Full CRUD access to all resources
- **RLS Policies**: Enforce access at database level

## 📊 Database Schema Details

### Posts Table
- **Status**: `draft`, `published`, `archived`
- **SEO Fields**: `meta_title`, `meta_description`, `meta_keywords`
- **Auto-calculated**: `reading_time`, `published_at` (on publish)

### Categories & Tags
- **Categories**: One-to-many with posts
- **Tags**: Many-to-many with posts (via junction table)
- **Slugs**: URL-friendly identifiers

## 🎨 UI Components

Built with shadcn/ui:
- Button, Input, Textarea
- Card, Dialog, Dropdown
- Table, Form components
- Toast notifications
- Loading states

## 📈 Performance Optimizations

- **SSR/SSG**: Server-side rendering for SEO
- **ISR**: Incremental Static Regeneration for blog posts
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Supabase query caching

## 🔄 Data Flow

### Public Blog Pages
```
User Request → Next.js Server Component → Supabase Query (RLS) → Render
```

### Admin Dashboard
```
User Request → Middleware (Auth) → Admin Layout → Supabase Query → Render
```

### Post Creation
```
Admin Action → Client Component → API Route → Supabase Insert → Redirect
```

## 📝 Next Steps

1. Review architecture documentation
2. Set up Supabase project
3. Run database migrations
4. Initialize Next.js project
5. Implement Phase 1 (Foundation)
6. Implement Phase 2 (Public Blog)
7. Implement Phase 3 (Admin Dashboard)
8. Polish and optimize

## 📖 Additional Resources

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

This is an architecture blueprint. When implementing:
1. Follow the structure outlined in ARCHITECTURE.md
2. Use the database schema from DATABASE_SCHEMA.sql
3. Reference FEATURES.md for feature requirements
4. Maintain RLS policies for security

## 📄 License

This architecture documentation is provided as-is for reference and implementation.

---

**Created by**: Senior Next.js Architect  
**Last Updated**: 2024  
**Version**: 1.0.0

