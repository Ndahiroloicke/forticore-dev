import { Link } from 'react-router-dom';
import { ChevronRight, Link as LinkIcon, Code, BarChart, Server, GitBranch, FileText } from 'lucide-react';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface IntegrationCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const IntegrationCard = ({ icon: Icon, title, description }: IntegrationCardProps) => (
  <div className="glass-card p-6 h-full">
    <div className="rounded-full p-2 bg-primary/10 text-primary mb-4 self-start w-fit">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="text-xl font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const Integration = () => {
  return (
    <div className="p-8 lg:pl-72">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 animate-slide-up">
          <h1 className="text-4xl font-bold mb-4">Integration Guide</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Integrate FortiCore with your existing tools and workflows.
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
                  <span className="ml-1 text-sm font-medium text-foreground">Integration</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Integration Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <IntegrationCard
              icon={LinkIcon}
              title="REST API"
              description="Programmatically control FortiCore and retrieve scan results using the RESTful API interface."
            />
            
            <IntegrationCard
              icon={GitBranch}
              title="CI/CD Pipelines"
              description="Integrate security scanning into your development workflow with CI/CD pipeline integration."
            />
            
            <IntegrationCard
              icon={Server}
              title="SIEM Systems"
              description="Forward scan findings to Security Information and Event Management (SIEM) systems for centralized monitoring."
            />
            
            <IntegrationCard
              icon={FileText}
              title="Ticketing Systems"
              description="Automatically create tickets for identified vulnerabilities in systems like Jira, ServiceNow, or GitHub Issues."
            />
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">REST API</h2>
          
          <p className="text-muted-foreground mb-6">
            FortiCore provides a comprehensive REST API for automation and integration. Enable the API in your configuration:
          </p>
          
          <CodeBlock
            code={`# In ~/.forticore/config.yml
api:
  enabled: true
  port: 8080
  host: "127.0.0.1"  # Use 0.0.0.0 to allow external connections
  require_auth: true
  api_key: "your-secure-api-key"`}
            caption="API configuration"
          />
          
          <p className="text-muted-foreground my-4">Start the API server:</p>
          
          <CodeBlock
            code="ftcore api start"
            caption="Start API server"
          />
          
          <h3 className="text-xl font-medium mt-6 mb-3">API Examples</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground mb-2">Starting a new scan:</p>
              <CodeBlock
                code={`curl -X POST "http://localhost:8080/api/v1/scans" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "target": "example.com",
    "scan_type": "comprehensive",
    "options": {
      "intensity": "high",
      "timeout": 600
    }
  }'`}
                caption="Start scan via API"
              />
            </div>
            
            <div>
              <p className="text-muted-foreground mb-2">Retrieving scan results:</p>
              <CodeBlock
                code={`curl -X GET "http://localhost:8080/api/v1/scans/scan-123456/results" \\
  -H "Authorization: Bearer your-api-key"`}
                caption="Get scan results"
              />
            </div>
            
            <div>
              <p className="text-muted-foreground mb-2">Viewing all past scans:</p>
              <CodeBlock
                code={`curl -X GET "http://localhost:8080/api/v1/scans" \\
  -H "Authorization: Bearer your-api-key"`}
                caption="List all scans"
              />
            </div>
          </div>
          
          <p className="text-muted-foreground mt-6">
            For full API documentation, visit the API docs at <code className="bg-primary/10 px-1.5 py-0.5 rounded text-primary">http://localhost:8080/api/docs</code> when the API server is running.
          </p>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">CI/CD Integration</h2>
          
          <p className="text-muted-foreground mb-6">
            Integrate FortiCore into your CI/CD pipeline to automate security testing:
          </p>
          
          <div className="mb-6">
            <h3 className="text-xl font-medium mb-3">GitHub Actions</h3>
            <CodeBlock
              code={`name: Security Scan

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y python3 python3-pip git
      
      - name: Install FortiCore
        run: |
          git clone https://github.com/FORTI-CORE/FortiCore.git
          cd FortiCore
          python3 -m venv venv
          source venv/bin/activate
          pip install -e .
      
      - name: Run Security Scan
        run: |
          ftcore scan \${GITHUB_SERVER_URL}/\${GITHUB_REPOSITORY} --output json --report scan-results.json
          
      - name: Run Port Scan
        run: |
          ftcore portscan \${GITHUB_SERVER_URL}/\${GITHUB_REPOSITORY} comprehensive json
          
      - name: Check for Critical Issues
        run: |
          critical_count=$(jq '.findings[] | select(.severity == "critical") | length' scan-results.json)
          if [ "\$critical_count" -gt 0 ]; then
            echo "Found \$critical_count critical vulnerabilities"
            exit 1
          fi`}
              caption="GitHub Actions Workflow Example"
            />
          </div>
          
          <div>
            <h3 className="text-xl font-medium mb-3">GitLab CI</h3>
            <CodeBlock
              code={`stages:
  - test
  - security

security-scan:
  stage: security
  image: ubuntu:latest
  script:
    - apt-get update && apt-get install -y curl
    - curl -sSL https://forticore.io/install.sh | bash
    - forticore scan --target https://$CI_PROJECT_NAME-$CI_COMMIT_REF_NAME.example.com --output json --output-file scan-results.json
  artifacts:
    paths:
      - scan-results.json
    expire_in: 1 week`}
              caption="GitLab CI Configuration Example"
            />
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">SIEM Integration</h2>
          
          <p className="text-muted-foreground mb-6">
            Forward FortiCore findings to your SIEM system for centralized security monitoring:
          </p>
          
          <h3 className="text-xl font-medium mb-3">Splunk Integration</h3>
          <CodeBlock
            code={`# Configure FortiCore to send results to Splunk
ftcore scan --target example.com --siem splunk --siem-url https://splunk.example.com:8088/services/collector --siem-token your-splunk-http-event-collector-token`}
            caption="Splunk integration example"
          />
          
          <h3 className="text-xl font-medium mt-6 mb-3">ELK Stack Integration</h3>
          <CodeBlock
            code={`# Configure FortiCore to send results to ELK
ftcore scan --target example.com --siem elasticsearch --siem-url https://elasticsearch.example.com:9200 --siem-index forticore-findings --siem-auth username:password`}
            caption="ELK Stack integration example"
          />
          
          <p className="text-muted-foreground mt-6">
            For continuous monitoring, set up a scheduled scan that automatically forwards results to your SIEM:
          </p>
          
          <CodeBlock
            code={`# Add to crontab
0 2 * * * ftcore scan --target example.com --siem splunk --siem-url https://splunk.example.com:8088/services/collector --siem-token your-splunk-http-event-collector-token --output-file /var/log/forticore/\$(date +\\%Y-\\%m-\\%d).json`}
            caption="Scheduled scan with SIEM integration"
          />
        </section>
        
        <section className="mb-4">
          <h2 className="text-2xl font-bold mb-4">Ticketing System Integration</h2>
          
          <p className="text-muted-foreground mb-6">
            Automatically create tickets for identified vulnerabilities:
          </p>
          
          <h3 className="text-xl font-medium mb-3">Jira Integration</h3>
          <CodeBlock
            code={`# Configure FortiCore to create Jira tickets
ftcore scan --target example.com --ticketing jira --jira-url https://jira.example.com --jira-project SEC --jira-auth username:api-token --jira-issue-type Bug --jira-labels security,vulnerability`}
            caption="Jira integration example"
          />
          
          <h3 className="text-xl font-medium mt-6 mb-3">GitHub Issues Integration</h3>
          <CodeBlock
            code={`# Configure FortiCore to create GitHub issues
ftcore scan --target example.com --ticketing github --github-repo owner/repository --github-token your-github-token --github-labels security,vulnerability`}
            caption="GitHub Issues integration example"
          />
          
          <p className="text-muted-foreground mt-6">
            For more integration options and detailed configuration, see the <Link to="/customization" className="text-primary hover:underline">Customization Guide</Link>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Integration;
