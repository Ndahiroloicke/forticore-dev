import { Hero } from '@/components/home/Hero';
import { StatsSection } from '@/components/home/StatsCard';
import { CommandLine } from '@/components/ui/CommandLine';
import { Button } from '@/components/ui/button';
import { Shield, Terminal, Zap, ChevronRight, Lock, Scan, Code2, Database, Network, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const demoCommands = [
  {
    input: "ftcore scan --target example.com",
    output: "[+] Initializing FortiCore v2.3.0\n[+] Target acquired: example.com\n[~] Running subdomain enumeration...\n[~] Analyzing security headers...\n[~] Checking TLS configuration...\n\n[✓] Scan complete | 127 endpoints discovered\n[!] 3 critical findings detected\n[>] Report: ~/forticore/reports/example_com_20240321.json",
    delay: 1200
  },
  {
    input: "ftcore report --latest --format json",
    output: "{\n  \"target\": \"example.com\",\n  \"scan_date\": \"2024-03-21T14:32:01Z\",\n  \"findings\": {\n    \"critical\": 3,\n    \"high\": 7,\n    \"medium\": 12,\n    \"low\": 8\n  },\n  \"subdomains_found\": 127,\n  \"vulnerabilities\": [\n    \"Missing HSTS header\",\n    \"Weak TLS configuration\",\n    \"Information disclosure\"\n  ]\n}",
    delay: 1500
  }
];

const Index = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  
  const features = [
    { icon: Scan, title: 'Automated Scanning', desc: 'Continuous vulnerability detection' },
    { icon: Shield, title: 'Advanced Protection', desc: 'Multi-layer security analysis' },
    { icon: Code2, title: 'Tech Fingerprinting', desc: 'Identify frameworks & servers' },
    { icon: Network, title: 'Network Mapping', desc: 'Discover hidden infrastructure' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen lg:pl-72 relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Hero Section - Redesigned */}
        <section className="section-padding pt-20 pb-16">
          <div className="text-center mb-12 relative">
            {/* Glowing orb effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-purple-600/20 blur-3xl -z-10 animate-pulse" />
            
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-xs font-mono text-purple-400">SYSTEM ONLINE</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                Penetration Testing
              </span>
              <span className="block mt-2">Automated & Simplified</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Enterprise-grade security scanning that identifies vulnerabilities before attackers do. 
              <span className="block mt-2 text-purple-400 font-mono text-base">
                [ NO ADVANCED KNOWLEDGE REQUIRED ]
              </span>
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all font-mono">
                <Link to="/installation">
                  <Terminal className="mr-2 h-5 w-5" />
                  START SCANNING
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-purple-500/30 hover:bg-purple-500/10 font-mono">
                <Link to="/dashboard">
                  <Shield className="mr-2 h-5 w-5" />
                  LAUNCH DASHBOARD
                </Link>
              </Button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 rounded-lg border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">15K+</div>
                <div className="text-xs text-muted-foreground font-mono">SCANS COMPLETED</div>
              </div>
              <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5 backdrop-blur-sm">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">99.8%</div>
                <div className="text-xs text-muted-foreground font-mono">ACCURACY RATE</div>
              </div>
              <div className="p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">24/7</div>
                <div className="text-xs text-muted-foreground font-mono">MONITORING</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Command Demo Section - Enhanced */}
        <section className="section-padding border-y border-border/50 bg-gradient-to-br from-purple-950/20 to-blue-950/20 -mx-4 px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                <div className="relative">
              <CommandLine commands={demoCommands} autoStart={true} />
                </div>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 mb-4">
                <Zap className="h-3 w-3 text-purple-400" />
                <span className="text-xs font-mono text-purple-400">POWERED BY AI</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Security Testing,{' '}
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Simplified
                </span>
              </h2>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our intelligent CLI automates complex security workflows into simple commands. 
                No need to master dozens of tools—FortiCore handles it all.
              </p>
              
              <div className="space-y-3">
                {[
                  'One-command security audits',
                  'Real-time vulnerability detection',
                  'Automated report generation',
                  'Zero-config deployment'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-500/30 transition-all">
                      <ChevronRight className="h-3 w-3 text-purple-400" />
                  </div>
                    <span className="text-sm font-mono text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Grid - Redesigned */}
        <section className="section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Advanced Security Arsenal
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto font-mono text-sm">
              Military-grade penetration testing tools at your fingertips
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  activeFeature === i ? 'scale-105' : ''
                }`}
                onMouseEnter={() => setActiveFeature(i)}
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300 ${
                  activeFeature === i ? 'opacity-30' : ''
                }`}></div>
                <div className="relative h-full p-6 bg-card border border-purple-500/20 rounded-xl hover:border-purple-500/40 transition-all">
                  <div className={`inline-flex p-3 rounded-lg mb-4 transition-all ${
                    activeFeature === i 
                      ? 'bg-purple-600/30 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]' 
                      : 'bg-purple-600/10 border border-purple-500/20'
                  }`}>
                    <feature.icon className={`h-6 w-6 ${
                      activeFeature === i ? 'text-purple-400' : 'text-purple-500'
                    }`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground font-mono">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group relative p-8 rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-950/20 to-transparent hover:border-purple-500/40 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all" />
              <div className="relative">
                <Terminal className="h-10 w-10 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">User-Friendly CLI</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Simple command-line interface with guided wizards. No expertise required—just type and scan.
                </p>
              </div>
            </div>
            
            <div className="group relative p-8 rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-950/20 to-transparent hover:border-blue-500/40 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
              <div className="relative">
                <Lock className="h-10 w-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Safe Exploitation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Non-destructive testing demonstrates vulnerabilities without causing actual damage to your systems.
                </p>
              </div>
            </div>
            
            <div className="group relative p-8 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 to-transparent hover:border-cyan-500/40 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all" />
              <div className="relative">
                <Database className="h-10 w-10 text-cyan-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Comprehensive Reports</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Generate immutable PDFs with digital signatures and actionable remediation steps.
                </p>
              </div>
            </div>
            
            <div className="group relative p-8 rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 to-transparent hover:border-emerald-500/40 transition-all overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
              <div className="relative">
                <Eye className="h-10 w-10 text-emerald-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Real-Time Monitoring</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Continuous threat detection with instant alerts when vulnerabilities are discovered.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section - Enhanced */}
        <section className="section-padding">
          <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-blue-950/40 to-purple-950/40 p-12 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_70%)]" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm mb-6">
                <Shield className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-mono text-purple-400">ENTERPRISE READY</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Secure Your Infrastructure?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of security professionals using FortiCore to protect their digital assets
              </p>
              
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all font-mono">
                <Link to="/quick-start">
                  GET STARTED NOW
                  <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;