type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;

  // TODO: Fetch post by id from Supabase
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Post</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit post ID: {id}
        </p>
      </div>

      {/* TODO: Add post editor form with existing data */}
      <div className="rounded-lg border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Post editor will appear here.
        </p>
      </div>
    </div>
  );
}

