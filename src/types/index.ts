export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
  post_count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image_url?: string;
  category_id?: string;
  author_id: string;
  status: 'draft' | 'scheduled' | 'published';
  published_at?: string;
  estimated_read_time?: number;
  view_count: number;
  created_at: string;
  updated_at: string;
  // Relations
  category?: Category;
  author?: User;
  tags?: Tag[];
}

export interface Comment {
  id: string;
  post_id: string;
  name: string;
  email: string;
  content: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read?: boolean;
  created_at: string;
}

export interface PostTag {
  post_id: string;
  tag_id: string;
}
