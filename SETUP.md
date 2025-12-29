# Setup Guide

Complete setup instructions for the Blog CMS Next.js project.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- Supabase clients
- Tailwind CSS
- shadcn/ui dependencies
- TypeScript

### 2. Set Up Supabase

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Wait for project to be ready (2-3 minutes)

2. **Get Your Credentials**
   - Go to Project Settings → API
   - Copy your Project URL
   - Copy your `anon` public key

3. **Run Database Migrations**
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `DATABASE_SCHEMA.sql`
   - Paste and run in SQL Editor
   - Verify tables are created

4. **Set Up Storage** (Optional, for media)
   - Go to Storage in Supabase dashboard
   - Create a bucket named `media`
   - Set it to public if you want public access

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important**: Never commit `.env.local` to git!

### 4. Create First Admin User

1. **Sign Up via Supabase Auth**
   - You can use Supabase dashboard → Authentication → Users
   - Or implement signup in your app first

2. **Set Admin Role**
   - Go to SQL Editor in Supabase
   - Run this query (replace email):
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE email = 'your@email.com';
   ```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure Overview

```
blogcms/
├── app/              # Next.js pages and layouts
├── components/       # React components
├── lib/             # Utilities and Supabase clients
├── types/           # TypeScript types
└── middleware.ts    # Auth protection
```

## Next Steps

1. **Test the Setup**
   - Visit `/home` - Should see homepage
   - Visit `/admin` - Should redirect to `/login` if not authenticated
   - Visit `/login` - Login page should appear

2. **Implement Features**
   - Start with Supabase queries in pages
   - Add authentication flow
   - Implement post CRUD operations
   - Add category/tag management

3. **Customize**
   - Update site name in `lib/config/site.ts`
   - Customize colors in `tailwind.config.ts`
   - Add more shadcn/ui components as needed

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
npm run dev -- -p 3001
```

### Supabase Connection Issues
- Verify environment variables are correct
- Check Supabase project is active
- Ensure database migrations ran successfully

### TypeScript Errors
```bash
# Regenerate types (if using Supabase CLI)
npx supabase gen types typescript --project-id your-project-id > types/database.ts
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Development Tips

1. **Hot Reload**: Changes to files automatically reload in browser
2. **TypeScript**: Use TypeScript for type safety
3. **Server Components**: Default in Next.js 14, use `"use client"` only when needed
4. **Tailwind**: Use utility classes, check `tailwind.config.ts` for custom values

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

## Support

For issues or questions:
1. Check documentation files in project root
2. Review `ARCHITECTURE.md` for system design
3. Check `FEATURES.md` for feature requirements

