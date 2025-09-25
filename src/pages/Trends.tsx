import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type TrendResponse = {
  country: string;
  timeframe: string;
  topPorts: Array<{ port: number; count: number }>;
  topClassifications: Array<{ name: string; count: number }>;
  timeseries: Array<{ date: string; count: number }>;
};

const Trends = () => {
  const [data, setData] = useState<TrendResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/trends?country=RW`, { cache: 'no-store' });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Failed to load trends');
        setData(json as TrendResponse);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="min-h-[60vh] grid place-items-center text-muted-foreground">Loading Rwanda trends…</div>;
  if (error) return <div className="min-h-[60vh] grid place-items-center text-red-500">{error}</div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-semibold">Rwanda Internet Trends</h1>
        <p className="text-muted-foreground">Timeframe: {data.timeframe}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h2 className="font-medium mb-2">Top Targeted Ports</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topPorts}>
                <XAxis dataKey="port" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="font-medium mb-2">Top Classifications</h2>
          <ul className="space-y-2 text-sm">
            {data.topClassifications.map((c) => (
              <li key={c.name} className="flex items-center justify-between">
                <span>{c.name}</span>
                <span className="text-muted-foreground">{c.count}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="font-medium mb-2">Activity Over Time</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.timeseries}>
              <XAxis dataKey="date" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="text-xs text-muted-foreground">Source: GreyNoise (or demo data if no API key)</div>
    </div>
  );
};

export default Trends;


