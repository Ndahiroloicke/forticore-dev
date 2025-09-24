import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        // Handles email confirmation, magic links, and OAuth code exchange
        if (!supabase) {
          navigate('/login');
          return;
        }
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (error) {
          console.error('[AuthCallback] exchange error', error.message);
          navigate('/login');
          return;
        }
        navigate('/dashboard', { replace: true });
      } catch (e) {
        navigate('/login');
      }
    };
    run();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Completing sign-in...
    </div>
  );
};

export default AuthCallback;


