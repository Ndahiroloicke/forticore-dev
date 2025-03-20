
import { Link } from 'react-router-dom';
import { ChevronRight, Settings, AlertTriangle, FileText } from 'lucide-react';
import { CodeBlock } from '@/components/ui/CodeBlock';

const Configuration = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12 animate-slide-up">
        <h1 className="text-4xl font-bold mb-4">Configuration</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Customize FortiCore settings to suit your security testing needs.
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
                <span className="ml-1 text-sm font-medium text-foreground">Configuration</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Configuration File</h2>
        
        <p className="text-muted-foreground mb-4">
          FortiCore uses a YAML configuration file located at <code className="bg-primary/10 px-2 py-1 rounded text-primary">~/.forticore/config.yml</code> for global settings.
        </p>
        
        <CodeBlock
          code={`# FortiCore Configuration
version: 1.0

# General Settings
general:
  output_dir: "~/forticore-reports"
  log_level: "info"  # debug, info, warning, error
  auto_update: true
  
# Scan Settings
scan:
  default_timeout: 300  # seconds
  max_threads: 10
  default_intensity: "medium"  # low, medium, high
  
# Reporting
reporting:
  default_format: "pdf"  # pdf, html, json, xml
  include_evidence: true
  include_remediation: true
  
# Network Settings
network:
  max_retries: 3
  request_timeout: 30  # seconds
  user_agent: "FortiCore Scanner/1.0"
  
# API Settings
api:
  enabled: false
  port: 8080
  require_auth: true`}
          caption="Example configuration file"
        />
        
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex items-start mt-6">
          <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
          <div>
            <h3 className="font-medium">Note</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Changes to the configuration file take effect after restarting FortiCore or running a new scan.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Scan Profiles</h2>
        
        <p className="text-muted-foreground mb-4">
          Create customized scan profiles for different scenarios:
        </p>
        
        <CodeBlock
          code={`# Save as ~/.forticore/profiles/quick-web-scan.yml
name: "Quick Web Application Scan"
description: "Fast scan for common web vulnerabilities"
type: "webapp"

settings:
  timeout: 120
  intensity: "low"
  
modules:
  - xss
  - sqli
  - csrf
  
exclude:
  - brute_force
  - dos_testing`}
          caption="Example scan profile"
        />
        
        <p className="text-muted-foreground mt-4 mb-2">To use a custom profile:</p>
        
        <CodeBlock
          code="forticore scan --target example.com --profile quick-web-scan"
          caption="Using a custom profile"
        />
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Environment Variables</h2>
        
        <p className="text-muted-foreground mb-4">
          Configure FortiCore using environment variables:
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-4 font-medium">Variable</th>
                <th className="text-left py-2 px-4 font-medium">Description</th>
                <th className="text-left py-2 px-4 font-medium">Default</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="py-3 px-4"><code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">FORTICORE_CONFIG</code></td>
                <td className="py-3 px-4 text-muted-foreground">Path to config file</td>
                <td className="py-3 px-4 text-muted-foreground">~/.forticore/config.yml</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">FORTICORE_OUTPUT_DIR</code></td>
                <td className="py-3 px-4 text-muted-foreground">Report output directory</td>
                <td className="py-3 px-4 text-muted-foreground">~/forticore-reports</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">FORTICORE_LOG_LEVEL</code></td>
                <td className="py-3 px-4 text-muted-foreground">Logging verbosity</td>
                <td className="py-3 px-4 text-muted-foreground">info</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">FORTICORE_API_KEY</code></td>
                <td className="py-3 px-4 text-muted-foreground">API authentication key</td>
                <td className="py-3 px-4 text-muted-foreground">None</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">FORTICORE_PROXY</code></td>
                <td className="py-3 px-4 text-muted-foreground">HTTP/HTTPS proxy URL</td>
                <td className="py-3 px-4 text-muted-foreground">None</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">CLI Configuration</h2>
        
        <p className="text-muted-foreground mb-4">
          Override any configuration setting via command-line arguments:
        </p>
        
        <CodeBlock
          code="forticore scan --target example.com --timeout 60 --threads 5 --intensity high"
          caption="Overriding configuration via CLI"
        />
        
        <p className="text-muted-foreground mt-4">
          CLI arguments always take precedence over configuration file settings and environment variables.
        </p>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Authentication Configuration</h2>
        
        <p className="text-muted-foreground mb-4">
          Configure authentication for scanning protected resources:
        </p>
        
        <CodeBlock
          code={`# Basic authentication
ftcore scan --target https://example.com --auth-type basic --username user --password pass

# Token-based authentication
ftcore scan --target https://example.com/api --auth-type bearer --token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Cookie-based authentication
ftcore scan --target https://example.com --auth-type cookie --cookie "session=abc123; user=admin"`}
          caption="Authentication configuration examples"
        />
        
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex items-start mt-6">
          <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
          <div>
            <h3 className="font-medium">Security Note</h3>
            <p className="text-sm text-muted-foreground mt-1">
              For security reasons, avoid putting credentials directly in command-line arguments. Use environment variables or the interactive mode instead.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-4">
        <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            to="/features" 
            className="glass-card p-4 hover:shadow-md transition-all duration-200 flex items-center"
          >
            <FileText className="h-5 w-5 mr-2 text-primary" />
            <span>Explore Features</span>
          </Link>
          
          <Link 
            to="/integration" 
            className="glass-card p-4 hover:shadow-md transition-all duration-200 flex items-center"
          >
            <Settings className="h-5 w-5 mr-2 text-primary" />
            <span>Integration Guide</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Configuration;
