export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  post_count?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image_url?: string;
  status: 'draft' | 'published';
  published_at?: string;
  view_count: number;
  estimated_read_time?: number;
  author_id: string;
  category_id: string;
  created_at: string;
  updated_at: string;
  author?: User;
  category?: Category;
  tags?: Tag[];
}

export interface Comment {
  id: string;
  post_id: string;
  name: string;
  email: string;
  content: string;
  status: 'pending' | 'approved' | 'spam';
  created_at: string;
  post?: Post;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  is_read: boolean;
  created_at: string;
}

export type ContactMessage = Contact;

export interface PostTag {
  post_id: string;
  tag_id: string;
}
