import { Hero } from '@/components/home/Hero';
import { StatsSection } from '@/components/home/StatsCard';
import { CommandLine } from '@/components/ui/CommandLine';
import { Button } from '@/components/ui/button';
import { Shield, Terminal, FileText, ChevronRight, BarChart, Database, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const demoCommands = [
  {
    input: "ftcore version",
    output: "FortiCore v2.3.0 - Advanced Security Testing Framework",
    delay: 1000
  },
  {
    input: "ftcore scan <target>",
    output: "Starting comprehensive scan...\nInitializing modules...\nPerforming vulnerability assessment...\nAnalyzing network security...\nChecking configurations...\n\nScan complete! Found 5 potential vulnerabilities.\nReport generated: ~/forticore/reports/scan_2024-03-21.pdf",
    delay: 2000
  },
  {
    input: "ftcore report --latest",
    output: "Opening latest report...\n\n--------------------------------\nSCAN SUMMARY\n--------------------------------\nCritical: 1\nHigh: 2\nMedium: 1\nLow: 1\n\nKey Findings:\n1. [CRITICAL] Remote Code Execution Vulnerability\n2. [HIGH] Insecure SSL Configuration\n3. [HIGH] Exposed Administrative Interface\n\nFull report available at: ~/forticore/reports/scan_2024-03-21.pdf",
    delay: 1500
  }
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <Hero />
        
        <StatsSection />
        
        <section className="section-padding border-b border-border/50">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <CommandLine commands={demoCommands} autoStart={true} />
            </div>
            
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-4">
                <span className="text-gradient">Powerful</span> & <span className="text-gradient">Simple</span>
              </h2>
              <p className="text-muted-foreground mb-6">
                FortiCore provides a powerful yet easy-to-use command line interface for comprehensive security testing. 
                No complex setup or advanced technical knowledge required.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">User-Friendly Commands</h4>
                    <p className="text-sm text-muted-foreground">Simple syntax that's easy to learn and remember</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">Guided Wizards</h4>
                    <p className="text-sm text-muted-foreground">Interactive setup guides you through the process</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 mt-0.5">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium">Comprehensive Documentation</h4>
                    <p className="text-sm text-muted-foreground">Detailed help and examples available right in the CLI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="section-padding">
          <h2 className="text-3xl font-bold mb-8 text-center">About FortiCore</h2>
          
          <div className="prose prose-lg max-w-3xl mx-auto text-muted-foreground">
            <p className="mb-4">
              FortiCore is an automated Penetration Testing Tool (PTT) designed to simplify penetration testing processes. 
              It delivers a command-line-based interface for streamlined, automated vulnerability scanning, enabling 
              businesses to efficiently identify potential security threats without the need for advanced technical expertise.
            </p>
            
            <p className="mb-4">
              Whether you're a small business without dedicated security resources or an enterprise with complex infrastructure,
              FortiCore provides the tools you need to secure your systems with confidence.
            </p>
            
            <p>
              The documentation provides comprehensive guidance on installation, configuration, and usage of FortiCore 
              for both beginners and advanced users.
            </p>
          </div>
        </section>
        
        <section className="section-padding bg-purple-50 dark:bg-purple-950/10 -mx-4 px-4 rounded-lg">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-dark-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-purple-100 dark:border-purple-900/30">
              <div className="rounded-full p-2 w-fit bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-4">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-medium mb-3">User-Friendly CLI</h3>
              <p className="text-muted-foreground">
                A simple command-line interface with guided wizards makes security testing accessible to non-experts.
              </p>
            </div>
            
            <div className="bg-white dark:bg-dark-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-purple-100 dark:border-purple-900/30">
              <div className="rounded-full p-2 w-fit bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-4">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-medium mb-3">Automated Scanning</h3>
              <p className="text-muted-foreground">
                Automatically detect common vulnerabilities like SQL injection, XSS, and open ports.
              </p>
            </div>
            
            <div className="bg-white dark:bg-dark-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-purple-100 dark:border-purple-900/30">
              <div className="rounded-full p-2 w-fit bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-4">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-medium mb-3">Safe Exploitation</h3>
              <p className="text-muted-foreground">
                Non-destructive exploitation demonstrates risks without causing actual harm to systems.
              </p>
            </div>
            
            <div className="bg-white dark:bg-dark-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-purple-100 dark:border-purple-900/30">
              <div className="rounded-full p-2 w-fit bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-4">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-medium mb-3">Detailed Reporting</h3>
              <p className="text-muted-foreground">
                Generate immutable PDFs with digital signatures that provide actionable remediation steps.
              </p>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Button asChild className="bg-purple-600 hover:bg-purple-700">
              <Link to="/features">
                Explore All Features
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
