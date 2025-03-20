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
              <li className="text-muted-foreground">SQL Injection</li>
              <li className="text-muted-foreground">Cross-Site Scripting (XSS)</li>
              <li className="text-muted-foreground">CSRF Vulnerabilities</li>
              <li className="text-muted-foreground">Authentication Flaws</li>
              <li className="text-muted-foreground">Insecure Configurations</li>
              <li className="text-muted-foreground">Sensitive Data Exposure</li>
            </ul>
          </div>
          
          <div className="glass-card p-6 transition-all duration-200 hover:shadow-md">
            <h3 className="text-xl font-medium mb-2">Network Security Scanner</h3>
            <p className="text-muted-foreground mb-4">
              Thorough analysis of network infrastructure, including:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc list-inside ml-2">
              <li className="text-muted-foreground">Port Scanning</li>
              <li className="text-muted-foreground">Service Enumeration</li>
              <li className="text-muted-foreground">Firewall Detection</li>
              <li className="text-muted-foreground">Vulnerability Assessment</li>
              <li className="text-muted-foreground">Network Mapping</li>
              <li className="text-muted-foreground">Misconfiguration Identification</li>
            </ul>
          </div>
          
          <div className="glass-card p-6 transition-all duration-200 hover:shadow-md">
            <h3 className="text-xl font-medium mb-2">Server Assessment</h3>
            <p className="text-muted-foreground mb-4">
              Identification of server-side vulnerabilities and misconfigurations:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 list-disc list-inside ml-2">
              <li className="text-muted-foreground">OS Vulnerabilities</li>
              <li className="text-muted-foreground">Service Misconfigurations</li>
              <li className="text-muted-foreground">Default Credentials</li>
              <li className="text-muted-foreground">Outdated Software</li>
              <li className="text-muted-foreground">Privilege Escalation Paths</li>
              <li className="text-muted-foreground">Missing Security Controls</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Reporting & Analysis</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard
            icon={File}
            title="Comprehensive Reports"
            description="Generate detailed reports with vulnerability findings, evidence, severity ratings, and recommended remediation steps."
          />
          
          <FeatureCard
            icon={BarChart}
            title="Risk Visualization"
            description="Visual representation of security posture with risk scores, trends, and vulnerability distribution."
          />
          
          <FeatureCard
            icon={Shield}
            title="Compliance Mapping"
            description="Map findings to compliance frameworks like NIST, ISO 27001, GDPR, and more for regulatory alignment."
          />
          
          <FeatureCard
            icon={Code}
            title="API Access"
            description="Programmatic access to scan results through a REST API for integration with DevSecOps pipelines."
          />
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Integration & Extensions</h2>
        
        <div className="glass-card p-6 transition-all duration-200 hover:shadow-md">
          <h3 className="text-xl font-medium mb-4">Third-Party Integrations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border border-border rounded-lg p-4 text-center">
              <ExternalLink className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="font-medium">SIEM Systems</p>
            </div>
            
            <div className="border border-border rounded-lg p-4 text-center">
              <Code className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="font-medium">CI/CD Pipelines</p>
            </div>
            
            <div className="border border-border rounded-lg p-4 text-center">
              <Settings className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="font-medium">Ticketing Systems</p>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            FortiCore integrates seamlessly with your existing security infrastructure and workflows. Learn more in the <Link to="/integration" className="text-primary hover:underline">Integration Guide</Link>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Features;
