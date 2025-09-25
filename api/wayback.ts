import type { VercelRequest, VercelResponse } from '@vercel/node';

const WAYBACK_CDX_URL = 'http://web.archive.org/cdx/search/cdx';
const WAYBACK_AVAILABILITY_URL = 'http://archive.org/wayback/available';

// Alternative proxy services as fallbacks
const PROXY_SERVICES = [
  'https://r.jina.ai/',
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/',
  'https://api.codetabs.com/v1/proxy?quest='
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
    // Check availability first
    const availabilityRes = await fetch(`${WAYBACK_AVAILABILITY_URL}?url=${encodeURIComponent(url)}`);
    const availabilityData = await availabilityRes.json();

    if (mode === 'urls') {
      // Use the exact curl command format: url=example.com/*&output=json&fl=original&collapse=urlkey
      const targetUrl = url.endsWith('/*') ? url : `${url}/*`;
      const cdxUrl = `${WAYBACK_CDX_URL}?url=${encodeURIComponent(targetUrl)}&output=json&fl=original&collapse=urlkey`;
      
      // Try direct access first
      try {
        const cdxRes = await fetch(cdxUrl, {
          headers: {
            'User-Agent': 'FortiCore-Bot/1.0',
            'Accept': 'application/json'
          }
        });

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
      } catch (directError) {
        console.log('Direct access failed, trying proxy services...');
      }

      // Try proxy services as fallbacks
      for (const proxy of PROXY_SERVICES) {
        try {
          const proxyUrl = `${proxy}${encodeURIComponent(cdxUrl)}`;
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), 10000);
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
                  console.error(`Failed to parse inner JSON from proxy ${proxy}:`, innerError);
                  continue; // Try next proxy
                }
              } else {
                console.error(`Proxy ${proxy} response is not valid JSON:`, proxyText.substring(0, 200));
                continue; // Try next proxy
              }
            }

            // Skip header row if present and extract only URLs (first column)
            const urlsOnly = proxyJson.slice(1).map((entry: string[]) => entry[0]);
            return res.status(200).json({ urls: urlsOnly, closest: availabilityData?.archived_snapshots?.closest });
          }
        } catch (proxyError) {
          console.log(`Proxy ${proxy} failed:`, proxyError.message);
          continue; // Try next proxy
        }
      }

      // All methods failed
      return res.status(503).json({ 
        error: 'All Wayback access methods failed. The service may be temporarily unavailable or rate-limited.',
        closest: availabilityData?.archived_snapshots?.closest,
        urls: []
      });

    } else {
      // Default mode: snapshots
      const cdxUrl = `${WAYBACK_CDX_URL}?url=${encodeURIComponent(url)}&output=json&fl=timestamp,original,statuscode,mimetype,length&filter=statuscode:200&collapse=digest&sort=descending`;
      
      // Try direct access first
      try {
        const cdxRes = await fetch(cdxUrl, {
          headers: {
            'User-Agent': 'FortiCore-Bot/1.0',
            'Accept': 'application/json'
          }
        });

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
      } catch (directError) {
        console.log('Direct access failed for snapshots, trying proxy services...');
      }

      // Try proxy services as fallbacks for snapshots
      for (const proxy of PROXY_SERVICES) {
        try {
          const proxyUrl = `${proxy}${encodeURIComponent(cdxUrl)}`;
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), 10000);
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
                  console.error(`Failed to parse inner JSON from proxy ${proxy}:`, innerError);
                  continue;
                }
              } else {
                console.error(`Proxy ${proxy} response is not valid JSON:`, proxyText.substring(0, 200));
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

            return res.status(200).json({ snapshots, closest: availabilityData?.archived_snapshots?.closest });
          }
        } catch (proxyError) {
          console.log(`Proxy ${proxy} failed for snapshots:`, proxyError.message);
          continue;
        }
      }

      return res.status(503).json({ 
        error: 'All Wayback access methods failed. The service may be temporarily unavailable or rate-limited.',
        closest: availabilityData?.archived_snapshots?.closest,
        snapshots: []
      });
    }
  } catch (error: any) {
    console.error('Wayback API error:', error);
    return res.status(500).json({ error: error.message });
  }
}
