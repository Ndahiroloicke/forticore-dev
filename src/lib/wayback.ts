export type WaybackAvailability = {
  archived_snapshots?: {
    closest?: {
      available: boolean;
      status: string;
      url: string;
      timestamp: string;
    };
  };
};

export type WaybackSnapshot = {
  timestamp: string;
  original: string;
  statuscode: string;
  mimetype?: string;
  length?: string;
};

const WB_AVAILABLE = 'https://archive.org/wayback/available';
const WB_CDX = 'https://web.archive.org/cdx/search/cdx';

export async function getWaybackAvailability(targetUrl: string): Promise<WaybackAvailability> {
  const local = `/api/wayback?url=${encodeURIComponent(targetUrl)}&limit=1`;
  try {
    const res = await fetch(local);
    if (res.ok) {
      const data = await res.json();
      return data.availability as WaybackAvailability;
    }
  } catch {}
  const res = await fetch(`${WB_AVAILABLE}?url=${encodeURIComponent(targetUrl)}`);
  if (!res.ok) throw new Error(`Wayback availability failed: ${res.status}`);
  return await res.json();
}

export async function getWaybackSnapshots(targetUrl: string, limit = 10): Promise<WaybackSnapshot[]> {
  const params = new URLSearchParams({
    url: targetUrl,
    output: 'json',
    fl: 'timestamp,original,statuscode,mimetype,length',
    filter: 'statuscode:200',
    collapse: 'digest',
    sort: 'descending',
    limit: String(limit),
  });
  // Some environments hit CORS restrictions on the CDX API. Use a permissive proxy.
  const direct = `${WB_CDX}?${params.toString()}`;
  const proxied = `https://r.jina.ai/http://web.archive.org/cdx/search/cdx?${params.toString()}`;
  try {
    const local = `/api/wayback?url=${encodeURIComponent(targetUrl)}&limit=${limit}`;
    const localRes = await fetch(local);
    if (localRes.ok) {
      const data = await localRes.json();
      return (data.snapshots || []) as WaybackSnapshot[];
    }
  } catch {}
  const res = await fetch(proxied);
  if (res.status === 451) {
    // Blocked due to robots/legal restrictions – surface as empty list
    return [];
  }
  if (!res.ok) throw new Error(`Wayback CDX failed: ${res.status}`);
  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    // Some proxies return a Markdown page with a JSON array present; extract the first JSON array
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start !== -1 && end !== -1 && end > start) {
      const slice = text.slice(start, end + 1);
      data = JSON.parse(slice);
    } else {
      // Attempt a minimal cleanup (remove leading labels)
      const cleaned = text.replace(/^[^{\[]+/, '');
      data = JSON.parse(cleaned);
    }
  }
  // First row is header
  const rows: string[][] = data.slice(1);
  return rows.map((r) => ({
    timestamp: r[0],
    original: r[1],
    statuscode: r[2],
    mimetype: r[3],
    length: r[4],
  }));
}

export function snapshotUrl(ts: string, original: string) {
  return `https://web.archive.org/web/${ts}/${original}`;
}


