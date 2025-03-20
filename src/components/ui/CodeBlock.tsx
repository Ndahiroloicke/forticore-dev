
import { useState, useRef } from 'react';
import { CheckCircle, Copy, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from "@/components/ui/badge";

interface CodeBlockProps {
  code: string;
  language?: string;
  caption?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
}

export const CodeBlock = ({ 
  code, 
  language = 'bash', 
  caption,
  showLineNumbers = true,
  showCopyButton = true
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const { toast } = useToast();
  
  const copyToClipboard = async () => {
    if (!navigator.clipboard) {
      toast({
        title: "Copy failed",
        description: "Clipboard API not available in your browser",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        description: "Code copied to clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive"
      });
    }
  };
  
  // Format code with line numbers
  const formatCode = () => {
    if (!showLineNumbers) return code;
    
    const lines = code.split('\n');
    
    return lines.map((line, i) => (
      <div key={i} className="table-row group">
        <span className="table-cell text-xs text-muted-foreground pr-4 text-right select-none opacity-60 group-hover:opacity-100 transition-opacity">
          {i + 1}
        </span>
        <span className="table-cell">{line}</span>
      </div>
    ));
  };
  
  return (
    <div className="my-6 rounded-lg overflow-hidden terminal-bg shadow-md transition-shadow duration-300 hover:shadow-lg">
      {caption && (
        <div className="flex items-center justify-between px-4 py-2 bg-dark-300 dark:bg-dark-400 border-b border-border/20">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">{caption}</span>
          </div>
          {language && (
            <Badge variant="outline" className="text-xs bg-dark-200 dark:bg-dark-300 text-muted-foreground border-purple-500/30">
              {language}
            </Badge>
          )}
        </div>
      )}
      
      <div className="relative">
        <pre
          ref={codeRef}
          className={cn(
            "p-4 overflow-x-auto font-mono text-sm text-purple-50",
            showLineNumbers ? "table w-full" : ""
          )}
        >
          {showLineNumbers ? formatCode() : code}
        </pre>
        
        {showCopyButton && (
          <button
            onClick={copyToClipboard}
            className={cn(
              "absolute top-3 right-3 p-2 rounded-md transition-all duration-200",
              "bg-dark-300/50 dark:bg-dark-200/50 hover:bg-dark-200/80 dark:hover:bg-dark-100/80",
              "focus:outline-none focus:ring-2 focus:ring-purple-500"
            )}
            aria-label="Copy code"
          >
            {copied ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-purple-300" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
