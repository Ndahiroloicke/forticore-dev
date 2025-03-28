import { Link } from 'react-router-dom';
import { ChevronRight, Terminal, Shield, FileText, CheckCircle, AlertTriangle, Info, Zap, Settings as SettingsIcon } from 'lucide-react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const QuickStart = () => {
  return (
    <div className="p-8 lg:pl-72">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 animate-slide-up">
          <Badge variant="purple-outline" className="mb-4">Quick Start Guide</Badge>
          <h1 className="text-4xl font-bold mb-4">Get Started with FortiCore</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Learn the basics and run your first security scan in just a few minutes.
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
                  <span className="ml-1 text-sm font-medium text-foreground">Quick Start</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        
        <Tabs defaultValue="linux" className="mb-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Choose Your Platform</h2>
            <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-none h-auto">
              <TabsTrigger value="linux" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                Linux
              </TabsTrigger>
              <TabsTrigger value="docker" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                Docker
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="linux" className="border-none p-0 animate-slide-up">
            <Card className="bg-white dark:bg-dark-300 border border-purple-100 dark:border-purple-900/30">
              <CardHeader>
                <CardTitle>Linux Installation</CardTitle>
                <CardDescription>Step-by-step guide to install FortiCore on Linux systems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Badge variant="purple" className="rounded-full h-6 w-6 p-0 flex items-center justify-center">1</Badge>
                    Install Dependencies
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    First, ensure you have the necessary dependencies installed:
                  </p>
                  <CodeBlock
                    code="sudo apt update && sudo apt install -y python3 python3-pip git"
                    caption="Install dependencies"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Badge variant="purple" className="rounded-full h-6 w-6 p-0 flex items-center justify-center">2</Badge>
                    Download FortiCore
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Clone the FortiCore repository from GitHub:
                  </p>
                  <CodeBlock
                    code="git clone https://github.com/FORTI-CORE/FortiCore.git"
                    caption="Clone repository"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Badge variant="purple" className="rounded-full h-6 w-6 p-0 flex items-center justify-center">3</Badge>
                    Set Up Virtual Environment
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    It's recommended to use a virtual environment for FortiCore:
                  </p>
                  <CodeBlock
                    code={`cd forticore
python3 -m venv venv
source venv/bin/activate`}
                    caption="Create and activate virtual environment"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Badge variant="purple" className="rounded-full h-6 w-6 p-0 flex items-center justify-center">4</Badge>
                    Install FortiCore
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Install FortiCore and its dependencies:
                  </p>
                  <CodeBlock
                    code="pip install -e ."
                    caption="Install FortiCore"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Badge variant="purple" className="rounded-full h-6 w-6 p-0 flex items-center justify-center">5</Badge>
                    Verify Installation
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Verify that FortiCore is correctly installed:
                  </p>
                  <CodeBlock
                    code="ftcore version"
                    caption="Check FortiCore version"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex items-center p-6 bg-purple-50 dark:bg-purple-950/10 border-t border-purple-100 dark:border-purple-900/30">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                <p className="text-sm">
                  Continue to <Link to="#your-first-scan" className="text-purple-600 dark:text-purple-400 hover:underline">Your First Scan</Link> section below after installation.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="docker" className="border-none p-0 animate-slide-up">
            <Card className="bg-white dark:bg-dark-300 border border-purple-100 dark:border-purple-900/30">
              <CardHeader>
                <CardTitle>Docker Installation</CardTitle>
                <CardDescription>Run FortiCore in a Docker container for cross-platform support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Badge variant="purple" className="rounded-full h-6 w-6 p-0 flex items-center justify-center">1</Badge>
                    Install Docker
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Ensure Docker is installed on your system. Visit the <a href="https://docs.docker.com/get-docker/" target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Docker website</a> for installation instructions.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Badge variant="purple" className="rounded-full h-6 w-6 p-0 flex items-center justify-center">2</Badge>
                    Pull the FortiCore Image
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Pull the FortiCore Docker image:
                  </p>
                  <CodeBlock
                    code="docker pull forticore/forticore:latest"
                    caption="Pull FortiCore Docker image"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Badge variant="purple" className="rounded-full h-6 w-6 p-0 flex items-center justify-center">3</Badge>
                    Run FortiCore Container
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start a FortiCore container:
                  </p>
                  <CodeBlock
                    code="docker run -it --name forticore forticore/forticore:latest"
                    caption="Run container"
                  />
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                    <Badge variant="purple" className="rounded-full h-6 w-6 p-0 flex items-center justify-center">4</Badge>
                    Verify Installation
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Verify that FortiCore is correctly installed:
                  </p>
                  <CodeBlock
                    code="docker exec -it forticore forticore --version"
                    caption="Check version"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex items-center p-6 bg-purple-50 dark:bg-purple-950/10 border-t border-purple-100 dark:border-purple-900/30">
                <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                <p className="text-sm">
                  Continue to <Link to="#your-first-scan" className="text-purple-600 dark:text-purple-400 hover:underline">Your First Scan</Link> section below after installation.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        <section id="your-first-scan" className="mb-10 scroll-mt-16">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold">Your First Scan</h2>
          </div>
          
          <div className="space-y-8 purple-highlight">
            <div>
              <h3 className="text-lg font-medium mb-2">1. Verify Installation</h3>
              <p className="text-muted-foreground mb-4">
                Ensure FortiCore is correctly installed by checking the version:
              </p>
              <CodeBlock
                code="ftcore version"
                caption="Check FortiCore version"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">2. Initialize a Basic Scan</h3>
              <p className="text-muted-foreground mb-4">
                For a quick vulnerability scan of a target:
              </p>
              <CodeBlock
                code="ftcore scan <target>"
                caption="Basic comprehensive scan"
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">3. View Results</h3>
              <p className="text-muted-foreground mb-4">
                After the scan completes, FortiCore will display a summary of findings. For a detailed report:
              </p>
              <CodeBlock
                code="ftcore report --latest"
                caption="View detailed report"
              />
            </div>
          </div>
        </section>
        
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold">Common Scan Types</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <Card className="bg-white dark:bg-dark-300 border border-purple-100 dark:border-purple-900/30 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Web Application Scan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  Scan a web application for common vulnerabilities like XSS and SQL injection:
                </p>
                <CodeBlock
                  code="ftcore -dt <target>"
                  caption="Web technology and vulnerability scan"
                />
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-dark-300 border border-purple-100 dark:border-purple-900/30 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Network Scan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  Perform a network vulnerability scan:
                </p>
                <CodeBlock
                  code="ftcore portscan <target> comprehensive"
                  caption="Comprehensive network scan"
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-dark-300 border border-purple-100 dark:border-purple-900/30 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">SSL/TLS Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  Check for SSL/TLS vulnerabilities:
                </p>
                <CodeBlock
                  code="ftcore scan <target> --type ssl"
                  caption="SSL/TLS security analysis"
                />
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-dark-300 border border-purple-100 dark:border-purple-900/30 h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Port Scanning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  Scan for open ports on a target:
                </p>
                <CodeBlock
                  code="ftcore portscan <target> quick"
                  caption="Quick port scan"
                />
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <SettingsIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-2xl font-bold">Customizing Your Scans</h2>
          </div>
          
          <p className="text-muted-foreground mb-6">
            FortiCore offers various options to customize your scans:
          </p>
          
          <div className="space-y-4 mb-6">
            <Card className="bg-white dark:bg-dark-300 border border-purple-100 dark:border-purple-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Scan Intensity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  Adjust the scan intensity (affects speed and thoroughness):
                </p>
                <CodeBlock
                  code="ftcore scan <target> comprehensive"
                  caption="High intensity comprehensive scan"
                />
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-dark-300 border border-purple-100 dark:border-purple-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Custom Port Range</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  Specify a custom port range to scan:
                </p>
                <CodeBlock
                  code="ftcore portscan <target> [scan_type] [report_format]"
                  caption="Configurable port scan"
                />
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-dark-300 border border-purple-100 dark:border-purple-900/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Output Format</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 text-sm">
                  Specify the output format for reports:
                </p>
                <CodeBlock
                  code="ftcore portscan <target> comprehensive json"
                  caption="Port scan with JSON output"
                />
              </CardContent>
            </Card>
          </div>
        </section>
        
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-300 dark:border-green-900 rounded-lg p-6 flex items-start mb-10">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5 mr-3" />
          <div>
            <h3 className="font-medium text-green-800 dark:text-green-300 text-lg">Ready to Explore More?</h3>
            <p className="text-sm text-green-700 dark:text-green-400 mt-2">
              Now that you've completed your first scan, explore the <Link to="/features" className="text-green-600 dark:text-green-300 underline">Features</Link> section to learn more about FortiCore's capabilities or check the <Link to="/configuration" className="text-green-600 dark:text-green-300 underline">Configuration</Link> guide to customize your setup.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm" className="border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30">
                <Link to="/features">
                  Explore Features
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30">
                <Link to="/configuration">
                  Configure FortiCore
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStart;
