
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-7xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-8 text-muted-foreground">This page doesn't exist.</p>
      
      <Button asChild size="lg">
        <Link to="/" className="inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Home
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
