import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Database, BarChart, File, Settings, ExternalLink, AlertTriangle, Code } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => (
  <div className="glass-card p-6 transition-all duration-200 hover:shadow-md animate-fade-in">
    <div className="rounded-full p-2 bg-primary/10 text-primary mb-4 self-start w-fit">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="text-xl font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const Features = () => {
  return (
    <div className="p-8 lg:pl-72">
      <div className="mb-12 animate-slide-up">
        <h1 className="text-4xl font-bold mb-4">Features</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Explore FortiCore's powerful security scanning and exploitation capabilities.
        </p>
        
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="ml-1 text-sm font-medium text-foreground">Features</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Core Capabilities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon={Shield}
            title="Automated Vulnerability Scanning"
            description="Automated discovery and assessment of security vulnerabilities across web applications, networks, servers, and more."
          />
          
          <FeatureCard
            icon={AlertTriangle}
            title="Safe Exploitation"
            description="Non-destructive exploitation that demonstrates vulnerability impacts without causing damage to target systems."
          />
          
          <FeatureCard
            icon={Database}
            title="Comprehensive Coverage"
            description="Pre-configured scans for OWASP Top 10, CWE vulnerabilities, misconfigurations, and emerging threats."
          />
          
          <FeatureCard
            icon={BarChart}
            title="Advanced Reporting"
            description="Detailed, actionable reports with severity ratings, exploitation proof, and remediation guidance prioritized by risk."
          />
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Scanning Modules</h2>
        
        <div className="space-y-6">
          <div className="glass-card p-6 transition-all duration-200 hover:shadow-md">
            <h3 className="text-xl font-medium mb-2">Web Application Scanner</h3>
            <p className="text-muted-foreground mb-4">
              Comprehensive testing for web applications, detecting vulnerabilities such as:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc list-inside ml-2">
              <li className="text-muted-foreground">Cross-Site Scripting (XSS)</li>
              <li className="text-muted-foreground">SQL Injection</li>
              <li className="text-muted-foreground">CORS Misconfiguration</li>
              <li className="text-muted-foreground">Insecure JWT Implementations</li>
              <li className="text-muted-foreground">CMS Vulnerabilities (WordPress, Drupal, Joomla, Magento)</li>
              <li className="text-muted-foreground">API Endpoint Discovery</li>
            </ul>
          </div>
          
          <div className="glass-card p-6 transition-all duration-200 hover:shadow-md">
            <h3 className="text-xl font-medium mb-2">Network Security Scanner</h3>
            <p className="text-muted-foreground mb-4">
              Thorough analysis of network infrastructure, including:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc list-inside ml-2">
              <li className="text-muted-foreground">Advanced Port Scanning</li>
              <li className="text-muted-foreground">Service Detection</li>
              <li className="text-muted-foreground">Enhanced DNS Enumeration</li>
              <li className="text-muted-foreground">Zone Transfer Analysis</li>
              <li className="text-muted-foreground">Subdomain Discovery</li>
              <li className="text-muted-foreground">Network Vulnerability Scanning</li>
            </ul>
          </div>
          
          <div className="glass-card p-6 transition-all duration-200 hover:shadow-md">
            <h3 className="text-xl font-medium mb-2">SSL/TLS Scanner</h3>
            <p className="text-muted-foreground mb-4">
              Analyzes SSL/TLS configurations to identify security issues:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc list-inside ml-2">
              <li className="text-muted-foreground">Weak Cipher Suites</li>
              <li className="text-muted-foreground">Protocol Vulnerabilities</li>
              <li className="text-muted-foreground">Certificate Validation Issues</li>
              <li className="text-muted-foreground">BEAST Vulnerability</li>
              <li className="text-muted-foreground">POODLE Vulnerability</li>
              <li className="text-muted-foreground">Heartbleed Detection</li>
            </ul>
          </div>
          
          <div className="glass-card p-6 transition-all duration-200 hover:shadow-md">
            <h3 className="text-xl font-medium mb-2">Vulnerability Scanner</h3>
            <p className="text-muted-foreground mb-4">
              Focused vulnerability detection for IP-based targets:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc list-inside ml-2">
              <li className="text-muted-foreground">FTP Anonymous Access</li>
              <li className="text-muted-foreground">SMB/Samba Vulnerabilities</li>
              <li className="text-muted-foreground">Database Exposures (MySQL, PostgreSQL, MongoDB, Redis)</li>
              <li className="text-muted-foreground">Backdoor Detection</li>
              <li className="text-muted-foreground">Service Misconfigurations</li>
              <li className="text-muted-foreground">Remote Desktop Exposures</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Exploitation Modules</h2>
        
        <div className="space-y-6 mb-8">
          <div className="glass-card p-6 transition-all duration-200 hover:shadow-md">
            <h3 className="text-xl font-medium mb-2">Safe Exploitation Framework</h3>
            <p className="text-muted-foreground mb-4">
              Non-destructive exploitation to demonstrate vulnerability impacts:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc list-inside ml-2">
              <li className="text-muted-foreground">Web Vulnerability Exploitation</li>
              <li className="text-muted-foreground">Network Vulnerability Exploitation</li>
              <li className="text-muted-foreground">SSL/TLS Exploitation</li>
              <li className="text-muted-foreground">Safe Mode (default, non-destructive)</li>
              <li className="text-muted-foreground">Automated Scan-to-Exploit Workflow</li>
              <li className="text-muted-foreground">Priority-based Exploitation</li>
            </ul>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-6">Reporting & Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon={File}
            title="PDF & Text Reports"
            description="Generate detailed reports in PDF or TXT formats with vulnerability findings, severity ratings, and remediation steps."
          />
          
          <FeatureCard
            icon={BarChart}
            title="Automatic Scan Storage"
            description="All scan results are automatically saved in the local 'scans' directory with organized naming conventions."
          />
          
          <FeatureCard
            icon={Shield}
            title="Severity Prioritization"
            description="Vulnerabilities are prioritized by severity to help focus remediation efforts on critical issues first."
          />
          
          <FeatureCard
            icon={Code}
            title="JSON Output Format"
            description="Structured JSON output for easy integration with CI/CD pipelines and custom analysis tools."
          />
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Workflow & Automation</h2>
        
        <div className="glass-card p-6 transition-all duration-200 hover:shadow-md">
          <h3 className="text-xl font-medium mb-4">Scan-to-Exploit Workflow</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 text-primary px-3 py-1 font-bold text-sm">1</div>
              <div>
                <p className="font-medium">Run Comprehensive Scan</p>
                <p className="text-sm text-muted-foreground">Identify vulnerabilities across target systems</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 text-primary px-3 py-1 font-bold text-sm">2</div>
              <div>
                <p className="font-medium">Automatic Exploitation</p>
                <p className="text-sm text-muted-foreground">FortiCore locates scan results and prioritizes exploitable vulnerabilities</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 text-primary px-3 py-1 font-bold text-sm">3</div>
              <div>
                <p className="font-medium">Generate Reports</p>
                <p className="text-sm text-muted-foreground">Create detailed PDF or TXT reports with findings and remediation guidance</p>
              </div>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            FortiCore automates the entire penetration testing workflow from discovery to exploitation to reporting. Learn more in the <Link to="/quick-start" className="text-primary hover:underline">Quick Start Guide</Link>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Features;
