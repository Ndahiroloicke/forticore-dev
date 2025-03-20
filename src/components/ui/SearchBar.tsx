
import { useState, useRef, useEffect } from 'react';
import { Search, Command } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Mock search results - in a real app, this would come from an API or search index
const mockResults = [
  { title: 'Installation Guide', path: '/installation', category: 'Getting Started' },
  { title: 'Quick Start Tutorial', path: '/quick-start', category: 'Getting Started' },
  { title: 'Vulnerability Scanning', path: '/features', category: 'Features' },
  { title: 'Configuration Options', path: '/configuration', category: 'User Guide' },
  { title: 'Integration with Other Tools', path: '/integration', category: 'Advanced Topics' },
  { title: 'Custom Scripts', path: '/customization', category: 'Advanced Topics' },
  { title: 'Common Questions', path: '/faq', category: 'FAQ' },
];

interface SearchResult {
  title: string;
  path: string;
  category: string;
}

interface SearchBarProps {
  isFullScreen?: boolean;
  onClose?: () => void;
}

export const SearchBar = ({ isFullScreen = false, onClose }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  // Focus input on mount if in full screen mode
  useEffect(() => {
    if (isFullScreen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFullScreen]);
  
  // Filter results based on query
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    
    const filtered = mockResults.filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setResults(filtered);
    setSelectedIndex(-1);
  }, [query]);
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleResultClick(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (onClose) onClose();
    }
  };
  
  // Scroll selected result into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);
  
  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setQuery('');
    if (onClose) onClose();
  };
  
  return (
    <div className={cn(
      "relative w-full",
      isFullScreen ? "max-w-2xl" : "max-w-md"
    )}>
      <div className={cn(
        "relative flex items-center",
        isFullScreen ? "w-full" : ""
      )}>
        <Search className={cn(
          "absolute left-3 h-4 w-4 text-muted-foreground",
          isFullScreen && "h-5 w-5"
        )} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search documentation..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full pl-10 pr-10 py-2 rounded-md bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-input transition-all",
            isFullScreen && "text-lg pl-11 py-3"
          )}
        />
        {!isFullScreen && (
          <div className="absolute right-3 flex items-center gap-1 text-xs text-muted-foreground">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        )}
      </div>
      
      {/* Search results */}
      {results.length > 0 && (
        <div 
          ref={resultsRef}
          className={cn(
            "absolute z-10 mt-2 w-full bg-background border border-border rounded-md shadow-md overflow-hidden",
            isFullScreen && "max-h-96 overflow-y-auto scrollbar-hide"
          )}
        >
          {results.map((result, index) => (
            <div
              key={result.path}
              className={cn(
                "px-4 py-2 cursor-pointer transition-colors",
                selectedIndex === index ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
              )}
              onClick={() => handleResultClick(result)}
            >
              <div className="font-medium">{result.title}</div>
              <div className="text-xs text-muted-foreground">{result.category}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
