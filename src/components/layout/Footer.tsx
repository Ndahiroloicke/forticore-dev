import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="lg:pl-64 mt-auto py-12 border-t border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 justify-between">
          <div>
            <Link to="/" className="inline-flex items-center mb-6">
              <img 
                src="/forticoreLogo.svg" 
                alt="FortiCore Logo" 
                className="h-12 w-12 mr-2"
              />
              <span className="font-bold text-xl">FortiCore</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Automated Penetration Testing Tool designed to simplify security assessment processes.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/forticore-team" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/forticore" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/forticore" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:info@forticore.io" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Documentation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/installation" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Installation
                </Link>
              </li>
              <li>
                <Link to="/quick-start" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Quick Start
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/configuration" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Configuration
                </Link>
              </li>
              <li>
                <Link to="/integration" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Integration
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Changelog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 text-sm">
                  License
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FortiCore. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> by the FortiCore Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
