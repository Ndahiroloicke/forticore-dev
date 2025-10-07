import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Heart, ArrowUpRight } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="lg:pl-64 mt-auto relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />
      
      <div className="relative border-t border-border/50">
        <div className="container mx-auto px-4 py-12 md:py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-12 mb-12">
            
            {/* Brand Section - Takes more space */}
            <div className="lg:col-span-5">
              <Link to="/" className="inline-flex items-center group mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full group-hover:bg-purple-500/30 transition-all duration-300" />
                  <img 
                    src="/forticoreLogo.svg" 
                    alt="FortiCore Logo" 
                    className="h-12 w-12 mr-3 relative z-10 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  FortiCore
                </span>
              </Link>
              
              <p className="text-muted-foreground text-base leading-relaxed mb-6 max-w-md">
                Automated Penetration Testing Tool designed to simplify security assessment processes and strengthen your digital defenses.
              </p>
              
              {/* Social Links with enhanced styling */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground mr-2">Connect:</span>
                <a 
                  href="https://github.com/forticore-team" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative p-2 rounded-lg bg-background/50 border border-border/50 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                </a>
                <a 
                  href="https://twitter.com/forticore" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative p-2 rounded-lg bg-background/50 border border-border/50 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                </a>
                <a 
                  href="https://linkedin.com/company/forticore" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative p-2 rounded-lg bg-background/50 border border-border/50 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                </a>
                <a 
                  href="mailto:info@forticore.io" 
                  className="group relative p-2 rounded-lg bg-background/50 border border-border/50 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5 text-muted-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
                </a>
              </div>
            </div>
            
            {/* Links Grid - Compact and organized */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              
              {/* Documentation */}
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground/90">
                  Documentation
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link 
                      to="/installation" 
                      className="group inline-flex items-center text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      Installation
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/quick-start" 
                      className="group inline-flex items-center text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      Quick Start
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/features" 
                      className="group inline-flex items-center text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      Features
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/configuration" 
                      className="group inline-flex items-center text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      Configuration
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/integration" 
                      className="group inline-flex items-center text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      Integration
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                </ul>
              </div>
              
              {/* Resources */}
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground/90">
                  Resources
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a 
                      href="#" 
                      className="group inline-flex items-center text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      Blog
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="group inline-flex items-center text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      Community
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="group inline-flex items-center text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      GitHub Repository
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="group inline-flex items-center text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      Changelog
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="group inline-flex items-center text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      Roadmap
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Legal */}
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider mb-4 text-foreground/90">
                  Legal
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a 
                      href="#" 
                      className="group inline-flex items-center text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      Privacy Policy
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="group inline-flex items-center text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      Terms of Service
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="group inline-flex items-center text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      Cookie Policy
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      className="group inline-flex items-center text-sm text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      License
                      <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                </ul>
              </div>
              
            </div>
          </div>
          
          {/* Bottom Bar - Separated with a subtle line */}
          <div className="pt-8 border-t border-border/50">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} FortiCore. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm">
                <p className="flex items-center text-muted-foreground">
                  Made with <Heart className="h-4 w-4 mx-1.5 text-red-500 animate-pulse" fill="currentColor" /> by the FortiCore Team
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
