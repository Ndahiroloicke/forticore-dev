import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Moon, Sun, Shield, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/ui/SearchBar';

interface NavbarProps {
  toggleSidebar: () => void;
}

export const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
  };
  
  // Check if user has scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Set theme based on user preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme as 'light' | 'dark');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } else if (prefersDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  return (
    <header className={cn(
      "sticky top-0 z-30 w-full transition-all duration-200",
      scrolled ? "glass" : "bg-transparent"
    )}>
      <div className="w-full px-4 flex items-center justify-between h-16">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar}
            className="mr-2 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link to="/" className="flex items-center">
            <img 
              src="/forticoreLogo.png" 
              alt="FortiCore Logo" 
              className="h-10 w-14 mr-2 hidden md:inline"
            />
            <span className="font-semibold text-lg">FortiCore</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme} 
            className="text-muted-foreground hover:text-foreground"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            asChild
            className="hidden sm:flex"
          >
            <a href="/login" target="_blank" rel="noopener noreferrer">
              Get Started
            </a>
          </Button>
        </div>
      </div>
      
      {/* Full screen search overlay */}
      <div className={cn(
        "fixed inset-0 z-50 bg-background/95 backdrop-blur-md p-4 transition-all duration-300",
        isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className="w-full mx-auto flex flex-col items-center justify-start pt-16 gap-8 max-w-2xl">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-2xl font-medium">Search Documentation</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsSearchOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <SearchBar 
            isFullScreen={true} 
            onClose={() => setIsSearchOpen(false)} 
          />
        </div>
      </div>
    </header>
  );
};
