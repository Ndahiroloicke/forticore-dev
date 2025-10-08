# Wayback Machine API - Troubleshooting Guide

## What Changed

### Version 2.0 Updates

1. **HTTPS URLs**: Changed from `http://` to `https://` for better security and reliability
2. **Better Proxy Services**: Updated with working CORS proxies:
   - AllOrigins (reliable, fast)
   - CORSProxy.io (new, optimized for APIs)
   - CodeTabs (stable backup)
   - CORS.sh (additional fallback)

3. **Improved Logging**: Better console logs to track which method works
4. **Longer Timeouts**: Increased proxy timeout from 4s to 5s
5. **All Proxies Attempted**: Removed the `.slice(0, 2)` limitation - tries all 4 proxies

## Why Wayback API Fails

### Common Causes

1. **IP Blocking**: Wayback Machine may block Vercel's server IPs
2. **Rate Limiting**: Too many requests from the same IP
3. **Geographic Restrictions**: Some regions may have limited access
4. **API Downtime**: Wayback Machine service maintenance
5. **CORS Policies**: Browser/server CORS restrictions

## How It Works Now

### Request Flow

```
1. Try Direct Access (HTTPS)
   ├─ Success? → Return data
   └─ Fail → Try Proxy 1

2. Try AllOrigins Proxy
   ├─ Success? → Return data
   └─ Fail → Try Proxy 2

3. Try CORSProxy.io
   ├─ Success? → Return data
   └─ Fail → Try Proxy 3

4. Try CodeTabs Proxy
   ├─ Success? → Return data
   └─ Fail → Try Proxy 4

5. Try CORS.sh Proxy
   ├─ Success? → Return data
   └─ Fail → Return error with debug info
```

### Timeout Strategy

- **Availability Check**: 5 seconds (non-blocking)
- **Direct CDX Call**: 8 seconds
- **Each Proxy**: 5 seconds
- **Total Worst Case**: ~25 seconds (under 60s limit)

## Testing

### Test Locally

```bash
# Test the API endpoint
curl "http://localhost:5173/api/wayback?url=example.com&mode=urls"

# Check logs
# Look for "Trying proxy: [name]" messages
```

### Test on Vercel

1. Deploy your changes
2. Check Vercel Function Logs:
   - Go to Vercel Dashboard
   - Select your project
   - Click "Logs" tab
   - Filter by `/api/wayback`

3. Look for these log messages:
   ```
   Trying proxy: AllOrigins
   Trying proxy: CORSProxy.io
   Success with proxy: [name]
   ```

### Test Different Domains

Some domains work better than others:

**Usually Work Well:**
- `example.com` (small, simple)
- `github.com` (popular, well-archived)
- `wikipedia.org` (heavily archived)

**May Have Issues:**
- Very new domains (< 1 year old)
- Domains with anti-bot protection
- Regional/geo-restricted sites
- Adult content sites (filtered by some proxies)

## Troubleshooting

### If Still Getting Errors

#### 1. Check Vercel Logs

```bash
vercel logs --since 10m
```

Look for:
- Which proxies are being tried
- Which one succeeds/fails
- Timeout vs connection errors

#### 2. Test Proxies Manually

Try accessing Wayback directly through a proxy:

```bash
# Test AllOrigins
curl "https://api.allorigins.win/raw?url=https://web.archive.org/cdx/search/cdx?url=example.com/*&output=json&fl=original&collapse=urlkey"

# Test CORSProxy.io
curl "https://corsproxy.io/?https://web.archive.org/cdx/search/cdx?url=example.com/*&output=json&fl=original&collapse=urlkey"
```

#### 3. Rate Limiting

If you're being rate-limited:

**Solution A: Add Delay**
```typescript
// In Dashboard.tsx, before calling the API
await new Promise(resolve => setTimeout(resolve, 2000)); // 2s delay
```

**Solution B: Cache Results**
```typescript
// Store results in localStorage
const cacheKey = `wayback_${domain}`;
const cached = localStorage.getItem(cacheKey);
if (cached) return JSON.parse(cached);
```

#### 4. Alternative: Client-Side Fetching

If proxies continue to fail, fetch directly from the browser:

```typescript
// This bypasses your API and calls Wayback directly
const response = await fetch(
  `https://web.archive.org/cdx/search/cdx?url=${domain}/*&output=json&fl=original&collapse=urlkey`,
  { mode: 'cors' }
);
```

**Note**: This may fail due to CORS, but worth trying.

## Alternative Solutions

### Option 1: Use Official Wayback API

Register for an API key at:
https://archive.org/account/s3.php

Then modify the API to use authenticated requests.

### Option 2: Use Wayback Availability API Only

Instead of full CDX queries, just check if snapshots exist:

```typescript
const response = await fetch(
  `https://archive.org/wayback/available?url=${domain}`
);
```

This is more reliable but provides less data.

### Option 3: Client-Side with JSONP

Some services offer JSONP support which bypasses CORS:

```typescript
// Use a JSONP library or callback pattern
```

### Option 4: Background Jobs

For heavy usage:

1. Set up a separate background worker (Vercel Cron, etc.)
2. Pre-fetch and cache Wayback data
3. Serve from your database/cache

## Monitoring

### Check Proxy Health

Add a health check endpoint:

```typescript
// api/health.ts
export default async function handler(req, res) {
  const results = await Promise.allSettled(
    PROXY_SERVICES.map(proxy => 
      fetch(`${proxy.url}https://example.com`, { timeout: 3000 })
    )
  );
  
  return res.json({
    proxies: PROXY_SERVICES.map((p, i) => ({
      name: p.name,
      status: results[i].status
    }))
  });
}
```

### Track Success Rate

Add analytics to track which proxies work most often:

```typescript
// In your wayback.ts, add counters
const stats = {
  direct: { success: 0, fail: 0 },
  allorigins: { success: 0, fail: 0 },
  // etc...
};
```

## Performance Tips

1. **Limit Result Size**: Add `&limit=100` to CDX queries
2. **Use Collapse**: Already using `collapse=urlkey` for deduplication
3. **Cache Results**: Implement caching layer (Redis/Upstash)
4. **Parallel Requests**: Fetch multiple domains concurrently
5. **Progressive Enhancement**: Show partial results while loading

## Support & Help

If issues persist:

1. Check Wayback Machine status: https://archive.org/status
2. Join Internet Archive forums: https://archive.org/about/contact.php
3. Consider alternative services:
   - Common Crawl (https://commoncrawl.org/)
   - ArchiveBox (https://archivebox.io/)
   - WebRecorder (https://webrecorder.net/)

## Current Status

✅ Using HTTPS for better security  
✅ 4 different proxy services as fallbacks  
✅ Better error messages with debug info  
✅ Improved timeout handling  
✅ Comprehensive logging  

The API should now work more reliably! If a specific domain fails, the error message will include debug information to help diagnose the issue.
