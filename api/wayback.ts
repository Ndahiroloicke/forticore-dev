import type { VercelRequest, VercelResponse } from '@vercel/node';

const WAYBACK_CDX_URL = 'https://web.archive.org/cdx/search/cdx';
const WAYBACK_AVAILABILITY_URL = 'https://archive.org/wayback/available';

// Alternative proxy services as fallbacks (updated with working proxies)
const PROXY_SERVICES = [
  { url: 'https://api.allorigins.win/raw?url=', name: 'AllOrigins' },
  { url: 'https://corsproxy.io/?', name: 'CORSProxy.io' },
  { url: 'https://api.codetabs.com/v1/proxy?quest=', name: 'CodeTabs' },
  { url: 'https://proxy.cors.sh/', name: 'CORS.sh' }
];

export default async function (req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, mode, limit } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required.' });
  }

  try {
    // Check availability first with timeout
    const availabilityController = new AbortController();
    const availabilityTimeout = setTimeout(() => availabilityController.abort(), 5000);
    
    let availabilityData;
    try {
      const availabilityRes = await fetch(`${WAYBACK_AVAILABILITY_URL}?url=${encodeURIComponent(url)}`, {
        signal: availabilityController.signal
      });
      availabilityData = await availabilityRes.json();
    } catch (err) {
      console.log('Availability check failed, continuing without it');
      availabilityData = null;
    } finally {
      clearTimeout(availabilityTimeout);
    }

    if (mode === 'urls') {
      // Use the exact curl command format: url=example.com/*&output=json&fl=original&collapse=urlkey
      const targetUrl = url.endsWith('/*') ? url : `${url}/*`;
      const cdxUrl = `${WAYBACK_CDX_URL}?url=${encodeURIComponent(targetUrl)}&output=json&fl=original&collapse=urlkey`;
      
      // Try direct access first with timeout
      try {
        const cdxController = new AbortController();
        const cdxTimeout = setTimeout(() => cdxController.abort(), 8000);
        
        const cdxRes = await fetch(cdxUrl, {
          headers: {
            'User-Agent': 'FortiCore-Bot/1.0',
            'Accept': 'application/json'
          },
          signal: cdxController.signal
        });
        clearTimeout(cdxTimeout);

        if (cdxRes.status === 451) {
          return res.status(200).json({
            error: 'Archive indexing blocked or no recent captures for this domain.',
            closest: availabilityData?.archived_snapshots?.closest,
            urls: []
          });
        }

        if (cdxRes.ok) {
          const cdxText = await cdxRes.text();
          let cdxJson;
          try {
            cdxJson = JSON.parse(cdxText);
          } catch (e) {
            // Attempt to extract JSON array from markdown-wrapped response
            const jsonMatch = cdxText.match(/\[\[.*?\]\]/s);
            if (jsonMatch && jsonMatch[0]) {
              try {
                cdxJson = JSON.parse(jsonMatch[0]);
              } catch (innerError) {
                console.error('Failed to parse inner JSON from CDX text:', innerError);
                return res.status(500).json({ error: 'Failed to parse CDX response as JSON.', rawResponse: cdxText.substring(0, 200) });
              }
          } else {
              console.error('CDX response is not valid JSON and no JSON array found:', cdxText);
              return res.status(500).json({ error: 'CDX response is not valid JSON.', rawResponse: cdxText.substring(0, 200) });
            }
          }

          // Skip header row if present and extract only URLs (first column)
          const urlsOnly = cdxJson.slice(1).map((entry: string[]) => entry[0]);
          return res.status(200).json({ urls: urlsOnly, closest: availabilityData?.archived_snapshots?.closest });
        }
      } catch (directError: any) {
        const isTimeout = directError.name === 'AbortError' || directError.message?.includes('aborted');
        console.log(`Direct access failed${isTimeout ? ' (timeout)' : ''}, trying proxy services...`);
      }

      // Try proxy services as fallbacks (limited attempts with shorter timeout)
      for (const proxy of PROXY_SERVICES) {
        try {
          const proxyUrl = `${proxy.url}${encodeURIComponent(cdxUrl)}`;
          console.log(`Trying proxy: ${proxy.name}`);
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), 5000);
          const proxyRes = await fetch(proxyUrl, {
            headers: {
              'User-Agent': 'FortiCore-Bot/1.0',
              'Accept': 'application/json'
            },
            signal: controller.signal
          }).finally(() => clearTimeout(id));

          if (proxyRes.ok) {
            const proxyText = await proxyRes.text();
            let proxyJson;
            try {
              proxyJson = JSON.parse(proxyText);
            } catch (e) {
              // Attempt to extract JSON array from markdown-wrapped response
              const jsonMatch = proxyText.match(/\[\[.*?\]\]/s);
              if (jsonMatch && jsonMatch[0]) {
                try {
                  proxyJson = JSON.parse(jsonMatch[0]);
                } catch (innerError) {
                  console.error(`Failed to parse inner JSON from proxy ${proxy.name}:`, innerError);
                  continue; // Try next proxy
                }
              } else {
                console.error(`Proxy ${proxy.name} response is not valid JSON:`, proxyText.substring(0, 200));
                continue; // Try next proxy
              }
            }

            // Skip header row if present and extract only URLs (first column)
            const urlsOnly = proxyJson.slice(1).map((entry: string[]) => entry[0]);
            console.log(`Success with proxy: ${proxy.name}`);
            return res.status(200).json({ urls: urlsOnly, closest: availabilityData?.archived_snapshots?.closest });
          }
        } catch (proxyError: any) {
          console.log(`Proxy ${proxy.name} failed:`, proxyError.message);
          continue; // Try next proxy
        }
      }

      // All methods failed
      console.error('All Wayback access methods exhausted for URL mode');
      return res.status(503).json({ 
        error: 'Unable to retrieve Wayback data. The Wayback Machine API may be temporarily unavailable, rate-limited, or blocking requests. Try a different domain or wait a few minutes.',
        closest: availabilityData?.archived_snapshots?.closest,
        urls: [],
        debug: {
          cdxUrl: cdxUrl.substring(0, 100) + '...',
          proxiesAttempted: PROXY_SERVICES.length
        }
      });

    } else {
      // Default mode: snapshots
      const cdxUrl = `${WAYBACK_CDX_URL}?url=${encodeURIComponent(url)}&output=json&fl=timestamp,original,statuscode,mimetype,length&filter=statuscode:200&collapse=digest&sort=descending`;
      
      // Try direct access first with timeout
      try {
        const cdxController = new AbortController();
        const cdxTimeout = setTimeout(() => cdxController.abort(), 8000);
        
        const cdxRes = await fetch(cdxUrl, {
          headers: {
            'User-Agent': 'FortiCore-Bot/1.0',
            'Accept': 'application/json'
          },
          signal: cdxController.signal
        });
        clearTimeout(cdxTimeout);

        if (cdxRes.status === 451) {
          return res.status(200).json({
            error: 'Archive indexing blocked or no recent captures for this domain.',
            closest: availabilityData?.archived_snapshots?.closest,
            snapshots: []
          });
        }

        if (cdxRes.ok) {
          const cdxText = await cdxRes.text();
          let cdxJson;
          try {
            cdxJson = JSON.parse(cdxText);
          } catch (e) {
            const jsonMatch = cdxText.match(/\[\[.*?\]\]/s);
            if (jsonMatch && jsonMatch[0]) {
              try {
                cdxJson = JSON.parse(jsonMatch[0]);
              } catch (innerError) {
                console.error('Failed to parse inner JSON from CDX text:', innerError);
                return res.status(500).json({ error: 'Failed to parse CDX response as JSON.', rawResponse: cdxText.substring(0, 200) });
              }
            } else {
              console.error('CDX response is not valid JSON and no JSON array found:', cdxText);
              return res.status(500).json({ error: 'CDX response is not valid JSON.', rawResponse: cdxText.substring(0, 200) });
            }
          }

          const snapshots = cdxJson.slice(1).map((entry: string[]) => ({
            timestamp: entry[0],
            original: entry[1],
            statusCode: entry[2],
            mimetype: entry[3],
            length: entry[4],
            archiveUrl: `https://web.archive.org/web/${entry[0]}/${entry[1]}`
          }));

          return res.status(200).json({ snapshots, closest: availabilityData?.archived_snapshots?.closest });
        }
      } catch (directError: any) {
        const isTimeout = directError.name === 'AbortError' || directError.message?.includes('aborted');
        console.log(`Direct access failed for snapshots${isTimeout ? ' (timeout)' : ''}, trying proxy services...`);
      }

      // Try proxy services as fallbacks for snapshots
      for (const proxy of PROXY_SERVICES) {
        try {
          const proxyUrl = `${proxy.url}${encodeURIComponent(cdxUrl)}`;
          console.log(`Trying proxy for snapshots: ${proxy.name}`);
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), 5000);
          const proxyRes = await fetch(proxyUrl, {
            headers: {
              'User-Agent': 'FortiCore-Bot/1.0',
              'Accept': 'application/json'
            },
            signal: controller.signal
          }).finally(() => clearTimeout(id));

          if (proxyRes.ok) {
            const proxyText = await proxyRes.text();
            let proxyJson;
            try {
              proxyJson = JSON.parse(proxyText);
            } catch (e) {
              const jsonMatch = proxyText.match(/\[\[.*?\]\]/s);
              if (jsonMatch && jsonMatch[0]) {
              try {
                proxyJson = JSON.parse(jsonMatch[0]);
              } catch (innerError) {
                console.error(`Failed to parse inner JSON from proxy ${proxy.name}:`, innerError);
                continue;
              }
            } else {
              console.error(`Proxy ${proxy.name} response is not valid JSON:`, proxyText.substring(0, 200));
              continue;
            }
          }

          const snapshots = proxyJson.slice(1).map((entry: string[]) => ({
            timestamp: entry[0],
            original: entry[1],
            statusCode: entry[2],
            mimetype: entry[3],
            length: entry[4],
            archiveUrl: `https://web.archive.org/web/${entry[0]}/${entry[1]}`
          }));

          console.log(`Success with proxy for snapshots: ${proxy.name}`);
          return res.status(200).json({ snapshots, closest: availabilityData?.archived_snapshots?.closest });
        }
      } catch (proxyError: any) {
        console.log(`Proxy ${proxy.name} failed for snapshots:`, proxyError.message);
        continue;
      }
    }

      console.error('All Wayback access methods exhausted for snapshots mode');
      return res.status(503).json({ 
        error: 'Unable to retrieve Wayback snapshots. The Wayback Machine API may be temporarily unavailable, rate-limited, or blocking requests. Try a different domain or wait a few minutes.',
        closest: availabilityData?.archived_snapshots?.closest,
        snapshots: [],
        debug: {
          cdxUrl: cdxUrl.substring(0, 100) + '...',
          proxiesAttempted: PROXY_SERVICES.length
        }
      });
    }
  } catch (error: any) {
    console.error('Wayback API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
