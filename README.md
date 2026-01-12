# Blog CMS: A Modern Next.js 16 & Supabase Publication Platform

A powerful, high-performance blog management system built with the latest Next.js 16 App Router features and Supabase's robust backend-as-a-service. This platform is designed for developers and content creators who want a seamless, secure, and highly customizable blogging experience.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Key Features

- **Dynamic Content Management**: Full CRUD operations for Posts, Categories, and Tags.
- **Advanced Security**: Row Level Security (RLS) with centralized role-based access control (RBAC).
- **Professional Invitations**: Invite-only user onboarding with professional email notifications.
- **Media Management**: Integrated Supabase Storage for featured images and galleries.
- **Modern UI/UX**: Built with Shadcn/UI and Tailwind CSS for a premium, responsive feel.
- **High Performance**: Optimized with Next.js Server Components and advanced caching strategies.

---

## 🏗️ Architecture Overview

The project follows a modern, decoupled architecture designed for scale and security.

### 🌓 Tech Stack
- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions, TypeScript)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: [Supabase Auth](https://supabase.com/auth) with RLS
- **Storage**: [Supabase Storage](https://supabase.com/storage)
- **State Management**: React Hooks & Server Actions

### 🔐 Security Model
The platform uses a layered security approach:
1. **Middleware Layer**: Protects administrative routes and verifies authentication status.
2. **Action Layer**: Server-level role checks (Admin, Super Admin, Editor) using specialized service role clients.
3. **Database Layer**: Row Level Security (RLS) policies using a customized `is_admin()` SQL function to prevent recursion and ensure data integrity.

### 📂 Structural Breakdown
```text
├── app/                  # Next.js App Router (Routes & Actions)
│   ├── (auth)/           # Authentication flows (Login, Register)
│   ├── admin/            # Protected administrative dashboard
│   └── api/              # API endpoints for revalidation and hooks
├── components/           # Reusable UI & Business components
│   ├── admin/            # Specialized administrative forms & tables
│   └── ui/               # Primary UI kit components (Shadcn)
├── lib/                  # Shared utilities and configurations
│   └── supabase/         # Database clients, middleware, and SQL scripts
└── types/                # Centralized TypeScript definitions
```

---

## 📅 Implementation Plan & Progress

### Phase 1: Foundation & Auth (Completed)
- [x] Initial Next.js 16 & Supabase setup.
- [x] Core Authentication middleware and route protection.
- [x] Dynamic Profile management with RBAC.

### Phase 2: CMS Core (Completed)
- [x] Post, Category, and Tag CRUD operations.
- [x] Ambiguous relationship resolution in SQL queries.
- [x] Robust RLS policy cleanup and recursion fixes.

### Phase 3: Advanced Features (Completed)
- [x] Professional Email Invitation flow for new users.
- [x] Service Role bypass for administrative actions.
- [x] Standardized sync and error handling for all data operations.

### Phase 4: Scaling & Polish (Future)
- [ ] Multi-tenant support.
- [ ] Advanced SEO metadata generator.
- [ ] Real-time analytics dashboard.

---

## 🛠️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/HassanGilani11/blogcms-nextjs.git
cd blogcms-nextjs
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key # CRITICAL for Admin actions
```

### 3. Database Initialization
Run the provided SQL scripts in the `lib/supabase/` directory in your Supabase Dashboard to set up tables, triggers, and RLS policies. Start with `final_master_fix.sql`.

### 4. Install Dependencies
```bash
npm install
```

### 5. Run Development Server
```bash
npm run dev
```

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
