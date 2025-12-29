export default function HomePage() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to the Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Latest articles, tutorials and news.
          </p>
        </div>

        {/* TODO: Add recent posts list */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold">Latest Posts</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Posts will appear here once published.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

