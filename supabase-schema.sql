-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Posts table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
  published_at TIMESTAMPTZ,
  estimated_read_time INTEGER,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post-Tags junction table
CREATE TABLE IF NOT EXISTS public.post_tags (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_author ON public.posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts(published_at);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON public.posts(slug);
CREATE INDEX IF NOT EXISTS idx_comments_post ON public.comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_post ON public.post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON public.post_tags(tag_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access
CREATE POLICY "Public can view published posts" ON public.posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Public can view tags" ON public.tags
  FOR SELECT USING (true);

CREATE POLICY "Public can view post_tags" ON public.post_tags
  FOR SELECT USING (true);

CREATE POLICY "Public can view comments" ON public.comments
  FOR SELECT USING (true);

CREATE POLICY "Public can insert comments" ON public.comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can insert contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- RLS Policies for authenticated users (admins)
CREATE POLICY "Authenticated users can view all posts" ON public.posts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert posts" ON public.posts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update posts" ON public.posts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete posts" ON public.posts
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage categories" ON public.categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage tags" ON public.tags
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage post_tags" ON public.post_tags
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage comments" ON public.comments
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view contact messages" ON public.contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update contact messages" ON public.contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete contact messages" ON public.contact_messages
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view users" ON public.users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON public.tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', 'Admin'), 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sample data - Proper categories matching navigation
INSERT INTO public.categories (name, slug, description) VALUES
  ('Business', 'business', 'Business strategies, insights, and entrepreneurship'),
  ('Finance', 'finance', 'Financial news, investment tips, and market analysis'),
  ('SaaS', 'saas', 'Software as a Service trends, tools, and best practices'),
  ('Startups', 'startups', 'Startup stories, funding news, and growth strategies'),
  ('AI', 'ai', 'Artificial Intelligence, machine learning, and automation'),
  ('Reviews', 'reviews', 'Product reviews, comparisons, and recommendations'),
  ('Technology', 'technology', 'Latest tech news, gadgets, and innovations'),
  ('Marketing', 'marketing', 'Digital marketing, SEO, and growth hacking'),
  ('Productivity', 'productivity', 'Tools and tips to boost your productivity'),
  ('Leadership', 'leadership', 'Leadership insights and management strategies')
ON CONFLICT (slug) DO NOTHING;

-- Sample tags - Comprehensive collection
INSERT INTO public.tags (name, slug) VALUES
  -- Technology
  ('JavaScript', 'javascript'),
  ('React', 'react'),
  ('TypeScript', 'typescript'),
  ('Node.js', 'nodejs'),
  ('Python', 'python'),
  ('Web Development', 'web-development'),
  ('Mobile Apps', 'mobile-apps'),
  ('Cloud Computing', 'cloud-computing'),
  -- Business
  ('Entrepreneurship', 'entrepreneurship'),
  ('Strategy', 'strategy'),
  ('Growth', 'growth'),
  ('Innovation', 'innovation'),
  ('E-commerce', 'ecommerce'),
  -- Finance
  ('Investing', 'investing'),
  ('Cryptocurrency', 'cryptocurrency'),
  ('Stock Market', 'stock-market'),
  ('Personal Finance', 'personal-finance'),
  ('Fintech', 'fintech'),
  -- AI & ML
  ('Machine Learning', 'machine-learning'),
  ('ChatGPT', 'chatgpt'),
  ('Automation', 'automation'),
  ('Data Science', 'data-science'),
  -- SaaS
  ('SaaS Tools', 'saas-tools'),
  ('Product Management', 'product-management'),
  ('API', 'api'),
  -- Marketing
  ('SEO', 'seo'),
  ('Content Marketing', 'content-marketing'),
  ('Social Media', 'social-media'),
  ('Analytics', 'analytics'),
  -- General
  ('Tutorial', 'tutorial'),
  ('Guide', 'guide'),
  ('News', 'news'),
  ('Tips', 'tips'),
  ('Trends', 'trends')
ON CONFLICT (slug) DO NOTHING;
