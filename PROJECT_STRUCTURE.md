# Project Structure

This document outlines the complete folder structure of the Blog CMS Next.js 14 application.

## 📁 Folder Structure

```
blogcms/
├── app/                          # Next.js 14 App Router
│   ├── (public)/                # Public routes group
│   │   ├── layout.tsx          # Public layout wrapper
│   │   ├── home/
│   │   │   └── page.tsx         # Homepage
│   │   ├── blog/
│   │   │   ├── page.tsx         # Blog listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # Single post page
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # Category page
│   │   └── tag/
│   │       └── [slug]/
│   │           └── page.tsx     # Tag page
│   │
│   ├── (admin)/                # Admin routes group
│   │   ├── admin/
│   │   │   ├── layout.tsx      # Admin shell layout
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── posts/
│   │   │   │   ├── page.tsx    # Posts list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx # New post
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx # Edit post
│   │   │   ├── categories/
│   │   │   │   └── page.tsx    # Categories management
│   │   │   ├── tags/
│   │   │   │   └── page.tsx    # Tags management
│   │   │   └── media/
│   │   │       └── page.tsx    # Media library
│   │   └── login/
│   │       └── page.tsx         # Admin login
│   │
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Root page (redirects)
│   └── globals.css             # Global styles
│
├── components/
│   ├── layout/
│   │   ├── SiteHeader.tsx      # Public site header
│   │   ├── SiteFooter.tsx      # Public site footer
│   │   └── MainNav.tsx         # Main navigation
│   │
│   ├── blog/
│   │   ├── PostCard.tsx        # Post card component
│   │   └── PostList.tsx        # Post list component
│   │
│   ├── admin/
│   │   ├── AdminSidebar.tsx    # Admin sidebar navigation
│   │   └── AdminHeader.tsx     # Admin header
│   │
│   └── ui/                     # shadcn/ui components
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── card.tsx
│       └── badge.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   └── server.ts           # Server Supabase client
│   │
│   ├── utils/
│   │   ├── cn.ts               # className utility
│   │   ├── slug.ts             # Slug generation
│   │   └── date.ts             # Date formatting
│   │
│   └── config/
│       └── site.ts             # Site configuration
│
├── types/
│   └── database.ts             # TypeScript types
│
├── middleware.ts               # Next.js middleware (auth)
│
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── postcss.config.mjs
└── .gitignore
```

## 📝 File Descriptions

### Configuration Files

- **package.json**: Project dependencies and scripts
- **tsconfig.json**: TypeScript configuration
- **next.config.mjs**: Next.js configuration
- **tailwind.config.ts**: Tailwind CSS configuration
- **postcss.config.mjs**: PostCSS configuration
- **.gitignore**: Git ignore rules

### App Directory

#### Root Files
- **app/layout.tsx**: Root layout with header/footer
- **app/page.tsx**: Root page (redirects to /home)
- **app/globals.css**: Global CSS with Tailwind directives

#### Public Routes (`app/(public)/`)
- **layout.tsx**: Public layout wrapper
- **home/page.tsx**: Homepage with latest posts
- **blog/page.tsx**: Blog listing with pagination
- **blog/[slug]/page.tsx**: Individual post page
- **category/[slug]/page.tsx**: Category archive page
- **tag/[slug]/page.tsx**: Tag archive page

#### Admin Routes (`app/(admin)/`)
- **admin/layout.tsx**: Admin shell with sidebar
- **admin/page.tsx**: Dashboard overview
- **admin/posts/page.tsx**: Posts management
- **admin/posts/new/page.tsx**: Create new post
- **admin/posts/[id]/page.tsx**: Edit post
- **admin/categories/page.tsx**: Categories management
- **admin/tags/page.tsx**: Tags management
- **admin/media/page.tsx**: Media library
- **login/page.tsx**: Admin login page

### Components

#### Layout Components
- **SiteHeader.tsx**: Public site header with navigation
- **SiteFooter.tsx**: Public site footer
- **MainNav.tsx**: Main navigation component

#### Blog Components
- **PostCard.tsx**: Card component for displaying posts
- **PostList.tsx**: List component for multiple posts

#### Admin Components
- **AdminSidebar.tsx**: Sidebar navigation for admin
- **AdminHeader.tsx**: Header for admin dashboard

#### UI Components (shadcn/ui)
- **button.tsx**: Button component with variants
- **input.tsx**: Input field component
- **label.tsx**: Label component
- **card.tsx**: Card component with sub-components
- **badge.tsx**: Badge component

### Lib Directory

#### Supabase
- **client.ts**: Browser-side Supabase client
- **server.ts**: Server-side Supabase client

#### Utils
- **cn.ts**: className utility (clsx + tailwind-merge)
- **slug.ts**: Slug generation and validation
- **date.ts**: Date formatting utilities

#### Config
- **site.ts**: Site-wide configuration

### Types
- **database.ts**: TypeScript types for database entities

### Middleware
- **middleware.ts**: Next.js middleware for protecting admin routes

## 🎯 Route Structure

### Public Routes
- `/` → Redirects to `/home`
- `/home` → Homepage
- `/blog` → Blog listing
- `/blog/[slug]` → Individual post
- `/category/[slug]` → Category archive
- `/tag/[slug]` → Tag archive

### Admin Routes (Protected)
- `/admin` → Dashboard
- `/admin/posts` → Posts list
- `/admin/posts/new` → Create post
- `/admin/posts/[id]` → Edit post
- `/admin/categories` → Manage categories
- `/admin/tags` → Manage tags
- `/admin/media` → Media library
- `/login` → Admin login

## 🔧 Key Features

1. **Route Groups**: `(public)` and `(admin)` for organization
2. **Server Components**: Default for all pages
3. **Client Components**: Marked with `"use client"` when needed
4. **Type Safety**: Full TypeScript support
5. **Component Library**: shadcn/ui components
6. **Styling**: Tailwind CSS with custom design tokens
7. **Authentication**: Supabase Auth with middleware protection

## 📦 Dependencies

### Core
- Next.js 14 (App Router)
- React 18
- TypeScript

### Backend
- @supabase/supabase-js
- @supabase/ssr

### UI
- Tailwind CSS
- shadcn/ui components
- Radix UI primitives
- Lucide React icons

### Utilities
- clsx & tailwind-merge
- date-fns
- zod
- react-markdown

## 🚀 Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables (see `.env.example`)
3. Run database migrations (see `DATABASE_SCHEMA.sql`)
4. Start development server: `npm run dev`

## 📚 Next Steps

1. Implement Supabase queries in pages
2. Add form handling for admin pages
3. Implement file upload for media
4. Add markdown rendering for posts
5. Implement search functionality
6. Add pagination components
7. Set up error boundaries
8. Add loading states

