import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Installation = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<'linux' | 'docker'>('linux');
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12 animate-slide-up">
        <h1 className="text-4xl font-bold mb-4">Installation</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Get up and running with FortiCore on your preferred platform.
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
                <span className="ml-1 text-sm font-medium text-foreground">Installation</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      
      <div className="mb-8">
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 flex items-start mb-8">
          <AlertTriangle className="h-5 w-5 text-primary shrink-0 mt-0.5 mr-3" />
          <div>
            <h3 className="font-medium">System Requirements</h3>
            <p className="text-sm text-muted-foreground mt-1">
              FortiCore currently supports Linux systems. Windows and macOS support is planned for future releases.
              Docker support is available for cross-platform usage.
            </p>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Choose Your Platform</h2>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            className={cn(
              "px-4 py-2 rounded-md border text-sm font-medium transition-all",
              selectedPlatform === 'linux' 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-background border-border hover:bg-accent"
            )}
            onClick={() => setSelectedPlatform('linux')}
          >
            Linux (Native)
          </button>
          
          <button
            className={cn(
              "px-4 py-2 rounded-md border text-sm font-medium transition-all",
              selectedPlatform === 'docker' 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-background border-border hover:bg-accent"
            )}
            onClick={() => setSelectedPlatform('docker')}
          >
            Docker
          </button>
        </div>
      </div>
      
      {selectedPlatform === 'linux' && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Linux Installation</h2>
          
          <h3 className="text-lg font-medium mb-2">1. Install Dependencies</h3>
          <p className="text-muted-foreground mb-4">
            First, ensure you have the necessary dependencies installed:
          </p>
          
          <CodeBlock
            code="sudo apt update && sudo apt install -y python3 python3-pip git"
            caption="Install dependencies"
          />
          
          <h3 className="text-lg font-medium mb-2 mt-6">2. Download FortiCore</h3>
          <p className="text-muted-foreground mb-4">
            Clone the FortiCore repository from GitHub:
          </p>
          
          <CodeBlock
            code="git clone https://github.com/FORTI-CORE/FortiCore.git"
            caption="Clone repository"
          />
          
          <h3 className="text-lg font-medium mb-2 mt-6">3. Set Up Virtual Environment (Optional)</h3>
          <p className="text-muted-foreground mb-4">
            It's recommended to use a virtual environment for FortiCore:
          </p>
          
          <CodeBlock
            code={`cd forticore
python3 -m venv venv
source venv/bin/activate`}
            caption="Create and activate virtual environment"
          />
          
          <h3 className="text-lg font-medium mb-2 mt-6">4. Install FortiCore</h3>
          <p className="text-muted-foreground mb-4">
            Install FortiCore and its dependencies:
          </p>
          
          <CodeBlock
            code="pip install -e ."
            caption="Install FortiCore"
          />
          
          <h3 className="text-lg font-medium mb-2 mt-6">5. Verify Installation</h3>
          <p className="text-muted-foreground mb-4">
            Verify that FortiCore is correctly installed:
          </p>
          
          <CodeBlock
            code="ftcore version"
            caption="Verify installation"
          />
          
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4 flex items-start mt-8">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5 mr-3" />
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-300">Installation Complete</h3>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                FortiCore is now installed on your system. Continue to the <Link to="/quick-start" className="underline">Quick Start Guide</Link> to begin your first scan.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {selectedPlatform === 'docker' && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold mb-4">Docker Installation</h2>
          
          <h3 className="text-lg font-medium mb-2">1. Install Docker</h3>
          <p className="text-muted-foreground mb-4">
            Ensure Docker is installed on your system. Visit the <a href="https://docs.docker.com/get-docker/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Docker website</a> for installation instructions.
          </p>
          
          <h3 className="text-lg font-medium mb-2 mt-6">2. Pull the FortiCore Image</h3>
          <p className="text-muted-foreground mb-4">
            Pull the FortiCore Docker image:
          </p>
          
          <CodeBlock
            code="docker pull forticore/forticore:latest"
            caption="Pull Docker image"
          />
          
          <h3 className="text-lg font-medium mb-2 mt-6">3. Run FortiCore Container</h3>
          <p className="text-muted-foreground mb-4">
            Start a FortiCore container:
          </p>
          
          <CodeBlock
            code="docker run -it --name forticore forticore/forticore:latest"
            caption="Run container"
          />
          
          <h3 className="text-lg font-medium mb-2 mt-6">4. Verify Installation</h3>
          <p className="text-muted-foreground mb-4">
            Verify that FortiCore is correctly installed:
          </p>
          
          <CodeBlock
            code="docker exec -it forticore ftcore version"
            caption="Check version"
          />
          
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4 flex items-start mt-8">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5 mr-3" />
            <div>
              <h3 className="font-medium text-green-800 dark:text-green-300">Installation Complete</h3>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                FortiCore is now available in a Docker container. Continue to the <Link to="/quick-start" className="underline">Quick Start Guide</Link> to begin your first scan.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Installation;
