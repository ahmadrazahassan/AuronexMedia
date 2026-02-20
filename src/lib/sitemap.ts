import { supabase } from './supabase';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const BASE_URL = window.location.origin;

export const generateSitemap = async (): Promise<string> => {
  const urls: SitemapUrl[] = [];

  // Static pages
  const staticPages = [
    { path: '/', priority: 1.0, changefreq: 'daily' as const },
    { path: '/blog', priority: 0.9, changefreq: 'daily' as const },
    { path: '/categories', priority: 0.8, changefreq: 'weekly' as const },
    { path: '/tags', priority: 0.8, changefreq: 'weekly' as const },
    { path: '/about', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/contact', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changefreq: 'yearly' as const },
    { path: '/terms', priority: 0.3, changefreq: 'yearly' as const },
  ];

  staticPages.forEach((page) => {
    urls.push({
      loc: `${BASE_URL}${page.path}`,
      changefreq: page.changefreq,
      priority: page.priority,
    });
  });

  try {
    // Fetch published posts
    const { data: posts } = await supabase
      .from('posts')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (posts) {
      posts.forEach((post) => {
        urls.push({
          loc: `${BASE_URL}/blog/${post.slug}`,
          lastmod: post.updated_at || post.published_at,
          changefreq: 'weekly',
          priority: 0.8,
        });
      });
    }

    // Fetch categories
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, updated_at');

    if (categories) {
      categories.forEach((category) => {
        urls.push({
          loc: `${BASE_URL}/categories/${category.slug}`,
          lastmod: category.updated_at,
          changefreq: 'weekly',
          priority: 0.6,
        });
      });
    }

    // Fetch tags
    const { data: tags } = await supabase.from('tags').select('slug');

    if (tags) {
      tags.forEach((tag) => {
        urls.push({
          loc: `${BASE_URL}/tags/${tag.slug}`,
          changefreq: 'weekly',
          priority: 0.5,
        });
      });
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>${
      url.lastmod
        ? `
    <lastmod>${new Date(url.lastmod).toISOString().split('T')[0]}</lastmod>`
        : ''
    }${
      url.changefreq
        ? `
    <changefreq>${url.changefreq}</changefreq>`
        : ''
    }${
      url.priority !== undefined
        ? `
    <priority>${url.priority.toFixed(1)}</priority>`
        : ''
    }
  </url>`
  )
  .join('\n')}
</urlset>`;

  return xml;
};

const escapeXml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export const downloadSitemap = async (): Promise<void> => {
  const xml = await generateSitemap();
  const blob = new Blob([xml], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
