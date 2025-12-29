export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New Post</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a new blog post.
        </p>
      </div>

      {/* TODO: Add post editor form */}
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Post editor will appear here.
        </p>
      </div>
    </div>
  );
}

