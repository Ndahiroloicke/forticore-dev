import { useState, useEffect, useRef } from 'react';
import { Terminal, Play, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CommandLineProps {
  commands: Array<{
    input: string;
    output: string;
    delay?: number;
  }>;
  className?: string;
  autoStart?: boolean;
}

export const CommandLine = ({ commands, className, autoStart = false }: CommandLineProps) => {
  const [currentCommandIndex, setCurrentCommandIndex] = useState(-1);
  const [showInput, setShowInput] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [isRunning, setIsRunning] = useState(autoStart);
  const containerRef = useRef<HTMLDivElement>(null);

  const demoCommands = [
    {
      input: "ftcore version",
      output: "FortiCore v2.3.0 - Advanced Security Testing Framework",
      delay: 1000
    },
    {
      input: "ftcore scan <target>",
      output: "Starting comprehensive scan...\nInitializing modules...\nPerforming vulnerability assessment...\nAnalyzing network security...\nChecking configurations...\n\nScan complete! Found 5 potential vulnerabilities.\nReport generated: ~/forticore/reports/scan_2024-03-21.pdf",
      delay: 2000
    },
    {
      input: "ftcore report --latest",
      output: "Opening latest report...\n\n--------------------------------\nSCAN SUMMARY\n--------------------------------\nCritical: 1\nHigh: 2\nMedium: 1\nLow: 1\n\nKey Findings:\n1. [CRITICAL] Remote Code Execution Vulnerability\n2. [HIGH] Insecure SSL Configuration\n3. [HIGH] Exposed Administrative Interface\n\nFull report available at: ~/forticore/reports/scan_2024-03-21.pdf",
      delay: 1500
    }
  ];

  useEffect(() => {
    if (!isRunning) return;
    
    if (currentCommandIndex < commands.length - 1) {
      // Show input
      setShowInput(true);
      setShowOutput(false);
      
      // After delay, show output and move to next command
      const command = commands[currentCommandIndex + 1];
      const delay = command.delay || 1500;
      
      const timer = setTimeout(() => {
        setShowOutput(true);
        
        setTimeout(() => {
          setCurrentCommandIndex(prev => prev + 1);
          
          // Scroll to bottom
          if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
          }
        }, 800);
      }, delay);
      
      return () => clearTimeout(timer);
    } else {
      setIsRunning(false);
    }
  }, [commands, currentCommandIndex, isRunning]);

  const startDemo = () => {
    setCurrentCommandIndex(-1);
    setIsRunning(true);
  };

  const stopDemo = () => {
    setIsRunning(false);
  };

  return (
    <div className={cn("rounded-lg overflow-hidden shadow-lg border border-purple-900/30", className)}>
      {/* Header */}
      <div className="bg-dark-300 text-white p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium text-purple-100">FortiCore Demo</span>
        </div>
        
        <div className="flex items-center gap-2">
          {!isRunning ? (
            <button 
              onClick={startDemo}
              className="text-xs flex items-center gap-1 bg-purple-700 hover:bg-purple-800 text-white px-2 py-1 rounded"
            >
              <Play className="h-3 w-3" />
              Run Demo
            </button>
          ) : (
            <button 
              onClick={stopDemo}
              className="text-xs flex items-center gap-1 bg-red-700 hover:bg-red-800 text-white px-2 py-1 rounded"
            >
              <XCircle className="h-3 w-3" />
              Stop
            </button>
          )}
        </div>
      </div>
      
      {/* Terminal */}
      <div 
        ref={containerRef}
        className="bg-dark-400 text-white p-4 font-mono text-sm h-[300px] overflow-auto"
      >
        {/* Previously executed commands */}
        {commands.slice(0, currentCommandIndex + 1).map((command, index) => (
          <div key={index} className="mb-4">
            {/* Command */}
            <div className="flex items-start">
              <span className="text-purple-500 mr-2">$</span>
              <span className="text-green-400">{command.input}</span>
            </div>
            
            {/* Output */}
            <div className="mt-1 pl-4 text-purple-100 opacity-80 whitespace-pre-line">
              {command.output}
            </div>
          </div>
        ))}
        
        {/* Current command being "typed" */}
        {isRunning && currentCommandIndex < commands.length - 1 && (
          <div className="mb-4">
            {showInput && (
              <div className="flex items-start">
                <span className="text-purple-500 mr-2">$</span>
                <span className="text-green-400">{commands[currentCommandIndex + 1].input}</span>
                {!showOutput && <span className="animate-pulse">▋</span>}
              </div>
            )}
            
            {showOutput && (
              <div className="mt-1 pl-4 text-purple-100 opacity-80 whitespace-pre-line">
                {commands[currentCommandIndex + 1].output}
              </div>
            )}
          </div>
        )}
        
        {/* Prompt when not running */}
        {!isRunning && (
          <div className="flex items-start">
            <span className="text-purple-500 mr-2">$</span>
            <span className="animate-pulse">▋</span>
          </div>
        )}
      </div>
    </div>
  );
};
