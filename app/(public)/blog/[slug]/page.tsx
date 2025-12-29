import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  // TODO: Fetch post by slug from Supabase
  // const post = await getPostBySlug(slug);
  // if (!post) notFound();

  return (
    <article className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* TODO: Render post content */}
        <h1 className="text-4xl font-bold tracking-tight">Post Title</h1>
        <p className="mt-4 text-muted-foreground">
          Post content will be rendered here.
        </p>
      </div>
    </article>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  // TODO: Generate metadata from post data
  return {
    title: "Post Title",
    description: "Post description",
  };
}

