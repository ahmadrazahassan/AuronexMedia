import { Post } from '../types';

/**
 * Generates a deterministic hash number from a string (post ID).
 * This ensures the same post always gets the same view count.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Seeded pseudo-random number generator for consistent results.
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/**
 * Generates a realistic, deterministic view count for a single post.
 * 
 * - Published posts: 30,000 – 85,000 views (with some "viral" outliers up to 120K)
 * - Draft posts: 200 – 1,500 views (preview/internal traffic)
 * - Older published posts get a time-based boost
 * - Some posts get a "viral" multiplier for realism
 */
export function generateViewCount(
  postId: string,
  status: string,
  publishedAt?: string
): number {
  const hash = hashString(postId);
  const rand = seededRandom(hash);
  const rand2 = seededRandom(hash + 1);
  const rand3 = seededRandom(hash + 2);

  if (status !== 'published') {
    // Drafts get minimal views (internal previews)
    return Math.floor(rand * 1300) + 200;
  }

  // Base range for published posts: 30,000 – 65,000
  let views = Math.floor(rand * 35000) + 30000;

  // Time-based boost: older posts accumulate more views
  if (publishedAt) {
    const publishDate = new Date(publishedAt);
    const now = new Date();
    const daysSincePublish = Math.max(1, Math.floor((now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24)));

    // Logarithmic time boost (diminishing returns)
    const timeMultiplier = 1 + Math.log10(Math.min(daysSincePublish, 365)) * 0.3;
    views = Math.floor(views * timeMultiplier);
  }

  // Viral boost: ~25% of posts get a significant boost (65K – 120K total)
  if (rand2 > 0.75) {
    const viralBoost = Math.floor(rand3 * 55000) + 65000;
    views = viralBoost;
  }

  // Medium popularity boost: ~30% of posts get a moderate boost
  if (rand2 > 0.45 && rand2 <= 0.75) {
    views = Math.floor(views * (1.2 + rand3 * 0.6));
  }

  return views;
}

/**
 * Enhances an array of posts with realistic view counts.
 * 
 * After generating individual view counts, scales them proportionally
 * to ensure the total across all published posts reaches ~450K+.
 */
export function enhancePostsWithViews(posts: Post[]): Post[] {
  if (!posts || posts.length === 0) return posts;

  // Generate raw view counts for each post
  const rawCounts = posts.map(post => ({
    post,
    rawViews: generateViewCount(post.id, post.status, post.published_at),
  }));

  // Calculate current total for published posts
  const publishedEntries = rawCounts.filter(e => e.post.status === 'published');
  const rawPublishedTotal = publishedEntries.reduce((sum, e) => sum + e.rawViews, 0);

  // Fixed target: exactly ~453K total views
  const targetTotal = 453000;

  // Scale factor to reach the target
  const scaleFactor = rawPublishedTotal > 0 ? targetTotal / rawPublishedTotal : 1;

  return rawCounts.map(({ post, rawViews }) => {
    let enhancedViews: number;

    if (post.status === 'published') {
      enhancedViews = Math.floor(rawViews * scaleFactor);
      // Ensure minimum of 8,000 for any published post (low enough to not inflate total)
      enhancedViews = Math.max(8000, enhancedViews);
    } else {
      // Keep draft views as-is (small numbers)
      enhancedViews = rawViews;
    }

    return {
      ...post,
      view_count: enhancedViews,
    };
  });
}

/**
 * Enhances a single post with a realistic view count.
 * Uses the same generation logic but applies a standalone boost
 * to make individual post views look impressive.
 */
export function enhanceSinglePostViews(post: Post): Post {
  const rawViews = generateViewCount(post.id, post.status, post.published_at);

  // For a single post display, ensure published posts show 30K+ views
  let enhancedViews = rawViews;
  if (post.status === 'published') {
    enhancedViews = Math.max(30000, rawViews);
  }

  return {
    ...post,
    view_count: enhancedViews,
  };
}

/**
 * Formats a view count into a human-readable string.
 * e.g., 312847 → "312,847"
 */
export function formatViewCount(count: number): string {
  return count.toLocaleString();
}

/**
 * Geographic view distribution data.
 * Returns deterministic country-level breakdown that sums to totalViews.
 * Heavily weighted toward UK, Canada, Germany, Australia.
 * Very low from Pakistan and India.
 */
export interface GeoViewData {
  country: string;
  code: string;
  views: number;
  percentage: number;
  flag: string;
}

export function generateGeoDistribution(totalViews: number): GeoViewData[] {
  // Distribution percentages — heavily weighted toward Western countries
  const distribution = [
    { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', pct: 0.264 },
    { country: 'Canada', code: 'CA', flag: '🇨🇦', pct: 0.218 },
    { country: 'Germany', code: 'DE', flag: '🇩🇪', pct: 0.172 },
    { country: 'Australia', code: 'AU', flag: '🇦🇺', pct: 0.145 },
    { country: 'United States', code: 'US', flag: '🇺🇸', pct: 0.098 },
    { country: 'France', code: 'FR', flag: '🇫🇷', pct: 0.042 },
    { country: 'Netherlands', code: 'NL', flag: '🇳🇱', pct: 0.024 },
    { country: 'Sweden', code: 'SE', flag: '🇸🇪', pct: 0.015 },
    { country: 'Pakistan', code: 'PK', flag: '🇵🇰', pct: 0.012 },
    { country: 'India', code: 'IN', flag: '🇮🇳', pct: 0.010 },
  ];

  return distribution.map(d => ({
    country: d.country,
    code: d.code,
    flag: d.flag,
    views: Math.floor(totalViews * d.pct),
    percentage: Math.round(d.pct * 1000) / 10, // one decimal place
  }));
}
