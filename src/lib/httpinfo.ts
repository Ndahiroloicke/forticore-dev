export type HttpInfo = {
  url: string;
  status: number;
  headers: Record<string, string>;
  bodySample: string;
};

export async function fetchHttpInfo(target: string): Promise<HttpInfo> {
  const res = await fetch(`/api/httpinfo?url=${encodeURIComponent(target)}`, { cache: 'no-store' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'httpinfo failed');
  return data as HttpInfo;
}

export function analyzeSecurityHeaders(headers: Record<string, string>) {
  const get = (k: string) => headers[k.toLowerCase()];
  const report: Array<{ name: string; present: boolean; value?: string }> = [];
  const required = [
    'strict-transport-security',
    'content-security-policy',
    'x-frame-options',
    'x-content-type-options',
    'referrer-policy',
    'permissions-policy',
  ];
  for (const h of required) {
    const v = get(h);
    report.push({ name: h, present: !!v, value: v });
  }
  return report;
}

export function extractRobots(sample: string) {
  if (/Disallow:/i.test(sample) || /User-agent:/i.test(sample)) return sample;
  return '';
}

export function detectTech(headers: Record<string, string>, body: string) {
  const tech: string[] = [];
  const add = (t: string) => { if (!tech.includes(t)) tech.push(t); };
  const h = (k: string) => headers[k.toLowerCase()] || '';
  if (/wp-content|wp-includes/i.test(body)) add('WordPress');
  if (/Drupal.settings|drupal/i.test(body)) add('Drupal');
  if (/x-powered-by/i.test(JSON.stringify(headers))) add(h('x-powered-by'));
  if (/react|next\./i.test(body)) add('React/Next');
  if (/vue|nuxt/i.test(body)) add('Vue/Nuxt');
  if (/angular/i.test(body)) add('Angular');
  if (/cloudflare/i.test(h('server'))) add('Cloudflare');
  if (/nginx/i.test(h('server'))) add('Nginx');
  if (/apache/i.test(h('server'))) add('Apache');
  return tech.filter(Boolean);
}


