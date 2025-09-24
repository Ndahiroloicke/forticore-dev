export const config = { runtime: 'edge' };

function normalize(input: string): string {
  try {
    const u = new URL(input);
    return u.hostname.replace(/^\*\./, '').toLowerCase();
  } catch {
    return input.replace(/^https?:\/\//, '').split('/')[0].replace(/^\*\./, '').toLowerCase();
  }
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get('domain') || '';
  const domain = normalize(raw);
  const base = domain.replace(/^www\./, '');
  if (!domain) return new Response(JSON.stringify({ error: 'Missing domain' }), { status: 400, headers: cors() });
  try {
    async function fetchCrt(q: string): Promise<any[]> {
      const headers = {
        'User-Agent': 'FortiCoreBot/1.0 (+https://forticore.dev)',
        'Accept': 'application/json,text/plain;q=0.9,*/*;q=0.8',
      } as Record<string, string>;
      // direct
      let res = await fetch(`https://crt.sh/?q=${encodeURIComponent(q)}&output=json`, { headers, cache: 'no-store' });
      let text = await res.text();
      if (!res.ok || /^\s*</.test(text)) {
        // proxy fallback
        const proxied = `https://r.jina.ai/http://crt.sh/?q=${encodeURIComponent(q)}&output=json`;
        const alt = await fetch(proxied, { headers, cache: 'no-store' });
        text = await alt.text();
      }
      try { return JSON.parse(text); } catch { return []; }
    }

    // Try both exact and wildcard, pick the larger set
    const [dataExact, dataWild] = await Promise.all([
      fetchCrt(base),
      fetchCrt(`%.${base}`),
    ]);
    const data = dataWild.length >= dataExact.length ? dataWild : dataExact;
    if (!Array.isArray(data) || data.length === 0) {
      return new Response(JSON.stringify({ domain: base, total: 0, subdomains: [] }), { headers: cors() });
    }
    const names: string[] = Array.isArray(data)
      ? data.flatMap((r: any) => {
          const nv = String(r?.name_value || '');
          const cn = String(r?.common_name || '');
          return [...nv.split(/\n+/), cn];
        })
      : [];
    const subdomains = [...new Set(
      names
        .map(n => n.trim().toLowerCase())
        .filter(Boolean)
        .filter(n => n === base || n.endsWith(`.${base}`))
        .filter(n => !n.includes('*'))
    )].sort();
    return new Response(JSON.stringify({ domain: base, total: subdomains.length, subdomains }), { headers: cors() });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors() });
  }
}

function cors() {
  return {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
  } as Record<string, string>;
}


