"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { CodeBlock } from "@/components/ui/CodeBlock"
import { ChevronRight, AlertTriangle, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const Installation = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<"linux" | "docker">("linux")

  return (
    <div className="p-4 sm:p-6 lg:p-8 lg:pl-72 max-w-full">
      <div className="mb-8 sm:mb-12 animate-slide-up">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Installation</h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-4 sm:mb-6">
          Get up and running with FortiCore on your preferred platform.
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
                <span className="ml-1 text-xs sm:text-sm font-medium text-foreground">Installation</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      <div className="mb-6 sm:mb-8">
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 sm:p-4 flex items-start mb-6 sm:mb-8">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mt-0.5 mr-2 sm:mr-3" />
          <div>
            <h3 className="font-medium text-sm sm:text-base">System Requirements</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              FortiCore requires Rust and Cargo (1.70.0 or newer), OpenSSL development libraries, and a Linux-based system (Ubuntu/Debian/CentOS/RHEL).
            </p>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Choose Your Platform</h2>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 mb-6">
          <button
            className={cn(
              "px-3 sm:px-4 py-2 rounded-md border text-xs sm:text-sm font-medium transition-all w-full sm:w-auto",
              selectedPlatform === "linux"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border hover:bg-accent",
            )}
            onClick={() => setSelectedPlatform("linux")}
          >
            Linux (Native)
          </button>

          <button
            className={cn(
              "px-3 sm:px-4 py-2 rounded-md border text-xs sm:text-sm font-medium transition-all w-full sm:w-auto",
              selectedPlatform === "docker"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border hover:bg-accent",
            )}
            onClick={() => setSelectedPlatform("docker")}
          >
            Docker
          </button>
        </div>
      </div>

      {selectedPlatform === "linux" && (
        <div className="animate-fade-in">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Linux Installation</h2>

          <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">1. Install Dependencies</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            For Debian/Ubuntu:
          </p>

          <div className="w-full">
            <CodeBlock
              code={`sudo apt-get update
sudo apt-get install -y build-essential pkg-config libssl-dev`}
              caption="Install dependencies (Debian/Ubuntu)"
            />
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 mt-4">
            For CentOS/RHEL/Fedora:
          </p>

          <div className="w-full">
            <CodeBlock
              code={`sudo yum groupinstall -y "Development Tools"
sudo yum install -y openssl-devel`}
              caption="Install dependencies (CentOS/RHEL)"
            />
          </div>

          <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 mt-4 sm:mt-6">2. Download FortiCore</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Clone the FortiCore repository from GitHub:
          </p>

          <div className="w-full">
            <CodeBlock code="git clone https://github.com/FORTI-CORE/FortiCore.git" caption="Clone repository" />
          </div>

          <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 mt-4 sm:mt-6">
            3. Automatic Installation
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Run as root in the fortc directory:
          </p>

          <div className="w-full">
            <CodeBlock
              code={`cd FortiCore
source "/root/.cargo/env" && bash install.sh`}
              caption="Automatic installation"
            />
          </div>

          <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 mt-4 sm:mt-6">4. Manual Installation (Alternative)</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Or build and install manually:
          </p>

          <div className="w-full">
            <CodeBlock
              code={`cargo build --release
sudo cp target/release/fortc /usr/local/bin/
sudo chmod +x /usr/local/bin/fortc`}
              caption="Manual build and installation"
            />
          </div>

          <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 mt-4 sm:mt-6">5. Verify Installation</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Verify that FortiCore is correctly installed:
          </p>

          <div className="w-full">
            <CodeBlock code="fortc --version" caption="Verify installation" />
          </div>

          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-3 sm:p-4 flex items-start mt-6 sm:mt-8">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 shrink-0 mt-0.5 mr-2 sm:mr-3" />
            <div>
              <h3 className="font-medium text-sm sm:text-base text-green-800 dark:text-green-300">
                Installation Complete
              </h3>
              <p className="text-xs sm:text-sm text-green-700 dark:text-green-400 mt-1">
                FortiCore is now installed on your system. Continue to the{" "}
                <Link to="/quick-start" className="underline">
                  Quick Start Guide
                </Link>{" "}
                to begin your first scan.
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedPlatform === "docker" && (
        <div className="animate-fade-in">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Docker Installation (Coming Soon)</h2>

          <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">1. Install Docker</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Ensure Docker is installed on your system. Visit the{" "}
            <a
              href="https://docs.docker.com/get-docker/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Docker website
            </a>{" "}
            for installation instructions.
          </p>

          <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 mt-4 sm:mt-6">2. Pull the FortiCore Image</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Pull the FortiCore Docker image:</p>

          <div className="w-full">
            <CodeBlock code="docker pull forticore/fortc:latest" caption="Pull Docker image" />
          </div>

          <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 mt-4 sm:mt-6">3. Run FortiCore Container</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Start a FortiCore container:</p>

          <div className="w-full">
            <CodeBlock code="docker run -it --name fortc forticore/fortc:latest" caption="Run container" />
          </div>

          <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2 mt-4 sm:mt-6">4. Verify Installation</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Verify that FortiCore is correctly installed:
          </p>

          <div className="w-full">
            <CodeBlock code="docker exec -it fortc fortc --version" caption="Check version" />
          </div>

          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-3 sm:p-4 flex items-start mt-6 sm:mt-8">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 shrink-0 mt-0.5 mr-2 sm:mr-3" />
            <div>
              <h3 className="font-medium text-sm sm:text-base text-green-800 dark:text-green-300">
                Installation Complete
              </h3>
              <p className="text-xs sm:text-sm text-green-700 dark:text-green-400 mt-1">
                FortiCore is now available in a Docker container. Continue to the{" "}
                <Link to="/quick-start" className="underline">
                  Quick Start Guide
                </Link>{" "}
                to begin your first scan.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Installation
