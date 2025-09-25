export const config = { runtime: 'edge' };

function cors() {
  return {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': '*',
  };
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');
  const type = (searchParams.get('type') || 'A').toUpperCase();
  if (!name) return new Response(JSON.stringify({ error: 'Missing name' }), { status: 400, headers: cors() });
  try {
    const base = 'https://dns.google/resolve';
    const url = `${base}?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`;
    const res = await fetch(url, { cache: 'no-store' });
    const json = await res.json();
    return new Response(JSON.stringify(json), { headers: cors() });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors() });
  }
}


