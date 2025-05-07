"use client"

import type React from "react"

import { useState, useRef } from "react"
import { CheckCircle, Copy, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"

interface CodeBlockProps {
  code: string
  language?: string
  caption?: string
  showLineNumbers?: boolean
  showCopyButton?: boolean
  style?: React.CSSProperties
}

export const CodeBlock = ({
  code,
  language = "bash",
  caption,
  showLineNumbers = false, // Default to false for better mobile experience
  showCopyButton = true,
  style,
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLPreElement>(null)
  const { toast } = useToast()

  const copyToClipboard = async () => {
    if (!navigator.clipboard) {
      toast({
        title: "Copy failed",
        description: "Clipboard API not available in your browser",
        variant: "destructive",
      })
      return
    }

    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      toast({
        description: "Code copied to clipboard",
      })

      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive",
      })
    }
  }

  // Format code with line numbers
  const formatCode = () => {
    if (!showLineNumbers) return code

    const lines = code.split("\n")

    return lines.map((line, i) => (
      <div key={i} className="table-row group">
        <span className="table-cell text-xs text-muted-foreground pr-4 text-right select-none opacity-60 group-hover:opacity-100 transition-opacity">
          {i + 1}
        </span>
        <span className="table-cell break-words">{line}</span>
      </div>
    ))
  }

  // Determine if we should use mobile-optimized display
  const isMobileOptimized = true // Always use mobile-optimized display for consistency

  return (
    <div className="my-4 sm:my-6 rounded-lg overflow-hidden terminal-bg shadow-md transition-shadow duration-300 hover:shadow-lg w-full">
      {caption && (
        <div className="flex items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2 bg-dark-300 dark:bg-dark-400 border-b border-border/20">
          <div className="flex items-center gap-2">
            <Terminal className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{caption}</span>
          </div>
          {language && (
            <Badge
              variant="outline"
              className="text-xs bg-dark-200 dark:bg-dark-300 text-muted-foreground border-purple-500/30"
            >
              {language}
            </Badge>
          )}
        </div>
      )}

      <div className="relative">
        {/* Mobile-optimized code display */}
        {isMobileOptimized && (
          <div className="overflow-x-auto max-w-full">
            <pre
              ref={codeRef}
              className="p-3 sm:p-4 font-mono text-xs sm:text-sm text-purple-50 whitespace-pre-wrap break-words"
              style={{
                ...style,
                maxWidth: "100%",
                overflowWrap: "break-word",
              }}
            >
              {code}
            </pre>
          </div>
        )}

        {/* Original display with line numbers (not used in mobile-optimized mode) */}
        {!isMobileOptimized && (
          <pre
            ref={codeRef}
            className={cn("p-4 font-mono text-sm text-purple-50", showLineNumbers ? "table w-full" : "overflow-x-auto")}
          >
            {showLineNumbers ? formatCode() : code}
          </pre>
        )}

        {showCopyButton && (
          <button
            onClick={copyToClipboard}
            className={cn(
              "absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-md transition-all duration-200",
              "bg-dark-300/50 dark:bg-dark-200/50 hover:bg-dark-200/80 dark:hover:bg-dark-100/80",
              "focus:outline-none focus:ring-2 focus:ring-purple-500",
            )}
            aria-label="Copy code"
          >
            {copied ? (
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
            ) : (
              <Copy className="h-3 w-3 sm:h-4 sm:w-4 text-purple-300" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}
