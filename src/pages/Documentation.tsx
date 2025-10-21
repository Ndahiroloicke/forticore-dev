
import { Link } from 'react-router-dom';
import { ChevronRight, FileText, Terminal, Shield, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import SEO from '@/components/SEO';
import { useEffect } from 'react';
import { injectStructuredData, generateBreadcrumbSchema } from '@/lib/seo-utils';

interface DocCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
  delay: number;
}

const DocCard = ({ icon: Icon, title, description, to, delay }: DocCardProps) => {
  return (
    <Link 
      to={to}
      className="glass-card p-6 flex flex-col hover:shadow-md transition-all duration-200 h-full"
      style={{ animation: `slide-up 0.5s ease-out ${delay}s both` }}
    >
      <div className="rounded-full p-2 bg-primary/10 text-primary mb-4 self-start">
        <Icon className="h-5 w-5" />
      </div>
      
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      
      <p className="text-muted-foreground text-sm mb-4 flex-1">{description}</p>
      
      <div className="mt-auto inline-flex items-center text-sm font-medium text-primary">
        Read more
        <ChevronRight className="ml-1 h-4 w-4" />
      </div>
    </Link>
  );
};

const Documentation = () => {
  useEffect(() => {
    // Add breadcrumb structured data
    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', url: 'https://forticoredev.innov.rw/' },
      { name: 'Documentation', url: 'https://forticoredev.innov.rw/documentation' },
    ]);
    injectStructuredData(breadcrumbSchema, 'breadcrumb-schema');
  }, []);

  return (
    <>
      <SEO
        title="FortiCore Documentation - Complete Guide to Penetration Testing Tool"
        description="Comprehensive documentation for FortiCore automated penetration testing tool. Learn installation, configuration, features, and advanced security testing techniques."
        keywords="FortiCore documentation, penetration testing guide, security testing tutorial, FortiCore installation, cybersecurity tool documentation, automated pentesting guide"
        url="https://forticoredev.innov.rw/documentation"
        type="article"
        article={{
          section: 'Documentation',
          tags: ['documentation', 'penetration testing', 'security', 'tutorial'],
        }}
      />
      <div className="max-w-4xl mx-auto">
      <div className="mb-12 animate-slide-up">
        <h1 className="text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive guides to help you get the most out of FortiCore.
        </p>
      </div>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Getting Started</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocCard
            icon={Terminal}
            title="Installation"
            description="Learn how to install FortiCore on different platforms and environments."
            to="/installation"
            delay={0.1}
          />
          
          <DocCard
            icon={Shield}
            title="Quick Start"
            description="Get up and running with your first vulnerability scan in minutes."
            to="/quick-start"
            delay={0.2}
          />
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">User Guide</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocCard
            icon={Shield}
            title="Features"
            description="Detailed exploration of FortiCore's vulnerability scanning capabilities and exploitation features."
            to="/features"
            delay={0.3}
          />
          
          <DocCard
            icon={Settings}
            title="Configuration"
            description="Learn how to customize FortiCore settings to suit your specific security needs."
            to="/configuration"
            delay={0.4}
          />
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Reference</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocCard
            icon={FileText}
            title="FAQ"
            description="Answers to frequently asked questions about FortiCore usage and troubleshooting."
            to="/faq"
            delay={0.5}
          />
        </div>
      </section>
    </div>
    </>
  );
};

export default Documentation;
