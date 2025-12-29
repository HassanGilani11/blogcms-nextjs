// Database types - These should be generated from Supabase schema
// For now, defining manually based on our schema

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  status: "draft" | "published" | "archived";
  author_id: string;
  category_id: string | null;
  published_at: string | null;
  reading_time: number | null;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type PostWithRelations = Post & {
  author: Profile;
  category: Category | null;
  tags: Tag[];
};

export type Media = {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  width: number | null;
  height: number | null;
  uploaded_by: string | null;
  created_at: string;
};

