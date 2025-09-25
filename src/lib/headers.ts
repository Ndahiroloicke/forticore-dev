export async function fetchHeadersAudit(targetUrl: string) {
  const res = await fetch(`/api/headers?url=${encodeURIComponent(targetUrl)}`, { cache: 'no-store' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Header audit failed');
  return json;
}

export async function dnsLookup(name: string, type: string = 'A') {
  const res = await fetch(`/api/dns?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`, { cache: 'no-store' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'DNS lookup failed');
  return json;
}


