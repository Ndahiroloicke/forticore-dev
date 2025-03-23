import { cn } from '@/lib/utils';

interface StatsCardProps {
  value: string;
  description: string;
  className?: string;
}

export const StatsCard = ({ value, description, className }: StatsCardProps) => {
  return (
    <div className={cn("border-l-2 border-purple-500 pl-6 py-2", className)}>
      <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{value}</div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export const StatsSection = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 py-16 border-y border-border">
      <StatsCard 
        value="98.5%" 
        description="detection accuracy rate" 
      />
      <StatsCard 
        value="25k+" 
        description="security checks in database" 
      />
      <StatsCard 
        value="15min" 
        description="average comprehensive scan time" 
      />
    </section>
  );
};
