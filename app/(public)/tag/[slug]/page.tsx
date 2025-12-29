type Props = {
  params: Promise<{ slug: string }>;
};

export default async function TagPage({ params }: Props) {
  const { slug } = await params;

  // TODO: Fetch tag and posts from Supabase
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tag: {slug}</h1>
          <p className="mt-2 text-muted-foreground">
            Posts with this tag will appear here.
          </p>
        </div>

        {/* TODO: Add posts grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Tagged posts will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

