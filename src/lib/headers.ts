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

export async function techFingerprint(url: string) {
  const res = await fetch(`/api/tech?url=${encodeURIComponent(url)}`, { cache: 'no-store' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Tech fingerprint failed');
  return json;
}

export async function fetchRobots(url: string) {
  const res = await fetch(`/api/robots?url=${encodeURIComponent(url)}`, { cache: 'no-store' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Robots fetch failed');
  return json;
}

export async function fetchTlsGrade(host: string) {
  const res = await fetch(`/api/tls?host=${encodeURIComponent(host)}`, { cache: 'no-store' });
  const json = await res.json();
  // Don't throw error for PENDING status (200 response with pending status)
  if (!res.ok && json.status !== 'PENDING') {
    throw new Error(json.message || json.error || 'TLS check failed');
  }
  return json;
}

export async function contentDiscovery(url: string) {
  const res = await fetch(`/api/content?url=${encodeURIComponent(url)}`, { cache: 'no-store' });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Content discovery failed');
  return json;
}


