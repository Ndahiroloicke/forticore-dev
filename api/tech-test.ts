import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function (req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required.' });
  }

  try {
    // Simple test response
    return res.status(200).json({
      url: url,
      total: 2,
      technologies: [
        {
          name: 'Test Technology 1',
          category: 'Test',
          version: '1.0',
          confidence: 90,
          website: 'https://example.com',
          description: 'This is a test technology detection'
        },
        {
          name: 'Test Technology 2',
          category: 'Framework',
          version: '2.0',
          confidence: 85,
          website: 'https://example.com',
          description: 'Another test technology'
        }
      ],
      source: 'Test technology detection'
    });

  } catch (error: any) {
    console.error('Technology discovery API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
