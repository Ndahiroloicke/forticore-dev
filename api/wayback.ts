export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const mode = searchParams.get('mode') || 'urls';

  if (!url) {
    return new Response(JSON.stringify({ error: 'Missing url parameter' }), { 
      status: 400, 
      headers: cors() 
    });
  }

  try {
    let targetUrl: string;
    let responseData: any;

    if (mode === 'urls') {
      // Get URLs only using CDX API
      targetUrl = `http://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}/*&output=json&fl=original&collapse=urlkey&limit=${limit}`;
      
      try {
        const res = await fetch(targetUrl, { cache: 'no-store' });
        const text = await res.text();
        
        if (res.status === 451) {
          // Legally restricted or robots.txt blocked
          return new Response(JSON.stringify({ 
            urls: [], 
            message: 'Archive indexing blocked or no recent captures',
            target: url 
          }), { headers: cors() });
        }
        
        if (!res.ok || /^\s*</.test(text)) {
          // Fallback to proxy
          const proxied = `https://r.jina.ai/${targetUrl}`;
          const alt = await fetch(proxied, { cache: 'no-store' });
          const altText = await alt.text();
          
          // Try to extract JSON from markdown-wrapped response
          const jsonMatch = altText.match(/\[\[.*?\]\]/s);
          if (jsonMatch) {
            responseData = JSON.parse(jsonMatch[0]);
          } else {
            responseData = JSON.parse(altText);
          }
        } else {
          responseData = JSON.parse(text);
        }
        
        // Extract URLs from CDX response (skip header row)
        const urls = Array.isArray(responseData) && responseData.length > 1 
          ? responseData.slice(1).map((row: any[]) => row[0]).filter(Boolean)
          : [];
        
        return new Response(JSON.stringify({ 
          urls, 
          target: url, 
          total: urls.length 
        }), { headers: cors() });
        
      } catch (error) {
        return new Response(JSON.stringify({ 
          error: 'Wayback CDX failed', 
          details: error instanceof Error ? error.message : 'Unknown error',
          target: url 
        }), { status: 500, headers: cors() });
      }
    } else {
      // Get availability info
      targetUrl = `http://web.archive.org/wayback/available?url=${encodeURIComponent(url)}`;
      
      const res = await fetch(targetUrl, { cache: 'no-store' });
      const data = await res.json();
      
      return new Response(JSON.stringify(data), { headers: cors() });
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ 
      error: 'Wayback request failed', 
      details: e.message 
    }), { status: 500, headers: cors() });
  }
}

function cors() {
  return {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
  } as Record<string, string>;
}
