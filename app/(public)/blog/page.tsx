export default function BlogListingPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
          <p className="mt-2 text-muted-foreground">
            Browse all our published articles.
          </p>
        </div>

        {/* TODO: Add blog posts list with pagination */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              Blog posts will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

