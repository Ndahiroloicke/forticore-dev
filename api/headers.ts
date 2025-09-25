export const config = { runtime: 'edge' };

function cors() {
  return {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
  };
}

const important = [
  'strict-transport-security',
  'content-security-policy',
  'x-frame-options',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy',
  'cross-origin-opener-policy',
  'cross-origin-resource-policy',
];

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');
  if (!url) return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400, headers: cors() });
  try {
    const resp = await fetch(url, { redirect: 'follow' });
    const raw: Record<string, string> = {};
    resp.headers.forEach((v, k) => { raw[k.toLowerCase()] = v; });

    const report: Record<string, { present: boolean; value?: string; note?: string }> = {};
    for (const k of important) {
      const val = raw[k];
      report[k] = { present: !!val, value: val };
    }

    // quick heuristics
    if (report['strict-transport-security'].present && !/max-age=\d+/.test(report['strict-transport-security'].value || '')) {
      report['strict-transport-security'].note = 'HSTS present but missing max-age';
    }
    if (!report['content-security-policy'].present) {
      report['content-security-policy'].note = 'No CSP; consider a restrictive policy';
    }
    if (!report['x-frame-options'].present) {
      report['x-frame-options'].note = 'Missing; clickjacking risk';
    }
    if (!report['x-content-type-options'].present) {
      report['x-content-type-options'].note = 'Missing; MIME sniffing possible';
    }

    return new Response(JSON.stringify({ url, status: resp.status, headers: report }), { headers: cors() });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors() });
  }
}


