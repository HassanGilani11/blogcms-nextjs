export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Media Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage uploaded media files.
        </p>
      </div>

      {/* TODO: Add media upload and grid */}
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Media library will appear here.
        </p>
      </div>
    </div>
  );
}

