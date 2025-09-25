export const config = { runtime: 'edge' };

function cors() {
  return {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
  };
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const urlInput = searchParams.get('url');
  if (!urlInput) return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400, headers: cors() });
  try {
    const u = new URL(urlInput);
    const base = `${u.protocol}//${u.host}`;
    const robotsUrl = `${base}/robots.txt`;
    const sitemapUrl = `${base}/sitemap.xml`;
    const [rRes, sRes] = await Promise.all([
      fetch(robotsUrl),
      fetch(sitemapUrl)
    ]);
    const robots = rRes.ok ? await rRes.text() : null;
    const sitemap = sRes.ok ? await sRes.text() : null;
    return new Response(JSON.stringify({ robotsUrl, sitemapUrl, robots, sitemap }), { headers: cors() });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors() });
  }
}


