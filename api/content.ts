export const config = { runtime: 'edge' };

function cors() {
  return {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
  };
}

const WORDS = [
  'robots.txt','sitemap.xml','admin','login','backup','.git/HEAD','server-status','crossdomain.xml',
  'config','config.php','.env','api','static','uploads','.well-known/security.txt','.well-known/assetlinks.json'
];

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const baseUrl = searchParams.get('url');
  if (!baseUrl) return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400, headers: cors() });
  try {
    const u = new URL(baseUrl);
    const origin = `${u.protocol}//${u.host}`;
    const results: Array<{ path: string; status: number }> = [];
    for (const w of WORDS) {
      const p = w.startsWith('/') ? w : `/${w}`;
      const target = origin + p;
      try {
        const r = await fetch(target, { method: 'GET' });
        if (r.status >= 200 && r.status < 400) {
          results.push({ path: p, status: r.status });
        }
      } catch {}
    }
    return new Response(JSON.stringify({ origin, hits: results }), { headers: cors() });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors() });
  }
}


