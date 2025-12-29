# Blog CMS - Next.js Project

This is the Next.js 14 App Router implementation of the Blog CMS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase project created
- Database schema migrated (see `DATABASE_SCHEMA.sql`)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed folder structure.

## 🎨 Features Implemented

### ✅ Structure
- [x] Next.js 14 App Router setup
- [x] Route groups (public/admin)
- [x] Layouts (root, public, admin)
- [x] Tailwind CSS configuration
- [x] shadcn/ui components
- [x] TypeScript setup
- [x] Middleware for auth protection

### 🚧 To Implement
- [ ] Supabase queries in pages
- [ ] Post CRUD operations
- [ ] Category/Tag management
- [ ] Media upload
- [ ] Authentication flow
- [ ] Markdown rendering
- [ ] Search functionality
- [ ] Pagination

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔗 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [FEATURES.md](./FEATURES.md) - Feature list
- [DATABASE_SCHEMA.sql](./DATABASE_SCHEMA.sql) - Database schema
- [API_REFERENCE.md](./API_REFERENCE.md) - API documentation
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Folder structure

## 🛠️ Development

### Adding New Components

1. **UI Components**: Add to `components/ui/`
2. **Layout Components**: Add to `components/layout/`
3. **Blog Components**: Add to `components/blog/`
4. **Admin Components**: Add to `components/admin/`

### Adding New Pages

1. **Public Pages**: Add to `app/(public)/`
2. **Admin Pages**: Add to `app/(admin)/admin/`

### Styling

- Use Tailwind CSS utility classes
- Use shadcn/ui components for consistent UI
- Custom styles in `app/globals.css`

## 🔐 Authentication

Admin routes are protected by middleware. Users must:
1. Be authenticated (have valid Supabase session)
2. Have `role = 'admin'` in profiles table

## 📦 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Follow Next.js deployment guides for your platform.

## 🤝 Contributing

1. Follow the project structure
2. Use TypeScript for type safety
3. Follow existing code patterns
4. Test before committing

## 📄 License

See LICENSE file for details.

