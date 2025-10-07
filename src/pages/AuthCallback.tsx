import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const run = async () => {
      try {
        // Handles email confirmation, magic links, and OAuth code exchange
        if (!supabase) {
          setStatus('error');
          setMessage('Authentication not configured');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (error) {
          console.error('[AuthCallback] exchange error', error.message);
          setStatus('error');
          setMessage('Verification failed. Please try again.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        setStatus('success');
        setMessage('Email verified successfully! Redirecting to dashboard...');
        
        // Short delay to show success message before redirecting
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 1500);
      } catch (e) {
        setStatus('error');
        setMessage('An error occurred. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    };
    run();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <div className="text-center space-y-4">
            {status === 'loading' && (
              <>
                <div className="mx-auto w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <p className="text-muted-foreground">{message}</p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                    Success!
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">{message}</p>
                </div>
              </>
            )}
            
            {status === 'error' && (
              <>
                <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                    Verification Failed
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">{message}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;


