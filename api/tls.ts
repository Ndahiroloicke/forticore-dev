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
    const analyze = async () => {
      const r = await fetch(`https://api.ssllabs.com/api/v3/analyze?host=${encodeURIComponent(host)}&fromCache=on&all=done`);
      return await r.json();
    };
    let data = await analyze();
    // If analysis is in progress, poll a few times
    let tries = 0;
    while (data.status && /IN_PROGRESS|DNS/.test(data.status) && tries < 6) {
      await new Promise(r => setTimeout(r, 4000));
      data = await analyze();
      tries++;
    }
    return new Response(JSON.stringify(data), { headers: cors() });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors() });
  }
}


