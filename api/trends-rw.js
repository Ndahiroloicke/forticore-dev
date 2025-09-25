export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const query = 'metadata.country:"Rwanda"';
  const url = `https://api.greynoise.io/v3/gnql/query?query=${encodeURIComponent(query)}`;
  const key = process.env.GREYNOISE_API_KEY || '';
  
  console.log('GreyNoise GNQL request:', { url, query, hasKey: !!key });
  
  try {
    const headers = { 'accept': 'application/json' };
    if (key) headers['Authorization'] = `Bearer ${key}`;
    
    let response = await fetch(url, { headers, cache: 'no-store' });
    let text = await response.text();
    
    console.log('Direct API response:', { 
      status: response.status, 
      textLength: text.length, 
      textStart: text.substring(0, 200) 
    });
    
    if (!response.ok || /^\s*</.test(text)) {
      console.log('Falling back to proxy...');
      // Public proxy fallback if the API requires a key or blocks
      const proxied = `https://r.jina.ai/${url}`;
      const altResponse = await fetch(proxied, { 
        headers: { accept: 'application/json' }, 
        cache: 'no-store' 
      });
      text = await altResponse.text();
      console.log('Proxy response:', { 
        status: altResponse.status, 
        textLength: text.length, 
        textStart: text.substring(0, 200) 
      });
    }
    
    let data;
    try { 
      data = JSON.parse(text); 
      console.log('Successfully parsed JSON:', { 
        dataKeys: Object.keys(data), 
        isArray: Array.isArray(data) 
      });
    } catch (parseError) { 
      console.error('JSON parse failed:', parseError);
      console.error('Raw text:', text.substring(0, 500));
      res.status(502).json({ 
        error: 'Invalid response from source', 
        details: parseError.message 
      });
      return;
    }
    
    res.status(200).json(data);
  } catch (e) {
    console.error('Handler error:', e);
    res.status(500).json({ error: e.message });
  }
}
