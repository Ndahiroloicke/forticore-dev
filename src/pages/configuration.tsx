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
            FortiCore scan results are automatically saved in the{" "}
            <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary text-xs sm:text-sm">
              ./scans
            </code>{" "}
            directory by default, with fallback to{" "}
            <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary text-xs sm:text-sm">
              ~/.forticore/scans/
            </code>{" "}
            or{" "}
            <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary text-xs sm:text-sm">
              /var/lib/forticore/scans/
            </code>
            .
          </p>

          <div className="w-full">
            <CodeBlock
              code={`# Scan Results Filename Format
<target>_<scan_type>_<timestamp>.json

# Example scan results locations:
./scans/example.com_web_2025-01-15_14-30-22.json
./scans/192.168.1.1_network_2025-01-15_15-45-10.json

# Report generation:
fortc report -i scan-results.json -o security-report.pdf`}
              caption="Scan results storage"
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
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Scan Types</h2>

          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            FortiCore supports multiple scan types for different scenarios:
          </p>

          <div className="w-full">
            <CodeBlock
              code={`# Web Application Scan
fortc scan -t https://example.com -s web -v

# Network Scan
fortc scan -t 192.168.1.1 -s network -o scan-results.json

# Vulnerability Scan (for IP targets)
fortc scan -t 192.168.1.100 -s vuln -v

# SSL/TLS Analysis
fortc scan -t example.com -s ssl -v

# Full/Comprehensive Port Scan
fortc scan -t example.com -s full -o scan-results.json

# Web scan with subdomain enumeration
fortc scan -t example.com -s web --scan-subdomains`}
              caption="Different scan types"
            />
          </div>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Exploitation Mode</h2>

          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            After scanning, safely exploit discovered vulnerabilities:
          </p>

          <div className="w-full">
            <CodeBlock
              code={`# Automatic exploitation from latest scan
fortc exploit -t example.com

# Specify a custom scan file
fortc exploit -t example.com --scan-file path/to/scan-results.json

# Exploit a specific vulnerability
fortc exploit -t example.com --vuln-id WEB-004

# Safe mode (default, non-destructive)
fortc exploit -t example.com --safe-mode true

# Save exploitation results
fortc exploit -t example.com -o exploit-results.json

# Generate PDF report from exploitation
fortc exploit -t example.com -o exploit-results.json --generate-report`}
              caption="Exploitation mode commands"
            />
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 sm:p-4 flex items-start mt-4 sm:mt-6">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mt-0.5 mr-2 sm:mr-3" />
            <div>
              <h3 className="font-medium text-sm sm:text-base">Security Note</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Safe mode is enabled by default. Only perform exploitation on systems you own or have explicit permission to test.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Report Generation</h2>

          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Generate comprehensive security reports from scan or exploitation results:
          </p>

          <div className="w-full">
            <CodeBlock
              code={`# Generate PDF report from scan results
fortc report -i scan-results.json -o security-report.pdf

# Generate text report
fortc report -i scan-results.json -o security-report.txt

# Generate report from exploitation results
fortc report -i exploit-results.json -o exploit-report.pdf

# Reports include:
# - Executive summary
# - Vulnerability findings with severity ratings
# - Evidence and proof of exploitation
# - Detailed remediation steps`}
              caption="Report generation commands"
            />
          </div>
        </section>

        <section className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Supported Vulnerability Types</h2>

          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            FortiCore can detect and exploit various vulnerability types:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 sm:p-4">
              <h3 className="font-medium text-sm sm:text-base mb-2">Web Vulnerabilities</h3>
              <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                <li>• XSS (WEB-001, WEB-004)</li>
                <li>• SQL Injection (WEB-002, WEB-005)</li>
                <li>• CORS Misconfiguration (WEB-003)</li>
                <li>• CMS Vulnerabilities (WEB-CMS-001)</li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 sm:p-4">
              <h3 className="font-medium text-sm sm:text-base mb-2">Network Vulnerabilities</h3>
              <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                <li>• Telnet, FTP, RDP Exposed</li>
                <li>• SMB/NetBIOS Services</li>
                <li>• Database Exposures</li>
                <li>• Redis, MongoDB, PostgreSQL</li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 sm:p-4">
              <h3 className="font-medium text-sm sm:text-base mb-2">SSL/TLS Issues</h3>
              <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                <li>• Weak Cipher Suites</li>
                <li>• Protocol Downgrade</li>
                <li>• Certificate Issues</li>
                <li>• Heartbleed Vulnerability</li>
              </ul>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 sm:p-4">
              <h3 className="font-medium text-sm sm:text-base mb-2">Other Vulnerabilities</h3>
              <ul className="text-xs sm:text-sm text-muted-foreground space-y-1">
                <li>• Anonymous FTP Access</li>
                <li>• Samba Vulnerabilities</li>
                <li>• Backdoor Detection</li>
                <li>• Service Misconfigurations</li>
              </ul>
            </div>
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
