import type { VercelRequest, VercelResponse } from '@vercel/node';

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

    // Simple technology detection using HTTP headers and basic analysis
    const technologies = await detectTechnologies(targetUrl);

    return res.status(200).json({
      url: targetUrl,
      total: technologies.length,
      technologies: technologies,
      source: 'Free technology detection'
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
    // Method 1: Check HTTP headers for technology indicators
    const headerAnalysis = await analyzeHeaders(url);
    technologies.push(...headerAnalysis);

    // Method 2: Basic URL-based detection
    const urlAnalysis = analyzeUrl(url);
    technologies.push(...urlAnalysis);

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
      description: 'Failed to detect technologies: ' + (error as Error).message
    }];
  }
}

function analyzeUrl(url: string): Technology[] {
  const technologies: Technology[] = [];
  const urlLower = url.toLowerCase();
  
  // Detect hosting platforms based on URL patterns
  if (urlLower.includes('github.io') || urlLower.includes('github.com')) {
    technologies.push({
      name: 'GitHub Pages',
      category: 'Hosting',
      version: 'Detected',
      confidence: 95,
      website: 'https://pages.github.com',
      description: 'Static site hosting by GitHub'
    });
  }
  
  if (urlLower.includes('netlify.app') || urlLower.includes('netlify.com')) {
    technologies.push({
      name: 'Netlify',
      category: 'Hosting',
      version: 'Detected',
      confidence: 95,
      website: 'https://netlify.com',
      description: 'Static site hosting and deployment platform'
    });
  }

  if (urlLower.includes('vercel.app') || urlLower.includes('vercel.com')) {
    technologies.push({
      name: 'Vercel',
      category: 'Hosting',
      version: 'Detected',
      confidence: 95,
      website: 'https://vercel.com',
      description: 'Frontend cloud platform'
    });
  }

  if (urlLower.includes('herokuapp.com')) {
    technologies.push({
      name: 'Heroku',
      category: 'Hosting',
      version: 'Detected',
      confidence: 95,
      website: 'https://heroku.com',
      description: 'Cloud platform as a service'
    });
  }

  if (urlLower.includes('aws.amazon.com') || urlLower.includes('amazonaws.com')) {
    technologies.push({
      name: 'Amazon Web Services',
      category: 'Cloud Platform',
      version: 'Detected',
      confidence: 90,
      website: 'https://aws.amazon.com',
      description: 'Cloud computing platform'
    });
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
    const xFrameOptions = response.headers.get('x-frame-options');
    const xContentTypeOptions = response.headers.get('x-content-type-options');
    const strictTransportSecurity = response.headers.get('strict-transport-security');

    // Server detection
    if (server) {
      let serverName = server.toLowerCase();
      let category = 'Web Server';
      let confidence = 95;
      
      if (serverName.includes('apache')) {
        serverName = 'Apache';
      } else if (serverName.includes('nginx')) {
        serverName = 'Nginx';
      } else if (serverName.includes('iis')) {
        serverName = 'Microsoft IIS';
      } else if (serverName.includes('cloudflare')) {
        serverName = 'Cloudflare';
        category = 'CDN';
      }

      technologies.push({
        name: serverName,
        category: category,
        version: 'Unknown',
        confidence: confidence,
        website: '',
        description: 'Detected via Server header'
      });
    }

    // Framework detection
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

    // Generator detection
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

    // Security headers detection
    if (xFrameOptions || xContentTypeOptions || strictTransportSecurity) {
      technologies.push({
        name: 'Security Headers',
        category: 'Security',
        version: 'Detected',
        confidence: 85,
        website: '',
        description: 'Security headers detected (X-Frame-Options, X-Content-Type-Options, HSTS)'
      });
    }

  } catch (error) {
    console.error('Header analysis error:', error);
  }

  return technologies;
}
