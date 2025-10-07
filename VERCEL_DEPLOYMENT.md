# Vercel Deployment Guide

## Function Timeouts

### Configuration
The `vercel.json` file is configured with a 60-second timeout for all API functions:

```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 60
    }
  }
}
```

### Plan Requirements

- **Hobby Plan**: Maximum 10 seconds (free tier)
- **Pro Plan**: Maximum 60 seconds (requires subscription)

### What This Means

#### On Hobby Plan (Free)
Even though we've set `maxDuration: 60`, Vercel will enforce a 10-second limit. The API routes have been optimized to work within this constraint:

- Availability check: 5 seconds max
- Main CDX API call: 8 seconds max  
- Proxy fallbacks: 4 seconds each (max 2 attempts)
- Total: ~21 seconds worst case, but will fail fast and return results early

#### On Pro Plan
The full 60-second timeout allows for:
- More comprehensive data retrieval
- Multiple retry attempts
- Slower external API responses

### Optimization Strategies

The API has been optimized to handle the 10-second timeout:

1. **Parallel Requests**: Availability check runs independently
2. **Early Timeouts**: Each request has its own timeout
3. **Fast Failure**: Limited proxy attempts (2 instead of 4)
4. **Graceful Degradation**: Returns partial results when available

### Upgrading to Pro

If you need longer timeouts for complex queries:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → General
4. Upgrade to Pro plan
5. Redeploy your project

The existing `vercel.json` configuration will automatically use the 60-second limit.

### Troubleshooting

If you still see timeout errors after deploying these changes:

1. **Check your Vercel plan**: Confirm if you're on Hobby or Pro
2. **Monitor function logs**: Check Vercel logs for timeout patterns
3. **Test specific domains**: Some domains have more snapshots and take longer
4. **Use client-side caching**: Implement request caching in the frontend
5. **Consider pagination**: For very large result sets, implement pagination

### Alternative Solutions

If timeouts persist:

1. **Client-Side Fetching**: Call Wayback Machine API directly from the browser
2. **Background Jobs**: Use Vercel Cron or external workers for long-running tasks
3. **Caching Layer**: Implement Redis/Upstash for frequently requested data
4. **Edge Functions**: Move to Vercel Edge Functions for faster responses

## Other API Routes

The timeout configuration applies to all API routes:
- `/api/wayback` - Wayback Machine snapshots
- `/api/subdomains` - Subdomain enumeration
- `/api/headers` - Security headers analysis
- `/api/dns` - DNS lookups
- `/api/tech` - Technology fingerprinting
- `/api/robots` - Robots.txt parsing
- `/api/tls` - TLS/SSL analysis
- `/api/content` - Content discovery

All routes are optimized to complete within the timeout limits.
