export const config = { runtime: 'edge' };

function cors() {
  return {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
  };
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get('target');
  if (!target) return new Response(JSON.stringify({ error: 'Missing target (IP or domain)' }), { status: 400, headers: cors() });
  try {
    // ip-api supports domain or IP; returns ASN info for IP, resolve first for domains
    const res = await fetch(`http://ip-api.com/json/${encodeURIComponent(target)}?fields=status,message,query,as,asname,isp,org,country,regionName,city,zip,lat,lon`);
    const json = await res.json();
    if (json.status !== 'success') return new Response(JSON.stringify({ error: json.message || 'Lookup failed' }), { status: 502, headers: cors() });
    return new Response(JSON.stringify(json), { headers: cors() });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors() });
  }
}


