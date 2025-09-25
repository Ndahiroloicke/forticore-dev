import type { VercelRequest, VercelResponse } from '@vercel/node';

// Free technology detection using multiple sources
const JINA_PROXY_BASE = 'https://r.jina.ai/';

export default async function (req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required.' });
  }

  try {
    // Normalize URL - ensure it has protocol
    let targetUrl = url;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }

    // Use multiple free sources for technology detection
    const technologies = await detectTechnologies(targetUrl);

    return res.status(200).json({
      url: targetUrl,
      total: technologies.length,
      technologies: technologies,
      source: 'Free technology detection (multiple sources)'
    });

  } catch (error: any) {
    console.error('Technology discovery API error:', error);
    return res.status(500).json({ error: error.message });
  }
}

interface Technology {
  name: string;
  category: string;
  version: string;
  confidence: number;
  website: string;
  description: string;
}

async function detectTechnologies(url: string): Promise<Technology[]> {
  const technologies: Technology[] = [];
  
  try {
    // Method 1: Analyze the website's HTML content for common technologies
    const htmlAnalysis = await analyzeHtmlContent(url);
    technologies.push(...htmlAnalysis);

    // Method 2: Check for common JavaScript libraries and frameworks
    const jsAnalysis = await analyzeJavaScript(url);
    technologies.push(...jsAnalysis);

    // Method 3: Check HTTP headers for technology indicators
    const headerAnalysis = await analyzeHeaders(url);
    technologies.push(...headerAnalysis);

    // Remove duplicates and return
    const uniqueTechnologies = technologies.filter((tech, index, self) => 
      index === self.findIndex(t => t.name.toLowerCase() === tech.name.toLowerCase())
    );

    return uniqueTechnologies;

  } catch (error) {
    console.error('Error in technology detection:', error);
    return [{
      name: 'Error',
      category: 'Error',
      version: 'Unknown',
      confidence: 0,
      website: '',
      description: 'Failed to detect technologies: ' + error.message
    }];
  }
}

async function analyzeHtmlContent(url: string): Promise<Technology[]> {
  const technologies: Technology[] = [];
  
  try {
    // Use Jina proxy to fetch the HTML content
    const proxyUrl = `${JINA_PROXY_BASE}${url}`;
    const response = await fetch(proxyUrl, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch HTML: ${response.status}`);
    }

    const html = await response.text();
    
    // Common technology patterns
    const patterns = [
      // CMS
      { name: 'WordPress', pattern: /wp-content|wp-includes|wordpress/i, category: 'CMS' },
      { name: 'Drupal', pattern: /drupal|sites\/all|modules\/system/i, category: 'CMS' },
      { name: 'Joomla', pattern: /joomla|components\/com_|templates\/system/i, category: 'CMS' },
      
      // Frameworks
      { name: 'React', pattern: /react|__REACT_DEVTOOLS_GLOBAL_HOOK__/i, category: 'JavaScript Framework' },
      { name: 'Vue.js', pattern: /vue\.js|__VUE__/i, category: 'JavaScript Framework' },
      { name: 'Angular', pattern: /angular|ng-app|ng-controller/i, category: 'JavaScript Framework' },
      { name: 'jQuery', pattern: /jquery|jQuery/i, category: 'JavaScript Library' },
      
      // Analytics
      { name: 'Google Analytics', pattern: /google-analytics|gtag|ga\(/i, category: 'Analytics' },
      { name: 'Google Tag Manager', pattern: /googletagmanager|gtm\.js/i, category: 'Analytics' },
      
      // CDN
      { name: 'Cloudflare', pattern: /cloudflare/i, category: 'CDN' },
      { name: 'Bootstrap', pattern: /bootstrap|bootstrap\.css/i, category: 'CSS Framework' },
      
      // E-commerce
      { name: 'Shopify', pattern: /shopify|cdn\.shopify/i, category: 'E-commerce' },
      { name: 'WooCommerce', pattern: /woocommerce/i, category: 'E-commerce' },
      
      // Server
      { name: 'Apache', pattern: /apache|server:\s*apache/i, category: 'Web Server' },
      { name: 'Nginx', pattern: /nginx|server:\s*nginx/i, category: 'Web Server' },
    ];

    for (const pattern of patterns) {
      if (pattern.pattern.test(html)) {
        technologies.push({
          name: pattern.name,
          category: pattern.category,
          version: 'Detected',
          confidence: 80,
          website: '',
          description: `Detected via HTML analysis`
        });
      }
    }

  } catch (error) {
    console.error('HTML analysis error:', error);
  }

  return technologies;
}

async function analyzeJavaScript(url: string): Promise<Technology[]> {
  const technologies: Technology[] = [];
  
  try {
    // This would require more sophisticated analysis
    // For now, we'll return some common detections based on URL patterns
    const urlLower = url.toLowerCase();
    
    if (urlLower.includes('github.io') || urlLower.includes('github.com')) {
      technologies.push({
        name: 'GitHub Pages',
        category: 'Hosting',
        version: 'Detected',
        confidence: 90,
        website: 'https://pages.github.com',
        description: 'Static site hosting by GitHub'
      });
    }
    
    if (urlLower.includes('netlify.app') || urlLower.includes('netlify.com')) {
      technologies.push({
        name: 'Netlify',
        category: 'Hosting',
        version: 'Detected',
        confidence: 90,
        website: 'https://netlify.com',
        description: 'Static site hosting and deployment platform'
      });
    }

  } catch (error) {
    console.error('JavaScript analysis error:', error);
  }

  return technologies;
}

async function analyzeHeaders(url: string): Promise<Technology[]> {
  const technologies: Technology[] = [];
  
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const server = response.headers.get('server');
    const poweredBy = response.headers.get('x-powered-by');
    const xGenerator = response.headers.get('x-generator');

    if (server) {
      technologies.push({
        name: server,
        category: 'Web Server',
        version: 'Unknown',
        confidence: 95,
        website: '',
        description: 'Detected via Server header'
      });
    }

    if (poweredBy) {
      technologies.push({
        name: poweredBy,
        category: 'Framework',
        version: 'Unknown',
        confidence: 90,
        website: '',
        description: 'Detected via X-Powered-By header'
      });
    }

    if (xGenerator) {
      technologies.push({
        name: xGenerator,
        category: 'Generator',
        version: 'Unknown',
        confidence: 95,
        website: '',
        description: 'Detected via X-Generator header'
      });
    }

  } catch (error) {
    console.error('Header analysis error:', error);
  }

  return technologies;
}
