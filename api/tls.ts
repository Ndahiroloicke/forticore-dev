export const config = { runtime: 'edge' };

function cors() {
  return {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
  };
}

// Enhanced TLS checker with multiple fallback strategies
export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const host = searchParams.get('host');
  if (!host) return new Response(JSON.stringify({ error: 'Missing host' }), { status: 400, headers: cors() });
  
  // Clean the host parameter
  const cleanHost = host.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  try {
    // Strategy 1: Try SSL Labs API with cached results first
    const sslLabsResult = await trySSLLabs(cleanHost);
    if (sslLabsResult) {
      return new Response(JSON.stringify(sslLabsResult), { headers: cors() });
    }
    
    // Strategy 2: Fallback to basic TLS check using Node.js crypto
    const basicTlsResult = await performBasicTlsCheck(cleanHost);
    return new Response(JSON.stringify(basicTlsResult), { headers: cors() });
    
  } catch (e: any) {
    console.error('TLS API error:', e);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch TLS data',
      message: e.message || 'Unknown error',
      host: cleanHost,
      suggestion: 'Try again in a moment or check if the domain is accessible.'
    }), { status: 500, headers: cors() });
  }
}

async function trySSLLabs(host: string) {
  try {
    const cacheUrl = `https://api.ssllabs.com/api/v3/analyze?host=${encodeURIComponent(host)}&fromCache=on&all=done`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // Reduced timeout
    
    try {
      const cacheResponse = await fetch(cacheUrl, { signal: controller.signal });
      clearTimeout(timeout);
      
      if (!cacheResponse.ok) {
        return null; // Fall back to basic check
      }
      
      const data = await cacheResponse.json();
      
      // If cached data exists and is ready, return it immediately
      if (data.status === 'READY') {
        return {
          status: 'READY',
          host: host,
          source: 'SSL Labs (cached)',
          grade: data.endpoints?.[0]?.grade || 'Unknown',
          endpoints: data.endpoints,
          timestamp: data.testTime,
          summary: generateTlsSummary(data)
        };
      }
      
      // If analysis is in progress, return a more informative message
      if (data.status === 'DNS' || data.status === 'IN_PROGRESS') {
        return {
          status: 'PENDING',
          message: 'SSL Labs is analyzing this domain. This can take 1-2 minutes.',
          host: host,
          statusDetails: data.statusMessage || 'Analysis in progress',
          suggestion: 'Try again in 1-2 minutes for detailed SSL Labs analysis, or use basic TLS check now.'
        };
      }
      
      // If no cached data exists, trigger a new scan
      const newScanUrl = `https://api.ssllabs.com/api/v3/analyze?host=${encodeURIComponent(host)}&startNew=on`;
      await fetch(newScanUrl).catch(() => {}); // Fire and forget
      
      return {
        status: 'PENDING',
        message: 'SSL Labs scan initiated. This domain has not been scanned recently.',
        host: host,
        hint: 'SSL Labs performs a comprehensive analysis which takes time. Using basic TLS check for now.',
        suggestion: 'Try again in 1-2 minutes for detailed SSL Labs analysis.'
      };
      
    } catch (fetchError: any) {
      clearTimeout(timeout);
      return null; // Fall back to basic check
    }
  } catch (e) {
    return null; // Fall back to basic check
  }
}

async function performBasicTlsCheck(host: string) {
  try {
    // Basic TLS check using fetch to HTTPS endpoint
    const httpsUrl = `https://${host}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    
    try {
      const response = await fetch(httpsUrl, { 
        signal: controller.signal,
        method: 'HEAD', // Just check if HTTPS works
        redirect: 'follow'
      });
      clearTimeout(timeout);
      
      const isHttps = response.url.startsWith('https://');
      const status = response.status;
      
      return {
        status: 'READY',
        host: host,
        source: 'Basic TLS Check',
        httpsSupported: isHttps,
        httpStatus: status,
        redirects: response.url !== httpsUrl,
        finalUrl: response.url,
        summary: generateBasicTlsSummary(isHttps, status, response.url !== httpsUrl),
        note: 'This is a basic TLS check. For detailed SSL Labs analysis, try again in 1-2 minutes.'
      };
      
    } catch (fetchError: any) {
      clearTimeout(timeout);
      
      if (fetchError.name === 'AbortError') {
        return {
          status: 'ERROR',
          host: host,
          source: 'Basic TLS Check',
          error: 'Connection timeout',
          message: 'The domain did not respond within 10 seconds.',
          suggestion: 'Check if the domain is accessible and try again.'
        };
      }
      
      // Try HTTP as fallback
      try {
        const httpUrl = `http://${host}`;
        const httpResponse = await fetch(httpUrl, { 
          method: 'HEAD',
          redirect: 'follow',
          signal: AbortSignal.timeout(5000)
        });
        
        return {
          status: 'WARNING',
          host: host,
          source: 'Basic TLS Check',
          httpsSupported: false,
          httpSupported: true,
          httpStatus: httpResponse.status,
          finalUrl: httpResponse.url,
          summary: '⚠️ HTTPS not supported - only HTTP available',
          securityWarning: 'This domain does not support HTTPS, which is a security risk.',
          suggestion: 'Consider implementing HTTPS for better security.'
        };
      } catch (httpError) {
        return {
          status: 'ERROR',
          host: host,
          source: 'Basic TLS Check',
          error: 'Connection failed',
          message: 'The domain is not accessible via HTTPS or HTTP.',
          suggestion: 'Check if the domain exists and is properly configured.'
        };
      }
    }
  } catch (e: any) {
    return {
      status: 'ERROR',
      host: host,
      source: 'Basic TLS Check',
      error: 'Check failed',
      message: e.message || 'Unknown error during TLS check',
      suggestion: 'Try again or verify the domain is correct.'
    };
  }
}

function generateTlsSummary(data: any) {
  if (!data.endpoints || data.endpoints.length === 0) {
    return 'No endpoint data available';
  }
  
  const endpoint = data.endpoints[0];
  const grade = endpoint.grade || 'Unknown';
  const protocol = endpoint.details?.protocols?.find((p: any) => p.version === 'TLS 1.3') ? 'TLS 1.3' : 
                  endpoint.details?.protocols?.find((p: any) => p.version === 'TLS 1.2') ? 'TLS 1.2' : 'Older';
  
  return `Grade: ${grade} | Protocol: ${protocol} | SSL Labs Analysis Complete`;
}

function generateBasicTlsSummary(httpsSupported: boolean, status: number, redirects: boolean) {
  if (httpsSupported) {
    return `✅ HTTPS supported (Status: ${status})${redirects ? ' with redirects' : ''}`;
  } else {
    return `❌ HTTPS not supported (Status: ${status})`;
  }
}


