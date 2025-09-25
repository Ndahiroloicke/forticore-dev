# Environment Variables

## Supabase Authentication
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Wappalyzer Technology Discovery
- `WAPPALYZER_API_KEY` - Your Wappalyzer API key (required for technology discovery)

### Getting a Wappalyzer API Key
1. Visit [Wappalyzer API](https://www.wappalyzer.com/api)
2. Sign up for an account
3. Choose a Business plan (API access requires paid plan)
4. Get your API key from the dashboard
5. Add it to your Vercel environment variables as `WAPPALYZER_API_KEY`

### Usage
Once configured, you can use the `/tech <url>` command in the dashboard to discover technologies used by any website.

Example: `/tech example.com` or `/tech https://github.com`