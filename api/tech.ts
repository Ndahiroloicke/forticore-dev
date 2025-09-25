export const config = { runtime: 'edge' };

function cors() {
  return {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
  };
}

const fingerprints: Array<{ name: string; header?: RegExp; body?: RegExp }> = [
  { name: 'Cloudflare', header: /cf-ray|cloudflare/i },
  { name: 'Akamai', header: /akamai/i },
  { name: 'nginx', header: /nginx/i },
  { name: 'Apache', header: /apache/i },
  { name: 'IIS', header: /iis/i },
  { name: 'Express', header: /x-powered-by:\s*express/i },
  { name: 'PHP', header: /x-powered-by:\s*php/i },
  { name: 'WordPress', body: /wp-content|wp-json/i },
  { name: 'Next.js', body: /__NEXT_DATA__|nextjs/i },
  { name: 'React', body: /data-reactroot|React\./i },
  { name: 'Angular', body: /ng-version|angular/i },
  { name: 'Drupal', body: /drupal-settings-json|drupal/i },
];

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url) return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400, headers: cors() });
  try {
    const resp = await fetch(url, { redirect: 'follow' });
    const hz: Record<string, string> = {};
    resp.headers.forEach((v, k) => { hz[k.toLowerCase()] = v; });
    const server = hz['server'] || '';
    const xpb = hz['x-powered-by'] || '';
    const body = await resp.text();

    const detected: string[] = [];
    const headerStr = Object.entries(hz).map(([k,v]) => `${k}: ${v}`).join('\n');
    for (const fp of fingerprints) {
      if (fp.header && fp.header.test(headerStr)) detected.push(fp.name);
      else if (fp.body && fp.body.test(body)) detected.push(fp.name);
    }

    return new Response(JSON.stringify({ url, status: resp.status, server, xPoweredBy: xpb, detected: [...new Set(detected)] }), { headers: cors() });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors() });
  }
}


