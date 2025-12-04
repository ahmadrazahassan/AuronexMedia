-- ============================================
-- FIX CATEGORIES AND TAGS FOR SIGNAL PULSE
-- ============================================
-- This script will clean up and recreate proper categories and tags
-- Run this in your Supabase SQL Editor

-- Step 1: Clear existing categories and tags (this will cascade delete post associations)
DELETE FROM public.post_tags;
DELETE FROM public.tags;
DELETE FROM public.categories;

-- Step 2: Insert proper categories matching the navigation
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
  ('Leadership', 'leadership', 'Leadership insights and management strategies');

-- Step 3: Insert comprehensive tags
INSERT INTO public.tags (name, slug) VALUES
  -- Technology Tags
  ('JavaScript', 'javascript'),
  ('React', 'react'),
  ('TypeScript', 'typescript'),
  ('Node.js', 'nodejs'),
  ('Python', 'python'),
  ('Web Development', 'web-development'),
  ('Mobile Apps', 'mobile-apps'),
  ('Cloud Computing', 'cloud-computing'),
  ('DevOps', 'devops'),
  ('Cybersecurity', 'cybersecurity'),
  
  -- Business Tags
  ('Entrepreneurship', 'entrepreneurship'),
  ('Strategy', 'strategy'),
  ('Growth', 'growth'),
  ('Innovation', 'innovation'),
  ('E-commerce', 'ecommerce'),
  ('Remote Work', 'remote-work'),
  ('Freelancing', 'freelancing'),
  
  -- Finance Tags
  ('Investing', 'investing'),
  ('Cryptocurrency', 'cryptocurrency'),
  ('Stock Market', 'stock-market'),
  ('Personal Finance', 'personal-finance'),
  ('Fintech', 'fintech'),
  ('Banking', 'banking'),
  
  -- AI & ML Tags
  ('Machine Learning', 'machine-learning'),
  ('Deep Learning', 'deep-learning'),
  ('ChatGPT', 'chatgpt'),
  ('Automation', 'automation'),
  ('Data Science', 'data-science'),
  ('Neural Networks', 'neural-networks'),
  
  -- SaaS Tags
  ('SaaS Tools', 'saas-tools'),
  ('Product Management', 'product-management'),
  ('Customer Success', 'customer-success'),
  ('Subscription Model', 'subscription-model'),
  ('API', 'api'),
  
  -- Marketing Tags
  ('SEO', 'seo'),
  ('Content Marketing', 'content-marketing'),
  ('Social Media', 'social-media'),
  ('Email Marketing', 'email-marketing'),
  ('Analytics', 'analytics'),
  ('Conversion', 'conversion'),
  
  -- General Tags
  ('Tutorial', 'tutorial'),
  ('Guide', 'guide'),
  ('News', 'news'),
  ('Opinion', 'opinion'),
  ('Case Study', 'case-study'),
  ('Best Practices', 'best-practices'),
  ('Tips', 'tips'),
  ('Trends', 'trends');

-- Step 4: Verify the data
SELECT 'Categories Created:' as info, COUNT(*) as count FROM public.categories
UNION ALL
SELECT 'Tags Created:' as info, COUNT(*) as count FROM public.tags;

-- Step 5: Display all categories
SELECT name, slug, description FROM public.categories ORDER BY name;

-- Step 6: Display all tags
SELECT name, slug FROM public.tags ORDER BY name;
