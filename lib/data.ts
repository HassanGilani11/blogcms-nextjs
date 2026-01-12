export interface Author {
    name: string
    avatar: string
    initials: string
}

export interface BlogPost {
    id: string | number
    title: string
    excerpt: string
    content?: string
    author: Author
    date: string
    readingTime: string
    category: string
    tags?: string[]
    image: string
    slug: string
    featured?: boolean
}

export const authors: Record<string, Author> = {
    alex: {
        name: "Alex Johnson",
        avatar: "https://i.pravatar.cc/150?u=alex",
        initials: "AJ",
    },
    sarah: {
        name: "Sarah Williams",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        initials: "SW",
    },
    michael: {
        name: "Michael Chen",
        avatar: "https://i.pravatar.cc/150?u=michael",
        initials: "MC",
    },
    emily: {
        name: "Emily Davis",
        avatar: "https://i.pravatar.cc/150?u=emily",
        initials: "ED",
    },
    david: {
        name: "David Wilson",
        avatar: "https://i.pravatar.cc/150?u=david",
        initials: "DW",
    },
    jessica: {
        name: "Jessica Taylor",
        avatar: "https://i.pravatar.cc/150?u=jessica",
        initials: "JT",
    },
}

export const blogPosts: BlogPost[] = [
    {
        id: 1,
        title: "The Ultimate Guide to Next.js 14",
        excerpt: "Learn everything you need to know about the latest features in Next.js 14, including Server Actions and Partial Prerendering.",
        content: `
      <p>Next.js 14 has arrived, bringing a suite of new features designed to improve developer experience and site performance. In this guide, we'll explore the key updates and how you can leverage them in your projects.</p>
      
      <h2>Server Actions</h2>
      <p>Server Actions allow you to define functions that run securely on the server, which can be called directly from your components. This eliminates the need to manually create API routes for simple data mutations.</p>
      
      <h2>Partial Prerendering (PPR)</h2>
      <p>PPR is a new rendering model that combines the best of static site generation (SSG) and server-side rendering (SSR). It allows you to deliver a static shell instantly while streaming dynamic content in parallel.</p>
      
      <h3>Why it matters</h3>
      <p>By adopting these new patterns, you can significantly reduce the amount of client-side JavaScript sent to the browser, resulting in faster page loads and better SEO.</p>
    `,
        author: authors.alex,
        date: "Dec 28, 2024",
        readingTime: "8 min read",
        category: "Development",
        tags: ["Next.js", "React", "Frontend"],
        image: "https://picsum.photos/id/1/800/400",
        slug: "ultimate-guide-nextjs-14",
        featured: true
    },
    {
        id: 2,
        title: "Mastering Tailwind CSS v4",
        excerpt: "A deep dive into the new engine, CSS-first configuration, and how to migrate your existing projects.",
        content: "Tailwind CSS v4 introduces a ground-up rewrite of the engine...",
        author: authors.sarah,
        date: "Dec 25, 2024",
        readingTime: "6 min read",
        category: "Performance",
        tags: ["Tailwind", "CSS", "Design"],
        image: "https://picsum.photos/id/2/800/400",
        slug: "mastering-tailwind-css-v4"
    },
    {
        id: 3,
        title: "Building Accessible Components",
        excerpt: "Why accessibility matters and how to build inclusive web applications using shadcn/ui and Radix UI.",
        content: "Accessibility is not just a feature, it's a fundamental right...",
        author: authors.michael,
        date: "Dec 20, 2024",
        readingTime: "5 min read",
        category: "Design",
        tags: ["A11y", "Radix UI", "React"],
        image: "https://picsum.photos/id/3/800/400",
        slug: "building-accessible-components"
    },
    {
        id: 4,
        title: "State Management in 2024",
        excerpt: "Comparing Redux, Zustand, Jotai, and React Context. Which one should you choose for your next project?",
        content: "State management remains one of the most debated topics in the React ecosystem...",
        author: authors.emily,
        date: "Dec 18, 2024",
        readingTime: "10 min read",
        category: "Development",
        tags: ["State Management", "Redux", "Zustand"],
        image: "https://picsum.photos/id/4/800/400",
        slug: "state-management-2024"
    },
    {
        id: 5,
        title: "The Rise of Server Components",
        excerpt: "Understanding the paradigm shift in React and how Server Components look to change the way we build web apps.",
        content: "Server Components represent the biggest shift in how we build React applications...",
        author: authors.david,
        date: "Dec 15, 2024",
        readingTime: "7 min read",
        category: "AI & ML",
        tags: ["RSC", "React", "Fullstack"],
        image: "https://picsum.photos/id/5/800/400",
        slug: "rise-of-server-components"
    },
    {
        id: 6,
        title: "Deploying to the Edge",
        excerpt: "How to optimize your application performance by deploying to edge networks with Vercel or Cloudflare.",
        content: "Edge computing brings computation closer to the user...",
        author: authors.jessica,
        date: "Dec 10, 2024",
        readingTime: "4 min read",
        category: "DevOps",
        tags: ["Edge", "Vercel", "Performance"],
        image: "https://picsum.photos/id/6/800/400",
        slug: "deploying-to-the-edge"
    },
    {
        id: 7,
        title: "Understanding Color Theory in UI Design",
        excerpt: "A comprehensive guide to using color effectively in your interfaces to create mood and direct attention.",
        content: "Color is one of the most powerful tools in a designer's arsenal...",
        author: authors.sarah,
        date: "Dec 05, 2024",
        readingTime: "5 min read",
        category: "Design",
        tags: ["UI", "Color", "Design Theory"],
        image: "https://picsum.photos/id/7/800/400",
        slug: "color-theory-ui-design"
    },
    {
        id: 8,
        title: "The Future of Web Development is Composable",
        excerpt: "Discover how modern architectures are shifting towards composable applications and what it means for the web.",
        content: "The monolithic era is fading, making way for composable architectures...",
        author: authors.alex,
        date: "Dec 01, 2024",
        readingTime: "6 min read",
        category: "Web3",
        tags: ["Architecture", "Composable", "Trends"],
        image: "https://picsum.photos/id/8/800/400",
        slug: "future-of-web-composable",
        featured: true
    }
]
