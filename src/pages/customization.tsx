
import { Link } from 'react-router-dom';
import { ChevronRight, Code, FileText, Package, Puzzle, Terminal, Settings } from 'lucide-react';
import { CodeBlock } from '@/components/ui/CodeBlock';

const Customization = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12 animate-slide-up">
        <h1 className="text-4xl font-bold mb-4">Customization</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Extend FortiCore's capabilities with plugins, custom scripts, and more.
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
                <span className="ml-1 text-sm font-medium text-foreground">Customization</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Plugin System</h2>
        
        <p className="text-muted-foreground mb-6">
          FortiCore's plugin system allows you to extend its functionality without modifying the core codebase.
        </p>
        
        <h3 className="text-xl font-medium mb-3">Plugin Directory Structure</h3>
        
        <CodeBlock
          code={`~/.forticore/plugins/
├── my_custom_scanner/
│   ├── __init__.py
│   ├── plugin.yml
│   └── scanner.py
└── vulnerability_reporter/
    ├── __init__.py
    ├── plugin.yml
    └── reporter.py`}
          caption="Plugin directory structure"
        />
        
        <h3 className="text-xl font-medium mt-6 mb-3">Plugin Configuration</h3>
        
        <p className="text-muted-foreground mb-4">
          Each plugin requires a <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">plugin.yml</code> configuration file:
        </p>
        
        <CodeBlock
          code={`name: Custom CORS Scanner
version: 1.0.0
description: Scans for CORS misconfigurations
author: Your Name
email: your.email@example.com
website: https://example.com

# Plugin type (scanner, reporter, exploit, etc.)
type: scanner

# Hooks into FortiCore
hooks:
  - web_scan
  - report_generation

# Dependencies
dependencies:
  - requests>=2.25.0
  - pyyaml>=5.4.0`}
          caption="Example plugin.yml"
        />
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Creating Custom Scanners</h2>
        
        <p className="text-muted-foreground mb-6">
          Create a custom vulnerability scanner by implementing the Scanner interface:
        </p>
        
        <CodeBlock
          code={`# ~/.forticore/plugins/my_custom_scanner/scanner.py
from forticore.scanner import Scanner
from forticore.vulnerability import Vulnerability

class CORSScanner(Scanner):
    """Scanner for CORS misconfigurations."""
    
    def __init__(self):
        super().__init__(
            name="CORS Misconfiguration Scanner",
            description="Detects insecure CORS configurations"
        )
    
    def scan(self, target, options=None):
        """Scan the target for CORS misconfigurations."""
        self.logger.info(f"Scanning {target} for CORS misconfigurations")
        
        # Implementation of the CORS scanning logic
        vulnerabilities = []
        
        # Example: Detecting wildcard CORS configuration
        try:
            import requests
            headers = {'Origin': 'https://malicious-site.com'}
            response = requests.get(target, headers=headers, timeout=10)
            
            cors_header = response.headers.get('Access-Control-Allow-Origin')
            if cors_header == '*':
                vulnerabilities.append(
                    Vulnerability(
                        name="Wildcard CORS Policy",
                        description="The server has a wildcard CORS policy which allows any origin to access the resource",
                        severity="high",
                        evidence=f"Response headers: {dict(response.headers)}",
                        remediation="Configure specific origins in the Access-Control-Allow-Origin header"
                    )
                )
                
        except Exception as e:
            self.logger.error(f"Error during CORS scan: {e}")
        
        return vulnerabilities`}
          caption="Example custom scanner"
        />
        
        <p className="text-muted-foreground mt-6 mb-4">
          Register your plugin by creating an <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">__init__.py</code> file:
        </p>
        
        <CodeBlock
          code={`# ~/.forticore/plugins/my_custom_scanner/__init__.py
from .scanner import CORSScanner

def get_scanners():
    """Return the scanners provided by this plugin."""
    return [CORSScanner()]`}
          caption="Plugin initialization"
        />
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Custom Report Templates</h2>
        
        <p className="text-muted-foreground mb-6">
          Create customized report templates to tailor the output format to your needs:
        </p>
        
        <CodeBlock
          code={`# ~/.forticore/templates/custom_report.html
<!DOCTYPE html>
<html>
<head>
    <title>{{ report.title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        
        .header {
            background: #4c1d95;
            color: white;
            padding: 20px;
            text-align: center;
        }
        
        .vulnerability {
            border: 1px solid #ddd;
            margin: 10px 0;
            padding: 15px;
            border-radius: 5px;
        }
        
        .high {
            border-left: 5px solid #ef4444;
        }
        
        .medium {
            border-left: 5px solid #f97316;
        }
        
        .low {
            border-left: 5px solid #3b82f6;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Security Assessment Report</h1>
        <p>Generated by FortiCore on {{ report.date }}</p>
    </div>
    
    <h2>Executive Summary</h2>
    <p>{{ report.summary }}</p>
    
    <h2>Target Information</h2>
    <p><strong>Target:</strong> {{ report.target }}</p>
    <p><strong>Scan Date:</strong> {{ report.date }}</p>
    <p><strong>Scan Duration:</strong> {{ report.duration }}</p>
    
    <h2>Findings</h2>
    <p>Total vulnerabilities found: {{ report.vulnerabilities|length }}</p>
    
    {% for vuln in report.vulnerabilities %}
    <div class="vulnerability {{ vuln.severity }}">
        <h3>{{ vuln.name }}</h3>
        <p><strong>Severity:</strong> {{ vuln.severity|title }}</p>
        <p><strong>Description:</strong> {{ vuln.description }}</p>
        <p><strong>Evidence:</strong> {{ vuln.evidence }}</p>
        <h4>Remediation</h4>
        <p>{{ vuln.remediation }}</p>
    </div>
    {% endfor %}
</body>
</html>`}
          caption="Custom HTML report template"
        />
        
        <p className="text-muted-foreground mt-6 mb-4">
          Use your custom template when generating reports:
        </p>
        
        <CodeBlock
          code="ftcore report --scan-id SCAN_ID --template custom_report --format html"
          caption="Using a custom report template"
        />
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Script Extensions</h2>
        
        <p className="text-muted-foreground mb-6">
          Write script extensions to automate complex workflows:
        </p>
        
        <CodeBlock
          code={`#!/usr/bin/env python3
# ~/.forticore/scripts/weekly_scan.py
"""
Weekly security scan script for multiple targets
"""
import argparse
import os
import sys
import datetime
from forticore import api

def main():
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="Run weekly security scans")
    parser.add_argument("--targets-file", required=True, help="File containing targets, one per line")
    parser.add_argument("--output-dir", default="./reports", help="Directory for scan reports")
    args = parser.parse_args()
    
    # Create output directory if it doesn't exist
    os.makedirs(args.output_dir, exist_ok=True)
    
    # Get targets from file
    with open(args.targets_file, "r") as f:
        targets = [line.strip() for line in f if line.strip()]
    
    # Get current date for report naming
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    
    # Initialize FortiCore client
    client = api.FortiCoreClient()
    
    # Run scans for each target
    for target in targets:
        print(f"Scanning {target}...")
        
        try:
            # Start the scan
            scan_id = client.start_scan(target=target, scan_type="comprehensive")
            
            # Wait for scan to complete
            client.wait_for_scan(scan_id)
            
            # Generate and save report
            report_path = os.path.join(args.output_dir, f"{target.replace('://', '_').replace('/', '_')}_{today}.pdf")
            client.generate_report(scan_id, output_file=report_path, format="pdf")
            
            print(f"Scan completed for {target}. Report saved to {report_path}")
            
        except Exception as e:
            print(f"Error scanning {target}: {e}")
    
    print("Weekly scan completed.")

if __name__ == "__main__":
    sys.exit(main())`}
          caption="Custom weekly scan script"
        />
        
        <p className="text-muted-foreground mt-6 mb-4">
          Make the script executable and run it:
        </p>
        
        <CodeBlock
          code={`chmod +x ~/.forticore/scripts/weekly_scan.py
~/.forticore/scripts/weekly_scan.py --targets-file targets.txt --output-dir ~/security-reports`}
          caption="Running a custom script"
        />
      </section>
      
      <section className="mb-4">
        <h2 className="text-2xl font-bold mb-4">Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            to="/faq" 
            className="glass-card p-4 hover:shadow-md transition-all duration-200 flex items-center"
          >
            <FileText className="h-5 w-5 mr-2 text-primary" />
            <span>Frequently Asked Questions</span>
          </Link>
          
          <Link 
            to="/integration" 
            className="glass-card p-4 hover:shadow-md transition-all duration-200 flex items-center"
          >
            <Puzzle className="h-5 w-5 mr-2 text-primary" />
            <span>Integration Guide</span>
          </Link>
          
          <a 
            href="https://github.com/forticore-team/forticore-plugins" 
            className="glass-card p-4 hover:shadow-md transition-all duration-200 flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Package className="h-5 w-5 mr-2 text-primary" />
            <span>Community Plugins</span>
          </a>
          
          <a 
            href="https://forticore.dev/api-docs" 
            className="glass-card p-4 hover:shadow-md transition-all duration-200 flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Code className="h-5 w-5 mr-2 text-primary" />
            <span>API Documentation</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Customization;
