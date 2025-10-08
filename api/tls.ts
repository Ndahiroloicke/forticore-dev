export const config = { runtime: 'edge' };

function cors() {
  return {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
  };
}

// Uses SSL Labs public API. See https://api.ssllabs.com/api/v3/
export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const host = searchParams.get('host');
  if (!host) return new Response(JSON.stringify({ error: 'Missing host' }), { status: 400, headers: cors() });
  
  try {
    // First, try to get cached results only (fast)
    const cacheUrl = `https://api.ssllabs.com/api/v3/analyze?host=${encodeURIComponent(host)}&fromCache=on&all=done`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    try {
      const cacheResponse = await fetch(cacheUrl, { signal: controller.signal });
      clearTimeout(timeout);
      
      if (!cacheResponse.ok) {
        throw new Error(`SSL Labs API returned ${cacheResponse.status}`);
      }
      
      const data = await cacheResponse.json();
      
      // If cached data exists and is ready, return it immediately
      if (data.status === 'READY' || data.status === 'ERROR') {
        return new Response(JSON.stringify(data), { headers: cors() });
      }
      
      // If no cached data or in progress, start a new scan but return immediately
      if (data.status === 'DNS' || data.status === 'IN_PROGRESS') {
        return new Response(JSON.stringify({
          status: 'PENDING',
          message: 'SSL Labs is analyzing this domain. This can take 1-2 minutes. Please try again in a moment.',
          host: host,
          statusDetails: data.statusMessage || 'Analysis in progress'
        }), { headers: cors() });
      }
      
      // If no cached data exists, trigger a new scan
      const newScanUrl = `https://api.ssllabs.com/api/v3/analyze?host=${encodeURIComponent(host)}&startNew=on`;
      await fetch(newScanUrl).catch(() => {}); // Fire and forget
      
      return new Response(JSON.stringify({
        status: 'PENDING',
        message: 'SSL Labs scan initiated. This domain has not been scanned recently. Please try again in 1-2 minutes.',
        host: host,
        hint: 'SSL Labs performs a comprehensive analysis which takes time. Subsequent requests will be faster.'
      }), { headers: cors() });
      
    } catch (fetchError: any) {
      clearTimeout(timeout);
      
      if (fetchError.name === 'AbortError') {
        return new Response(JSON.stringify({
          error: 'Request timeout',
          message: 'SSL Labs API is taking too long to respond. The domain may be under analysis. Please try again in a minute.',
          host: host
        }), { status: 504, headers: cors() });
      }
      
      throw fetchError;
    }
    
  } catch (e: any) {
    console.error('TLS API error:', e);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch TLS data',
      message: e.message || 'Unknown error',
      host: host,
      suggestion: 'Try again in a moment or check if the domain is accessible.'
    }), { status: 500, headers: cors() });
  }
}


