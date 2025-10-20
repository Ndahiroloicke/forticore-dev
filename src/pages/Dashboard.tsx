import { useAuth } from '@/hooks/useAuth';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Plus, Send, LogOut, Search, BookOpen, Bot, Folder, Globe, Link, FileSearch, Shield, Menu, X, Terminal } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getWaybackAvailability, getWaybackSnapshots, snapshotUrl, getWaybackUrlsOnly } from '@/lib/wayback';
import { fetchHeadersAudit, dnsLookup, techFingerprint, fetchRobots, fetchTlsGrade, contentDiscovery } from '@/lib/headers';
import { getSubdomainsFromCrt } from '@/lib/subdomains';

type ChatMessage = { 
  id: string; 
  role: 'user' | 'assistant'; 
  content: string; 
  code?: boolean; 
  loading?: boolean;
  timestamp?: number;
  command?: string;
  executionTime?: number;
};

const Dashboard = () => {
  const { user, signOut } = useAuth();
  type Session = { id: string; title: string; messages: ChatMessage[] };
  const STORAGE_KEY = 'forticore.sessions.v1';
  const [conversations, setConversations] = useState<Session[]>([{ id: 'c1', title: 'New session', messages: [] }]);
  const [activeId, setActiveId] = useState('c1');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    
    // Extract command type from input
    const commandMatch = text.match(/^\/(\w+)/);
    const commandType = commandMatch ? commandMatch[1].toUpperCase() : 'QUERY';
    
    const startTime = Date.now();
    const newMsg: ChatMessage = { 
      id: `m${Date.now()}`, 
      role: 'user', 
      content: text,
      timestamp: startTime,
      command: commandType
    };
    setMessages(prev => [...prev, newMsg]);
    setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages, newMsg] } : s));
    setInput('');

    // add loading indicator
    const loadingMsg: ChatMessage = { 
      id: `l${Date.now()}`, 
      role: 'assistant', 
      content: 'Analyzing…', 
      loading: true,
      timestamp: Date.now()
    };
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
          const executionTime = Date.now() - startTime;
          const reply: ChatMessage = { 
            id: `m${Date.now()}`, 
            role: 'assistant', 
            content: json, 
            code: true,
            timestamp: Date.now(),
            executionTime
          };
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
          const executionTime = Date.now() - startTime;
          const reply: ChatMessage = { 
            id: `m${Date.now()}`, 
            role: 'assistant', 
            content: json, 
            code: true,
            timestamp: Date.now(),
            executionTime
          };
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
          const executionTime = Date.now() - startTime;
          const reply: ChatMessage = { 
            id: `m${Date.now()}`, 
            role: 'assistant', 
            content: json, 
            code: true,
            timestamp: Date.now(),
            executionTime
          };
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
          const executionTime = Date.now() - startTime;
          const reply: ChatMessage = { 
            id: `m${Date.now()}`, 
            role: 'assistant', 
            content: json, 
            code: true,
            timestamp: Date.now(),
            executionTime
          };
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
          const executionTime = Date.now() - startTime;
          const reply: ChatMessage = { 
            id: `m${Date.now()}`, 
            role: 'assistant', 
            content: json, 
            code: true,
            timestamp: Date.now(),
            executionTime
          };
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
          const executionTime = Date.now() - startTime;
          const reply: ChatMessage = { 
            id: `m${Date.now()}`, 
            role: 'assistant', 
            content: json, 
            code: true,
            timestamp: Date.now(),
            executionTime
          };
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
          const executionTime = Date.now() - startTime;
          
          // Format the response based on status
          let formattedContent = '';
          if (data.status === 'READY') {
            formattedContent = `🔒 TLS Analysis Complete for ${data.host}\n\n` +
              `Source: ${data.source}\n` +
              `Summary: ${data.summary}\n\n` +
              (data.grade ? `SSL Grade: ${data.grade}\n` : '') +
              (data.httpsSupported !== undefined ? `HTTPS Supported: ${data.httpsSupported ? '✅ Yes' : '❌ No'}\n` : '') +
              (data.httpStatus ? `HTTP Status: ${data.httpStatus}\n` : '') +
              (data.finalUrl ? `Final URL: ${data.finalUrl}\n` : '') +
              (data.securityWarning ? `⚠️ Security Warning: ${data.securityWarning}\n` : '') +
              (data.note ? `\nNote: ${data.note}\n` : '') +
              `\nExecution Time: ${executionTime}ms\n\n` +
              `Full Response:\n${JSON.stringify(data, null, 2)}`;
          } else if (data.status === 'PENDING') {
            formattedContent = `⏳ TLS Analysis in Progress for ${data.host}\n\n` +
              `Status: ${data.message}\n` +
              (data.statusDetails ? `Details: ${data.statusDetails}\n` : '') +
              (data.suggestion ? `Suggestion: ${data.suggestion}\n` : '') +
              (data.hint ? `Hint: ${data.hint}\n` : '') +
              `\nExecution Time: ${executionTime}ms\n\n` +
              `Full Response:\n${JSON.stringify(data, null, 2)}`;
          } else if (data.status === 'WARNING') {
            formattedContent = `⚠️ TLS Analysis Warning for ${data.host}\n\n` +
              `Source: ${data.source}\n` +
              `Summary: ${data.summary}\n` +
              (data.securityWarning ? `Security Warning: ${data.securityWarning}\n` : '') +
              (data.suggestion ? `Suggestion: ${data.suggestion}\n` : '') +
              `\nExecution Time: ${executionTime}ms\n\n` +
              `Full Response:\n${JSON.stringify(data, null, 2)}`;
          } else if (data.status === 'ERROR') {
            formattedContent = `❌ TLS Analysis Failed for ${data.host}\n\n` +
              `Error: ${data.error || 'Unknown error'}\n` +
              `Message: ${data.message}\n` +
              (data.suggestion ? `Suggestion: ${data.suggestion}\n` : '') +
              `\nExecution Time: ${executionTime}ms\n\n` +
              `Full Response:\n${JSON.stringify(data, null, 2)}`;
          } else {
            // Fallback to raw JSON for unknown status
            formattedContent = JSON.stringify(data, null, 2);
          }
          
          const reply: ChatMessage = { 
            id: `m${Date.now()}`, 
            role: 'assistant', 
            content: formattedContent, 
            code: true,
            timestamp: Date.now(),
            executionTime
          };
          setMessages(prev => [...prev.filter(m => !m.loading), reply]);
          setConversations(prev => prev.map(s => s.id === activeId ? { ...s, messages: [...s.messages.filter(m=>!m.loading), reply] } : s));
          setLoading(false);
        } catch (e: any) {
          const err: ChatMessage = { 
            id: `m${Date.now()}`, 
            role: 'assistant', 
            content: `❌ TLS Analysis Error for ${host}\n\nError: ${e.message}\n\nPlease try again or check if the domain is accessible.` 
          };
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
          const executionTime = Date.now() - startTime;
          const reply: ChatMessage = { 
            id: `m${Date.now()}`, 
            role: 'assistant', 
            content: json, 
            code: true,
            timestamp: Date.now(),
            executionTime
          };
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
  
  // Filter conversations based on search query
  const filteredConversations = conversations.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sync theme with user preference
  useEffect(() => {
    const applyTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;
      
      if (shouldBeDark) {
    document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    // Apply theme initially
    applyTheme();

    // Listen for storage changes (theme changes from other tabs/pages)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        applyTheme();
      }
    };

    // Listen for custom theme change events
    const handleThemeChange = () => {
      applyTheme();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('themeChange', handleThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChange', handleThemeChange);
    };
  }, []);

  // Keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-focus search input when opened
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [showSearch]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0a0e1a] overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:14px_24px]" />
      </div>

      {/* Sidebar - Desktop */}
      {showSidebar && (
      <aside className="hidden md:flex flex-col w-[280px] border-r border-purple-200 dark:border-purple-500/20 bg-gray-50/95 dark:bg-[#0d1220]/80 backdrop-blur-xl h-screen overflow-hidden z-10 flex-shrink-0">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-purple-300 dark:from-purple-500/50 via-purple-200 dark:via-purple-500/20 to-transparent" />
        
        <div className="p-4 border-b border-purple-200 dark:border-purple-500/20 space-y-4">
          <div className="flex items-center gap-3 px-1">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-300 dark:bg-purple-500/30 blur-xl rounded-full animate-pulse" />
              <img src="/forticoreLogo.svg" alt="FortiCore" className="h-10 w-10 relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
          </div>
            <div>
              <h2 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                FortiCore
              </h2>
              <p className="text-[10px] text-purple-600/60 dark:text-purple-400/60 font-mono">SECURITY TERMINAL</p>
            </div>
          </div>
          
          <Button 
            size="sm" 
            className="w-full justify-start bg-purple-200 dark:bg-purple-600/20 hover:bg-purple-300 dark:hover:bg-purple-600/30 border border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 transition-all hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]" 
            onClick={addConversation}
          >
            <Plus className="h-4 w-4 mr-2" /> NEW SESSION
          </Button>
          
          <nav className="space-y-1 text-sm">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className={cn(
                "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-all group",
                showSearch 
                  ? "bg-purple-200 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300" 
                  : "hover:bg-purple-100 dark:hover:bg-purple-500/10 text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-300"
              )}
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 group-hover:text-purple-600 dark:group-hover:text-purple-400" /> 
                <span className="font-mono text-xs">SEARCH</span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-950/50 border border-purple-500/20 text-[9px] font-mono text-purple-400/60">
                <span>⌘</span>K
              </kbd>
            </button>
          </nav>
        </div>
        
        {/* Search Input */}
        {showSearch && (
          <div className="px-4 pb-3 border-b border-purple-200 dark:border-purple-500/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-8 bg-purple-50 dark:bg-purple-950/30 border-purple-300 dark:border-purple-500/30 text-xs font-mono text-gray-800 dark:text-gray-300 placeholder:text-gray-500 dark:placeholder:text-gray-600 focus-visible:ring-purple-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-purple-100 dark:hover:bg-purple-500/20 rounded transition-colors"
                >
                  <X className="h-3 w-3 text-gray-500 dark:text-gray-500" />
                </button>
              )}
        </div>
            {searchQuery && (
              <p className="text-[10px] text-purple-600 dark:text-purple-400/60 mt-2 font-mono">
                {filteredConversations.length} result{filteredConversations.length !== 1 ? 's' : ''} found
              </p>
            )}
        </div>
        )}
        
        <div className="flex-1 overflow-hidden p-2 space-y-1 custom-scrollbar">
          <p className="px-3 py-2 text-[10px] font-mono text-purple-600/60 dark:text-purple-400/40 uppercase tracking-wider">
            {searchQuery ? 'Search Results' : 'Session History'}
          </p>
          {filteredConversations.length === 0 ? (
            <div className="px-3 py-8 text-center">
              <Search className="h-8 w-8 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
              <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">No sessions found</p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-mono"
                >
                  Clear search
                </button>
              )}
                    </div>
          ) : (
            filteredConversations.map(c => (
            <button 
              key={c.id} 
              onClick={() => { setActiveId(c.id); setMessages(c.messages || []); }} 
              className={cn(
                'w-full text-left px-3 py-2 rounded-md text-xs font-mono transition-all group',
                activeId === c.id 
                  ? 'bg-purple-200 dark:bg-purple-600/20 text-purple-700 dark:text-purple-300 border-l-2 border-purple-500 shadow-md dark:shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                  : 'text-gray-500 dark:text-gray-500 hover:bg-purple-100 dark:hover:bg-purple-500/5 hover:text-purple-700 dark:hover:text-purple-400 border-l-2 border-transparent'
              )}
            >
                    <div className="flex items-center gap-2">
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  activeId === c.id ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" : "bg-gray-400 dark:bg-gray-600 group-hover:bg-purple-500"
                )} />
                <span className="truncate">
                  {searchQuery ? (
                    <>
                      {c.title.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => 
                        part.toLowerCase() === searchQuery.toLowerCase() ? (
                          <mark key={i} className="bg-purple-300 dark:bg-purple-500/30 text-purple-800 dark:text-purple-200 px-0.5 rounded">{part}</mark>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </>
                  ) : (
                    c.title
                  )}
                      </span>
                    </div>
            </button>
          )))}
                    </div>
        
        <div className="p-3 border-t border-purple-200 dark:border-purple-500/20">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 font-mono text-xs transition-all" 
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-2" /> SIGN OUT
          </Button>
                    </div>
      </aside>
      )}

      {/* Sidebar - Mobile */}
      {showSidebar && mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-full sm:w-[320px] border-r border-purple-200 dark:border-purple-500/20 bg-gray-50 dark:bg-[#0d1220] h-screen overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-purple-300 dark:from-purple-500/50 via-purple-200 dark:via-purple-500/20 to-transparent" />
            
            <div className="p-4 border-b border-purple-200 dark:border-purple-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 px-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-300 dark:bg-purple-500/30 blur-xl rounded-full animate-pulse" />
                    <img src="/forticoreLogo.svg" alt="FortiCore" className="h-10 w-10 relative z-10 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                    </div>
                  <div>
                    <h2 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                      FortiCore
                    </h2>
                    <p className="text-[10px] text-purple-600/60 dark:text-purple-400/60 font-mono">SECURITY TERMINAL</p>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-purple-100 dark:hover:bg-purple-500/10 rounded-lg transition-colors">
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <Button 
                size="sm" 
                className="w-full justify-start bg-purple-200 dark:bg-purple-600/20 hover:bg-purple-300 dark:hover:bg-purple-600/30 border border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 transition-all hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]" 
                onClick={() => {
                  addConversation();
                  setMobileMenuOpen(false);
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> NEW SESSION
              </Button>
              
              <nav className="space-y-1 text-sm">
                <button 
                  onClick={() => setShowSearch(!showSearch)}
                  className={cn(
                    "w-full flex items-center gap-2 px-3 py-2 rounded-md transition-all group",
                    showSearch 
                      ? "bg-purple-200 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300" 
                      : "hover:bg-purple-100 dark:hover:bg-purple-500/10 text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-300"
                  )}
                >
                  <Search className="h-4 w-4 group-hover:text-purple-600 dark:group-hover:text-purple-400" /> 
                  <span className="font-mono text-xs">SEARCH</span>
                </button>
              </nav>
                    </div>
            
            {/* Search Input - Mobile */}
            {showSearch && (
              <div className="px-4 pb-3 border-b border-purple-500/20">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-purple-400" />
                  <Input
                    type="text"
                    placeholder="Search sessions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 pl-9 pr-8 bg-purple-950/30 border-purple-500/30 text-xs font-mono text-gray-300 placeholder:text-gray-600 focus-visible:ring-purple-500/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-purple-500/20 rounded transition-colors"
                    >
                      <X className="h-3 w-3 text-gray-500" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <p className="text-[10px] text-purple-400/60 mt-2 font-mono">
                    {filteredConversations.length} result{filteredConversations.length !== 1 ? 's' : ''} found
                  </p>
                )}
              </div>
            )}
            
            <div className="flex-1 overflow-hidden p-2 space-y-1 custom-scrollbar">
              <p className="px-3 py-2 text-[10px] font-mono text-purple-400/40 uppercase tracking-wider">
                {searchQuery ? 'Search Results' : 'Session History'}
              </p>
              {filteredConversations.length === 0 ? (
                <div className="px-3 py-8 text-center">
                  <Search className="h-8 w-8 mx-auto mb-3 text-gray-600" />
                  <p className="text-xs text-gray-500 font-mono">No sessions found</p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="mt-2 text-xs text-purple-400 hover:text-purple-300 font-mono"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                filteredConversations.map(c => (
                <button 
                  key={c.id} 
                  onClick={() => { 
                    setActiveId(c.id); 
                    setMessages(c.messages || []); 
                    setMobileMenuOpen(false);
                  }} 
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-md text-xs font-mono transition-all group',
                    activeId === c.id 
                      ? 'bg-purple-600/20 text-purple-300 border-l-2 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.2)]' 
                      : 'text-gray-500 hover:bg-purple-500/5 hover:text-purple-400 border-l-2 border-transparent'
                  )}
                >
                    <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      activeId === c.id ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" : "bg-gray-600 group-hover:bg-purple-500"
                    )} />
                    <span className="truncate">
                      {searchQuery ? (
                        <>
                          {c.title.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => 
                            part.toLowerCase() === searchQuery.toLowerCase() ? (
                              <mark key={i} className="bg-purple-300 dark:bg-purple-500/30 text-purple-800 dark:text-purple-200 px-0.5 rounded">{part}</mark>
                            ) : (
                              <span key={i}>{part}</span>
                            )
                          )}
                        </>
                      ) : (
                        c.title
                      )}
                      </span>
                    </div>
                </button>
              )))}
            </div>
            
            <div className="p-3 border-t border-purple-500/20">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-gray-400 hover:text-red-400 hover:bg-red-500/10 font-mono text-xs transition-all" 
                onClick={signOut}
              >
                <LogOut className="h-4 w-4 mr-2" /> SIGN OUT
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Chat area */}
      <section className="flex flex-col h-screen overflow-hidden relative z-10 flex-1 min-w-0">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center px-4 py-8 overflow-y-auto">
            <div className="max-w-4xl w-full">
              {/* Hero Header */}
              <div className="text-center mb-10 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 blur-3xl -z-10" />
                <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 dark:from-purple-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent animate-gradient">
                  INITIATE SECURITY SCAN
                </h1>
                <p className="text-gray-600 dark:text-gray-400 font-mono text-sm tracking-wider">
                  [ SELECT MODULE TO BEGIN ANALYSIS ]
                </p>
              </div>

              {/* Tool Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* Subdomain Discovery */}
                <div 
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-purple-300 dark:border-purple-500/30 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/40 dark:to-blue-950/40 backdrop-blur-sm p-6 transition-all hover:border-purple-400 dark:hover:border-purple-500/60 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                  onClick={() => setInput('/subdomains ')}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-500/30 transition-all group-hover:shadow-md dark:group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                        <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400/50 bg-purple-200 dark:bg-purple-500/10 px-2 py-1 rounded">CMD</span>
                    </div>
                    <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-2 group-hover:text-purple-800 dark:group-hover:text-purple-200 transition-colors">Subdomain Discovery</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-mono">Enumerate subdomains using crt.sh certificate transparency logs</p>
                  </div>
                </div>

                {/* Wayback Lookup */}
                <div 
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-blue-300 dark:border-blue-500/30 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 backdrop-blur-sm p-6 transition-all hover:border-blue-400 dark:hover:border-blue-500/60 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                  onClick={() => setInput('/wayback ')}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-500/30 transition-all group-hover:shadow-md dark:group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400/50 bg-blue-200 dark:bg-blue-500/10 px-2 py-1 rounded">ARCHIVE</span>
                    </div>
                    <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-2 group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors">Wayback Machine</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-mono">Retrieve historical snapshots and discover hidden endpoints</p>
                  </div>
                </div>

                {/* Headers Audit */}
                <div 
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-cyan-300 dark:border-cyan-500/30 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/40 dark:to-blue-950/40 backdrop-blur-sm p-6 transition-all hover:border-cyan-400 dark:hover:border-cyan-500/60 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                  onClick={() => setInput('/headers ')}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-500/30 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-500/30 transition-all group-hover:shadow-md dark:group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                        <Link className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400/50 bg-cyan-200 dark:bg-cyan-500/10 px-2 py-1 rounded">AUDIT</span>
                    </div>
                    <h3 className="text-lg font-bold text-cyan-700 dark:text-cyan-300 mb-2 group-hover:text-cyan-800 dark:group-hover:text-cyan-200 transition-colors">Security Headers</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-mono">Analyze HSTS, CSP, X-Frame-Options and security policies</p>
                  </div>
                </div>

                {/* DNS Lookup */}
                <div 
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-emerald-300 dark:border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/40 dark:to-cyan-950/40 backdrop-blur-sm p-6 transition-all hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                  onClick={() => setInput('/dns ')}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-300 dark:border-emerald-500/30 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-500/30 transition-all group-hover:shadow-md dark:group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                        <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400/50 bg-emerald-200 dark:bg-emerald-500/10 px-2 py-1 rounded">DNS</span>
                    </div>
                    <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-300 mb-2 group-hover:text-emerald-800 dark:group-hover:text-emerald-200 transition-colors">DNS Resolution</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-mono">Query A, AAAA, CNAME, MX, TXT, NS, CAA records</p>
                  </div>
                </div>

                {/* Additional Tools */}
                {showMore && (
                  <>
                    <div 
                      className="group relative cursor-pointer overflow-hidden rounded-xl border border-orange-300 dark:border-orange-500/30 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/40 dark:to-red-950/40 backdrop-blur-sm p-6 transition-all hover:border-orange-400 dark:hover:border-orange-500/60 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]"
                      onClick={() => setInput('/tech ')}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2.5 rounded-lg bg-orange-100 dark:bg-orange-500/20 border border-orange-300 dark:border-orange-500/30 group-hover:bg-orange-200 dark:group-hover:bg-orange-500/30 transition-all">
                            <FileSearch className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                          <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400/50 bg-orange-200 dark:bg-orange-500/10 px-2 py-1 rounded">DETECT</span>
                        </div>
                        <h3 className="text-lg font-bold text-orange-700 dark:text-orange-300 mb-2">Tech Stack Analysis</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-mono">Fingerprint server, CDN, and frameworks</p>
                      </div>
                    </div>

                    <div 
                      className="group relative cursor-pointer overflow-hidden rounded-xl border border-pink-300 dark:border-pink-500/30 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/40 dark:to-purple-950/40 backdrop-blur-sm p-6 transition-all hover:border-pink-400 dark:hover:border-pink-500/60 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                      onClick={() => setInput('/robots ')}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2.5 rounded-lg bg-pink-100 dark:bg-pink-500/20 border border-pink-300 dark:border-pink-500/30 group-hover:bg-pink-200 dark:group-hover:bg-pink-500/30 transition-all">
                            <FileSearch className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                          </div>
                          <span className="text-[10px] font-mono text-pink-600 dark:text-pink-400/50 bg-pink-200 dark:bg-pink-500/10 px-2 py-1 rounded">CRAWL</span>
                        </div>
                        <h3 className="text-lg font-bold text-pink-700 dark:text-pink-300 mb-2">Robots & Sitemap</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-mono">Extract robots.txt and sitemap.xml directives</p>
                      </div>
                    </div>

                    <div 
                      className="group relative cursor-pointer overflow-hidden rounded-xl border border-red-300 dark:border-red-500/30 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/40 dark:to-orange-950/40 backdrop-blur-sm p-6 transition-all hover:border-red-400 dark:hover:border-red-500/60 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                      onClick={() => setInput('/tls ')}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2.5 rounded-lg bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-500/30 group-hover:bg-red-200 dark:group-hover:bg-red-500/30 transition-all">
                            <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                          </div>
                          <span className="text-[10px] font-mono text-red-600 dark:text-red-400/50 bg-red-200 dark:bg-red-500/10 px-2 py-1 rounded">SSL</span>
                        </div>
                        <h3 className="text-lg font-bold text-red-700 dark:text-red-300 mb-2">TLS Configuration</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-mono">Assess SSL/TLS security with SSL Labs API + basic fallback</p>
                      </div>
                    </div>

                    <div 
                      className="group relative cursor-pointer overflow-hidden rounded-xl border border-violet-300 dark:border-violet-500/30 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40 backdrop-blur-sm p-6 transition-all hover:border-violet-400 dark:hover:border-violet-500/60 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
                      onClick={() => setInput('/content ')}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2.5 rounded-lg bg-violet-100 dark:bg-violet-500/20 border border-violet-300 dark:border-violet-500/30 group-hover:bg-violet-200 dark:group-hover:bg-violet-500/30 transition-all">
                            <FileSearch className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                          </div>
                          <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400/50 bg-violet-200 dark:bg-violet-500/10 px-2 py-1 rounded">PROBE</span>
                        </div>
                        <h3 className="text-lg font-bold text-violet-700 dark:text-violet-300 mb-2">Content Discovery</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-mono">Probe for sensitive endpoints and admin panels</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Show More/Less Toggle */}
              <div className="text-center mb-6">
                <button 
                  className="text-xs font-mono text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 px-4 py-2 border border-purple-300 dark:border-purple-500/30 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-500/10 transition-all"
                  onClick={() => setShowMore(v => !v)}
                >
                  {showMore ? '[ HIDE ADVANCED TOOLS ]' : '[ SHOW ALL TOOLS ]'}
                </button>
              </div>

              {/* Command Input */}
              <div className="flex items-center gap-3 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-xl" />
                <button className="relative h-12 w-12 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-600/30 dark:to-blue-600/30 border border-purple-300 dark:border-purple-500/40 grid place-items-center hover:from-purple-200 hover:to-blue-200 dark:hover:from-purple-600/40 dark:hover:to-blue-600/40 transition-all hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                  <Plus className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </button>
                <div className="relative flex-1 h-12 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/60 dark:to-blue-950/60 border border-purple-300 dark:border-purple-500/30 backdrop-blur-sm px-5 flex items-center">
                  <span className="text-purple-600 dark:text-purple-400 font-mono text-sm mr-2">$</span>
                  <input 
                    className="bg-transparent outline-none w-full text-sm text-gray-800 dark:text-gray-300 font-mono placeholder:text-gray-400 dark:placeholder:text-gray-600" 
                    placeholder="Enter command or domain..." 
                    value={input} 
                    onChange={(e)=>setInput(e.target.value)} 
                    onKeyDown={handleKeyDown} 
                  />
                </div>
                <Button 
                  className="relative h-12 w-12 rounded-full p-0 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-purple-400/50 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all" 
                  onClick={handleSend} 
                  disabled={!input.trim()}
                >
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
            <header className="h-12 border-b border-purple-200 dark:border-purple-500/20 px-4 flex items-center justify-between text-xs font-mono text-purple-700 dark:text-purple-400/60 bg-gray-50/50 dark:bg-[#0d1220]/50 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                {showSidebar && (
                  <button 
                    onClick={() => setMobileMenuOpen(true)}
                    className="md:hidden p-2 hover:bg-purple-100 dark:hover:bg-purple-500/10 rounded-lg transition-colors -ml-2"
                  >
                    <Menu className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </button>
                )}
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                  <span className="uppercase tracking-wider">ACTIVE SESSION</span>
                </div>
              </div>
            </header>
            <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-4 custom-scrollbar">
              {messages.map(m => (
            <div key={m.id} className={cn('max-w-2xl', m.role === 'user' ? 'ml-auto' : 'mr-auto')}>
              {m.code ? (
                <div className="relative group">
                  {/* Response Header */}
                  <div className="flex items-center justify-between mb-2 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Response</span>
                      {m.executionTime && (
                        <span className="text-[10px] font-mono text-gray-500 dark:text-gray-500">• {m.executionTime}ms</span>
                      )}
                    </div>
                  <button
                      className="text-[10px] font-mono px-2 py-1 rounded bg-emerald-200 dark:bg-emerald-600/20 hover:bg-emerald-300 dark:hover:bg-emerald-600/30 border border-emerald-400 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 transition-all hover:shadow-md dark:hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                      onClick={() => {
                        navigator.clipboard.writeText(m.content);
                      }}
                    aria-label="Copy to clipboard"
                  >
                      <span className="inline-flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        COPY
                      </span>
                  </button>
                  </div>
                  
                  {/* JSON Output with Enhanced Styling */}
                  <div className="relative overflow-hidden rounded-lg border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-[#0b1220] shadow-lg dark:shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                    {/* Scan line effect */}
                    <div className="scan-line" />
                    
                    <pre className="px-4 py-4 text-xs leading-relaxed overflow-x-auto max-h-96 font-mono custom-scrollbar">
<code className="text-emerald-700 dark:text-emerald-300">{m.content}</code>
                  </pre>
                    
                    {/* Bottom gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-emerald-50 dark:from-[#0b1220] to-transparent pointer-events-none" />
                  </div>
                </div>
              ) : (
                m.loading ? (
                  <div className="relative">
                    <div className="flex items-center gap-3 rounded-lg px-5 py-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-600/10 dark:to-blue-600/10 border border-purple-300 dark:border-purple-500/30 backdrop-blur-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse"></span>
                        <span className="inline-block w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)] animate-pulse [animation-delay:150ms]"></span>
                        <span className="inline-block w-2 h-2 rounded-full bg-purple-300 shadow-[0_0_8px_rgba(168,85,247,0.4)] animate-pulse [animation-delay:300ms]"></span>
                      </div>
                      <div className="flex-1">
                        <div className="text-purple-700 dark:text-purple-300 font-mono text-sm font-semibold">PROCESSING REQUEST</div>
                        <div className="text-purple-600/70 dark:text-purple-400/60 font-mono text-[10px] mt-0.5">Executing security scan...</div>
                      </div>
                      <div className="animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full" />
                    </div>
                  </div>
                ) : (
                  m.role === 'user' ? (
                    <div className="relative group">
                      {/* Command Header */}
                      <div className="flex items-center justify-between mb-2 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-purple-600/70 dark:text-purple-400/60 uppercase tracking-wider">Command Executed</span>
                          {m.timestamp && (
                            <span className="text-[10px] font-mono text-gray-500 dark:text-gray-600">
                              {new Date(m.timestamp).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                        {m.command && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-200 dark:bg-purple-600/20 border border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-400">
                            {m.command}
                          </span>
                        )}
                      </div>
                      
                      {/* Command Message */}
                      <div className="relative overflow-hidden rounded-lg border border-purple-300 dark:border-purple-500/40 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-600/20 dark:to-blue-600/20 backdrop-blur-sm shadow-md dark:shadow-[0_0_20px_rgba(168,85,247,0.15)]">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
                        <div className="relative px-4 py-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              <Terminal className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex-1 font-mono text-sm text-gray-800 dark:text-purple-100 break-all">
                    {m.content}
                            </div>
                          </div>
                        </div>
                        {/* Glow effect on border */}
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* System Message Header */}
                      <div className="flex items-center gap-2 mb-2 px-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                        <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider">System Response</span>
                      </div>
                      
                      {/* System Message */}
                      <div className="rounded-lg px-4 py-3 bg-[#0d1220]/80 border border-blue-500/20 backdrop-blur-sm">
                        <div className="font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                          {m.content}
                        </div>
                      </div>
                  </div>
                  )
                )
              )}
                </div>
              ))}
            </div>
            <div className="border-t border-purple-500/20 p-4 bg-muted/50 dark:bg-[#0d1220]/50 backdrop-blur-sm">
              <div className="max-w-2xl mx-auto flex items-center gap-2 relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg blur-lg" />
                <div className="relative flex-1 h-11 rounded-lg bg-gradient-to-r from-purple-950/60 to-blue-950/60 border border-purple-500/30 backdrop-blur-sm px-4 flex items-center">
                  <span className="text-purple-400 font-mono text-sm mr-2">$</span>
                  <Input 
                    className="bg-transparent border-0 h-full text-sm font-mono text-gray-300 placeholder:text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 p-0" 
                    placeholder="/wayback domain.com | /subdomain domain.com | /headers url" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={handleKeyDown} 
                  />
                </div>
                <Button 
                  className="relative h-11 px-4 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 border border-purple-400/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all font-mono text-xs" 
                  onClick={handleSend} 
                  disabled={!input.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  EXECUTE
                </Button>
              </div>
              <p className="text-[10px] text-center text-purple-400/40 mt-3 font-mono tracking-wider">[ TERMINAL SESSION - LOCAL STORAGE ENABLED ]</p>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Dashboard;


