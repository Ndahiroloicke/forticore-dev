
import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
}

export const TableOfContents = ({ className }: TableOfContentsProps) => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Get all h2 and h3 elements
    const elements = Array.from(document.querySelectorAll('h2, h3'))
      .filter(element => element.id)
      .map(element => ({
        id: element.id,
        text: element.textContent || '',
        level: element.tagName === 'H2' ? 2 : 3,
      }));
    
    setHeadings(elements);
    
    // Set up intersection observer to highlight active section
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );
    
    elements.forEach(heading => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });
    
    return () => {
      elements.forEach(heading => {
        const element = document.getElementById(heading.id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);
  
  if (headings.length === 0) return null;
  
  return (
    <div className={cn("w-64 hidden xl:block", className)}>
      <div className="sticky top-20">
        <h4 className="text-sm font-semibold mb-4 text-foreground">On This Page</h4>
        <nav>
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li 
                key={heading.id}
                className={cn(
                  "transition-colors",
                  heading.level === 3 && "ml-4",
                  activeId === heading.id 
                    ? "text-purple-600 dark:text-purple-400" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <a 
                  href={`#${heading.id}`}
                  className={cn(
                    "text-sm flex items-center",
                    activeId === heading.id && "font-medium"
                  )}
                >
                  {activeId === heading.id && (
                    <ChevronRight className="h-3 w-3 mr-1 flex-shrink-0" />
                  )}
                  <span>{heading.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
