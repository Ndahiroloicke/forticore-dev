import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  article?: {
    section?: string;
    tags?: string[];
  };
}

const SEO = ({
  title = 'FortiCore - Advanced Automated Penetration Testing & Security Assessment Tool',
  description = 'FortiCore is the leading automated penetration testing platform for cybersecurity professionals. Streamline security assessments with our powerful CLI tool featuring subdomain enumeration, vulnerability scanning, and comprehensive security testing capabilities.',
  keywords = 'FortiCore, penetration testing, automated security testing, cybersecurity tools, vulnerability assessment, subdomain enumeration, security scanning, pentesting automation, CLI security tools, network security, web application security, security assessment platform',
  image = 'https://forticoredev.innov.rw/og-image.png',
  url = 'https://forticoredev.innov.rw',
  type = 'website',
  author = 'FortiCore Development Team',
  publishedTime,
  modifiedTime,
  article,
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Update standard meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);

    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'FortiCore', true);

    // Update Twitter Card tags
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', image, true);
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:url', url, true);

    // Article-specific meta tags
    if (type === 'article') {
      if (publishedTime) {
        updateMetaTag('article:published_time', publishedTime, true);
      }
      if (modifiedTime) {
        updateMetaTag('article:modified_time', modifiedTime, true);
      }
      if (article?.section) {
        updateMetaTag('article:section', article.section, true);
      }
      if (article?.tags) {
        article.tags.forEach(tag => {
          const tagElement = document.createElement('meta');
          tagElement.setAttribute('property', 'article:tag');
          tagElement.setAttribute('content', tag);
          document.head.appendChild(tagElement);
        });
      }
    }

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Cleanup function to reset on unmount (optional)
    return () => {
      // We don't reset because we want the last set values to persist
    };
  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime, article]);

  return null; // This component doesn't render anything
};

export default SEO;

