import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TrendItem = {
  ip?: string;
  first_seen?: string;
  last_seen?: string;
  classification?: string;
  metadata?: {
    country?: string;
    country_code?: string;
    city?: string;
    organization?: string;
    asn?: string;
    tor?: boolean;
    os?: string;
    category?: string;
    [key: string]: any;
  };
  raw_data?: {
    scan?: {
      timestamp?: string;
      port?: number;
      protocol?: string;
    };
    web?: {
      paths?: string[];
      useragents?: string[];
    };
    ja3?: string[];
    tags?: string[];
  };
};

const Trends = () => {
  const [items, setItems] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Trends component mounted, starting API call...');
    (async () => {
      try {
        console.log('Fetching /api/test...');
        const res = await fetch('/api/test', { cache: 'no-store' });
        console.log('Fetch completed, status:', res.status);
        const text = await res.text();
        console.log('Raw API response:', text);
        console.log('Response status:', res.status);
        console.log('Response headers:', Object.fromEntries(res.headers.entries()));
        
        if (!res.ok) {
          console.error('API error response:', text);
          throw new Error(`API error: ${res.status}`);
        }
        
        let data;
        try {
          data = JSON.parse(text);
          console.log('Parsed JSON data:', data);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.error('Raw text that failed to parse:', text.substring(0, 500));
          throw new Error(`Invalid JSON response: ${parseError.message}`);
        }
        
        // GreyNoise GNQL API schema: { data: [ ... ] } or { results: [ ... ] }
        let items: any[] = [];
        if (Array.isArray((data as any)?.data)) {
          items = (data as any).data;
        } else if (Array.isArray((data as any)?.results)) {
          items = (data as any).results;
        } else if (Array.isArray(data)) {
          items = data;
        }
        console.log('Extracted items:', items);
        setItems(items);
      } catch (e: any) {
        console.error('Fetch error:', e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Tag Trends</h1>
        <p className="text-muted-foreground mb-6">Rwanda IP trends via GreyNoise. Source: <a href="https://viz.greynoise.io/trends/trending" className="underline" target="_blank" rel="noreferrer">GreyNoise Trends</a>.</p>

        <div className="border-b mb-4 flex items-center gap-6 text-sm">
          <button className="py-2 border-b-2 border-white/60">Trending</button>
          <button className="py-2 text-muted-foreground">Anomalies</button>
          <button className="py-2 text-muted-foreground">Most Active</button>
          <button className="py-2 text-muted-foreground">Most Recent</button>
        </div>

        {loading && (
          <div className="py-20 text-center text-muted-foreground">Loading Rwanda trends…</div>
        )}
        {error && (
          <div className="py-4 text-sm bg-destructive/10 border border-destructive/30 rounded-md px-4">{error}</div>
        )}

        {!loading && !error && (
          <div className="space-y-3">
            {items.slice(0, 50).map((it, idx) => (
              <div key={idx} className="rounded-lg border bg-card px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-mono text-sm font-semibold">{it.ip || 'unknown'}</div>
                  <div className="text-xs px-2 py-1 rounded-full bg-muted">
                    {it.classification || 'unclassified'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <span className="font-medium">Organization:</span> {it.metadata?.organization || '-'}
                  </div>
                  <div>
                    <span className="font-medium">City:</span> {it.metadata?.city || '-'}
                  </div>
                  <div>
                    <span className="font-medium">ASN:</span> {it.metadata?.asn || '-'}
                  </div>
                  <div>
                    <span className="font-medium">OS:</span> {it.metadata?.os || '-'}
                  </div>
                </div>
                {it.raw_data?.tags && it.raw_data.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {it.raw_data.tags.slice(0, 5).map((tag, tagIdx) => (
                      <span key={tagIdx} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                        {tag}
                      </span>
                    ))}
                    {it.raw_data.tags.length > 5 && (
                      <span className="text-xs text-muted-foreground">+{it.raw_data.tags.length - 5} more</span>
                    )}
                  </div>
                )}
                <div className="mt-2 text-xs text-muted-foreground">
                  <span className="mr-4">First seen: {it.first_seen || '-'}</span>
                  <span>Last seen: {it.last_seen || '-'}</span>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-sm text-muted-foreground">No data available for Rwanda.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trends;


