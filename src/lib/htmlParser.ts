/**
 * Enterprise-grade HTML to Article Parser
 * Extracts clean content, metadata, and structure from HTML files
 */

export interface ParsedArticle {
  title: string;
  content: string;
  excerpt: string;
  suggestedCategory: string;
  suggestedTags: string[];
  estimatedReadTime: number;
  wordCount: number;
  images: string[];
  headings: string[];
  metadata: {
    author?: string;
    publishDate?: string;
    description?: string;
  };
}

export class HTMLArticleParser {
  private parser: DOMParser;

  constructor() {
    this.parser = new DOMParser();
  }

  /**
   * Parse HTML file and extract article data
   */
  parse(htmlContent: string): ParsedArticle {
    const doc = this.parser.parseFromString(htmlContent, 'text/html');

    // Extract title
    const title = this.extractTitle(doc);

    // Extract main content
    const content = this.extractContent(doc);

    // Extract metadata
    const metadata = this.extractMetadata(doc);

    // Generate excerpt
    const excerpt = this.generateExcerpt(content);

    // Extract images
    const images = this.extractImages(doc);

    // Extract headings for structure analysis
    const headings = this.extractHeadings(doc);

    // Calculate stats
    const wordCount = this.countWords(content);
    const estimatedReadTime = Math.ceil(wordCount / 200); // 200 words per minute

    // AI-powered categorization
    const suggestedCategory = this.suggestCategory(title, content, headings);
    const suggestedTags = this.suggestTags(title, content, headings);

    return {
      title,
      content,
      excerpt,
      suggestedCategory,
      suggestedTags,
      estimatedReadTime,
      wordCount,
      images,
      headings,
      metadata,
    };
  }

  /**
   * Extract title from HTML
   */
  private extractTitle(doc: Document): string {
    // Try multiple sources in order of preference
    const sources = [
      doc.querySelector('h1')?.textContent,
      doc.querySelector('title')?.textContent,
      doc.querySelector('meta[property="og:title"]')?.getAttribute('content'),
      doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content'),
      doc.querySelector('.title, .post-title, .article-title')?.textContent,
    ];

    const title = sources.find(t => t && t.trim().length > 0);
    return this.cleanText(title || 'Untitled Article');
  }

  /**
   * Extract main content from HTML
   */
  private extractContent(doc: Document): string {
    // Remove unwanted elements
    const unwantedSelectors = [
      'script',
      'style',
      'nav',
      'header',
      'footer',
      'aside',
      '.sidebar',
      '.advertisement',
      '.ad',
      '.social-share',
      '.comments',
      '.related-posts',
    ];

    unwantedSelectors.forEach(selector => {
      doc.querySelectorAll(selector).forEach(el => el.remove());
    });

    // Try to find main content area
    const contentSelectors = [
      'article',
      'main',
      '[role="main"]',
      '.content',
      '.post-content',
      '.article-content',
      '.entry-content',
      '#content',
      'body',
    ];

    let contentElement: Element | null = null;
    for (const selector of contentSelectors) {
      contentElement = doc.querySelector(selector);
      if (contentElement) break;
    }

    if (!contentElement) {
      contentElement = doc.body;
    }

    // Clean and format content
    return this.cleanHTML(contentElement.innerHTML);
  }

  /**
   * Extract metadata from HTML
   */
  private extractMetadata(doc: Document): ParsedArticle['metadata'] {
    return {
      author:
        doc.querySelector('meta[name="author"]')?.getAttribute('content') ||
        doc.querySelector('[rel="author"]')?.textContent ||
        undefined,
      publishDate:
        doc.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ||
        doc.querySelector('time')?.getAttribute('datetime') ||
        undefined,
      description:
        doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
        doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
        undefined,
    };
  }

  /**
   * Extract all images from content
   */
  private extractImages(doc: Document): string[] {
    const images: string[] = [];
    doc.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('data:')) {
        images.push(src);
      }
    });
    return images;
  }

  /**
   * Extract headings for structure analysis
   */
  private extractHeadings(doc: Document): string[] {
    const headings: string[] = [];
    doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
      const text = heading.textContent?.trim();
      if (text) headings.push(text);
    });
    return headings;
  }

  /**
   * Generate excerpt from content
   */
  private generateExcerpt(content: string, maxLength: number = 200): string {
    // Strip HTML tags
    const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    if (text.length <= maxLength) return text;

    // Find the last complete sentence within maxLength
    const truncated = text.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastQuestion = truncated.lastIndexOf('?');
    const lastExclamation = truncated.lastIndexOf('!');

    const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);

    if (lastSentenceEnd > maxLength * 0.6) {
      return text.substring(0, lastSentenceEnd + 1);
    }

    // Otherwise, cut at last space
    const lastSpace = truncated.lastIndexOf(' ');
    return text.substring(0, lastSpace) + '...';
  }

  /**
   * AI-powered category suggestion based on content analysis
   */
  private suggestCategory(title: string, content: string, headings: string[]): string {
    const text = `${title} ${headings.join(' ')} ${content}`.toLowerCase();

    const categoryKeywords: Record<string, string[]> = {
      business: ['business', 'entrepreneur', 'company', 'corporate', 'strategy', 'management', 'leadership'],
      finance: ['finance', 'money', 'investment', 'stock', 'trading', 'crypto', 'banking', 'economy'],
      saas: ['saas', 'software', 'cloud', 'subscription', 'platform', 'api', 'integration'],
      startups: ['startup', 'founder', 'funding', 'venture', 'seed', 'pitch', 'mvp', 'launch'],
      ai: ['ai', 'artificial intelligence', 'machine learning', 'neural', 'chatgpt', 'gpt', 'llm', 'automation'],
      reviews: ['review', 'comparison', 'vs', 'best', 'top', 'rating', 'pros', 'cons'],
      technology: ['tech', 'technology', 'digital', 'innovation', 'gadget', 'device', 'hardware'],
      marketing: ['marketing', 'seo', 'content', 'social media', 'advertising', 'campaign', 'brand'],
      productivity: ['productivity', 'efficiency', 'workflow', 'time management', 'tools', 'tips'],
      leadership: ['leadership', 'management', 'team', 'culture', 'motivation', 'coaching'],
    };

    let maxScore = 0;
    let suggestedCategory = 'technology';

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      let score = 0;
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = text.match(regex);
        score += matches ? matches.length : 0;
      });

      if (score > maxScore) {
        maxScore = score;
        suggestedCategory = category;
      }
    }

    return suggestedCategory;
  }

  /**
   * AI-powered tag suggestion
   */
  private suggestTags(title: string, content: string, headings: string[]): string[] {
    const text = `${title} ${headings.join(' ')} ${content}`.toLowerCase();

    const tagKeywords: Record<string, string[]> = {
      javascript: ['javascript', 'js', 'node', 'react', 'vue', 'angular'],
      react: ['react', 'jsx', 'hooks', 'component'],
      typescript: ['typescript', 'ts', 'type'],
      python: ['python', 'django', 'flask'],
      'web-development': ['web dev', 'frontend', 'backend', 'fullstack'],
      'mobile-apps': ['mobile', 'ios', 'android', 'app'],
      'cloud-computing': ['cloud', 'aws', 'azure', 'gcp'],
      entrepreneurship: ['entrepreneur', 'startup', 'founder'],
      strategy: ['strategy', 'strategic', 'planning'],
      growth: ['growth', 'scale', 'scaling'],
      innovation: ['innovation', 'innovative', 'disrupt'],
      investing: ['invest', 'portfolio', 'stock'],
      cryptocurrency: ['crypto', 'bitcoin', 'ethereum', 'blockchain'],
      'machine-learning': ['machine learning', 'ml', 'model', 'training'],
      chatgpt: ['chatgpt', 'gpt', 'openai'],
      automation: ['automat', 'workflow', 'bot'],
      'data-science': ['data science', 'analytics', 'big data'],
      seo: ['seo', 'search engine', 'ranking'],
      'content-marketing': ['content marketing', 'blog', 'article'],
      'social-media': ['social media', 'facebook', 'twitter', 'linkedin'],
      tutorial: ['tutorial', 'how to', 'guide', 'step by step'],
      guide: ['guide', 'handbook', 'manual'],
      tips: ['tips', 'tricks', 'hack'],
      trends: ['trend', 'future', 'prediction'],
    };

    const suggestedTags: string[] = [];

    for (const [tag, keywords] of Object.entries(tagKeywords)) {
      let score = 0;
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}`, 'gi');
        const matches = text.match(regex);
        score += matches ? matches.length : 0;
      });

      if (score > 0) {
        suggestedTags.push(tag);
      }
    }

    // Return top 5 tags
    return suggestedTags.slice(0, 5);
  }

  /**
   * Clean HTML content
   */
  private cleanHTML(html: string): string {
    // Remove comments
    html = html.replace(/<!--[\s\S]*?-->/g, '');

    // Remove empty tags
    html = html.replace(/<(\w+)[^>]*>\s*<\/\1>/g, '');

    // Clean up whitespace
    html = html.replace(/\s+/g, ' ');
    html = html.replace(/>\s+</g, '><');

    return html.trim();
  }

  /**
   * Clean text content
   */
  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[\r\n]+/g, ' ')
      .trim();
  }

  /**
   * Count words in content
   */
  private countWords(content: string): number {
    const text = content.replace(/<[^>]*>/g, ' ');
    const words = text.match(/\b\w+\b/g);
    return words ? words.length : 0;
  }
}

/**
 * Utility function to parse HTML file
 */
export const parseHTMLFile = (htmlContent: string): ParsedArticle => {
  const parser = new HTMLArticleParser();
  return parser.parse(htmlContent);
};
