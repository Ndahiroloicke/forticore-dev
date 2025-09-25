import { useAuth } from '@/hooks/useAuth';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Plus, Send, LogOut, Search, BookOpen, Bot, Folder, Globe, Link, FileSearch, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getWaybackAvailability, getWaybackSnapshots, snapshotUrl, getWaybackUrlsOnly } from '@/lib/wayback';
import { fetchHeadersAudit, dnsLookup, techFingerprint, fetchRobots, fetchTlsGrade, contentDiscovery } from '@/lib/headers';
import { getSubdomainsFromCrt } from '@/lib/subdomains';

type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string; code?: boolean; loading?: boolean };

const Dashboard = () => {
  const { user, signOut } = useAuth();
  type Session = { id: string; title: string; messages: ChatMessage[] };
  const STORAGE_KEY = 'forticore.sessions.v1';
  const [conversations, setConversations] = useState<Session[]>([{ id: 'c1', title: 'New session', messages: [] }]);
  const [activeId, setActiveId] = useState('c1');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const toDomain = (input: string) => {
    try { return new URL(input).hostname.toLowerCase(); } catch { return input.replace(/^https?:\/\//,'').split('/')[0].toLowerCase(); }
  };

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  // Load sessions on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Session[] = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          setConversations(parsed);
          setActiveId(parsed[0].id);
          setMessages(parsed[0].messages || []);
        }
      }
    } catch {}
  }, []);

  // Persist on change
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations)); } catch {}
  }, [conversations]);

  const addConversation = () => {
    const id = `c${Date.now()}`;
    setConversations(prev => [{ id, title: 'New session', messages: [] }, ...prev]);
    setActiveId(id);
    // Start with no messages so the centered input hero shows
    setMessages([]);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const newMsg: ChatMessage = { id: `m${Date.now()}`, role: 'user', content: text };
    setMessages(prev => [...prev, newMsg]);
    setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages, newMsg] } : s));
    setInput('');

    // add loading indicator
    const loadingMsg: ChatMessage = { id: `l${Date.now()}`, role: 'assistant', content: 'Analyzing…', loading: true };
    setLoading(true);
    setMessages(prev => [...prev, loadingMsg]);
    setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages, loadingMsg] } : s));

    // Slash command: /wayback <url>
    const wbMatch = text.match(/^\/(wayback)\s+(\S+)(?:\s+(\d+))?/i);
    if (wbMatch) {
      const target = wbMatch[2];
      const domainTitle = toDomain(target);
      setConversations(prev => prev.map(s => s.id === activeId ? { ...s, title: domainTitle || s.title } : s));
      const lim = wbMatch[3] ? parseInt(wbMatch[3], 10) : 50;
      (async () => {
        try {
          const urls = await getWaybackUrlsOnly(target, lim);
          const format = (list: string[], max = 5) => list.slice(0, max).map((u) => `- ${u}`);
          const toUrl = (u: string) => { try { return new URL(u); } catch { return null as any; } };
          const parsed = urls.map(toUrl).filter(Boolean);
          const withParams = parsed.filter(u => u.search && u.search.length > 1).map(u => u.toString());
          const byExt = (exts: string[]) => parsed.filter(u => {
            const m = u.pathname.match(/\.([a-z0-9]+)$/i); return m ? exts.includes(m[1].toLowerCase()) : false;
          }).map(u => u.toString());
          const docs = byExt(['pdf','doc','docx','xls','xlsx','csv']);
          const archives = byExt(['zip','tar','gz','bz2','7z']);
          const configs = byExt(['json','xml','yaml','yml','ini','env','conf']);
          const interesting = [
            ...withParams,
            ...parsed.filter(u => /admin|login|config|backup|export|api|download/i.test(u.pathname)).map(u=>u.toString())
          ];
          // Top directories
          const dirKey = (u: URL) => u.pathname.split('?')[0].split('/').slice(0,3).join('/') || '/';
          const dirCount = new Map<string, number>();
          for (const u of parsed) dirCount.set(dirKey(u), (dirCount.get(dirKey(u))||0)+1);
          const topDirs = [...dirCount.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5);

          const payload = {
            target: target.replace(/\/*$/, ''),
            total: urls.length,
            topDirectories: topDirs.map(([path, count]) => ({ path, count })),
            urlsWithParams: withParams.slice(0, 50),
            documents: docs.slice(0, 50),
            archives: archives.slice(0, 50),
            configOrData: configs.slice(0, 50),
            interestingEndpoints: [...new Set(interesting)].slice(0, 50),
          };
          const json = JSON.stringify(payload, null, 2);
          const reply: ChatMessage = { id: `m${Date.now()}`, role: 'assistant', content: json, code: true };
          setMessages(prev => [...prev.filter(m => !m.loading), reply]);
          setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), reply] } : s));
          setLoading(false);
        } catch (e: any) {
          const errText = e?.message?.includes('Unexpected end of JSON input')
            ? 'Wayback error: Received an incomplete response. Please try again or reduce the limit.'
            : `Wayback error: ${e.message}`;
          const err: ChatMessage = { id: `m${Date.now()}`, role: 'assistant', content: errText };
          setMessages(prev => [...prev.filter(m => !m.loading), err]);
          setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), err] } : s));
          setLoading(false);
        }
      })();
      return;
    }

    // Slash command: /subdomain <domain>
    const sdMatch = text.match(/^\/(subdomain|subdomains)\s+(\S+)/i);
    if (sdMatch) {
      const domain = sdMatch[2];
      const domainTitle = toDomain(domain);
      setConversations(prev => prev.map(s => s.id === activeId ? { ...s, title: domainTitle || s.title } : s));
      (async () => {
        try {
          const data = await getSubdomainsFromCrt(domain);
          const json = JSON.stringify(data, null, 2);
          const reply: ChatMessage = { id: `m${Date.now()}`, role: 'assistant', content: json, code: true };
          setMessages(prev => [...prev.filter(m => !m.loading), reply]);
          setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), reply] } : s));
          setLoading(false);
        } catch (e: any) {
          const msg = e?.message?.includes('Invalid response')
            ? 'Subdomain error: crt.sh returned an invalid response. Please wait a moment and retry.'
            : `Subdomain error: ${e.message}`;
          const err: ChatMessage = { id: `m${Date.now()}`, role: 'assistant', content: msg };
          setMessages(prev => [...prev.filter(m => !m.loading), err]);
          setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), err] } : s));
          setLoading(false);
        }
      })();
      return;
    }

    // Slash command: /headers <url>
    const hMatch = text.match(/^\/(headers)\s+(\S+)/i);
    if (hMatch) {
      const target = hMatch[2];
      const domainTitle = toDomain(target);
      setConversations(prev => prev.map(s => s.id === activeId ? { ...s, title: domainTitle || s.title } : s));
      (async () => {
        try {
          const data = await fetchHeadersAudit(target);
          const json = JSON.stringify(data, null, 2);
          const reply: ChatMessage = { id: `m${Date.now()}`, role: 'assistant', content: json, code: true };
          setMessages(prev => [...prev.filter(m => !m.loading), reply]);
          setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), reply] } : s));
          setLoading(false);
        } catch (e: any) {
          const err: ChatMessage = { id: `m${Date.now()}`, role: 'assistant', content: `Headers error: ${e.message}` };
          setMessages(prev => [...prev.filter(m => !m.loading), err]);
          setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), err] } : s));
          setLoading(false);
        }
      })();
      return;
    }

    // Slash command: /dns <name> [type]
    const dMatch = text.match(/^\/(dns)\s+(\S+)(?:\s+(A|AAAA|CNAME|MX|TXT|NS|CAA))?/i);
    if (dMatch) {
      const name = dMatch[2];
      const qtype = dMatch[3] || 'A';
      (async () => {
        try {
          const data = await dnsLookup(name, qtype);
          const json = JSON.stringify(data, null, 2);
          const reply: ChatMessage = { id: `m${Date.now()}`, role: 'assistant', content: json, code: true };
          setMessages(prev => [...prev.filter(m => !m.loading), reply]);
          setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), reply] } : s));
          setLoading(false);
        } catch (e: any) {
          const err: ChatMessage = { id: `m${Date.now()}`, role: 'assistant', content: `DNS error: ${e.message}` };
          setMessages(prev => [...prev.filter(m => !m.loading), err]);
          setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), err] } : s));
          setLoading(false);
        }
      })();
      return;
    }

    // Slash command: /tech <url>
    const tMatch = text.match(/^\/(tech)\s+(\S+)/i);
    if (tMatch) {
      const target = tMatch[2];
      const domainTitle = toDomain(target);
      setConversations(prev => prev.map(s => s.id === activeId ? { ...s, title: domainTitle || s.title } : s));
      (async () => {
        try {
          const data = await techFingerprint(target);
          const json = JSON.stringify(data, null, 2);
          const reply: ChatMessage = { id: `m${Date.now()}`, role: 'assistant', content: json, code: true };
          setMessages(prev => [...prev.filter(m => !m.loading), reply]);
          setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), reply] } : s));
          setLoading(false);
        } catch (e: any) {
          const err: ChatMessage = { id: `m${Date.now()}`, role: 'assistant', content: `Tech error: ${e.message}` };
          setMessages(prev => [...prev.filter(m => !m.loading), err]);
          setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), err] } : s));
          setLoading(false);
        }
      })();
      return;
    }

    // Slash command: /robots <url>
    const rMatch = text.match(/^\/(robots)\s+(\S+)/i);
    if (rMatch) {
      const target = rMatch[2];
      const domainTitle = toDomain(target);
      setConversations(prev => prev.map(s => s.id === activeId ? { ...s, title: domainTitle || s.title } : s));
      (async () => {
        try {
          const data = await fetchRobots(target);
          const json = JSON.stringify(data, null, 2);
          const reply: ChatMessage = { id: `m${Date.now()}`, role: 'assistant', content: json, code: true };
          setMessages(prev => [...prev.filter(m => !m.loading), reply]);
          setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), reply] } : s));
          setLoading(false);
        } catch (e: any) {
          const err: ChatMessage = { id: `m${Date.now()}`, role: 'assistant', content: `Robots error: ${e.message}` };
          setMessages(prev => [...prev.filter(m => !m.loading), err]);
          setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), err] } : s));
          setLoading(false);
        }
      })();
      return;
    }

    // Slash command: /tls <host>
    const tlsMatch = text.match(/^\/(tls)\s+(\S+)/i);
    if (tlsMatch) {
      const host = tlsMatch[2];
      (async () => {
        try {
          const data = await fetchTlsGrade(host);
          const json = JSON.stringify(data, null, 2);
          const reply: ChatMessage = { id: `m${Date.now()}`, role: 'assistant', content: json, code: true };
          setMessages(prev => [...prev.filter(m => !m.loading), reply]);
          setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), reply] } : s));
          setLoading(false);
        } catch (e: any) {
          const err: ChatMessage = { id: `m${Date.now()}`, role: 'assistant', content: `TLS error: ${e.message}` };
          setMessages(prev => [...prev.filter(m => !m.loading), err]);
          setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), err] } : s));
          setLoading(false);
        }
      })();
      return;
    }

    // Slash command: /content <url>
    const cMatch = text.match(/^\/(content)\s+(\S+)/i);
    if (cMatch) {
      const target = cMatch[2];
      const domainTitle = toDomain(target);
      setConversations(prev => prev.map(s => s.id === activeId ? { ...s, title: domainTitle || s.title } : s));
      (async () => {
        try {
          const data = await contentDiscovery(target);
          const json = JSON.stringify(data, null, 2);
          const reply: ChatMessage = { id: `m${Date.now()}`, role: 'assistant', content: json, code: true };
          setMessages(prev => [...prev.filter(m => !m.loading), reply]);
          setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), reply] } : s));
          setLoading(false);
        } catch (e: any) {
          const err: ChatMessage = { id: `m${Date.now()}`, role: 'assistant', content: `Content discovery error: ${e.message}` };
          setMessages(prev => [...prev.filter(m => !m.loading), err]);
          setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), err] } : s));
          setLoading(false);
        }
      })();
      return;
    }

    // Default echo placeholder
    setTimeout(() => {
      const reply: ChatMessage = { id: `m${Date.now()}`, role: 'assistant', content: `You said: "${text}". (Tool execution placeholder)` };
      setMessages(prev => [...prev.filter(m => !m.loading), reply]);
      setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), reply] } : s));
      setLoading(false);
    }, 400);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if ((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showSidebar = messages.length > 0;
  // Force dark theme for dashboard
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {};
  }, []);

  return (
    <div className={cn('grid h-screen gap-0 bg-background overflow-hidden dark', showSidebar ? 'grid-cols-1 md:grid-cols-[260px_1fr]' : 'grid-cols-1')}>
      {/* Sidebar */}
      {showSidebar && (
      <aside className="hidden md:flex flex-col border-r bg-background sticky top-0 h-screen overflow-hidden">
        <div className="p-3 border-b space-y-3">
          <div className="flex items-center gap-2 px-1">
            <img src="/forticoreLogo.svg" alt="FortiCore" className="h-12 w-12" />
          </div>
          <Button size="sm" className="w-full justify-start" onClick={addConversation}>
            <Plus className="h-4 w-4 mr-2" /> New session
          </Button>
          <nav className="space-y-1 text-sm">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent">
              <Search className="h-4 w-4" /> Search sessions
            </button>
            {/* <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent">
              <BookOpen className="h-4 w-4" /> Library
            </button> */}
            {/* <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent">
              <Bot className="h-4 w-4" /> GPTs
            </button> */}
            {/* <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent">
              <Folder className="h-4 w-4" /> Projects
            </button> */}
          </nav>
        </div>
        <div className="flex-1 overflow-hidden p-2 space-y-1">
          {conversations.map(c => (
            <button key={c.id} onClick={() => { setActiveId(c.id); setMessages(c.messages || []); }} className={cn('w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent', activeId === c.id && 'bg-accent')}>{c.title}</button>
          ))}
        </div>
        <div className="p-3 border-t">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      )}

      {/* Chat area */}
      <section className="flex flex-col h-screen overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 grid place-items-center px-4">
            <div className="max-w-3xl w-full">
              <h1 className="text-center text-3xl sm:text-4xl font-semibold mb-6">What are you working on?</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Card className="cursor-pointer hover:bg-accent" onClick={() => setInput('/subdomains ')}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-purple-500/15 text-purple-400 grid place-items-center">
                        <Globe className="h-3.5 w-3.5" />
                      </span>
                      <CardTitle className="text-base">Subdomain discovery</CardTitle>
                    </div>
                    <CardDescription>Find subdomains for a target domain using multiple sources.</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:bg-accent" onClick={() => setInput('/wayback ')}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-purple-500/15 text-purple-400 grid place-items-center">
                        <BookOpen className="h-3.5 w-3.5" />
                      </span>
                      <CardTitle className="text-base">Wayback lookup</CardTitle>
                    </div>
                    <CardDescription>Check archived snapshots and quickly open the closest capture.</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:bg-accent" onClick={() => setInput('/headers ')}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-purple-500/15 text-purple-400 grid place-items-center">
                        <Link className="h-3.5 w-3.5" />
                      </span>
                      <CardTitle className="text-base">Headers audit</CardTitle>
                    </div>
                    <CardDescription>Check HSTS, CSP, XFO and more for a target URL.</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:bg-accent" onClick={() => setInput('/dns ')}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-purple-500/15 text-purple-400 grid place-items-center">
                        <Globe className="h-3.5 w-3.5" />
                      </span>
                      <CardTitle className="text-base">DNS lookup</CardTitle>
                    </div>
                    <CardDescription>Resolve A/AAAA/CNAME/MX/TXT/NS/CAA records via Google DNS.</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:bg-accent" onClick={() => setInput('/tech ')}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-purple-500/15 text-purple-400 grid place-items-center">
                        <FileSearch className="h-3.5 w-3.5" />
                      </span>
                      <CardTitle className="text-base">Tech fingerprint</CardTitle>
                    </div>
                    <CardDescription>Detect server, CDN and framework from headers/HTML.</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:bg-accent" onClick={() => setInput('/robots ')}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-purple-500/15 text-purple-400 grid place-items-center">
                        <FileSearch className="h-3.5 w-3.5" />
                      </span>
                      <CardTitle className="text-base">robots/sitemap</CardTitle>
                    </div>
                    <CardDescription>Fetch robots.txt and sitemap.xml for crawl hints.</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:bg-accent" onClick={() => setInput('/tls ')}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-purple-500/15 text-purple-400 grid place-items-center">
                        <Shield className="h-3.5 w-3.5" />
                      </span>
                      <CardTitle className="text-base">TLS grade</CardTitle>
                    </div>
                    <CardDescription>Check HTTPS configuration via SSL Labs public API.</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="cursor-pointer hover:bg-accent" onClick={() => setInput('/content ')}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-purple-500/15 text-purple-400 grid place-items-center">
                        <FileSearch className="h-3.5 w-3.5" />
                      </span>
                      <CardTitle className="text-base">Content discovery</CardTitle>
                    </div>
                    <CardDescription>Probe common endpoints like robots, sitemap, admin, backups.</CardDescription>
                  </CardHeader>
                </Card>
              </div>
              <div className="flex items-center gap-2">
                <button className="h-11 w-11 rounded-full bg-muted grid place-items-center"><Plus className="h-5 w-5" /></button>
                <div className="flex-1 h-11 rounded-full bg-muted px-4 flex items-center">
                  <input className="bg-transparent outline-none w-full text-sm" placeholder="Ask anything" value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={handleKeyDown} />
                </div>
                <Button className="h-11 w-11 rounded-full p-0" onClick={handleSend} disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {/* <div className="mt-12 text-center">
                <a
                  className="text-sm font-medium text-foreground/90 underline decoration-purple-600 decoration-2 underline-offset-4 hover:opacity-90 inline-flex items-center gap-1"
                  href="/trends"
                >
                  Explore Trends <span>→</span>
                </a>
              </div> */}
            </div>
          </div>
        ) : (
          <>
            <header className="h-10 border-b px-4 flex items-center text-xs text-muted-foreground">Tools workspace</header>
            <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {messages.map(m => (
            <div key={m.id} className={cn('max-w-2xl', m.role === 'user' ? 'ml-auto' : '')}>
              {m.code ? (
                <div className="relative">
                  <button
                    className="absolute right-2 top-2 z-10 text-[10px] px-2 py-0.5 rounded-md bg-muted hover:bg-muted/80 border"
                    onClick={() => navigator.clipboard.writeText(m.content)}
                    aria-label="Copy to clipboard"
                  >
                    Copy
                  </button>
                  <pre className="rounded-lg px-3 py-2 text-xs leading-relaxed overflow-x-auto max-h-96 bg-[#0b1220] text-slate-100 border border-border">
<code>{m.content}</code>
                  </pre>
                </div>
              ) : (
                m.loading ? (
                  <div className="rounded-lg px-3 py-2 bg-muted/70 flex items-center gap-1.5 text-xs">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="inline-block w-2 h-2 rounded-full bg-primary/80 animate-pulse [animation-delay:150ms]"></span>
                    <span className="inline-block w-2 h-2 rounded-full bg-primary/60 animate-pulse [animation-delay:300ms]"></span>
                  </div>
                ) : (
                  <div className={cn('rounded-lg px-3 py-2 whitespace-pre-wrap break-words text-[13px] leading-relaxed', m.role === 'user' ? 'bg-primary/90 text-primary-foreground' : 'bg-muted/70')}> 
                    {m.content}
                  </div>
                )
              )}
                </div>
              ))}
            </div>
            <div className="border-t p-3">
              <div className="max-w-2xl mx-auto flex items-center gap-2">
                <Input className="h-10 text-sm" placeholder="Message FortiCore… /wayback domain.com /subdomain domain.com" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} />
                <Button className="h-10 px-3" onClick={handleSend} disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-[10px] text-center text-muted-foreground mt-2">This is a demo workspace. Messages are not persisted yet.</p>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Dashboard;


