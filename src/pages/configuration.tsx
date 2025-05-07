import { Link } from "react-router-dom"
import { ChevronRight, AlertTriangle, FileText } from "lucide-react"
import { CodeBlock } from "@/components/ui/CodeBlock"

const Configuration = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 lg:pl-72 max-w-full">
      <div className="">
        <div className="mb-8 sm:mb-12 animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Configuration</h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-4 sm:mb-6">
            Customize FortiCore settings to suit your security testing needs.
          </p>

          <nav className="flex overflow-x-auto pb-1" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span className="ml-1 text-xs sm:text-sm font-medium text-foreground">Configuration</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Configuration File</h2>

          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            FortiCore uses a YAML configuration file located at{" "}
            <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary text-xs sm:text-sm">
              ~/.forticore/config.yml
            </code>{" "}
            for global settings.
          </p>

          <div className="w-full">
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
              language="yaml"
            />
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 sm:p-4 flex items-start mt-4 sm:mt-6">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mt-0.5 mr-2 sm:mr-3" />
            <div>
              <h3 className="font-medium text-sm sm:text-base">Note</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Changes to the configuration file take effect after restarting FortiCore or running a new scan.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Scan Profiles</h2>

          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Create customized scan profiles for different scenarios:
          </p>

          <div className="w-full">
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
              language="yaml"
            />
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4 mb-1 sm:mb-2">To use a custom profile:</p>

          <div className="w-full">
            <CodeBlock
              code="forticore scan --target example.com --profile quick-web-scan"
              caption="Using a custom profile"
            />
          </div>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Environment Variables</h2>

          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Configure FortiCore using environment variables:
          </p>

          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium">Variable</th>
                  <th className="text-left py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium">Description</th>
                  <th className="text-left py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium">Default</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs sm:text-sm">
                <tr>
                  <td className="py-2 sm:py-3 px-3 sm:px-4">
                    <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary text-xs sm:text-sm">
                      FORTICORE_CONFIG
                    </code>
                  </td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4 text-muted-foreground">Path to config file</td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4 text-muted-foreground">~/.forticore/config.yml</td>
                </tr>
                <tr>
                  <td className="py-2 sm:py-3 px-3 sm:px-4">
                    <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary text-xs sm:text-sm">
                      FORTICORE_OUTPUT_DIR
                    </code>
                  </td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4 text-muted-foreground">Report output directory</td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4 text-muted-foreground">~/forticore-reports</td>
                </tr>
                <tr>
                  <td className="py-2 sm:py-3 px-3 sm:px-4">
                    <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary text-xs sm:text-sm">
                      FORTICORE_LOG_LEVEL
                    </code>
                  </td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4 text-muted-foreground">Logging verbosity</td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4 text-muted-foreground">info</td>
                </tr>
                <tr>
                  <td className="py-2 sm:py-3 px-3 sm:px-4">
                    <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary text-xs sm:text-sm">
                      FORTICORE_API_KEY
                    </code>
                  </td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4 text-muted-foreground">API authentication key</td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4 text-muted-foreground">None</td>
                </tr>
                <tr>
                  <td className="py-2 sm:py-3 px-3 sm:px-4">
                    <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary text-xs sm:text-sm">
                      FORTICORE_PROXY
                    </code>
                  </td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4 text-muted-foreground">HTTP/HTTPS proxy URL</td>
                  <td className="py-2 sm:py-3 px-3 sm:px-4 text-muted-foreground">None</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">CLI Configuration</h2>

          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Override any configuration setting via command-line arguments:
          </p>

          <div className="w-full">
            <CodeBlock
              code="forticore scan --target example.com --timeout 60 --threads 5 --intensity high"
              caption="Overriding configuration via CLI"
            />
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
            CLI arguments always take precedence over configuration file settings and environment variables.
          </p>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Authentication Configuration</h2>

          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Configure authentication for scanning protected resources:
          </p>

          <div className="w-full">
            <CodeBlock
              code={`# Basic authentication
ftcore scan <target> --auth basic --username user --password pass

# Token-based authentication
ftcore scan <target> --auth bearer --token <token>

# Cookie-based authentication
ftcore scan <target> --auth cookie --cookie "session=abc123"`}
              caption="Authentication configuration examples"
            />
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 sm:p-4 flex items-start mt-4 sm:mt-6">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mt-0.5 mr-2 sm:mr-3" />
            <div>
              <h3 className="font-medium text-sm sm:text-base">Security Note</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                For security reasons, avoid putting credentials directly in command-line arguments. Use environment
                variables or the interactive mode instead.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Scan Configuration Examples</h2>

          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Explore different scan configurations:
          </p>

          <div className="w-full">
            <CodeBlock
              code={`# Comprehensive scan
ftcore scan <target> comprehensive

# Quick port scan
ftcore portscan <target> quick

# Stealth scan with YAML output
ftcore portscan <target> stealth yaml

# Subdomain enumeration
ftcore subdomain <domain>`}
              caption="Scan configuration examples"
            />
          </div>
        </section>

        <section className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Next Steps</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <Link
              to="/features"
              className="glass-card p-3 sm:p-4 hover:shadow-md transition-all duration-200 flex items-center text-sm sm:text-base"
            >
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
              <span>Explore Features</span>
            </Link>

            <Link
              to="/quick-start"
              className="glass-card p-3 sm:p-4 hover:shadow-md transition-all duration-200 flex items-center text-sm sm:text-base"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary" />
              <span>Quick Start Guide</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Configuration
