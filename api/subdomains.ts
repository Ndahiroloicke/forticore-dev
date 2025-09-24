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
    // Use wildcard query to include subdomains
    const query = `%25.${base}`; // translates to '%.base'
    const url = `https://crt.sh/?q=${encodeURIComponent(query)}&output=json`;
    const headers = {
      'User-Agent': 'FortiCoreBot/1.0 (+https://forticore.dev)',
      'Accept': 'application/json,text/plain;q=0.9,*/*;q=0.8',
    } as Record<string, string>;
    let res = await fetch(url, { headers, cache: 'no-store' });
    if (!res.ok) return new Response(JSON.stringify({ error: `crt.sh error ${res.status}` }), { status: 502, headers: cors() });
    let text = await res.text();
    if (/^\s*</.test(text)) {
      const proxied = `https://r.jina.ai/http://crt.sh/?q=${encodeURIComponent(domain)}&output=json`;
      const alt = await fetch(proxied, { headers, cache: 'no-store' });
      text = await alt.text();
    }
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid response from crt.sh' }), { status: 502, headers: cors() });
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


