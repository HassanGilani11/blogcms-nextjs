import { PostCard } from "./PostCard";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image_url?: string;
  published_at?: string;
  reading_time?: number;
  category?: {
    name: string;
    slug: string;
  };
};

type PostListProps = {
  posts: Post[];
};

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <p className="text-muted-foreground">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          title={post.title}
          slug={post.slug}
          excerpt={post.excerpt}
          featuredImage={post.featured_image_url}
          publishedAt={post.published_at}
          category={post.category}
          readingTime={post.reading_time}
        />
      ))}
    </div>
  );
}

