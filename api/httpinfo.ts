export const config = { runtime: 'edge' };

function cors() {
  return {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
  } as Record<string, string>;
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get('url') || '';
  if (!input) return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400, headers: cors() });

  // normalize
  let target = input.trim();
  if (!/^https?:\/\//i.test(target)) target = `https://${target}`;

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 12000);
    const resp = await fetch(target, { redirect: 'follow', signal: controller.signal });
    clearTimeout(id);

    const headers: Record<string, string> = {};
    resp.headers.forEach((v, k) => { headers[k] = v; });
    const text = await resp.text();

    return new Response(JSON.stringify({
      url: target,
      status: resp.status,
      headers,
      bodySample: text.slice(0, 20000),
    }), { headers: cors() });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors() });
  }
}


