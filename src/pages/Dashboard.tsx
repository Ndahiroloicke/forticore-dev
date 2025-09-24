import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, signOut } = useAuth();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={signOut}>Sign out</Button>
      </div>
      <p className="text-muted-foreground">Welcome{user ? `, ${user.email}` : ''}.</p>
    </div>
  );
};

export default Dashboard;


