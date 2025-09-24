import { useAuth } from '@/hooks/useAuth';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Plus, Send, LogOut, Search, BookOpen, Bot, Folder, Globe, Link, FileSearch } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getWaybackAvailability, getWaybackSnapshots, snapshotUrl, getWaybackUrlsOnly } from '@/lib/wayback';

type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string; code?: boolean };

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [conversations, setConversations] = useState<Array<{ id: string; title: string }>>([
    { id: 'c1', title: 'New chat' }
  ]);
  const [activeId, setActiveId] = useState('c1');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const addConversation = () => {
    const id = `c${Date.now()}`;
    setConversations(prev => [{ id, title: 'New chat' }, ...prev]);
    setActiveId(id);
    // Start with no messages so the centered input hero shows
    setMessages([]);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const newMsg: ChatMessage = { id: `m${Date.now()}`, role: 'user', content: text };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Slash command: /wayback <url>
    const wbMatch = text.match(/^\/(wayback)\s+(\S+)(?:\s+(\d+))?/i);
    if (wbMatch) {
      const target = wbMatch[2];
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
          setMessages(prev => [...prev, { id: `m${Date.now()}`, role: 'assistant', content: json, code: true }]);
        } catch (e: any) {
          setMessages(prev => [...prev, { id: `m${Date.now()}`, role: 'assistant', content: `Wayback error: ${e.message}` }]);
        }
      })();
      return;
    }

    // Default echo placeholder
    setTimeout(() => {
      setMessages(prev => [...prev, { id: `m${Date.now()}`, role: 'assistant', content: `You said: "${text}". (Tool execution placeholder)` }]);
    }, 400);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if ((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] h-screen gap-0 bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col border-r bg-background">
        <div className="p-3 border-b space-y-3">
          <div className="flex items-center gap-2 px-1">
            <img src="/forticoreLogo.svg" alt="FortiCore" className="h-12 w-12" />
          </div>
          <Button size="sm" className="w-full justify-start" onClick={addConversation}>
            <Plus className="h-4 w-4 mr-2" /> New chat
          </Button>
          <nav className="space-y-1 text-sm">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent">
              <Search className="h-4 w-4" /> Search chats
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
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map(c => (
            <button key={c.id} onClick={() => setActiveId(c.id)} className={cn('w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent', activeId === c.id && 'bg-accent')}>{c.title}</button>
          ))}
        </div>
        <div className="p-3 border-t">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Chat area */}
      <section className="flex flex-col h-full">
        {messages.length === 0 ? (
          <div className="flex-1 grid place-items-center px-4">
            <div className="max-w-3xl w-full">
              <h1 className="text-center text-3xl sm:text-4xl font-semibold mb-6">What are you working on?</h1>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
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
                <Card className="cursor-pointer hover:bg-accent" onClick={() => setInput('/fuzz ')}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-purple-500/15 text-purple-400 grid place-items-center">
                        <Link className="h-3.5 w-3.5" />
                      </span>
                      <CardTitle className="text-base">URL fuzzing</CardTitle>
                    </div>
                    <CardDescription>Probe paths and parameters to uncover hidden endpoints.</CardDescription>
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
                    <CardDescription>Enumerate files, directories and assets exposed by the site.</CardDescription>
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
            </div>
          </div>
        ) : (
          <>
            <header className="h-12 border-b px-4 flex items-center text-sm text-muted-foreground">Chat • Tools sandbox</header>
            <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map(m => (
            <div key={m.id} className={cn('max-w-3xl', m.role === 'user' ? 'ml-auto' : '')}>
              {m.code ? (
                <pre className="rounded-xl px-4 py-3 text-sm leading-relaxed overflow-x-auto bg-[#0b1220] text-slate-100 border border-border">
<code>{m.content}</code>
                </pre>
              ) : (
                <div className={cn('rounded-xl px-4 py-3 whitespace-pre-wrap break-words text-sm leading-relaxed', m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                  {m.content}
                </div>
              )}
                </div>
              ))}
            </div>
            <div className="border-t p-3">
              <div className="max-w-3xl mx-auto flex items-center gap-2">
                <Input placeholder="Message FortiCore… /scan /ports /report" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} />
                <Button onClick={handleSend} disabled={!input.trim()}>
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


