import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Download, 
  BookOpen, 
  Code, 
  Settings, 
  ChevronRight, 
  Terminal, 
  Shield, 
  FileText,
  ExternalLink
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  hasSubmenu?: boolean;
  isSubmenuOpen?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const NavItem = ({ 
  to, 
  icon: Icon, 
  label, 
  isActive, 
  hasSubmenu = false, 
  isSubmenuOpen = false, 
  onClick, 
  children 
}: NavItemProps) => {
  return (
    <div className="mb-1">
      <Link
        to={to}
        className={cn(
          "flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group",
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
        onClick={onClick}
      >
        <Icon className="h-4 w-4 mr-2 shrink-0" />
        <span className="flex-1">{label}</span>
        {hasSubmenu && (
          <ChevronRight className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-200",
            isSubmenuOpen && "transform rotate-90"
          )} />
        )}
      </Link>
      {hasSubmenu && isSubmenuOpen && (
        <div className="pl-5 mt-1 animate-slide-down">
          {children}
        </div>
      )}
    </div>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'getting-started': true,
    'user-guide': false,
    'advanced-topics': false,
  });
  
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const checkIsActive = (path: string) => {
    return location.pathname === path;
  };
  
  useEffect(() => {
    // Close sidebar on mobile when route changes
    if (isOpen && window.innerWidth < 1024) {
      onClose();
    }
  }, [location.pathname]);
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "fixed top-16 bottom-0 left-0 z-40 bg-sidebar-background border-r border-sidebar-border",
        "w-5/6 sm:w-3/4 md:w-72 lg:w-64",
        "transition-transform duration-300 ease-in-out",
        "flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex-1 overflow-y-auto">          
          <nav className="p-4">
            <NavItem 
              to="/" 
              icon={Home} 
              label="Home" 
              isActive={checkIsActive('/')} 
            />
            
            <NavItem 
              to="#" 
              icon={Download} 
              label="Getting Started" 
              isActive={false}
              hasSubmenu={true}
              isSubmenuOpen={openSections['getting-started']}
              onClick={() => toggleSection('getting-started')}
            >
              <NavItem 
                to="/installation" 
                icon={Terminal} 
                label="Installation" 
                isActive={checkIsActive('/installation')} 
              />
              <NavItem 
                to="/quick-start" 
                icon={BookOpen} 
                label="Quick Start" 
                isActive={checkIsActive('/quick-start')} 
              />
            </NavItem>
            
            <NavItem 
              to="#" 
              icon={Code} 
              label="User Guide" 
              isActive={false}
              hasSubmenu={true}
              isSubmenuOpen={openSections['user-guide']}
              onClick={() => toggleSection('user-guide')}
            >
              <NavItem 
                to="/features" 
                icon={Shield} 
                label="Features" 
                isActive={checkIsActive('/features')} 
              />
              <NavItem 
                to="/configuration" 
                icon={Settings} 
                label="Configuration" 
                isActive={checkIsActive('/configuration')} 
              />
            </NavItem>
            
            <NavItem 
              to="#" 
              icon={BookOpen} 
              label="Advanced Topics" 
              isActive={false}
              hasSubmenu={true}
              isSubmenuOpen={openSections['advanced-topics']}
              onClick={() => toggleSection('advanced-topics')}
            >
              <NavItem 
                to="/integration" 
                icon={ExternalLink} 
                label="Integration" 
                isActive={checkIsActive('/integration')} 
              />
              <NavItem 
                to="/customization" 
                icon={Code} 
                label="Customization" 
                isActive={checkIsActive('/customization')} 
              />
            </NavItem>
            
            <NavItem 
              to="/faq" 
              icon={FileText} 
              label="FAQ" 
              isActive={checkIsActive('/faq')} 
            />
          </nav>
        </div>

        <div className="p-4 border-t border-border/50 mt-auto">
          <div className="text-sm text-muted-foreground">
            FortiCore Documentation
            <br />
            © 2025 FortiCore Team
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
