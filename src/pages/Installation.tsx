import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const Installation = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<'linux' | 'docker'>('linux');
  
  return (
    <div className="p-8 lg:pl-72">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12 animate-slide-up">
          <h1 className="text-4xl font-bold mb-4">Installation</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Get up and running with FortiCore on your preferred platform.
          </p>
          
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
            </ol>
          </nav>
        </div>
      </div>
    </div>
  );
};