export async function getSubdomainsFromCrt(domainInput: string): Promise<{ domain: string; total: number; subdomains: string[] }>{
  const domain = normalizeDomain(domainInput);

  // Prefer our serverless API in production; in local dev, fall back to direct proxy fetch
  const apiBase = (import.meta as any).env?.VITE_API_BASE as string | undefined;
  const isProd = typeof window !== 'undefined' && !location.hostname.includes('localhost');
  const endpoint = apiBase
    ? `${apiBase.replace(/\/$/, '')}/api/subdomains?domain=${encodeURIComponent(domain)}`
    : isProd
      ? `/api/subdomains?domain=${encodeURIComponent(domain)}`
      : '';

  if (endpoint) {
    try {
      const res = await fetch(endpoint, { cache: 'no-store' });
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        return await res.json();
      }
    } catch {}
  }

  // Fallback: fetch directly via a read-only proxy (avoids CORS)
  const wildcard = `%.${domain.replace(/^www\./,'')}`;
  const proxied = `https://r.jina.ai/http://crt.sh/?q=${encodeURIComponent(wildcard)}&output=json`;
  const text = await (await fetch(proxied, { cache: 'no-store' })).text();
  let data: any = [];
  try { data = JSON.parse(text); } catch {
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start !== -1 && end !== -1 && end > start) {
      try { data = JSON.parse(text.slice(start, end + 1)); } catch {}
    }
  }
  const names: string[] = Array.isArray(data) ? data.flatMap((r: any) => String(r?.name_value || '').split(/\n+/)) : [];
  const subdomains = [...new Set(
    names
      .map(n => n.trim().toLowerCase())
      .filter(Boolean)
      .filter(n => n.endsWith(domain))
      .filter(n => !n.includes('*'))
  )].sort();
  return { domain, total: subdomains.length, subdomains };
}

function normalizeDomain(input: string): string {
  try { return new URL(input).hostname.toLowerCase(); } catch { return input.replace(/^https?:\/\//, '').split('/')[0].toLowerCase(); }
}


