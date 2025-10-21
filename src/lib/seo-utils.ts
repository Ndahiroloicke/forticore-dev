/**
 * SEO Utility Functions
 * Provides helper functions for SEO optimization across the application
 */

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ArticleSchema {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  author: string;
  url: string;
}

/**
 * Generate JSON-LD breadcrumb structured data
 */
export const generateBreadcrumbSchema = (items: BreadcrumbItem[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

/**
 * Generate JSON-LD FAQ structured data
 */
export const generateFAQSchema = (faqs: FAQItem[]) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
};

/**
 * Generate JSON-LD article structured data
 */
export const generateArticleSchema = (article: ArticleSchema) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FortiCore',
      logo: {
        '@type': 'ImageObject',
        url: 'https://forticoredev.innov.rw/forticoreLogo.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
};

/**
 * Generate JSON-LD How-To structured data
 */
export const generateHowToSchema = (
  name: string,
  description: string,
  steps: string[],
  image?: string
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    image: image || 'https://forticoredev.innov.rw/og-image.png',
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: `Step ${index + 1}`,
      text: step,
    })),
  };
};

/**
 * Generate JSON-LD Software Application structured data
 */
export const generateSoftwareSchema = (
  name: string,
  description: string,
  version: string,
  features: string[]
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Cross-platform',
    softwareVersion: version,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: features,
    author: {
      '@type': 'Organization',
      name: 'FortiCore Development Team',
    },
  };
};

/**
 * Inject structured data into the page
 */
export const injectStructuredData = (schema: object, id: string) => {
  // Remove existing schema with the same ID if it exists
  const existingScript = document.getElementById(id);
  if (existingScript) {
    existingScript.remove();
  }

  // Create and inject new schema
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
};

/**
 * Remove structured data from the page
 */
export const removeStructuredData = (id: string) => {
  const script = document.getElementById(id);
  if (script) {
    script.remove();
  }
};

/**
 * Generate meta tags for a page
 */
export const generatePageMeta = (
  title: string,
  description: string,
  keywords?: string,
  image?: string
) => {
  return {
    title: `${title} | FortiCore`,
    description,
    keywords:
      keywords ||
      'FortiCore, penetration testing, automated security testing, cybersecurity tools',
    image: image || 'https://forticoredev.innov.rw/og-image.png',
  };
};

/**
 * Track page view for analytics (Google Analytics, etc.)
 */
export const trackPageView = (url: string, title: string) => {
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: url,
      page_title: title,
    });
  }

  // You can add other analytics platforms here
  // Example: Facebook Pixel, Microsoft Clarity, etc.
};

/**
 * Format date for structured data
 */
export const formatDateForSchema = (date: Date): string => {
  return date.toISOString();
};

/**
 * Generate sitemap entry
 */
export const generateSitemapEntry = (
  url: string,
  lastmod: string,
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',
  priority: number
) => {
  return {
    url,
    lastmod,
    changefreq,
    priority,
  };
};

/**
 * Validate and sanitize meta description length
 */
export const sanitizeMetaDescription = (description: string): string => {
  const maxLength = 160;
  if (description.length <= maxLength) {
    return description;
  }
  return description.substring(0, maxLength - 3) + '...';
};

/**
 * Validate and sanitize title length
 */
export const sanitizeTitle = (title: string): string => {
  const maxLength = 60;
  if (title.length <= maxLength) {
    return title;
  }
  return title.substring(0, maxLength - 3) + '...';
};

/**
 * Generate slug from text
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

/**
 * Check if running in production
 */
export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

/**
 * Get canonical URL for current page
 */
export const getCanonicalUrl = (path: string): string => {
  const baseUrl = 'https://forticoredev.innov.rw';
  return `${baseUrl}${path}`;
};

