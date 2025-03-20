import { ChevronRight, Terminal, Shield, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Decorative purple gradient background */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-purple-500/10 via-purple-600/5 to-transparent rounded-full blur-3xl -z-10" />
      
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto pt-12 md:pt-16 lg:pt-24 animate-slide-up">
        <img 
          src="/forticoreLogo.png" 
          alt="FortiCore Logo" 
          className=" mb-8"
        />
        <Badge variant="purple-outline" className="mb-6 py-1.5 px-4 gap-2 text-sm">
          <Shield className="h-4 w-4" />
          <span>Automated Penetration Testing Tool</span>
        </Badge>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
          <span className="text-gradient">FortiCore</span> Documentation
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl text-balance">
          The comprehensive guide to FortiCore, an automated penetration testing tool designed to simplify security assessment without sacrificing depth or accuracy.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg" className="h-12 px-6 bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg">
            <Link to="/installation">
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="h-12 px-6 border-purple-500/40 hover:bg-purple-500/10">
            <a href="https://github.com/forticore-team/forticore" target="_blank" rel="noopener noreferrer">
              <Terminal className="mr-2 h-4 w-4" />
              View on GitHub
            </a>
          </Button>
        </div>
      </div>
      
      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 md:mt-24">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon: Icon, title, description, delay }: FeatureCardProps) => {
  return (
    <div 
      className="glass-card p-6 flex flex-col items-start transition-all duration-300 hover:shadow-md hover:-translate-y-1"
      style={{ animation: `slide-up 0.5s ease-out ${delay}s both` }}
    >
      <div className="rounded-full p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-4">
        <Icon className="h-5 w-5" />
      </div>
      
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

const features = [
  {
    icon: Terminal,
    title: "Simple CLI Interface",
    description: "User-friendly command-line interface with guided setup for effortless security testing."
  },
  {
    icon: Shield,
    title: "Automated Scanning",
    description: "Automatically scan for common vulnerabilities on target systems, websites, and networks."
  },
  {
    icon: FileText,
    title: "Detailed Reports",
    description: "Generate comprehensive reports with identified vulnerabilities and actionable remediation steps."
  }
];
